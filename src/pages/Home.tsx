import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { Twitter, Github, MessageSquare, Shield, Lock, EyeOff, Server, ArrowRight, type LucideIcon } from 'lucide-react';

// --- Global Styles ---
const GlobalStyles = () => (
  <style>{`
    body {
      background-color: #050505;
      color: #e0e0e0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #050505;
    }
    ::-webkit-scrollbar-thumb {
      background: #222;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #01f4cb;
    }
    .glass-nav {
      background: rgba(5, 5, 5, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
    .text-glow {
      text-shadow: 0 0 30px rgba(1, 244, 203, 0.4);
    }
    .bg-grid {
      background-image: 
        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }
  `}</style>
);

// --- Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 80, damping: 20 } 
  }
} as const;

const drawLine = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1, 
    transition: { duration: 2, ease: "easeInOut" as const, delay: 0.5 } 
  }
} as const;

const floatAnimation = {
  y: [-8, 8, -8],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

// --- Custom Isometric SVG Hero Graphic ---
const IsometricHero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full aspect-square md:aspect-auto md:h-[600px] lg:h-[700px] relative flex items-center justify-center overflow-visible"
    >
      {/* Centered Viewbox eliminates translation bugs and scales perfectly */}
      <svg viewBox="-350 -350 700 700" className="w-full h-full max-w-2xl absolute z-10 overflow-visible">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g transform="scale(1, 0.577) rotate(-45)">
          
          {/* --- Connections (Lines) --- */}
          <motion.path variants={drawLine} initial="hidden" animate="visible" d="M -120 -80 L -240 -80 L -240 -120" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
          <motion.path variants={drawLine} initial="hidden" animate="visible" d="M -120 0 L -200 0 L -200 60" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
          <motion.path variants={drawLine} initial="hidden" animate="visible" d="M -120 120 L -200 120 L -200 180" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
          <motion.path variants={drawLine} initial="hidden" animate="visible" d="M 120 -80 L 220 -80 L 220 -120" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
          <motion.path variants={drawLine} initial="hidden" animate="visible" d="M 120 40 L 220 40 L 220 100" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round" />
          <motion.path variants={drawLine} initial="hidden" animate="visible" d="M 120 160 L 220 160 L 220 220" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round" />

          {/* --- Phone Base (Shadow/Depth) --- */}
          <rect x="-120" y="-240" width="240" height="480" rx="32" fill="#000" stroke="#1a1a1a" strokeWidth="2" transform="translate(0, 30)" />
          <path d="M -120 -208 L -120 -240 Q -120 -270 -88 -270 L 88 -270 Q 120 -270 120 -240 L 120 -208" fill="none" stroke="#1a1a1a" strokeWidth="2" transform="translate(0, 30)"/>
          
          {/* --- Phone Top Surface --- */}
          <rect x="-120" y="-240" width="240" height="480" rx="32" fill="#0a0a0a" stroke="#444" strokeWidth="2" />
          
          {/* Screen */}
          <rect x="-105" y="-225" width="210" height="450" rx="20" fill="#050505" stroke="#222" strokeWidth="2" />
          {/* Notch */}
          <rect x="-35" y="-215" width="70" height="16" rx="8" fill="#111" stroke="#222" strokeWidth="1" />
          
          {/* UI Elements inside screen */}
          <rect x="-80" y="-160" width="160" height="60" rx="8" fill="none" stroke="#222" strokeWidth="2" />
          <circle cx="-60" cy="-130" r="10" fill="#222" />
          <rect x="-30" y="-140" width="80" height="8" rx="4" fill="#222" />
          <rect x="-30" y="-125" width="50" height="8" rx="4" fill="#111" />

          <rect x="-80" y="-80" width="70" height="70" rx="8" fill="none" stroke="#222" strokeWidth="2" />
          <rect x="10" y="-80" width="70" height="70" rx="8" fill="none" stroke="#222" strokeWidth="2" />

          {/* Glowing active box on screen */}
          <motion.rect initial={{ strokeDasharray: "0 400" }} animate={{ strokeDasharray: "400 0" }} transition={{ duration: 2, ease: "easeOut", delay: 0.5 }} x="-80" y="10" width="160" height="120" rx="12" fill="none" stroke="#333" strokeWidth="2" />
          <path d="M -20 50 L 20 90 M 20 50 L -20 90" stroke="#333" strokeWidth="2" strokeLinecap="round" />

          <circle cx="-60" cy="180" r="12" fill="#01f4cb" filter="drop-shadow(0 0 5px rgba(1,244,203,0.5))" />
          <circle cx="-20" cy="180" r="12" fill="#222" />
          <circle cx="20" cy="180" r="12" fill="#222" />
          <circle cx="60" cy="180" r="12" fill="#222" />

          {/* --- Nodes (Floating Apps/Features) --- */}

          {/* Node 1 (Active Chat - Cyan) */}
          <g transform="translate(-240, -120)">
            <rect x="-40" y="-40" width="80" height="80" rx="20" fill="none" stroke="#004d40" strokeWidth="2" transform="translate(0, 15)" />
            <motion.rect animate={floatAnimation} x="-40" y="-40" width="80" height="80" rx="20" fill="#01f4cb" fillOpacity="0.05" stroke="#01f4cb" strokeWidth="2" filter="url(#glow)" />
            {/* Chat Bubble Icon */}
            <motion.path animate={floatAnimation} d="M -15 -10 h 30 a 5 5 0 0 1 5 5 v 15 a 5 5 0 0 1 -5 5 h -5 l -10 10 v -10 h -15 a 5 5 0 0 1 -5 -5 v -15 a 5 5 0 0 1 5 -5 z" fill="none" stroke="#01f4cb" strokeWidth="2" strokeLinejoin="round" />
          </g>

          {/* Node 2 (Rocket/Speed) */}
          <motion.g animate={floatAnimation} transition={{ delay: 0.5 }} transform="translate(-200, 60)">
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="none" stroke="#111" strokeWidth="2" transform="translate(0, 10)" />
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="#0a0a0a" stroke="#444" strokeWidth="2" />
            <path d="M -10 10 L 15 -15 M 15 -15 C 15 -15 20 -5 10 5 C 0 15 15 -15 15 -15 Z" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>

          {/* Node 3 (Shield/Privacy) */}
          <motion.g animate={floatAnimation} transition={{ delay: 1 }} transform="translate(-200, 180)">
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="none" stroke="#111" strokeWidth="2" transform="translate(0, 10)" />
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="#0a0a0a" stroke="#444" strokeWidth="2" />
            <path d="M -12 -10 L 0 -15 L 12 -10 v 10 c 0 8 -12 15 -12 15 c 0 0 -12 -7 -12 -15 z" fill="none" stroke="#aaa" strokeWidth="2" strokeLinejoin="round" />
          </motion.g>

          {/* Node 4 (Globe/Network) */}
          <motion.g animate={floatAnimation} transition={{ delay: 0.2 }} transform="translate(220, -120)">
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="none" stroke="#111" strokeWidth="2" transform="translate(0, 10)" />
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="#0a0a0a" stroke="#444" strokeWidth="2" />
            <circle cx="0" cy="0" r="15" fill="none" stroke="#aaa" strokeWidth="2" />
            <ellipse cx="0" cy="0" rx="6" ry="15" fill="none" stroke="#aaa" strokeWidth="2" />
            <line x1="-15" y1="0" x2="15" y2="0" stroke="#aaa" strokeWidth="2" />
          </motion.g>

          {/* Node 5 (Vault/Data) */}
          <motion.g animate={floatAnimation} transition={{ delay: 0.8 }} transform="translate(220, 100)">
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="none" stroke="#111" strokeWidth="2" transform="translate(0, 10)" />
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="#0a0a0a" stroke="#444" strokeWidth="2" />
            <rect x="-12" y="-5" width="24" height="18" rx="3" fill="none" stroke="#aaa" strokeWidth="2" />
            <path d="M -7 -5 v -6 a 7 7 0 0 1 14 0 v 6" fill="none" stroke="#aaa" strokeWidth="2" />
          </motion.g>

          {/* Node 6 (M Logo) */}
          <motion.g animate={floatAnimation} transition={{ delay: 1.2 }} transform="translate(220, 220)">
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="none" stroke="#111" strokeWidth="2" transform="translate(0, 10)" />
            <rect x="-35" y="-35" width="70" height="70" rx="16" fill="#0a0a0a" stroke="#444" strokeWidth="2" />
            <text x="0" y="7" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="#aaa" textAnchor="middle">M</text>
          </motion.g>

          {/* --- Isometric Text --- */}
          <text x="-240" y="280" fontFamily="sans-serif" fontSize="48" fontWeight="800" fill="none" stroke="#333" strokeWidth="2" letterSpacing="10">MySYs</text>
          
          <motion.text 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            x="-240" y="-180" fontFamily="monospace" fontSize="20" fontWeight="bold" fill="#01f4cb" letterSpacing="4" filter="url(#glow)">
            CHAT
          </motion.text>
          <motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} d="M -220 -170 L -240 -150" stroke="#01f4cb" strokeWidth="2" />

        </g>
      </svg>
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-[#01f4cb] opacity-[0.04] blur-[80px] rounded-full pointer-events-none"></div>
    </motion.div>
  );
};

