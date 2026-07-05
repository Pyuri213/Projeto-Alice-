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
  Sun
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

// Moana-Inspired Bioluminescent/Golden Particles
function TropicalParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 25 }).map((_, i) => {
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 7 + 5;
        const delay = Math.random() * 5;
        const left = Math.random() * 100;
        const isTeFiti = Math.random() > 0.6; // beautiful emerald green
        const isSunset = Math.random() > 0.4; // warm coral pink/gold

        return (
          <motion.div
            key={i}
            initial={{ y: "105%", opacity: 0, scale: 0.5 }}
            animate={{
              y: "-5%",
              opacity: [0, 0.7, 0.7, 0],
              scale: [0.5, 1.3, 0.5],
              x: [0, Math.sin(i) * 25, 0]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut"
            }}
            className={`absolute rounded-full ${
              isTeFiti 
                ? 'bg-emerald-300 shadow-[0_0_8px_#34d399]' 
                : isSunset 
                  ? 'bg-orange-400 shadow-[0_0_8px_#fb923c]' 
                  : 'bg-teal-300 shadow-[0_0_8px_#5eead4]'
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
    <div className="min-h-screen bg-[#03151a] text-teal-50 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Wave Accent Top & Bottom Background Design */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0c404d]/20 via-transparent to-black" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-teal-900/10 to-transparent pointer-events-none" />
      
      {/* Decorative Wave lines in background */}
      <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      {/* Bioluminescent / Sunset Ocean Particles */}
      <TropicalParticles />

      {/* Floating Ambient Music Action */}
      {isOpen && (
        <button
          id="btn-music-toggle"
          onClick={handleToggleMusic}
          className="fixed top-6 right-6 z-50 p-4 rounded-full bg-teal-950/60 border border-teal-500/30 text-amber-300 hover:bg-teal-900/80 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)] backdrop-blur-md"
        >
          {musicOn ? <Volume2 className="w-5 h-5 animate-pulse text-amber-300" /> : <VolumeX className="w-5 h-5 text-teal-400" />}
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
              <div className="flex justify-center items-center gap-2 mb-2 text-amber-400">
                <Sun className="w-5 h-5 animate-spin-slow" />
                <span className="text-xs font-sans tracking-[0.3em] uppercase font-bold text-amber-300">UM CONVITE ALÉM DO HORIZONTE</span>
                <Sun className="w-5 h-5 animate-spin-slow" />
              </div>
              <h2 className="font-display text-5xl md:text-6xl text-amber-200 mt-1">Alice de Mattos</h2>
              <p className="text-xs text-teal-300 tracking-widest mt-2">VENHA CELEBRAR ESSA AVENTURA COMIGO!</p>
              <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4" />
            </motion.div>

            {/* Interactive 3D Sailboat/Tropical Envelope */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center perspective-[1200px]">
              
              {/* Back flap (envelope base) */}
              <motion.div 
                animate={isOpening ? { rotateX: -180, z: -10 } : {}}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute inset-x-4 bottom-0 h-4/5 bg-gradient-to-b from-[#092a30] to-[#04151a] border-b border-x border-teal-500/20 rounded-b-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 flex items-center justify-center overflow-hidden"
              >
                {/* Inside envelope floral pattern */}
                <div className="absolute inset-0 bg-[#0e3a42]/30 opacity-40" />
                <div className="absolute -inset-10 border border-teal-500/10 rounded-full animate-spin-slow opacity-15 pointer-events-none" />
                
                {/* Invitation card inside peeking out slightly */}
                <motion.div
                  animate={isOpening ? { y: -100, scale: 1.05, opacity: 1 } : { y: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="w-11/12 h-5/6 bg-gradient-to-b from-[#0f434f] to-[#07242b] border border-amber-400/20 rounded-2xl flex flex-col items-center justify-center p-4 shadow-2xl relative"
                >
                   <p className="font-sans text-[10px] tracking-widest text-amber-300 font-bold">CONVITE DE ANIVERSÁRIO</p>
                   <h3 className="font-display text-2xl text-white mt-1">ALICE</h3>
                </motion.div>
              </motion.div>

              {/* Cover envelope front triangles (overlaying the peeking card) */}
              <div className="absolute inset-x-4 bottom-0 h-4/5 bg-transparent z-20 pointer-events-none">
                {/* Side triangular flaps */}
                <div style={{ clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)" }} className="absolute inset-0 w-full h-full bg-[#051c21] border-l border-teal-500/15 rounded-bl-3xl left-0" />
                <div style={{ clipPath: "polygon(100% 0%, 50% 50%, 100% 100%)" }} className="absolute inset-0 w-full h-full bg-[#051c21] border-r border-teal-500/15 rounded-br-3xl right-0" />
                {/* Bottom flap */}
                <div style={{ clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }} className="absolute inset-x-0 bottom-0 h-1/2 bg-[#082229]/95 border-b border-teal-500/20 rounded-b-3xl shadow-inner" />
              </div>

              {/* Seal Wax Flap (glowing Te Fiti Heart Spiral) */}
              <motion.div
                animate={isOpening ? { rotateX: 180, z: -20, opacity: 0 } : {}}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{ transformOrigin: "top", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                className="absolute inset-x-4 top-1/5 h-1/2 bg-gradient-to-b from-[#0e3b45] to-[#051b20] border-t border-x border-teal-500/20 rounded-t-3xl z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center"
              >
                {/* Glowing Heart of Te Fiti Seal */}
                {!isOpening && (
                  <motion.button
                    id="btn-wax-seal"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenInvitation}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-400 to-teal-500 border-2 border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.6)] flex items-center justify-center cursor-pointer z-40"
                  >
                    {/* SVG spiral pattern */}
                    <svg className="w-9 h-9 text-emerald-950 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2a10 10 0 0 1 10 10c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 0 1 9-9c3.314 0 6 2.686 6 6 0 2.21-1.79 4-4 4a2 2 0 0 1-2-2c0-.55.45-1 1-1" />
                    </svg>
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-emerald-400/30 rounded-full"
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
              <p className="text-xs text-amber-300/80 tracking-widest animate-pulse flex items-center justify-center gap-1.5">
                🌴 Toque no Coração de Te Fiti para abrir 🌴
              </p>
              
              <button 
                id="btn-reveal-invitation"
                onClick={handleOpenInvitation}
                className="mt-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:border-amber-400 transition-all shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95"
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
            {/* LEFT COLUMN: The Beautiful Moana-Style 9:16 Invitation Card */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full max-w-sm aspect-[9/16] bg-gradient-to-b from-[#0c3942] via-[#052127] to-[#021014] rounded-[2.5rem] p-6 border border-teal-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between"
            >
              {/* Tropical Border details */}
              <div className="absolute inset-3 border border-amber-400/10 rounded-[2rem] pointer-events-none" />
              <div className="absolute inset-4 border-2 border-orange-500/5 rounded-[1.8rem] pointer-events-none" />
              
              {/* Waves and stars in card backgrounds */}
              <div className="absolute top-10 left-10 text-teal-400/5 pointer-events-none">
                 <Waves className="w-40 h-40 opacity-10" />
              </div>

              {/* Card Corner Accents (Tribal Compass stars) */}
              <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-amber-400/40 rounded-tl-sm flex items-center justify-center">
                <Sun className="w-2.5 h-2.5 text-amber-400/40" />
              </div>
              <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-amber-400/40 rounded-tr-sm flex items-center justify-center">
                <Sun className="w-2.5 h-2.5 text-amber-400/40" />
              </div>
              <div className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-amber-400/40 rounded-bl-sm flex items-center justify-center">
                <Sun className="w-2.5 h-2.5 text-amber-400/40" />
              </div>
              <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-amber-400/40 rounded-br-sm flex items-center justify-center">
                <Sun className="w-2.5 h-2.5 text-amber-400/40" />
              </div>

              {/* Top logo header */}
              <div className="text-center mt-4">
                <span className="text-[9px] font-sans text-amber-400 tracking-[0.4em] uppercase font-bold flex items-center justify-center gap-1">
                   <Sun className="w-3.5 h-3.5 text-amber-400" /> MEU ANIVERSÁRIO <Sun className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <p className="font-serif text-[11px] italic text-teal-300 mt-1">"O oceano me chama..."</p>
              </div>

              {/* Main invitation info */}
              <div className="text-center my-auto flex flex-col items-center">
                <span className="text-[10px] font-sans text-orange-400 tracking-[0.3em] uppercase font-bold block mb-2">FESTA TROPICAL DA</span>
                <h1 className="font-display text-6xl md:text-7xl text-amber-200 leading-none filter drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">Alice</h1>
                <span className="font-sans text-sm text-teal-100 tracking-[0.25em] block mt-1 font-bold">DE MATTOS</span>
                
                <div className="flex items-center gap-3 w-32 my-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-400/40" />
                  <Anchor className="w-4 h-4 text-amber-400" />
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-400/40" />
                </div>

                <p className="text-xs text-teal-200/80 leading-relaxed max-w-[220px]">
                  Venha se divertir com muitos jogos, lanchinhos e a magia das ilhas tropicais!
                </p>
              </div>

              {/* Core Date & Location highlighted in the card */}
              <div className="text-center mb-4">
                <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl py-2 px-3 mx-2">
                   <span className="block text-amber-300 text-xs tracking-widest font-bold uppercase">DOMINGO</span>
                   <span className="block text-xl font-bold text-white mt-0.5">25 DE JULHO</span>
                   <span className="block text-amber-400 text-xs font-bold tracking-widest uppercase mt-0.5">ÀS 16:00 HORAS</span>
                </div>
                
                <p className="text-[10px] text-teal-400 tracking-wider uppercase font-bold mt-3">Salão do Condomínio Michelangelo</p>
                <p className="text-[9px] text-teal-500 font-medium">Av. Getúlio Vargas, 72 - Zona 1</p>
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
              <div className="bg-[#0b242a]/80 backdrop-blur-md border border-teal-500/10 rounded-3xl p-5 shadow-xl text-center">
                <span className="text-[10px] font-sans text-amber-300 tracking-widest uppercase font-bold block mb-3">Velejando em direção à festa...</span>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-teal-950/50 border border-teal-500/10 p-2.5 rounded-xl">
                    <span className="block text-xl font-bold text-white">{timeLeft.days}</span>
                    <span className="text-[8px] uppercase tracking-widest text-teal-400 font-bold">Dias</span>
                  </div>
                  <div className="bg-teal-950/50 border border-teal-500/10 p-2.5 rounded-xl">
                    <span className="block text-xl font-bold text-white">{timeLeft.hours}</span>
                    <span className="text-[8px] uppercase tracking-widest text-teal-400 font-bold">Horas</span>
                  </div>
                  <div className="bg-teal-950/50 border border-teal-500/10 p-2.5 rounded-xl">
                    <span className="block text-xl font-bold text-white">{timeLeft.minutes}</span>
                    <span className="text-[8px] uppercase tracking-widest text-teal-400 font-bold">Min</span>
                  </div>
                  <div className="bg-teal-950/50 border border-teal-500/10 p-2.5 rounded-xl">
                    <span className="block text-xl font-bold text-orange-400 animate-pulse">{timeLeft.seconds}</span>
                    <span className="text-[8px] uppercase tracking-widest text-teal-400 font-bold">Seg</span>
                  </div>
                </div>
              </div>

              {/* ACTION MODULES (SIMPLIFIED TO 2 PRIMARY BUTTONS) */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* RSVP Button */}
                <button 
                  id="btn-rsvp-open"
                  onClick={() => setActiveModal("rsvp")}
                  className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between aspect-[1.3/1] shadow-md group ${
                    rsvpConfirmed 
                    ? "bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-500/60" 
                    : "bg-[#0a252b]/80 border-teal-500/15 hover:border-amber-400/50"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className={`p-2 rounded-xl ${rsvpConfirmed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-teal-900/40 text-teal-400 group-hover:text-amber-300'}`}>
                      <Waves className="w-5 h-5" />
                    </div>
                    {rsvpConfirmed && <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Confirmado</span>}
                  </div>
                  <div>
                    <h4 className="font-sans text-xs tracking-wider font-bold mb-0.5 text-white">CONFIRMAR PRESENÇA</h4>
                    <p className="text-[9px] text-teal-300 group-hover:text-white transition-colors">Garanta o seu lugar na tripulação!</p>
                  </div>
                </button>

                {/* Location Map Button */}
                <button 
                  id="btn-location-open"
                  onClick={() => setActiveModal("location")}
                  className="bg-[#0a252b]/80 border border-teal-500/15 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] hover:border-amber-400/50 flex flex-col justify-between aspect-[1.3/1] shadow-md group"
                >
                  <div className="p-2 rounded-xl bg-teal-900/40 text-teal-400 group-hover:text-amber-300">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs tracking-wider font-bold mb-0.5 text-white">LOCALIZAÇÃO</h4>
                    <p className="text-[9px] text-teal-300 group-hover:text-white transition-colors">Veja como chegar no condomínio.</p>
                  </div>
                </button>

              </div>

              {/* MURAL DE RECADOS (LIVE GUESTBOOK) */}
              <div className="bg-[#0b242a]/80 backdrop-blur-md border border-teal-500/10 rounded-3xl p-5 shadow-xl flex-grow flex flex-col justify-between min-h-[190px]">
                <div>
                  <h3 className="font-sans text-[11px] text-amber-300 tracking-widest uppercase mb-2 flex items-center gap-1.5 font-bold">
                    <Heart className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" /> Mural de Mensagens à Alice
                  </h3>
                  
                  {/* Message feed list */}
                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar text-xs">
                    {guestMessages.length === 0 ? (
                      <div className="text-center py-4 text-teal-400/60 italic text-[11px] leading-relaxed">
                        Nenhuma mensagem enviada ainda.<br />
                        Seja o primeiro a deixar uma mensagem de carinho para a Alice! ⛵🌺
                      </div>
                    ) : (
                      guestMessages.map((msg, index) => (
                        <div key={index} className="bg-teal-950/40 border border-teal-500/5 p-2 rounded-xl">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-[11px] font-bold text-amber-200">{msg.name}</span>
                            <span className="text-[8px] text-teal-400 uppercase">{msg.date}</span>
                          </div>
                          <p className="text-[10px] text-teal-100 italic leading-snug">"{msg.text}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Live Message Form */}
                <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-teal-500/10 flex flex-col gap-2.5">
                   <div className="flex gap-2">
                      <input 
                         type="text" 
                         value={newName}
                         onChange={(e) => setNewName(e.target.value)}
                         placeholder="Seu Nome"
                         required
                         className="flex-1 bg-teal-950/60 border border-teal-500/20 rounded-xl px-2.5 py-1.5 text-[11px] text-white placeholder-teal-600 focus:outline-none focus:border-amber-400 transition-all"
                      />
                      <input 
                         type="text" 
                         value={newMessage}
                         onChange={(e) => setNewMessage(e.target.value)}
                         placeholder="Mensagem carinhosa..."
                         required
                         className="flex-[2] bg-teal-950/60 border border-teal-500/20 rounded-xl px-2.5 py-1.5 text-[11px] text-white placeholder-teal-600 focus:outline-none focus:border-amber-400 transition-all"
                      />
                   </div>
                   
                   <motion.button 
                      id="btn-send-message"
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                         boxShadow: [
                            "0 0 0px rgba(245, 158, 11, 0.2)",
                            "0 0 15px rgba(245, 158, 11, 0.5)",
                            "0 0 0px rgba(245, 158, 11, 0.2)"
                         ]
                      }}
                      transition={{
                         boxShadow: {
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "easeInOut"
                         }
                      }}
                      className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-teal-950 font-bold uppercase tracking-widest text-[9px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:text-white"
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#041a1f] border border-teal-500/20 max-w-sm w-full rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(20,184,166,0.15)] relative overflow-hidden"
            >
              
              {/* Corner accent decorations */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-amber-400/20 rounded-tl-sm" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-amber-400/20 rounded-tr-sm" />
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 text-teal-400 hover:text-white rounded-full bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* MODAL 1: RSVP FORM */}
              {activeModal === "rsvp" && (
                <div>
                   <h3 className="font-display text-2xl text-amber-300 tracking-wider mb-1 uppercase flex items-center gap-1.5">
                     <Waves className="w-5 h-5 text-amber-400" /> Presença Confirmada
                   </h3>
                   <p className="text-xs text-teal-300 mb-5 leading-relaxed">
                     Por favor, confirme se você comparecerá ao aniversário tropical da Alice para prepararmos sua vaga no barco!
                   </p>

                   {rsvpStatus === "pending" && (
                     <form onSubmit={handleRSVPSubmit} className="space-y-4">
                        <div>
                           <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">Seu Nome Completo</label>
                           <input 
                              type="text" 
                              required
                              value={rsvpName}
                              onChange={(e) => setRsvpName(e.target.value)}
                              placeholder="Digite seu nome"
                              className="w-full bg-teal-950/50 border border-teal-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-teal-700 focus:outline-none focus:border-amber-400 transition-all"
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">Quantidade de Acompanhantes</label>
                           <select 
                              value={rsvpGuests}
                              onChange={(e) => setRsvpGuests(e.target.value)}
                              className="w-full bg-teal-950/50 border border-teal-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-all"
                           >
                              <option value="0" className="bg-[#041a1f]">Apenas eu</option>
                              <option value="1" className="bg-[#041a1f]">Eu + 1 Acompanhante</option>
                              <option value="2" className="bg-[#041a1f]">Eu + 2 Acompanhantes</option>
                              <option value="3" className="bg-[#041a1f]">Eu + 3 Acompanhantes</option>
                           </select>
                        </div>

                        <button 
                           type="submit"
                           className="w-full mt-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
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
                        <div className="w-14 h-14 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/40">
                           <Check className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h4 className="font-display text-xl text-emerald-400 font-bold uppercase tracking-wide">Tudo pronto!</h4>
                        <p className="text-xs text-teal-300 mt-2 max-w-xs mx-auto">
                           Obrigado! Sua resposta foi gravada com carinho. Mal podemos esperar para nos aventurar no oceano com você!
                        </p>
                        
                        <button 
                           onClick={() => {
                              localStorage.removeItem("moana_alice_rsvp_confirmed");
                              setRsvpStatus("pending");
                              setRsvpConfirmed(false);
                           }}
                           className="mt-6 text-[9px] text-teal-500 hover:text-white uppercase tracking-widest hover:underline"
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
                   <h3 className="font-display text-2xl text-amber-300 tracking-wider mb-1 uppercase flex items-center gap-1.5">
                     <MapPin className="w-5 h-5 text-amber-400" /> Local da Festa
                   </h3>
                   <p className="text-xs text-teal-300 mb-4 leading-relaxed">
                     A festa acontecerá no aconchegante salão de festas do condomínio.
                   </p>

                   {/* Custom styled map visualizer */}
                   <div className="w-full h-40 rounded-2xl bg-[#092229] border border-teal-500/10 overflow-hidden relative mb-4 flex items-center justify-center">
                     <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:14px_14px]" />
                     
                     {/* Tropical Compass Accent */}
                     <div className="relative text-center z-10 px-4">
                        <MapPin className="w-7 h-7 text-orange-400 mx-auto mb-1 animate-bounce" />
                        <span className="block font-bold text-xs text-white">Condomínio Michelangelo</span>
                        <span className="block text-[10px] text-teal-300 mt-0.5">Av. Getúlio Vargas, nº 72, Zona 1</span>
                     </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-start gap-2.5 bg-teal-950/40 border border-teal-500/5 p-3 rounded-xl">
                         <Clock className="w-4 h-4 text-amber-400 mt-0.5" />
                         <div>
                            <span className="block font-bold text-[11px] text-white uppercase tracking-wider">Início: 16h00 em Ponto</span>
                            <p className="text-[10px] text-teal-300 mt-0.5">Prepare-se para uma recepção com suquinhos tropicais e muitas brincadeiras!</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                         <a 
                            href="https://maps.google.com/?q=Av.+Get%C3%BAlio+Vargas,+72+-+Zona+1" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-teal-900/40 border border-teal-500/20 hover:border-amber-400/40 text-white py-2 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest transition-all"
                         >
                            Google Maps
                         </a>
                         <a 
                            href="https://waze.com/ul?q=Av.+Get%C3%BAlio+Vargas,+72+-+Zona+1" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-amber-500 text-teal-950 py-2 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-all"
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
