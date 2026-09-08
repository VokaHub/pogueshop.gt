import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ArrowLeft, Volume2, VolumeX, Heart, Sparkles, MessageCircle } from 'lucide-react';

interface Bubble {
  id: number;
  x: number; // percentage width
  y: number; // percentage height within lower playground
  size: number;
  duration: number;
  dx: number; // drift distance x
  dy: number; // drift distance y
  shapeVariant: number;
}

interface FloatingLike {
  id: number;
  x: number; // percentage width
  emoji: string;
  size: number;
  duration: number;
  delay: number;
}

const CONFIDENCE_QUOTES = [
  "You're iconic, darling.",
  "Main character energy only.",
  "That girl? You are her.",
  "Unapologetically you.",
  "Confidence looks stunning on you.",
  "Born to stand out, never to blend in.",
  "Effortlessly elite.",
  "A walking masterpiece.",
  "Pure magnetism.",
  "They couldn't duplicate you if they tried.",
  "Own every room you enter.",
  "Style is eternal, and so is your power.",
  "Too rare to be understood by everyone.",
  "Luxury is a mindset, and you've got it.",
  "Unstoppable, undeniable, unforgettable."
];

const SHAPE_VARIANTS = [
  'rounded-[48%_52%_68%_32%/42%_44%_56%_58%]',
  'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]',
  'rounded-[40%_60%_70%_30%/40%_50%_60%_50%]',
  'rounded-[55%_45%_35%_65%/45%_60%_40%_55%]',
  'rounded-[35%_65%_55%_45%/55%_45%_65%_35%]'
];

// Spaced out wall-to-wall spots across the lower playground (not grouped in 2 rows, well dispersed)
const SPACED_WALL_SPOTS = [
  { x: 12, y: 38, dx: 18, dy: -14 }, // near left wall
  { x: 26, y: 74, dx: 15, dy: -16 }, // bottom-left
  { x: 32, y: 22, dx: -16, dy: 14 }, // upper-left
  { x: 44, y: 52, dx: -14, dy: -14 }, // mid-left
  { x: 52, y: 26, dx: 16, dy: -12 }, // upper-center
  { x: 50, y: 80, dx: -14, dy: -16 }, // bottom-center
  { x: 64, y: 46, dx: 16, dy: 15 }, // mid-right
  { x: 74, y: 20, dx: -15, dy: 14 }, // upper-right
  { x: 88, y: 44, dx: 18, dy: -14 }, // near right wall
  { x: 78, y: 76, dx: -16, dy: -14 }  // bottom-right
];

// Influencer confidence boost notification compliments (uplifting, chic, positive)
const INFLUENCER_NOTIFICATIONS = [
  {
    id: 1,
    app: "MESSAGES",
    sender: "Bestie ✨",
    time: "ahora",
    text: "Oye... ¿quién te dio permiso de verte tan icónica hoy?! 🔥"
  },
  {
    id: 2,
    app: "INSTAGRAM",
    sender: "Notificaciones",
    time: "ahora",
    text: "A 3,240 personas les encantó tu vibe y estilo ✨"
  },
  {
    id: 3,
    app: "DIRECT",
    sender: "Tu admirador secreto",
    time: "hace 1 min",
    text: "Literalmente iluminas cualquier lugar al que entras 🖤"
  },
  {
    id: 4,
    app: "DAILY BOOST",
    sender: "POGUE Reminder",
    time: "ahora",
    text: "That girl energy activa al 100%. Nunca bajes tus estándares 👑"
  }
];

const LIKE_EMOJIS = ['❤️', '🖤', '✨', '🔥', '💖', '👑', '⚡'];

interface ConfidenceBoostProps {
  isOpen: boolean;
  onClose: () => void;
  canvaCatalogUrl: string;
}