// --- Reusable Feature Wireframe Graphic ---
const WireframeGraphic = ({ type }: { type: string }) => {
  return (
    <motion.div 
      animate={floatAnimation}
      className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto aspect-[0.85] rounded-3xl overflow-hidden border border-[#222] bg-[#080808] shadow-2xl group flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#151515] via-[#050505] to-[#050505] z-0"></div>
      
      <svg viewBox="-200 -250 400 500" className="w-full h-full z-10 group-hover:scale-105 transition-transform duration-700">
        <g transform="scale(1, 0.577) rotate(-45)">
          {/* Base Grid Pattern */}
          <path d="M -150 -150 L 150 -150 L 150 150 L -150 150 Z" fill="none" stroke="#151515" strokeWidth="1" />
          <path d="M -75 -150 L -75 150 M 0 -150 L 0 150 M 75 -150 L 75 150" stroke="#151515" strokeWidth="1" />
          <path d="M -150 -75 L 150 -75 M -150 0 L 150 0 M -150 75 L 150 75" stroke="#151515" strokeWidth="1" />

          {type === 'chat' && (
            <>
              <rect x="-80" y="-100" width="120" height="60" rx="15" fill="#0a0a0a" stroke="#333" strokeWidth="2" />
              <rect x="-60" y="-80" width="60" height="6" rx="3" fill="#444" />
              <rect x="-60" y="-65" width="40" height="6" rx="3" fill="#222" />
              
              <rect x="-40" y="-10" width="120" height="60" rx="15" fill="#01f4cb" fillOpacity="0.05" stroke="#01f4cb" strokeWidth="2" filter="drop-shadow(0 0 8px rgba(1,244,203,0.2))" />
              <rect x="-20" y="10" width="60" height="6" rx="3" fill="#01f4cb" fillOpacity="0.8" />
              <rect x="-20" y="25" width="80" height="6" rx="3" fill="#01f4cb" fillOpacity="0.4" />
              
              <rect x="-100" y="80" width="100" height="60" rx="15" fill="#0a0a0a" stroke="#333" strokeWidth="2" />
            </>
          )}

          {type === 'feed' && (
            <>
              <rect x="-100" y="-120" width="200" height="100" rx="10" fill="#0a0a0a" stroke="#333" strokeWidth="2" />
              <circle cx="-70" cy="-90" r="10" fill="#333" />
              <rect x="-45" y="-95" width="80" height="10" rx="5" fill="#222" />
              <rect x="-80" y="-60" width="160" height="20" rx="4" fill="#1a1a1a" />

              <rect x="-100" y="0" width="200" height="100" rx="10" fill="#01f4cb" fillOpacity="0.05" stroke="#01f4cb" strokeWidth="2" filter="drop-shadow(0 0 8px rgba(1,244,203,0.2))" />
              <circle cx="-70" cy="30" r="10" fill="#01f4cb" fillOpacity="0.8" />
              <rect x="-45" y="25" width="80" height="10" rx="5" fill="#01f4cb" fillOpacity="0.4" />
              <rect x="-80" y="60" width="160" height="20" rx="4" fill="#01f4cb" fillOpacity="0.2" />
            </>
          )}

          {type === 'vault' && (
            <>
              <circle cx="0" cy="0" r="80" fill="#0a0a0a" stroke="#333" strokeWidth="2" strokeDasharray="10 5" />
              <circle cx="0" cy="0" r="60" fill="none" stroke="#01f4cb" strokeWidth="2" filter="drop-shadow(0 0 8px rgba(1,244,203,0.3))" />
              <rect x="-25" y="-10" width="50" height="40" rx="5" fill="#050505" stroke="#01f4cb" strokeWidth="2" />
              <path d="M -15 -10 v -10 a 15 15 0 0 1 30 0 v 10" fill="none" stroke="#01f4cb" strokeWidth="2" />
              <circle cx="0" cy="10" r="4" fill="#01f4cb" />
            </>
          )}

          {type === 'network' && (
            <>
              <path d="M 0 -80 L -80 40 L 80 40 Z" fill="none" stroke="#333" strokeWidth="2" />
              <path d="M 0 0 L 0 -80 M 0 0 L -80 40 M 0 0 L 80 40" fill="none" stroke="#01f4cb" strokeWidth="2" filter="drop-shadow(0 0 5px rgba(1,244,203,0.4))" />
              
              <circle cx="0" cy="-80" r="15" fill="#0a0a0a" stroke="#444" strokeWidth="2" />
              <circle cx="-80" cy="40" r="15" fill="#0a0a0a" stroke="#444" strokeWidth="2" />
              <circle cx="80" cy="40" r="15" fill="#0a0a0a" stroke="#444" strokeWidth="2" />
              
              <circle cx="0" cy="0" r="20" fill="#050505" stroke="#01f4cb" strokeWidth="3" filter="drop-shadow(0 0 10px rgba(1,244,203,0.5))" />
              <circle cx="0" cy="0" r="6" fill="#01f4cb" />
            </>
          )}
        </g>
      </svg>
    </motion.div>
  );
};

// --- Main Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Messenger', path: '/m' },
    { label: 'Feed', path: '/feed' },
    { label: 'Explore', path: '/explore' },
    { label: 'Reels', path: '/r' },
  ];

  return (
    <nav className={`glass-nav fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 shadow-2xl' : 'py-6 border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg border border-[#01f4cb]/50 flex items-center justify-center text-[#01f4cb] font-bold text-xl group-hover:bg-[#01f4cb] group-hover:text-[#050505] transition-all duration-300 shadow-[0_0_15px_rgba(1,244,203,0.15)]">
            M
          </div>
          <span className="font-semibold tracking-widest text-lg hidden sm:block text-[#e0e0e0]">MySYs</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} className="text-[#a0a0a0] hover:text-[#01f4cb] transition-colors duration-200 text-sm font-medium tracking-wide">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden lg:flex items-center gap-5 text-[#666]">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#01f4cb] transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#01f4cb] transition-colors"><Github className="w-5 h-5" /></a>
          </div>
          <Link to="/register" className="bg-transparent border border-[#01f4cb]/50 text-[#01f4cb] hover:bg-[#01f4cb] hover:text-[#050505] transition-all duration-300 px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-[0_0_15px_rgba(1,244,203,0.1)] hover:shadow-[0_0_25px_rgba(1,244,203,0.3)] whitespace-nowrap">
            Claim Handle
          </Link>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 min-h-[90vh] flex items-center overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505] z-0"></div>
      
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8 z-10">
        
        {/* Left: Text Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden" 
          animate="visible" 
          className="flex-1 text-center lg:text-left pt-10 lg:pt-0"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#222] bg-[#111] text-[#a0a0a0] text-xs font-mono mb-6 md:mb-8">
            <Shield className="w-3.5 h-3.5 text-[#01f4cb]" /> <span>End-to-end encrypted by default</span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 text-[#e0e0e0] leading-[1.1]">
            Social Media. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01f4cb] to-[#00897b] text-glow">
              Redefined for Privacy.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-[#a0a0a0] max-w-xl mx-auto lg:mx-0 mb-8 md:mb-10 leading-relaxed">
            Your digital life, truly yours. A decentralized network built on absolute privacy, zero-knowledge encryption, and true data ownership.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link to="/register" className="w-full sm:w-auto bg-[#01f4cb] text-[#050505] font-bold text-base px-8 py-3.5 rounded-lg hover:bg-[#02e0bb] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(1,244,203,0.3)] flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-transparent text-[#e0e0e0] border border-[#333] font-medium text-base px-8 py-3.5 rounded-lg hover:bg-[#111] hover:border-[#555] transition-all duration-300 flex items-center justify-center">
              Login to Account
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Right: Graphic */}
        <div className="flex-1 w-full">
          <IsometricHero />
        </div>

      </div>
    </section>
  );
};

interface FeatureSectionProps {
  titleLight: string;
  titleCyan: string;
  description: string;
  icon: LucideIcon;
  wireframeType: string;
  reverse?: boolean;
}

const FeatureSection = ({ titleLight, titleCyan, description, icon: Icon, wireframeType, reverse }: FeatureSectionProps) => (
  <motion.section 
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={staggerContainer}
    className={`py-16 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
  >
    <motion.div variants={fadeUp} className="flex-1 text-center lg:text-left">
      <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-[#222] flex items-center justify-center mb-6 md:mb-8 mx-auto lg:mx-0 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <Icon className="w-7 h-7 text-[#01f4cb]" />
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight text-[#e0e0e0] leading-tight">
        {titleLight} <span className="text-[#01f4cb]">{titleCyan}</span>
      </h2>
      <p className="text-base sm:text-lg text-[#a0a0a0] max-w-xl mx-auto lg:mx-0 leading-relaxed">
        {description}
      </p>
    </motion.div>
    
    <motion.div variants={fadeUp} className="flex-1 w-full px-4 sm:px-0">
      <WireframeGraphic type={wireframeType} />
    </motion.div>
  </motion.section>
);

const GlobeCTA = () => (
  <motion.section 
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeUp}
    className="relative py-24 md:py-40 px-4 sm:px-6 flex flex-col items-center text-center overflow-hidden border-t border-[#111] mt-10 md:mt-20 bg-grid"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-0 pointer-events-none"></div>
    
    <div className="relative z-10 max-w-4xl mx-auto bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#222] p-8 sm:p-12 md:p-20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full">
      <div className="w-16 h-16 bg-[#01f4cb]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#01f4cb]/30">
        <Shield className="w-8 h-8 text-[#01f4cb]" />
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 tracking-tight text-[#e0e0e0]">
        Take back <span className="text-[#01f4cb]">control.</span>
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-[#a0a0a0] mb-10 max-w-2xl mx-auto">
        Stop being the product. Join the network where your data remains encrypted, local, and completely in your hands.
      </p>
      <Link to="/register" className="inline-block bg-[#01f4cb] text-[#050505] font-bold text-base sm:text-lg px-8 py-3.5 sm:px-12 sm:py-4 rounded-xl hover:bg-[#02e0bb] hover:-translate-y-1 transition-all duration-300 shadow-[0_0_30px_rgba(1,244,203,0.2)] hover:shadow-[0_0_50px_rgba(1,244,203,0.5)] whitespace-nowrap">
        Create Secure Account
      </Link>
    </div>
  </motion.section>
);

const Footer = () => (
  <footer className="border-t border-[#111] pt-16 pb-8 px-4 sm:px-6 bg-[#050505]">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
      
      <div className="flex flex-col gap-4 md:gap-5">
        <h3 className="text-[#e0e0e0] font-semibold tracking-widest uppercase text-xs">Platform</h3>
        {[
          { label: 'Messenger', path: '/m' },
          { label: 'Feed', path: '/feed' },
          { label: 'Explore', path: '/explore' },
          { label: 'Reels', path: '/r' }
        ].map(item => (
          <Link key={item.label} to={item.path} className="text-sm text-[#777] hover:text-[#01f4cb] transition-colors">{item.label}</Link>
        ))}
      </div>
      <div className="flex flex-col gap-4 md:gap-5">
        <h3 className="text-[#e0e0e0] font-semibold tracking-widest uppercase text-xs">Developers</h3>
        {['Documentation', 'GitHub', 'Open Source', 'Bounties'].map(link => (
          <a key={link} href="#" className="text-sm text-[#777] hover:text-[#01f4cb] transition-colors">{link}</a>
        ))}
      </div>
      <div className="flex flex-col gap-4 md:gap-5">
        <h3 className="text-[#e0e0e0] font-semibold tracking-widest uppercase text-xs">Company</h3>
        {['About', 'Blog', 'Manifesto', 'Careers'].map(link => (
          <a key={link} href="#" className="text-sm text-[#777] hover:text-[#01f4cb] transition-colors">{link}</a>
        ))}
      </div>
      <div className="flex flex-col gap-4 md:gap-5">
        <h3 className="text-[#e0e0e0] font-semibold tracking-widest uppercase text-xs">Legal</h3>
        {[
          { label: 'Privacy Policy', path: '/info/privacy' },
          { label: 'Terms of Service', path: '/info/terms' },
          { label: 'Guidelines', path: '/info/guidelines' }
        ].map(item => (
          <Link key={item.label} to={item.path} className="text-sm text-[#777] hover:text-[#01f4cb] transition-colors">{item.label}</Link>
        ))}
      </div>

    </div>

    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-[#111] pt-8 text-[#555]">
      <div className="flex items-center gap-3 mb-6 md:mb-0">
        <div className="w-8 h-8 rounded-lg border border-[#333] flex items-center justify-center text-[#555] font-bold text-sm bg-[#0a0a0a]">
          M
        </div>
        <span className="text-sm tracking-wide">&copy; {new Date().getFullYear()} MySYs INC. All rights reserved.</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#01f4cb] transition-colors"><Twitter className="w-5 h-5" /></a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#01f4cb] transition-colors"><Github className="w-5 h-5" /></a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#01f4cb] transition-colors"><MessageSquare className="w-5 h-5" /></a>
      </div>
    </div>
  </footer>
);

// --- Main App Component ---

export default function App() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/feed', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading || currentUser) {
    return null;
  }

  return (
    <div className="font-sans bg-[#050505] min-h-screen text-[#e0e0e0] selection:bg-[#01f4cb] selection:text-[#050505]">
      <GlobalStyles />
      <Navbar />
      
      <main>
        <HeroSection />

        <div className="mt-12 md:mt-24 space-y-12 md:space-y-0 relative z-20">
          <FeatureSection 
            icon={Lock}
            titleLight="Zero-Knowledge" 
            titleCyan="Messaging."
            description="End-to-end encrypted chats where only you and your friends hold the keys. No servers in the middle can read your messages. Ever."
            wireframeType="chat"
            reverse={false}
          />

          <FeatureSection 
            icon={EyeOff}
            titleLight="Algorithmic" 
            titleCyan="Freedom."
            description="No algorithms manipulating your attention. No advertisers tracking your clicks. Just a clean, chronological feed of the people you actually care about."
            wireframeType="feed"
            reverse={true}
          />

          <FeatureSection 
            icon={Shield}
            titleLight="Your Data," 
            titleCyan="Your Vault."
            description="Store your memories and posts securely. You own your data natively, and you can take it anywhere with your decentralized identity."
            wireframeType="vault"
            reverse={false}
          />

          <FeatureSection 
            icon={Server}
            titleLight="Uncensorable &" 
            titleCyan="Decentralized."
            description="Run on a distributed peer-to-peer network that cannot be taken down, throttled, or controlled by any single corporate entity."
            wireframeType="network"
            reverse={true}
          />
        </div>

        <GlobeCTA />
      </main>

      <Footer />
    </div>
  );
}