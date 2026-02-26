import React, { useEffect, useState, Suspense } from "react";
import { motion, type HTMLMotionProps, AnimatePresence } from "motion/react";
import { 
  Twitter, 
  Github, 
  MessageSquare, 
  Send,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/layout";
import Spline from '@splinetool/react-spline';

const Home: React.FC = () => {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const sectionVariants: HTMLMotionProps<"section"> = {
    initial: { opacity: 0, y: 30 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    viewport: { once: true, margin: "-50px" }
  };

  const navLinks = [
    { name: "Messenger", href: "#" },
    { name: "Social", href: "#" },
    { name: "ID", href: "#" },
    { name: "Whitepaper", href: "#" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
        
        {/* Navigation */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isNavScrolled || isMobileMenuOpen 
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg" 
            : "bg-transparent border-b border-transparent"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group z-50">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform duration-300">
                M
              </div>
              <span className="font-semibold tracking-wider text-lg hidden sm:block">MYSYS</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-4 text-muted-foreground">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <Github size={18} />
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <MessageSquare size={18} />
                </a>
              </div>
              <a 
                href="https://zos.zero.tech/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-5 py-2 rounded-full text-sm font-medium"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-foreground z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-background border-b border-border overflow-hidden"
              >
                <div className="px-4 py-8 flex flex-col gap-6">
                  {navLinks.map((item) => (
                    <a 
                      key={item.name} 
                      href={item.href} 
                      className="text-xl font-semibold hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="h-px bg-border/50 my-2" />
                  <div className="flex items-center gap-8 text-muted-foreground">
                    <a href="#" className="hover:text-primary transition-colors"><Twitter size={24} /></a>
                    <a href="#" className="hover:text-primary transition-colors"><Github size={24} /></a>
                    <a href="#" className="hover:text-primary transition-colors"><MessageSquare size={24} /></a>
                  </div>
                  <a 
                    href="https://zos.zero.tech/" 
                    className="w-full bg-primary text-primary-foreground text-center py-4 rounded-xl font-bold text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-24 pb-12 sm:pt-48 sm:pb-32 px-4 sm:px-6 flex flex-col items-center text-center max-w-7xl mx-auto overflow-hidden">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span>The Social Network</span> <br/> <span className="text-primary font-black uppercase">YOU Own.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 sm:mb-12"
          >
            No tracking. No censorship. Just community. Experience high-fidelity communication on a platform built for its users.
          </motion.p>
          
          {/* Spline 3D Embed */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative z-10 w-full max-w-4xl mx-auto rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-video min-h-[300px] sm:min-h-[400px] max-h-[700px] bg-card border border-border/50 shadow-2xl"
          >
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground animate-pulse">Initializing Secure Layer...</div>}>
              <Spline scene="https://prod.spline.design/Yu-Xnq7fkXYLjvBj/scene.splinecode" />
            </Suspense>
          </motion.div>
        </section>

        {/* Section 1: The everything app */}
        <motion.section 
          {...sectionVariants}
          className="py-16 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span>The</span> <span className="text-primary">privacy-first network.</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 sm:mb-16">
            A unified space for messenger, social feeds, and creative expression—where your data never leaves your hands.
          </p>
          
          <div className="w-full max-w-5xl rounded-3xl border border-border overflow-hidden bg-card shadow-2xl">
            <video 
              src="/assets/hero-video.mp4" 
              loop 
              autoPlay 
              muted 
              playsInline 
              className="w-full object-cover"
            />
          </div>
        </motion.section>

        {/* Feature Sections */}
        {[
          {
            title: <>Unfiltered expression. <br className="hidden sm:block"/> Total <span className="text-primary">anonymity.</span></>,
            desc: "Share your life without being tracked. MySys ensures your posts reach your friends, not data brokers or advertisers.",
            img: "/assets/feature-1.webp"
          },
          {
            title: <><span className="text-primary">Messaging</span> <br className="hidden sm:block"/> without a trace.</>,
            desc: "End-to-end encrypted chats that keep your conversations between you and your circle. No metadata mining, no exceptions.",
            img: "/assets/feature-2.webp"
          },
          {
            title: <><span className="text-primary">Communities</span> <br className="hidden sm:block"/> <span>on your terms.</span></>,
            desc: "Find your tribe in a decentralized landscape where interests matter more than invasive profiling algorithms.",
            img: "/assets/feature-3.webp"
          },
          {
            title: <><span>Own your content,</span> <br className="hidden sm:block"/> own your data.</>,
            desc: "Monetize your creativity directly through secure, peer-to-peer support, skipping the ad-tech surveillance machine.",
            img: "/assets/feature-4.webp"
          }
        ].map((feature, i) => (
          <motion.section 
            key={i}
            {...sectionVariants}
            className="py-16 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              {feature.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 sm:mb-16">
              {feature.desc}
            </p>
            <div className="relative w-full max-w-xs sm:max-w-md mx-auto aspect-[0.7] rounded-[2.5rem] overflow-hidden border border-border shadow-2xl group">
              <img 
                src={feature.img} 
                alt="" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.section>
        ))}

        {/* Section 6: Built for freedom */}
        <motion.section 
          {...sectionVariants}
          className="relative py-32 sm:py-64 px-4 sm:px-6 flex flex-col items-center text-center overflow-hidden border-t border-border"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0 opacity-20 sm:opacity-40">
            <img 
              src="/assets/globe.webp" 
              alt="Globe" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              Privacy is <span className="text-primary">a right.</span>
            </h2>
            <p className="text-lg sm:text-3xl text-muted-foreground">
              Secure. Sovereign. Yours.
            </p>
          </div>
        </motion.section>

        {/* Call to Action Footer */}
        <motion.section 
          {...sectionVariants}
          className="py-24 sm:py-32 px-4 sm:px-6 flex flex-col items-center text-center bg-card"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-10 tracking-tight">Take Control of Your Data</h2>
          <a 
            href="https://zos.zero.tech/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground font-bold text-lg px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/20"
          >
            Start Your Private Journey
          </a>
        </motion.section>

        {/* Footer Links */}
        <footer className="border-t border-border pt-20 pb-10 px-4 sm:px-6 bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <h3 className="font-bold tracking-widest uppercase text-xs text-foreground/50">Resources</h3>
              {["Zine", "Whitepaper", "Press Kit", "Deck"].map(link => (
                <a key={link} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link}</a>
              ))}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <h3 className="font-bold tracking-widest uppercase text-xs text-foreground/50">Audits</h3>
              {["M Token", "M NS", "M FI"].map(link => (
                <a key={link} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link}</a>
              ))}
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <h3 className="font-bold tracking-widest uppercase text-xs text-foreground/50">Products</h3>
              {["Messenger", "Social", "MySys ID"].map(link => (
                <a key={link} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link}</a>
              ))}
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <h3 className="font-bold tracking-widest uppercase text-xs text-foreground/50">Legal</h3>
              {["Privacy Policy", "T&C", "EULA"].map(link => (
                <a key={link} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link}</a>
              ))}
            </div>

          </div>

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-border/50 pt-10 text-muted-foreground">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">M</div>
              <span className="text-sm font-medium">&copy; 2026 MySys Inc.</span>
            </div>
            <div className="flex items-center gap-6 sm:gap-8">
              <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><MessageSquare size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Send size={20} /></a>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Global Style overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .spline-container canvas {
          width: 100% !important;
          height: 100% !important;
        }
      `}} />
    </PageTransition>
  );
};

export default Home;
