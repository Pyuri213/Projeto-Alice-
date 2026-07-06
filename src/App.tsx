/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Heart, 
  Check, 
  Send, 
  X,
  Compass,
  Anchor,
  Waves,
  Sun,
  Camera,
  Sliders,
  ZoomIn,
  Phone,
  MessageCircle
} from "lucide-react";

// Immersive tropical sound synthesizer (Ocean wave sweeps, soft marimba, steel drum/island bells)
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private oscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private mainGain: GainNode | null = null;
  private loopInterval: any = null;

  start() {
    if (this.isPlaying) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0.06, this.ctx.currentTime); // Gentle volume
      this.mainGain.connect(this.ctx.destination);
      this.isPlaying = true;

      // Deep tropical ocean swells (D chord roots)
      this.playPad(146.83, 0);   // D3
      this.playPad(220.00, 0.4); // A3
      this.playPad(293.66, 0.8); // D4
      this.playPad(370.00, 1.2); // F#4 (Bright tropical major third)

      // Play soft ocean wave sounds immediately
      this.playWaveSwell();

      // Start gentle tropical marimba/island bell melodies (D Major Pentatonic scale)
      const islandChimes = [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66];
      this.loopInterval = setInterval(() => {
        if (!this.ctx || this.ctx.state === 'suspended') return;
        const randomPitch = islandChimes[Math.floor(Math.random() * islandChimes.length)];
        this.playIslandBell(randomPitch);
        
        // Occasionally trigger a wave swell
        if (Math.random() > 0.6) {
          this.playWaveSwell();
        }
      }, 1900);

    } catch (e) {
      console.warn("Audio Context not supported in this environment.", e);
    }
  }

  private playIslandBell(frequency: number) {
    if (!this.ctx || !this.mainGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pure warm bell tone
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.mainGain);
    osc.start();

    setTimeout(() => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (err) {}
    }, 3000);
  }

  playWaveSwell() {
    if (!this.ctx || !this.mainGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 2);
    osc.frequency.exponentialRampToValueAtTime(75, now + 4);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 2);
    gain.gain.linearRampToValueAtTime(0, now + 4);

    osc.connect(gain);
    gain.connect(this.mainGain);
    osc.start();
    osc.stop(now + 4.2);
  }

  private playPad(frequency: number, delay: number) {
    if (!this.ctx || !this.mainGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 3 + delay);

    osc.connect(gain);
    gain.connect(this.mainGain);
    osc.start();

    this.oscillators.push({ osc, gain });
  }

  playTransitionNotification() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    this.playWaveSwell();

    // Magical arpeggio when opening
    const notes = [293.66, 370.00, 440.00, 587.33, 739.99, 880.00, 1174.66];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.mainGain!);
      osc.start(now + idx * 0.08);

      setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
          gain.disconnect();
        } catch (e) {}
      }, 1500);
    });
  }

  stop() {
    this.isPlaying = false;
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.oscillators.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    this.oscillators = [];
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// Moana-Inspired Bioluminescent/Golden Particles with Purple Touch
function TropicalParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft pastel gradients representing tropical sea and sunset blending into purple sky */}
      <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-orange-100/40 via-teal-100/30 to-transparent blur-[60px] pointer-events-none" />
      
      {/* Soft warm glowing circles at the bottom representing Te Fiti and purple sunset magic */}
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-150px] left-1/4 w-[450px] h-[350px] bg-gradient-to-tr from-purple-200/40 to-teal-200/35 rounded-full blur-[100px] pointer-events-none" 
      />
      
      <motion.div 
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-180px] right-1/4 w-[550px] h-[380px] bg-gradient-to-tr from-orange-200/40 to-purple-200/30 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Dynamic ocean/sunset light bar at the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-teal-200/40 via-amber-200/50 to-purple-200/40 blur-xs pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-teal-300/50 via-amber-300/60 to-purple-300/50 pointer-events-none" />

      {Array.from({ length: 45 }).map((_, i) => {
        const size = Math.random() * 6 + 3;
        const duration = Math.random() * 8 + 6;
        const delay = Math.random() * 6;
        const left = Math.random() * 100;
        const rand = Math.random();
        const isTeFiti = rand > 0.75; // emerald green
        const isSunset = rand > 0.5 && rand <= 0.75; // warm gold
        const isPurple = rand > 0.25 && rand <= 0.5; // magical purple

        return (
          <motion.div
            key={i}
            initial={{ y: "105%", opacity: 0, scale: 0.5 }}
            animate={{
              y: "-5%",
              opacity: [0, 0.85, 0.85, 0],
              scale: [0.5, 1.4, 0.5],
              x: [0, Math.sin(i) * 35, 0]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut"
            }}
            className={`absolute rounded-full ${
              isTeFiti 
                ? 'bg-emerald-400 shadow-[0_0_12px_#34d399,0_0_4px_#10b981]' 
                : isSunset 
                  ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24,0_0_4px_#f59e0b]' 
                  : isPurple
                    ? 'bg-purple-400 shadow-[0_0_12px_#c084fc,0_0_4px_#a855f7]'
                    : 'bg-teal-400 shadow-[0_0_12px_#2dd4bf,0_0_4px_#0d9488]'
            }`}
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              bottom: 0
            }}
          />
        );
      })}
    </div>
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  
  // Custom Photo States
  const defaultPhotoUrl = "/src/assets/images/alice_photo.png";
  const fallbackPhotoUrl = "https://images.unsplash.com/photo-1595811269788-3c40173e32e8?auto=format&fit=crop&q=80&w=400&h=400";
  const [alicePhoto, setAlicePhoto] = useState<string>(() => {
    return localStorage.getItem("moana_alice_photo_url") || defaultPhotoUrl;
  });
  const [photoScale, setPhotoScale] = useState<number>(() => {
    return parseFloat(localStorage.getItem("moana_alice_photo_scale") || "1.6");
  });
  const [photoX, setPhotoX] = useState<number>(() => {
    return parseInt(localStorage.getItem("moana_alice_photo_x") || "53");
  });
  const [photoY, setPhotoY] = useState<number>(() => {
    return parseInt(localStorage.getItem("moana_alice_photo_y") || "44");
  });

  // Automatically synchronize client-side uploaded photo to server
  useEffect(() => {
    const localPhoto = localStorage.getItem("moana_alice_photo_url");
    if (localPhoto && localPhoto.startsWith("data:image/")) {
      fetch("/api/upload-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: localPhoto })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("Local photo successfully synchronized with server backend.");
        }
      })
      .catch(err => {
        console.error("Error synchronizing photo with server:", err);
      });
    }
  }, []);
  
  // RSVP Form States
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState("0");
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"pending" | "submitted" | "already">("pending");

  // Guestbook Messages (Pre-filled with loving Moana references)
  const [guestMessages, setGuestMessages] = useState<{name: string, text: string, date: string}[]>([]);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Modal selector
  const [activeModal, setActiveModal] = useState<"rsvp" | "location" | null>(null);

  // Synth reference
  const synthRef = useRef<AmbientSynth | null>(null);

  // Countdown timer targeting the 25th of October at 16h00 (tropical breeze day)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Check RSVP in localStorage
    const savedRSVP = localStorage.getItem("moana_alice_rsvp_confirmed");
    if (savedRSVP) {
      setRsvpStatus("already");
      setRsvpConfirmed(true);
    }

    // Load guest messages
    const savedMessages = localStorage.getItem("moana_alice_messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Filter out any leftover mock messages to clean the list completely
        const filtered = Array.isArray(parsed) ? parsed.filter(
          (msg: any) => msg.name !== "Mamãe e Papai" && msg.name !== "Vovó Tala" && msg.name !== "Tia Carol"
        ) : [];
        setGuestMessages(filtered);
        localStorage.setItem("moana_alice_messages", JSON.stringify(filtered));
      } catch (e) {
        setGuestMessages([]);
        localStorage.setItem("moana_alice_messages", JSON.stringify([]));
      }
    } else {
      setGuestMessages([]);
      localStorage.setItem("moana_alice_messages", JSON.stringify([]));
    }

    // Setup countdown timer for July 25, 2026 at 16:00
    const targetDate = new Date("2026-07-25T16:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(interval);
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => {
      clearInterval(interval);
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  const handleToggleMusic = () => {
    if (!synthRef.current) {
      synthRef.current = new AmbientSynth();
    }
    
    if (musicOn) {
      synthRef.current.stop();
      setMusicOn(false);
    } else {
      synthRef.current.start();
      setMusicOn(true);
    }
  };

  const handleOpenInvitation = () => {
    setIsOpening(true);
    
    if (!synthRef.current) {
      synthRef.current = new AmbientSynth();
    }
    synthRef.current.start();
    synthRef.current.playTransitionNotification();
    setMusicOn(true);

    setTimeout(() => {
      setIsOpen(true);
    }, 2000);
  };

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    localStorage.setItem("moana_alice_rsvp_confirmed", "true");
    localStorage.setItem("moana_alice_rsvp_name", rsvpName);
    localStorage.setItem("moana_alice_rsvp_guests", rsvpGuests);

    setRsvpStatus("submitted");
    setRsvpConfirmed(true);

    // Auto add notification to the message board
    const rsvpNotice = {
      name: rsvpName,
      text: `Confirmou presença para navegar nessa aventura! ${rsvpGuests === "0" ? "Apenas ele(a)" : `E trará +${rsvpGuests} tripulante(s)`}! ⛵🌴`,
      date: "Agora mesmo"
    };
    const updated = [rsvpNotice, ...guestMessages];
    setGuestMessages(updated);
    localStorage.setItem("moana_alice_messages", JSON.stringify(updated));

    setTimeout(() => {
      setActiveModal(null);
    }, 1800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    const newMsg = {
      name: newName,
      text: newMessage,
      date: "Agora mesmo"
    };

    const updated = [newMsg, ...guestMessages];
    setGuestMessages(updated);
    localStorage.setItem("moana_alice_messages", JSON.stringify(updated));

    setNewName("");
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-[#faf8fd] text-purple-950 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Wave Accent Top & Bottom Background Design */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-purple-100/10 to-transparent pointer-events-none" />
      
      {/* Decorative Wave lines in background */}
      <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-purple-200/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-teal-200/15 blur-[100px] pointer-events-none" />

      {/* Bioluminescent / Sunset Ocean Particles */}
      <TropicalParticles />

      {/* Floating Ambient Music Action */}
      {isOpen && (
        <button
          id="btn-music-toggle"
          onClick={handleToggleMusic}
          className="fixed top-6 right-6 z-50 p-4 rounded-full bg-white/70 border border-purple-200/50 text-purple-750 hover:bg-white/90 transition-all flex items-center justify-center shadow-[0_4px_15px_rgba(168,85,247,0.12)] backdrop-blur-md cursor-pointer"
        >
          {musicOn ? <Volume2 className="w-5 h-5 animate-pulse text-purple-600" /> : <VolumeX className="w-5 h-5 text-teal-600" />}
        </button>
      )}

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* SECTION 1: THE TROPICAL NAVIGATOR'S ENVELOPE (COVER) */
          <motion.div
            key="moana-envelope"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full max-w-lg px-4 flex flex-col items-center z-10"
          >
            {/* Header branding with Moana script feel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center items-center gap-2 mb-2 text-purple-700">
                <Sun className="w-5 h-5 animate-spin-slow text-orange-500" />
                <span className="text-xs font-sans tracking-[0.3em] uppercase font-bold text-purple-800">UM CONVITE ALÉM DO HORIZONTE</span>
                <Sun className="w-5 h-5 animate-spin-slow text-orange-500" />
              </div>
              <h2 className="font-display text-5xl md:text-6xl text-purple-950 mt-1">Alice de Mattos</h2>
              <p className="text-xs text-teal-600 tracking-widest font-bold mt-2">VENHA CELEBRAR ESSA AVENTURA COMIGO!</p>
              <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto mt-4" />
            </motion.div>

            {/* Interactive 3D Sailboat/Tropical Envelope */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center perspective-[1200px]">
              
              {/* Back flap (envelope base) */}
              <motion.div 
                animate={isOpening ? { rotateX: -180, z: -10 } : {}}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute inset-x-4 bottom-0 h-4/5 bg-gradient-to-b from-[#f2ecfc] to-[#e6f1f2] border-b border-x border-purple-200/40 rounded-b-3xl shadow-[0_15px_40px_rgba(107,33,168,0.1)] z-10 flex items-center justify-center overflow-hidden"
              >
                {/* Inside envelope floral pattern */}
                <div className="absolute inset-0 bg-purple-100/10 opacity-40" />
                <div className="absolute -inset-10 border border-teal-200/20 rounded-full animate-spin-slow opacity-15 pointer-events-none" />
                
                {/* Invitation card inside peeking out slightly */}
                <motion.div
                  animate={isOpening ? { y: -100, scale: 1.05, opacity: 1 } : { y: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="w-11/12 h-5/6 bg-gradient-to-b from-white to-[#fafcff] border border-amber-300/30 rounded-2xl flex flex-col items-center justify-center p-4 shadow-2xl relative"
                >
                   <p className="font-sans text-[10px] tracking-widest text-purple-600 font-bold">CONVITE DE ANIVERSÁRIO</p>
                   <h3 className="font-display text-2xl text-purple-950 mt-1">ALICE</h3>
                </motion.div>
              </motion.div>

              {/* Cover envelope front triangles (overlaying the peeking card) */}
              <div className="absolute inset-x-4 bottom-0 h-4/5 bg-transparent z-20 pointer-events-none">
                {/* Side triangular flaps */}
                <div style={{ clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)" }} className="absolute inset-0 w-full h-full bg-[#f6f3fc] border-l border-purple-200/30 rounded-bl-3xl left-0" />
                <div style={{ clipPath: "polygon(100% 0%, 50% 50%, 100% 100%)" }} className="absolute inset-0 w-full h-full bg-[#f6f3fc] border-r border-purple-200/30 rounded-br-3xl right-0" />
                {/* Bottom flap */}
                <div style={{ clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }} className="absolute inset-x-0 bottom-0 h-1/2 bg-[#ebf4f5]/95 border-b border-purple-200/40 rounded-b-3xl shadow-inner" />
              </div>

              {/* Seal Wax Flap (glowing Te Fiti Heart Spiral) */}
              <motion.div
                animate={isOpening ? { rotateX: 180, z: -20, opacity: 0 } : {}}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{ transformOrigin: "top", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                className="absolute inset-x-4 top-1/5 h-1/2 bg-gradient-to-b from-[#faf8fd] to-[#f3edf9] border-t border-x border-purple-200/30 rounded-t-3xl z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center"
              >
                {/* Glowing Heart of Te Fiti Seal */}
                {!isOpening && (
                  <motion.button
                    id="btn-wax-seal"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenInvitation}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-purple-500 border-2 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center cursor-pointer z-40"
                  >
                    {/* SVG spiral pattern */}
                    <svg className="w-9 h-9 text-purple-950 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2a10 10 0 0 1 10 10c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 0 1 9-9c3.314 0 6 2.686 6 6 0 2.21-1.79 4-4 4a2 2 0 0 1-2-2c0-.55.45-1 1-1" />
                    </svg>
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-teal-400/30 rounded-full"
                    />
                  </motion.button>
                )}
              </motion.div>

            </div>

            {/* Instruction Call to Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-6"
            >
              <p className="text-xs text-purple-700/80 tracking-widest font-bold animate-pulse flex items-center justify-center gap-1.5">
                🌴 Toque no Coração de Te Fiti para abrir 🌴
              </p>
              
              <button 
                id="btn-reveal-invitation"
                onClick={handleOpenInvitation}
                className="mt-6 bg-gradient-to-r from-purple-600 via-orange-500 to-teal-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(147,51,234,0.25)] cursor-pointer"
              >
                Abrir Convite Tropical
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* SECTION 2: THE MAIN TROPICAL SHOWCASE (SIMPLIFIED DETAILS) */
          <motion.div
            key="moana-dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-4xl px-4 md:px-6 py-4 flex flex-col md:flex-row gap-8 items-center justify-center z-10"
          >
            {/* LEFT COLUMN: The Beautiful Moana-Style Invitation Card */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full max-w-sm min-h-[680px] bg-gradient-to-b from-white via-[#fcfbfd] to-[#fafcfb] rounded-[2.5rem] p-6 border border-purple-200/50 shadow-[0_20px_50px_rgba(107,33,168,0.06)] relative overflow-hidden flex flex-col justify-between"
            >
              {/* Tropical Border details */}
              <div className="absolute inset-3 border border-purple-200/20 rounded-[2rem] pointer-events-none" />
              <div className="absolute inset-4 border-2 border-orange-500/5 rounded-[1.8rem] pointer-events-none" />
              
              {/* Waves and stars in card backgrounds */}
              <div className="absolute top-10 left-10 text-teal-600/5 pointer-events-none">
                 <Waves className="w-40 h-40 opacity-10 text-teal-400" />
              </div>

              {/* Card Corner Accents (Tribal Compass stars) */}
              <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-purple-400/30 rounded-tl-sm flex items-center justify-center">
                <Sun className="w-2.5 h-2.5 text-purple-400/30" />
              </div>
              <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-purple-400/30 rounded-tr-sm flex items-center justify-center">
                <Sun className="w-2.5 h-2.5 text-purple-400/30" />
              </div>
              <div className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-purple-400/30 rounded-bl-sm flex items-center justify-center">
                <Sun className="w-2.5 h-2.5 text-purple-400/30" />
              </div>
              <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-purple-400/30 rounded-br-sm flex items-center justify-center">
                <Sun className="w-2.5 h-2.5 text-purple-400/30" />
              </div>

              {/* Top logo header */}
              <div className="text-center mt-4">
                <span className="text-[9px] font-sans text-purple-600 tracking-[0.4em] uppercase font-bold flex items-center justify-center gap-1">
                   <Sun className="w-3.5 h-3.5 text-orange-500" /> MEU ANIVERSÁRIO <Sun className="w-3.5 h-3.5 text-orange-500" />
                </span>
                <p className="font-serif text-[11px] italic text-teal-600 mt-1">"O oceano me chama..."</p>
              </div>

              {/* Main invitation info */}
              <div className="text-center my-auto flex flex-col items-center py-6">
                <span className="text-xs font-sans text-orange-500 tracking-[0.3em] uppercase font-extrabold block mb-2">FESTA TROPICAL DA</span>
                <h1 className="font-display text-7xl md:text-8xl bg-gradient-to-r from-purple-700 via-orange-600 to-teal-600 bg-clip-text text-transparent leading-none py-2 filter drop-shadow-[0_2px_10px_rgba(107,33,168,0.15)]">Alice</h1>
                <span className="font-sans text-sm md:text-base text-purple-800 tracking-[0.3em] block mt-2 font-black">DE MATTOS</span>

                <div className="flex items-center gap-3 w-40 my-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-purple-400/40" />
                  <Anchor className="w-5 h-5 text-purple-600 animate-pulse" />
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-purple-400/40" />
                </div>

                <p className="text-xs sm:text-sm text-purple-950/90 leading-relaxed max-w-[260px] font-medium">
                  Venha se divertir com muitos jogos, lanchinhos e a magia das ilhas tropicais!
                </p>
              </div>

              {/* Core Date & Location highlighted in the card */}
              <div className="text-center flex flex-col items-center justify-center w-full px-2 mb-4">
                <div className="w-full bg-purple-50/80 border border-purple-100/80 rounded-2xl py-3 px-4 shadow-sm">
                   <span className="block text-purple-600 text-[10px] sm:text-xs tracking-[0.2em] font-extrabold uppercase">DOMINGO</span>
                   <span className="block text-2.5xl font-black text-purple-950 mt-1 leading-none">25 DE JULHO</span>
                   <span className="block text-orange-600 text-[10px] sm:text-xs font-black tracking-[0.15em] uppercase mt-1">ÀS 16:00 HORAS</span>
                </div>
                
                <div className="mt-4 flex flex-col items-center justify-center text-center w-full">
                  <p className="text-xs sm:text-sm text-teal-700 tracking-wider uppercase font-black flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4 text-orange-500 animate-bounce shrink-0" />
                    Salão do Condomínio Michelangelo
                  </p>
                  <p className="text-xs sm:text-xs text-purple-900/80 font-bold mt-1">
                    Av. Getúlio Vargas, 72 - Zona 1
                  </p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: SIMPLIFIED CONTROLS & INTERACTIVE PANEL */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex-1 w-full max-w-md flex flex-col gap-4"
            >
              {/* TROPICAL COUNTDOWN CARD */}
              <div className="bg-white/80 backdrop-blur-md border border-purple-100/80 rounded-3xl p-5 shadow-[0_8px_30px_rgba(107,33,168,0.04)] text-center">
                <span className="text-[10px] font-sans text-purple-700 tracking-widest uppercase font-bold block mb-3">Velejando em direção à festa...</span>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-purple-50/40 border border-purple-100/30 p-2.5 rounded-xl">
                    <span className="block text-xl font-bold text-purple-950">{timeLeft.days}</span>
                    <span className="text-[8px] uppercase tracking-widest text-teal-600 font-bold">Dias</span>
                  </div>
                  <div className="bg-purple-50/40 border border-purple-100/30 p-2.5 rounded-xl">
                    <span className="block text-xl font-bold text-purple-950">{timeLeft.hours}</span>
                    <span className="text-[8px] uppercase tracking-widest text-teal-600 font-bold">Horas</span>
                  </div>
                  <div className="bg-purple-50/40 border border-purple-100/30 p-2.5 rounded-xl">
                    <span className="block text-xl font-bold text-purple-950">{timeLeft.minutes}</span>
                    <span className="text-[8px] uppercase tracking-widest text-teal-600 font-bold">Min</span>
                  </div>
                  <div className="bg-purple-50/40 border border-purple-100/30 p-2.5 rounded-xl">
                    <span className="block text-xl font-bold text-orange-500 animate-pulse">{timeLeft.seconds}</span>
                    <span className="text-[8px] uppercase tracking-widest text-teal-600 font-bold">Seg</span>
                  </div>
                </div>
              </div>

              {/* ACTION MODULES (SIMPLIFIED TO 2 PRIMARY BUTTONS) */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* RSVP Button */}
                <motion.button 
                  id="btn-rsvp-open"
                  onClick={() => setActiveModal("rsvp")}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -4,
                    boxShadow: "0 10px 25px -5px rgba(168,85,247,0.12)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: rsvpConfirmed 
                      ? ["0 4px 6px rgba(16,185,129,0.02)", "0 4px 15px rgba(16,185,129,0.15)", "0 4px 6px rgba(16,185,129,0.02)"]
                      : ["0 4px 6px rgba(168,85,247,0.02)", "0 4px 15px rgba(168,85,247,0.15)", "0 4px 6px rgba(168,85,247,0.02)"]
                  }}
                  transition={{
                    boxShadow: {
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between aspect-[1.3/1] shadow-sm group cursor-pointer transition-colors ${
                    rsvpConfirmed 
                    ? "bg-emerald-50 border-emerald-200" 
                    : "bg-white border-purple-100 hover:border-purple-300"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <motion.div 
                      animate={{ y: [-1, 1, -1] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className={`p-2 rounded-xl ${rsvpConfirmed ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-50 text-purple-600 group-hover:text-orange-500'}`}
                    >
                      <Waves className="w-5 h-5" />
                    </motion.div>
                    {rsvpConfirmed ? (
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Confirmado</span>
                    ) : (
                      <span className="text-[7.5px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest animate-pulse">Toque Aqui</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans text-xs tracking-wider font-black mb-0.5 text-purple-950 flex items-center gap-1">
                      CONFIRMAR PRESENÇA
                    </h4>
                    <p className="text-[9px] text-purple-700/80 font-semibold group-hover:text-purple-950 transition-colors">Garanta o seu lugar na tripulação!</p>
                  </div>
                </motion.button>

                {/* Location Map Button */}
                <motion.button 
                  id="btn-location-open"
                  onClick={() => setActiveModal("location")}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -4,
                    boxShadow: "0 10px 25px -5px rgba(20,184,166,0.12)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: ["0 4px 6px rgba(20,184,166,0.02)", "0 4px 15px rgba(20,184,166,0.15)", "0 4px 6px rgba(20,184,166,0.02)"]
                  }}
                  transition={{
                    boxShadow: {
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                      delay: 0.5
                    }
                  }}
                  className="bg-white border border-purple-100 p-4 rounded-2xl text-left flex flex-col justify-between aspect-[1.3/1] shadow-sm group cursor-pointer transition-colors hover:border-teal-300"
                >
                  <div className="flex justify-between items-start w-full">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:text-orange-500"
                    >
                      <Compass className="w-5 h-5" />
                    </motion.div>
                    <span className="text-[7.5px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest animate-pulse">Toque Aqui</span>
                  </div>
                  <div>
                    <h4 className="font-sans text-xs tracking-wider font-black mb-0.5 text-purple-950">LOCALIZAÇÃO</h4>
                    <p className="text-[9px] text-purple-700/80 font-semibold group-hover:text-purple-950 transition-colors">Veja como chegar no condomínio.</p>
                  </div>
                </motion.button>

              </div>

              {/* CONTATOS / DÚVIDAS CARD */}
              <div className="bg-white/80 backdrop-blur-md border border-purple-100/80 rounded-3xl p-5 shadow-[0_8px_30px_rgba(107,33,168,0.04)] text-center">
                <span className="text-[10px] font-sans text-purple-700 tracking-widest uppercase font-bold block mb-1">Ficou com alguma dúvida?</span>
                <h4 className="font-sans text-xs text-purple-900 tracking-wider uppercase mb-3 flex items-center justify-center gap-1.5 font-bold">
                  <Phone className="w-3.5 h-3.5 text-purple-600 animate-bounce" /> Contatos dos Organizadores
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {/* Mãe - Michele */}
                  <a 
                    href="https://wa.me/5551997058646?text=Ol%C3%A1%20Michele!%20Tenho%20uma%20d%C3%BAvida%20sobre%20o%20anivers%C3%A1rio%20da%20Alice."
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-purple-50/40 border border-purple-100/40 p-2.5 rounded-xl hover:scale-[1.02] hover:border-purple-300 transition-all cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-200 transition-colors shadow-xs">
                      <MessageCircle className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[11px] font-bold text-purple-950 truncate">Michele Mattos</span>
                      <span className="block text-[9px] text-purple-700/80 font-medium">Mãe da Alice</span>
                      <span className="block text-[9px] text-teal-600 font-bold mt-0.5">(51) 99705-8646</span>
                    </div>
                  </a>

                  {/* Irmã - Andriely */}
                  <a 
                    href="https://wa.me/5551995476067?text=Ol%C3%A1%20Andriely!%20Tenho%20uma%20d%C3%BAvida%20sobre%20o%20anivers%C3%A1rio%20da%20Alice."
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-purple-50/40 border border-purple-100/40 p-2.5 rounded-xl hover:scale-[1.02] hover:border-purple-300 transition-all cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-200 transition-colors shadow-xs">
                      <MessageCircle className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[11px] font-bold text-purple-950 truncate">Andriely de Mattos</span>
                      <span className="block text-[9px] text-purple-700/80 font-medium">Irmã da Alice</span>
                      <span className="block text-[9px] text-teal-600 font-bold mt-0.5">(51) 99547-6067</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* MURAL DE RECADOS (LIVE GUESTBOOK) */}
              <div className="bg-white/80 backdrop-blur-md border border-purple-100/80 rounded-3xl p-5 shadow-[0_8px_30px_rgba(107,33,168,0.04)] flex-grow flex flex-col justify-between min-h-[190px]">
                <div>
                  <h3 className="font-sans text-[11px] text-purple-800 tracking-widest uppercase mb-2 flex items-center gap-1.5 font-bold">
                    <Heart className="w-3.5 h-3.5 fill-purple-600 text-purple-600 animate-pulse" /> Mural de Mensagens à Alice
                  </h3>
                  
                  {/* Message feed list */}
                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar text-xs">
                    {guestMessages.length === 0 ? (
                      <div className="text-center py-4 text-purple-400/60 italic text-[11px] leading-relaxed">
                        Nenhuma mensagem enviada ainda.<br />
                        Seja o primeiro a deixar uma mensagem de carinho para a Alice! ⛵🌺
                      </div>
                    ) : (
                      guestMessages.map((msg, index) => (
                        <div key={index} className="bg-purple-50/50 border border-purple-100/20 p-2 rounded-xl">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-[11px] font-bold text-purple-900">{msg.name}</span>
                            <span className="text-[8px] text-purple-400 uppercase">{msg.date}</span>
                          </div>
                          <p className="text-[10px] text-purple-900/90 italic leading-snug">"{msg.text}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Live Message Form */}
                <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-purple-100/30 flex flex-col gap-2.5">
                   <div className="flex gap-2">
                      <input 
                         type="text" 
                         value={newName}
                         onChange={(e) => setNewName(e.target.value)}
                         placeholder="Seu Nome"
                         required
                         className="flex-1 bg-white border border-purple-200/80 rounded-xl px-2.5 py-1.5 text-[11px] text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 transition-all"
                      />
                      <input 
                         type="text" 
                         value={newMessage}
                         onChange={(e) => setNewMessage(e.target.value)}
                         placeholder="Mensagem carinhosa..."
                         required
                         className="flex-[2] bg-white border border-purple-200/80 rounded-xl px-2.5 py-1.5 text-[11px] text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 transition-all"
                      />
                   </div>
                   
                   <motion.button 
                      id="btn-send-message"
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                         boxShadow: [
                            "0 0 0px rgba(168, 85, 247, 0.1)",
                            "0 0 15px rgba(168, 85, 247, 0.2)",
                            "0 0 0px rgba(168, 85, 247, 0.1)"
                         ]
                      }}
                      transition={{
                         boxShadow: {
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "easeInOut"
                         }
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 via-orange-500 to-teal-500 text-white font-bold uppercase tracking-widest text-[9px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                   >
                      <span>Enviar Mensagem</span>
                      <Send className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                   </motion.button>
                </form>
              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <div className="mt-8 mb-6 text-center text-teal-600 text-[9px] tracking-widest uppercase z-10">
        <p>© 2026 Alice de Mattos • Festa da Moana ⛵🌺</p>
      </div>

      {/* OVERLAY INTERACTIVE MODALS */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-purple-200/80 max-w-sm w-full rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(107,33,168,0.15)] relative overflow-hidden"
            >
              
              {/* Corner accent decorations */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-purple-300/20 rounded-tl-sm" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-purple-300/20 rounded-tr-sm" />
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 text-purple-600 hover:text-purple-950 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* MODAL 1: RSVP FORM */}
              {activeModal === "rsvp" && (
                <div>
                   <h3 className="font-display text-2xl text-purple-950 tracking-wider mb-1 uppercase flex items-center gap-1.5">
                     <Waves className="w-5 h-5 text-purple-600" /> Presença Confirmada
                   </h3>
                   <p className="text-xs text-purple-800 mb-5 leading-relaxed">
                     Por favor, confirme se você comparecerá ao aniversário tropical da Alice para prepararmos sua vaga no barco!
                   </p>

                   {rsvpStatus === "pending" && (
                     <form onSubmit={handleRSVPSubmit} className="space-y-4">
                        <div>
                           <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-650 mb-1">Seu Nome Completo</label>
                           <input 
                              type="text" 
                              required
                              value={rsvpName}
                              onChange={(e) => setRsvpName(e.target.value)}
                              placeholder="Digite seu nome"
                              className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 transition-all"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold uppercase tracking-widest text-purple-650 mb-1">Quantidade de Acompanhantes</label>
                           <select 
                              value={rsvpGuests}
                              onChange={(e) => setRsvpGuests(e.target.value)}
                              className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-purple-950 focus:outline-none focus:border-purple-500 transition-all"
                           >
                              <option value="0" className="bg-white text-purple-950">Apenas eu</option>
                              <option value="1" className="bg-white text-purple-950">Eu + 1 Acompanhante</option>
                              <option value="2" className="bg-white text-purple-950">Eu + 2 Acompanhantes</option>
                              <option value="3" className="bg-white text-purple-950">Eu + 3 Acompanhantes</option>
                           </select>
                        </div>

                        <button 
                           type="submit"
                           className="w-full mt-4 bg-gradient-to-r from-purple-600 via-orange-500 to-teal-500 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                           Confirmar Presença na Tripulação
                        </button>
                     </form>
                   )}

                   {(rsvpStatus === "submitted" || rsvpStatus === "already") && (
                     <motion.div 
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="text-center py-4"
                     >
                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                           <Check className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h4 className="font-display text-xl text-emerald-600 font-bold uppercase tracking-wide">Tudo pronto!</h4>
                        <p className="text-xs text-purple-800 mt-2 max-w-xs mx-auto">
                           Obrigado! Sua resposta foi gravada com carinho. Mal podemos esperar para nos aventurar no oceano com você!
                        </p>
                        
                        <button 
                           onClick={() => {
                              localStorage.removeItem("moana_alice_rsvp_confirmed");
                              setRsvpStatus("pending");
                              setRsvpConfirmed(false);
                           }}
                           className="mt-6 text-[9px] text-purple-600 hover:text-purple-950 uppercase tracking-widest hover:underline cursor-pointer"
                        >
                           Alterar resposta / Cancelar
                        </button>
                     </motion.div>
                   )}
                </div>
              )}

              {/* MODAL 2: VENUE LOCATION */}
              {activeModal === "location" && (
                <div>
                   <h3 className="font-display text-2xl text-purple-950 tracking-wider mb-1 uppercase flex items-center gap-1.5">
                     <MapPin className="w-5 h-5 text-purple-600" /> Local da Festa
                   </h3>
                   <p className="text-xs text-purple-800 mb-4 leading-relaxed">
                     A festa acontecerá no aconchegante salão de festas do condomínio.
                   </p>

                   {/* Custom styled map visualizer */}
                   <div className="w-full h-40 rounded-2xl bg-gradient-to-tr from-purple-50 to-teal-50 border border-purple-100 overflow-hidden relative mb-4 flex items-center justify-center">
                     <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:14px_14px]" />
                     
                     {/* Tropical Compass Accent */}
                     <div className="relative text-center z-10 px-4">
                        <MapPin className="w-7 h-7 text-orange-500 mx-auto mb-1 animate-bounce" />
                        <span className="block font-bold text-xs text-purple-950">Condomínio Michelangelo</span>
                        <span className="block text-[10px] text-purple-750 mt-0.5">Av. Getúlio Vargas, nº 72, Zona 1</span>
                     </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-start gap-2.5 bg-purple-50/50 border border-purple-100 p-3 rounded-xl">
                         <Clock className="w-4 h-4 text-purple-600 mt-0.5" />
                         <div>
                            <span className="block font-bold text-[11px] text-purple-950 uppercase tracking-wider">Início: 16h00 em Ponto</span>
                            <p className="text-[10px] text-purple-800 mt-0.5">Prepare-se para uma recepção com suquinhos tropicais e muitas brincadeiras!</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                         <a 
                            href="https://maps.google.com/?q=Av.+Get%C3%BAlio+Vargas,+72+-+Zona+1" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-purple-50 border border-purple-200 hover:border-purple-400 text-purple-950 py-2 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest transition-all shadow-xs"
                         >
                            Google Maps
                         </a>
                         <a 
                            href="https://waze.com/ul?q=Av.+Get%C3%BAlio+Vargas,+72+-+Zona+1" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-orange-500 text-white py-2 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xs"
                         >
                            Waze Rota
                         </a>
                      </div>
                   </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
