import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  Swords,
  Heart,
  Shuffle,
  Crown,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trophy,
  Sparkles,
  HelpCircle,
  Image as ImageIcon,
  Mail,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { uploadMultipleFilesToR2 } from "../../lib/r2";
import { sendTournamentConfirmationEmail } from "../../lib/email";
import {
  TournamentRole,
  CompetitiveRank,
  OVERWATCH_RANKS,
} from "../../types/tournament";

interface TournamentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentName?: string;
  tournamentId?: string;
}

export function TournamentRegistrationModal({
  isOpen,
  onClose,
  tournamentName = "Overplay Tourney 4",
  tournamentId = "tourney-4",
}: TournamentRegistrationModalProps) {
  // Form State
  const [isCaptain, setIsCaptain] = useState<boolean>(false);
  const [battleNetId, setBattleNetId] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [email, setEmail] = useState("");
  const [preferredRole, setPreferredRole] = useState<TournamentRole>("Tanque");
  const [rankTank, setRankTank] = useState<CompetitiveRank>("Platino");
  const [rankDps, setRankDps] = useState<CompetitiveRank>("Platino");
  const [rankSupport, setRankSupport] = useState<CompetitiveRank>("Platino");
  const [draftName, setDraftName] = useState("");
  const [favoriteHero, setFavoriteHero] = useState("");

  // Files state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ name: string; url: string; isPdf: boolean }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    id?: string;
    battleNetId: string;
    discordId: string;
    draftName: string;
    email: string;
  } | null>(null);

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incomingFiles = Array.from(e.target.files);

    const validFiles: File[] = [];
    for (const f of incomingFiles) {
      const isImg = f.type.startsWith("image/");
      const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      if (isImg || isPdf) {
        if (validFiles.length + selectedFiles.length < 5) {
          validFiles.push(f);
        }
      }
    }

    const updated = [...selectedFiles, ...validFiles].slice(0, 5);
    setSelectedFiles(updated);

    // Create previews
    const previews = updated.map((file) => ({
      name: file.name,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      isPdf: file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
    }));
    setFilePreviews(previews);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    const previews = updated.map((file) => ({
      name: file.name,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      isPdf: file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
    }));
    setFilePreviews(previews);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validations
    if (!battleNetId.trim()) {
      setErrorMessage("Por favor ingresa tu ID de Battle.net (incluye el #, ej: Jugador#12345).");
      return;
    }
    if (!battleNetId.includes("#")) {
      setErrorMessage("Tu ID de Battle.net debe incluir el '#' (ejemplo: MiNick#1234).");
      return;
    }
    if (!discordId.trim()) {
      setErrorMessage("Por favor ingresa tu usuario o ID de Discord.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Por favor ingresa un correo electrónico válido para enviarte el comprobante de inscripción.");
      return;
    }
    if (!draftName.trim()) {
      setErrorMessage("Por favor dinos cómo quieres que se te vea en el Draft (Tu nombre/apodo).");
      return;
    }
    if (!favoriteHero.trim()) {
      setErrorMessage("Por favor escribe tu héroe favorito de Overwatch.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload files to Cloudflare R2
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setUploadProgressText(`Subiendo ${selectedFiles.length} archivo(s) a Cloudflare R2...`);
        uploadedUrls = await uploadMultipleFilesToR2(
          selectedFiles,
          "tournament-registrations",
          (current, total, name) => {
            setUploadProgressText(`Subiendo a R2 (${current}/${total}): ${name}`);
          }
        );
      }

      // 2. Save registration in Supabase
      setUploadProgressText("Registrando inscripción en Supabase...");

      const payload = {
        tournament_id: tournamentId,
        tournament_name: tournamentName,
        is_captain: isCaptain,
        battlenet_id: battleNetId.trim(),
        discord_id: discordId.trim(),
        email: email.trim().toLowerCase(),
        preferred_role: preferredRole,
        rank_tank: rankTank,
        rank_dps: rankDps,
        rank_support: rankSupport,
        draft_name: draftName.trim(),
        favorite_hero: favoriteHero.trim(),
        career_file_urls: uploadedUrls,
        status: "pending",
        admin_notes: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("tournament_registrations")
        .insert([payload])
        .select("id")
        .single();

      if (error) {
        throw new Error(
          `Error al guardar en Supabase: ${error.message || "Verifica la tabla tournament_registrations"}`
        );
      }

      // 3. Enviar confirmación por correo al jugador y respaldo al staff (overplaypage@gmail.com)
      setUploadProgressText("Enviando comprobante por correo electrónico...");
      try {
        await sendTournamentConfirmationEmail({
          id: data?.id,
          tournamentId,
          tournamentName,
          email: email.trim().toLowerCase(),
          isCaptain,
          battleNetId: battleNetId.trim(),
          discordId: discordId.trim(),
          preferredRole,
          rankTank,
          rankDps,
          rankSupport,
          draftName: draftName.trim(),
          favoriteHero: favoriteHero.trim(),
          careerFileUrls: uploadedUrls,
          status: "pending",
        });
      } catch (mailErr) {
        console.warn("Aviso al enviar correos (la inscripción se guardó correctamente):", mailErr);
      }

      setSubmittedData({
        id: data?.id,
        battleNetId: battleNetId.trim(),
        discordId: discordId.trim(),
        draftName: draftName.trim(),
        email: email.trim().toLowerCase(),
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error al enviar inscripción:", err);
      setErrorMessage(
        err.message || "Ocurrió un error al procesar tu inscripción. Intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgressText("");
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage("");
    setSelectedFiles([]);
    setFilePreviews([]);
    setBattleNetId("");
    setDiscordId("");
    setEmail("");
    setDraftName("");
    setFavoriteHero("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden p-3 sm:p-6 md:p-8">
        {/* Backdrop con Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-[#050508]/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f] shadow-2xl shadow-orange-500/10"
        >
          {/* Barra Superior Neón */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-violet-500" />

          {/* Botón Cerrar */}
          <button
            onClick={handleResetAndClose}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>

          {isSuccess ? (
            /* Pantalla de Éxito */
            <div className="p-8 sm:p-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>

              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" /> ¡Inscripción Enviada con Éxito!
              </span>

              <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                ¡Bienvenido a <span className="text-orange-400">{tournamentName}</span>!
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm text-white/70 sm:text-base">
                Tu solicitud ha sido guardada con éxito. Hemos enviado una copia de respaldo a tu correo electrónico registrado y a nuestro equipo de moderación.
              </p>

              {submittedData && (
                <div className="mx-auto mt-6 max-w-md rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/50">Nombre en Draft:</span>
                    <span className="font-semibold text-orange-300">{submittedData.draftName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-2">
                    <span className="text-white/50">Battle.net ID:</span>
                    <span className="font-mono text-white/90">{submittedData.battleNetId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-2">
                    <span className="text-white/50">Discord:</span>
                    <span className="font-mono text-indigo-300">{submittedData.discordId}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-white/50">Correo de Respaldo:</span>
                    <span className="font-mono text-emerald-300">{submittedData.email}</span>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-105 hover:from-orange-600 hover:to-amber-600"
                >
                  Entendido y Volver
                </button>
              </div>
            </div>
          ) : (
            /* Formulario Completo */
            <form onSubmit={handleSubmit} className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
              {/* Cabecera */}
              <div className="border-b border-white/10 pb-5 pr-8">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                    Inscripción Oficial
                  </span>
                </div>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Formulario de Registro al Torneo
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-white/60">
                  Rellena los siguientes campos con la información de tu cuenta. Te enviaremos un comprobante automático a tu correo electrónico.
                </p>
              </div>

              {/* Mensaje de Error */}
              {errorMessage && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-200">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                  <div>
                    <strong className="font-bold text-red-300">Atención: </strong>
                    {errorMessage}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-6">
                {/* 1. ¿QUIERES SER CAPITÁN EN EL TORNEO? */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4.5 sm:p-5">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-400" />
                    <label className="text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                      ¿Quieres ser Capitán en el Torneo?{" "}
                      <span className="text-amber-400/90 font-normal">(Cupos limitados)</span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-white/50">
                    Los capitanes participarán en el draft en vivo para seleccionar a sus compañeros de equipo.
                  </p>

                  <div className="mt-3.5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCaptain(true)}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs font-bold transition-all sm:text-sm ${
                        isCaptain
                          ? "border-amber-500 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/10"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <Crown className={`h-4 w-4 ${isCaptain ? "text-amber-400" : "text-white/40"}`} />
                      <span>SÍ, QUIERO SER CAPITÁN</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCaptain(false)}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs font-bold transition-all sm:text-sm ${
                        !isCaptain
                          ? "border-orange-500 bg-orange-500/15 text-orange-300 shadow-lg shadow-orange-500/10"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span>NO, SOLO JUGADOR</span>
                    </button>
                  </div>
                </div>

                {/* 2. ID DE BATTLENET */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4.5 sm:p-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                    Déjanos aquí tu ID de Battle.net <span className="text-orange-400">*</span>
                  </label>
                  <p className="mt-1 text-xs text-white/60">
                    Te llegará una solicitud de parte de Overplay para que aceptes.{" "}
                    <span className="text-orange-300 font-semibold">No te olvides de añadir el #</span>. Nuestro BattleTag oficial es:{" "}
                    <span className="font-mono font-bold text-amber-400">OVERPLAY#11220</span>
                  </p>

                  <div className="mt-3 relative">
                    <input
                      type="text"
                      required
                      placeholder="Ej: Jugador#12345"
                      value={battleNetId}
                      onChange={(e) => setBattleNetId(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder-white/25 transition-all focus:border-orange-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* 3. ID DE DISCORD */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4.5 sm:p-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                    Déjanos tu ID de Discord <span className="text-orange-400">*</span>
                  </label>
                  <p className="mt-1 text-xs text-white/60">
                    Tienes que aceptar la solicitud para que te informemos si fuiste aceptado o no en el torneo además de preguntarte algunas cosas más si es necesario.
                  </p>

                  <div className="mt-3 relative">
                    <input
                      type="text"
                      required
                      placeholder="Ej: mi_usuario o usuario#1234"
                      value={discordId}
                      onChange={(e) => setDiscordId(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-indigo-200 placeholder-white/25 transition-all focus:border-indigo-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* 4. CORREO ELECTRÓNICO (RESPALDO / COMPROBANTE) */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4.5 sm:p-5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-orange-400" />
                    <label className="text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                      Correo Electrónico de Contacto <span className="text-orange-400">*</span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-white/60">
                    Te enviaremos automáticamente una copia y comprobante con todos los datos que registres en este formulario.
                  </p>

                  <div className="mt-3 relative">
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder-white/25 transition-all focus:border-orange-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* 5. ¿QUÉ ROL VAS A JUGAR? */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4.5 sm:p-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                    ¿Qué rol vas a jugar? <span className="text-orange-400">*</span>
                  </label>
                  <p className="mt-1 text-xs text-white/60">
                    En caso de que coloques <span className="text-amber-300 font-semibold">"Todos los Roles"</span>, nosotros asignaremos tu rol según las necesidades del bracket.
                  </p>

                  <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {[
                      { role: "Tanque" as TournamentRole, icon: Shield, color: "text-blue-400", border: "border-blue-500/50" },
                      { role: "DPS" as TournamentRole, icon: Swords, color: "text-red-400", border: "border-red-500/50" },
                      { role: "Support" as TournamentRole, icon: Heart, color: "text-emerald-400", border: "border-emerald-500/50" },
                      { role: "Todos los Roles" as TournamentRole, icon: Shuffle, color: "text-amber-400", border: "border-amber-500/50" },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = preferredRole === item.role;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => setPreferredRole(item.role)}
                          className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3.5 text-center transition-all ${
                            isSelected
                              ? `bg-white/10 ${item.border} shadow-lg shadow-white/5`
                              : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {/* Circulito indicador */}
                          <div
                            className={`absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-orange-500 bg-orange-500"
                                : "border-white/30 bg-transparent"
                            }`}
                          >
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>

                          <Icon className={`h-6 w-6 ${isSelected ? item.color : "text-white/40"}`} />
                          <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-white/70"}`}>
                            {item.role}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5, 6, 7. RANGOS EN TANQUE, DPS Y SUPPORT */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4.5 sm:p-5">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <label className="text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                      Rangos Competitivos por Rol <span className="text-orange-400">*</span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-white/60">
                    Marca la medalla del rango actual más alto que posees en cada uno de los 3 roles.
                  </p>

                  <div className="mt-4 space-y-4">
                    {/* RANGO TANQUE */}
                    <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                          <Shield className="h-3.5 w-3.5" /> ¿Qué rango eres en TANQUE?
                        </span>
                        <span className="text-xs font-semibold text-white/80 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                          {rankTank}
                        </span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {OVERWATCH_RANKS.map((rank) => (
                          <button
                            key={`tank-${rank.id}`}
                            type="button"
                            onClick={() => setRankTank(rank.id)}
                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                              rankTank === rank.id
                                ? "border-blue-500 bg-blue-500/20 text-white shadow-sm shadow-blue-500/20"
                                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {rank.image ? (
                              <img src={rank.image} alt={rank.name} className="h-4 w-4 object-contain" />
                            ) : null}
                            <span>{rank.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* RANGO DPS */}
                    <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                          <Swords className="h-3.5 w-3.5" /> ¿Qué rango eres en DPS?
                        </span>
                        <span className="text-xs font-semibold text-white/80 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                          {rankDps}
                        </span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {OVERWATCH_RANKS.map((rank) => (
                          <button
                            key={`dps-${rank.id}`}
                            type="button"
                            onClick={() => setRankDps(rank.id)}
                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                              rankDps === rank.id
                                ? "border-red-500 bg-red-500/20 text-white shadow-sm shadow-red-500/20"
                                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {rank.image ? (
                              <img src={rank.image} alt={rank.name} className="h-4 w-4 object-contain" />
                            ) : null}
                            <span>{rank.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* RANGO SUPPORT */}
                    <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <Heart className="h-3.5 w-3.5" /> ¿Qué rango eres en SUPPORT?
                        </span>
                        <span className="text-xs font-semibold text-white/80 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {rankSupport}
                        </span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {OVERWATCH_RANKS.map((rank) => (
                          <button
                            key={`support-${rank.id}`}
                            type="button"
                            onClick={() => setRankSupport(rank.id)}
                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                              rankSupport === rank.id
                                ? "border-emerald-500 bg-emerald-500/20 text-white shadow-sm shadow-emerald-500/20"
                                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {rank.image ? (
                              <img src={rank.image} alt={rank.name} className="h-4 w-4 object-contain" />
                            ) : null}
                            <span>{rank.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. PERFIL DE CARRERA (PDF O HASTA 5 IMÁGENES) */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4.5 sm:p-5">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-orange-400" />
                    <label className="text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                      Deja aquí tu Perfil de Carrera
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-white/60 leading-relaxed">
                    Mostrando tu total de horas y las tres últimas temporadas competitivas (en caso de no tener rango antes tienes que sacar el rango competitivo y mostrarnos igualmente las otras temporadas previas para certificar que no tenías rango).{" "}
                    <span className="text-amber-300 font-semibold">Puedes subir formato PDF o hasta 5 imágenes de capturas.</span>
                  </p>

                  <div className="mt-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="career-file-input"
                    />

                    <label
                      htmlFor="career-file-input"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-black/30 p-5 text-center transition-all hover:border-orange-500/50 hover:bg-orange-500/[0.02]"
                    >
                      <Upload className="h-7 w-7 text-orange-400/80 mb-2" />
                      <span className="text-xs font-bold text-white sm:text-sm">
                        Haz clic aquí para seleccionar capturas o PDF
                      </span>
                      <span className="mt-1 text-[11px] text-white/40">
                        PNG, JPG, WEBP o PDF (Máximo 5 archivos) • Se guardarán en Cloudflare R2
                      </span>
                    </label>

                    {/* Previsualización de archivos subidos */}
                    {filePreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {filePreviews.map((preview, i) => (
                          <div
                            key={i}
                            className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/40 p-1.5"
                          >
                            {preview.isPdf ? (
                              <div className="flex h-20 w-full flex-col items-center justify-center rounded bg-red-950/30 text-red-400">
                                <FileText className="h-6 w-6" />
                                <span className="mt-1 max-w-[90%] truncate text-[10px] text-white/70">
                                  {preview.name}
                                </span>
                              </div>
                            ) : (
                              <div className="relative h-20 w-full overflow-hidden rounded">
                                <img
                                  src={preview.url}
                                  alt={preview.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white opacity-90 transition-opacity hover:opacity-100"
                              title="Eliminar archivo"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 9. NOMBRE PARA DRAFT Y HÉROE FAVORITO */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4.5 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                        Nombre para el Draft <span className="text-orange-400">*</span>
                      </label>
                      <p className="mt-1 text-xs text-white/50">
                        Cómo quieres que se te vea en la transmisión y tablas.
                      </p>
                      <input
                        type="text"
                        required
                        placeholder="Ej: KillerWolf"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="mt-2.5 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/25 transition-all focus:border-orange-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/90 sm:text-sm">
                        Héroe Favorito <span className="text-orange-400">*</span>
                      </label>
                      <p className="mt-1 text-xs text-white/50">
                        No es necesario que sea el que más sepas jugar.
                      </p>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Reinhardt, Ana, Tracer..."
                        value={favoriteHero}
                        onChange={(e) => setFavoriteHero(e.target.value)}
                        className="mt-2.5 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/25 transition-all focus:border-orange-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de Enviar */}
              <div className="mt-8 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-white/50">
                  {uploadProgressText ? (
                    <span className="flex items-center gap-2 text-amber-300 font-medium">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {uploadProgressText}
                    </span>
                  ) : (
                    <span>* Todos los campos marcados son obligatorios.</span>
                  )}
                </div>

                <div className="flex w-full sm:w-auto items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    disabled={isSubmitting}
                    className="w-1/2 sm:w-auto rounded-xl border border-white/10 px-5 py-3 text-xs font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-7 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Enviar Inscripción</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