export function ConfidenceBoostModal({ isOpen, onClose, canvaCatalogUrl }: ConfidenceBoostProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  // No quote shown until first pop!
  const [currentQuote, setCurrentQuote] = useState<string | null>(null);
  const [lastPoppedPosition, setLastPoppedPosition] = useState<{ x: number; y: number } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Speed Pop Rush Meter (0 to 100)
  const [popEnergy, setPopEnergy] = useState<number>(0);
  const [isInfluencerRush, setIsInfluencerRush] = useState<boolean>(false);
  const [floatingLikes, setFloatingLikes] = useState<FloatingLike[]>([]);

  const getAudioContext = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          audioCtxRef.current = new AudioCtxClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  };

  // Pop sound via Web Audio API with mobile resume
  const playPopSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.07);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio fallback
    }
  };

  // Upbeat luxury chime when full influencer meter activates
  const playCelebrationChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        const startTime = audioCtx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.41);
      });
    } catch {
      // Audio fallback
    }
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      if (next) {
        // Unlock audio context on mobile tap
        const ctx = getAudioContext();
        if (ctx) {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, ctx.currentTime);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.08);
          } catch {
            // fallback
          }
        }
      }
      return next;
    });
  };

  const resetBubbles = () => {
    const initial: Bubble[] = SPACED_WALL_SPOTS.map((spot, idx) => ({
      id: Date.now() + idx,
      x: spot.x,
      y: spot.y,
      size: 114 + Math.floor(Math.random() * 32),
      duration: 3.2 + Math.random() * 2,
      dx: spot.dx,
      dy: spot.dy,
      shapeVariant: idx % SHAPE_VARIANTS.length
    }));
    setBubbles(initial);
  };

  // Decay timer: If the user stops popping fast, the meter empties quickly
  useEffect(() => {
    if (!isOpen || isInfluencerRush) return;
    const interval = setInterval(() => {
      setPopEnergy(prev => (prev <= 0 ? 0 : Math.max(0, prev - 2.8)));
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isInfluencerRush]);

  useEffect(() => {
    if (isOpen) {
      resetBubbles();
      setCurrentQuote(null); // No quote displayed initially until first pop
      setPopEnergy(0);
      setIsInfluencerRush(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Trigger Influencer Rush celebration mode
  const triggerInfluencerRush = () => {
    setIsInfluencerRush(true);
    setPopEnergy(0);
    playCelebrationChime();

    // Generate burst of floating likes/hearts
    const likes: FloatingLike[] = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      x: 15 + Math.random() * 70,
      emoji: LIKE_EMOJIS[Math.floor(Math.random() * LIKE_EMOJIS.length)],
      size: 20 + Math.floor(Math.random() * 20),
      duration: 2 + Math.random() * 1.5,
      delay: Math.random() * 1.2
    }));
    setFloatingLikes(likes);

    // Auto-dismiss celebration after 6.5 seconds
    setTimeout(() => {
      setIsInfluencerRush(false);
    }, 6500);
  };

  const handlePop = (bubble: Bubble, event: MouseEvent) => {
    playPopSound();

    const availableQuotes = CONFIDENCE_QUOTES.filter(q => q !== currentQuote);
    const quote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
    setCurrentQuote(quote);

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setLastPoppedPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });

    setBubbles(prev => prev.filter(b => b.id !== bubble.id));

    // Increase speed energy meter (+22% per fast pop)
    if (!isInfluencerRush) {
      setPopEnergy(prev => {
        const next = Math.min(100, prev + 22);
        if (next >= 100) {
          triggerInfluencerRush();
          return 0;
        }
        return next;
      });
    }

    // Respawn replacement bubble within the spaced wall positions
    setTimeout(() => {
      setBubbles(prev => {
        if (prev.length >= SPACED_WALL_SPOTS.length) return prev;
        const spot = SPACED_WALL_SPOTS[Math.floor(Math.random() * SPACED_WALL_SPOTS.length)];
        const newBubble: Bubble = {
          id: Date.now() + Math.random(),
          x: spot.x,
          y: spot.y,
          size: 114 + Math.floor(Math.random() * 32),
          duration: 3.2 + Math.random() * 2,
          dx: spot.dx,
          dy: spot.dy,
          shapeVariant: Math.floor(Math.random() * SHAPE_VARIANTS.length)
        };
        return [...prev, newBubble];
      });
    }, 1100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#fbfbfa] text-black flex flex-col overflow-hidden select-none"
        >
          {/* Top Bar - Seamless & borderless */}
          <header className="relative z-40 w-full px-6 md:px-12 h-16 md:h-18 flex items-center justify-between flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-sans font-medium text-gray-700 hover:text-black transition-colors"
            >
              <ArrowLeft size={14} /> Volver
            </button>

            <span className="text-[9px] uppercase tracking-[0.35em] text-gray-400 font-sans hidden sm:inline-block">
              POGUESHOP.GT
            </span>

            <div className="flex items-center gap-5">
              <a
                href={canvaCatalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-black hover:opacity-60 transition-opacity border-b border-black pb-0.5"
              >
                Ver Catálogo <ExternalLink size={11} />
              </a>

              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-black transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Unified Top Area: Instruction & Large Revealed Quote (No visible dividers) */}
          <div className="relative z-30 w-full px-6 max-w-4xl mx-auto pt-1 pb-3 text-center pointer-events-none flex-shrink-0">
            <div className="inline-flex items-center justify-center gap-2.5 mb-2 pointer-events-auto">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-gray-400 font-sans font-semibold">
                Haz pop haciendo clic
              </span>
              <span className="text-gray-300 text-[10px] select-none">•</span>
              <button
                type="button"
                onClick={toggleSound}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-sans font-bold cursor-pointer active:scale-95 ${
                  soundEnabled
                    ? 'border-gray-300 bg-white text-black shadow-xs hover:border-black'
                    : 'border-transparent bg-gray-100 text-gray-400 hover:text-gray-600'
                }`}
                title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
                aria-label={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
              >
                {soundEnabled ? <Volume2 size={11} /> : <VolumeX size={11} />}
                <span>{soundEnabled ? 'sound on' : 'sound off'}</span>
              </button>
            </div>

            {/* Revealed Quote Display - Only appears upon first pop */}
            <div className="min-h-[75px] md:min-h-[105px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {currentQuote && (
                  <motion.h2
                    key={currentQuote}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic tracking-tight text-gray-950 px-2 leading-tight"
                  >
                    "{currentQuote}"
                  </motion.h2>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Blobs Playground - Unified cluster ("un solo montón") safely below the quote */}
          <div className="relative flex-1 w-full overflow-hidden">
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                style={{
                  position: 'absolute',
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  zIndex: 20
                }}
              >
                <motion.button
                  type="button"
                  onClick={(e) => handlePop(bubble, e)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: [0, bubble.dx, -bubble.dx, 0],
                    y: [0, bubble.dy, -bubble.dy, 0]
                  }}
                  exit={{
                    scale: 1.35,
                    opacity: 0,
                    transition: { duration: 0.16 }
                  }}
                  transition={{
                    scale: { duration: 0.3, ease: 'easeOut' },
                    opacity: { duration: 0.2 },
                    x: { duration: bubble.duration, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: bubble.duration + 0.6, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-full h-full group flex flex-col items-center justify-center bg-black text-white shadow-xl hover:shadow-2xl transition-transform cursor-pointer ${SHAPE_VARIANTS[bubble.shapeVariant]}`}
                >
                  <span className="text-[11px] md:text-[12px] font-sans tracking-[0.25em] font-bold uppercase text-white leading-none mb-1 pointer-events-none group-hover:scale-105 transition-transform">
                    POP
                  </span>
                  <span className="text-[8px] md:text-[9px] font-sans tracking-[0.2em] uppercase text-white/40 leading-none pointer-events-none">
                    tap me
                  </span>
                </motion.button>
              </div>
            ))}

            {/* Quick pop flash label */}
            {lastPoppedPosition && (
              <motion.div
                key={`${lastPoppedPosition.x}-${lastPoppedPosition.y}`}
                initial={{ opacity: 0.9, scale: 0.8, y: 0 }}
                animate={{ opacity: 0, scale: 1.3, y: -30 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  left: lastPoppedPosition.x - 24,
                  top: lastPoppedPosition.y - 18,
                  pointerEvents: 'none',
                  zIndex: 80
                }}
                className="text-[9px] uppercase tracking-[0.25em] font-sans font-bold text-black bg-white/90 px-2 py-0.5 rounded shadow-sm"
              >
                POP
              </motion.div>
            )}
          </div>

          {/* Bottom Footer Speed Meter Bar ("Barrita chiquita abajo") */}
          <footer className="relative z-40 w-full px-6 py-3 pb-5 flex flex-col items-center justify-center pointer-events-auto bg-gradient-to-t from-[#fbfbfa] via-[#fbfbfa]/80 to-transparent">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-sans transition-colors ${
                  popEnergy > 70
                    ? 'text-black font-black animate-pulse'
                    : 'text-gray-400 font-semibold'
                }`}
              >
                {popEnergy >= 80 ? '⚡ ¡RÁPIDO, CASI LO TIENES!' : '⚡ BOOST RUSH'}
              </span>
              <span className="text-[8px] font-mono text-gray-400">
                {Math.round(popEnergy)}%
              </span>
            </div>

            {/* Subtle Slim Progress Bar */}
            <div className="w-48 sm:w-56 h-1.5 bg-gray-200/90 rounded-full overflow-hidden shadow-xs">
              <motion.div
                className="h-full rounded-full transition-all duration-100 ease-out"
                style={{
                  width: `${popEnergy}%`,
                  backgroundColor: popEnergy >= 80 ? '#000000' : '#4b5563'
                }}
              />
            </div>
            <span className="text-[7px] uppercase tracking-[0.25em] text-gray-400/80 mt-1">
              revienta rápido para llenar
            </span>
          </footer>

          {/* INFLUENCER CELEBRATION OVERLAY (iPhone Notification Cards + Like Explosion) */}
          <AnimatePresence>
            {isInfluencerRush && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] pointer-events-none flex flex-col items-center justify-start pt-16 sm:pt-20 px-4"
              >
                {/* Floating Likes / Hearts Stream */}
                {floatingLikes.map((like) => (
                  <motion.div
                    key={like.id}
                    initial={{
                      opacity: 0,
                      y: 400,
                      x: `${like.x}vw`,
                      scale: 0.6
                    }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: -120,
                      scale: [0.6, 1.2, 1.3, 0.9],
                      x: [`${like.x}vw`, `${like.x + (Math.random() * 12 - 6)}vw`, `${like.x}vw`]
                    }}
                    transition={{
                      duration: like.duration,
                      delay: like.delay,
                      ease: 'easeOut'
                    }}
                    style={{
                      position: 'fixed',
                      bottom: 0,
                      left: 0,
                      fontSize: `${like.size}px`,
                      zIndex: 130
                    }}
                  >
                    {like.emoji}
                  </motion.div>
                ))}

                {/* Celebration Pill Header (Dynamic Island Style) */}
                <motion.div
                  initial={{ scale: 0.8, y: -20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.8, y: -20, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="mb-4 inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full shadow-2xl border border-white/20 pointer-events-auto"
                >
                  <Sparkles size={13} className="text-amber-300 animate-spin" />
                  <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-black">
                    ICONIC ENERGY UNLOCKED
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsInfluencerRush(false)}
                    className="ml-2 text-white/50 hover:text-white transition-colors"
                    aria-label="Cerrar notificaciones"
                  >
                    <X size={12} />
                  </button>
                </motion.div>

                {/* iPhone Black Notification Banners (Cascading Entry) */}
                <div className="w-full max-w-sm sm:max-w-md space-y-2.5 pointer-events-auto">
                  {INFLUENCER_NOTIFICATIONS.map((notif, index) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: -30, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      transition={{
                        delay: index * 0.28,
                        type: 'spring',
                        stiffness: 350,
                        damping: 24
                      }}
                      className="w-full bg-[#111114]/95 backdrop-blur-xl text-white rounded-2xl p-3.5 sm:p-4 shadow-[0_20px_40px_rgba(0,0,0,0.45)] border border-white/15"
                    >
                      {/* App Header */}
                      <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.25em] text-white/50 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {notif.app === 'INSTAGRAM' ? (
                            <Heart size={11} className="text-rose-400 fill-rose-400" />
                          ) : (
                            <MessageCircle size={11} className="text-blue-400 fill-blue-400" />
                          )}
                          <span className="font-bold">{notif.app}</span>
                        </div>
                        <span>{notif.time}</span>
                      </div>

                      {/* Notification Body */}
                      <p className="text-[11px] sm:text-[12px] font-sans font-bold text-white leading-snug">
                        {notif.sender}
                      </p>
                      <p className="text-[11px] sm:text-[12px] font-sans text-white/85 leading-snug mt-0.5">
                        {notif.text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Counter Pill */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 }}
                  className="mt-3 bg-white/90 backdrop-blur-md text-black px-3.5 py-1 rounded-full shadow-lg text-[9px] uppercase tracking-[0.25em] font-sans font-bold"
                >
                  🔥 +99 notificaciones de amor propio
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface GiftEnvelopeSectionProps {
  onOpen: () => void;
}

export function GiftEnvelopeSection({ onOpen }: GiftEnvelopeSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Editorial Section Tag - Consistent 10px across page */}
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-sans font-bold mb-6">
          A Special Note For You
        </p>

        {/* Chic Monochrome Envelope Card */}
        <div className="flex justify-center">
          <motion.button
            type="button"
            onClick={onOpen}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group relative w-[260px] sm:w-[290px] h-[150px] sm:h-[165px] bg-[#0d0d0f] text-white rounded-xl shadow-[0_16px_38px_rgba(0,0,0,0.22)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.35)] border border-white/15 overflow-hidden flex flex-col items-center justify-center p-5 transition-all duration-300 cursor-pointer text-center"
            aria-label="Open for a confident boost"
          >
            {/* Subtle Luxury Satin Sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/40 pointer-events-none" />

            {/* Precision Luxury Envelope Creases SVG (Crisp Monochrome White / Silver) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 290 165"
              fill="none"
            >
              {/* Upper Flap Triangle */}
              <path
                d="M 0 0 L 145 84 L 290 0"
                stroke="rgba(255, 255, 255, 0.32)"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="group-hover:stroke-white/50 transition-colors"
              />
              {/* Inner fold depth */}
              <path
                d="M 14 0 L 145 78 L 276 0"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
              {/* Bottom Diagonal Creases */}
              <path
                d="M 0 165 L 105 84"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <path
                d="M 290 165 L 185 84"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>

            {/* Signature "P." in Letter Style (Personal touch) */}
            <div className="relative z-10 flex items-baseline justify-center mb-3 group-hover:scale-105 transition-transform select-none">
              <span className="font-serif italic text-3xl sm:text-4xl text-white/95 font-normal leading-none tracking-tight">
                P.
              </span>
            </div>

            {/* Faded sophisticated text, 10px consistent sizing, 100% legible */}
            <span className="relative z-10 text-[10px] uppercase tracking-[0.28em] font-sans font-bold leading-snug text-white/80 pointer-events-none px-3 drop-shadow">
              Open for a confident boost
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
