import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import photo from '../assets/unnamed.jpg';


export default function Landing() {
  const { isAuthenticated } = useAuth();
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-line",
        { y: 60, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, headingRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1C1C] overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-extrabold tracking-tighter text-[#9D4300]">
            Swaad<span className="text-[#1A1C1C]">QR</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide text-zinc-600">
            <a className="hover:text-orange-500 transition-colors" href="#features">
              Features
            </a>
            <a className="hover:text-orange-500 transition-colors" href="#how-it-works">
              How it Works
            </a>
            <a className="hover:text-orange-500 transition-colors" href="#testimonials">
              Testimonials
            </a>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {!isAuthenticated && (
              <Link to="/login" className="text-zinc-600 hover:text-orange-500 transition-colors font-medium text-sm">
                Login
              </Link>
            )}
            <Link
              to={isAuthenticated ? "/restaurants" : "/register"}
              className="bg-gradient-to-br from-[#F97316] to-[#FD651E] text-white px-5 sm:px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-orange-500/20"
            >
              {isAuthenticated ? "Go To Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 lg:w-[480px] lg:h-[480px] bg-orange-200/40 blur-[100px] lg:blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] lg:w-[640px] lg:h-[640px] bg-orange-300/30 blur-[120px] lg:blur-[180px] rounded-full animate-pulse [animation-delay:1.5s]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 ref={headingRef} className="mt-10 md:mt-16 text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-[-0.04em] leading-[1.1] mb-6">
            <span className="hero-line block bg-gradient-to-br from-[#9D4300] to-[#F97316] bg-clip-text text-transparent">SwaadQR</span>
            <span className="hero-line block text-[#1A1C1C]">Your Digital Menu, One Scan Away</span>
          </h1>

          <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-2">
            Elevate your restaurant&apos;s guest experience with luminous sophistication. Beautiful, contactless menus designed
            for the modern palate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/restaurants" : "/register"}
              className="group bg-gradient-to-br from-[#F97316] to-[#FD651E] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-extrabold text-base sm:text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-orange-500/30"
            >
              {isAuthenticated ? "Open Your Restaurants" : "Get Started - It's Free"}
              <span className="material-symbols-outlined align-middle ml-2 transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="bg-white/80 backdrop-blur-md outline outline-1 outline-[#E0C0B1]/25 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg text-[#1A1C1C] hover:bg-[#F3F3F3] transition-colors"
            >
              View Demo
            </a>
          </div>

          <div className="mt-20 relative mx-auto max-w-4xl">
            <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full" />
            <img
              className="relative rounded-[2.5rem] outline outline-1 outline-[#E0C0B1]/30 shadow-2xl w-full object-cover h-[320px] sm:h-[420px] md:h-[600px]"
              alt="Premium smartphone mockup showing a high-end restaurant digital menu"
              src={photo}
            />
            <div className="hidden md:block absolute -top-10 -right-10 bg-white p-6 rounded-2xl shadow-xl outline outline-1 outline-[#E0C0B1]/30 animate-bounce">
              <span className="material-symbols-outlined text-[#9D4300] text-5xl [font-variation-settings:'FILL'_1]">qr_code_2</span>
            </div>
            <div className="hidden md:block absolute top-1/2 -left-12 bg-white p-5 rounded-2xl shadow-xl outline outline-1 outline-[#E0C0B1]/30 animate-bounce [animation-delay:900ms]">
              <span className="material-symbols-outlined text-[#A73A00] text-4xl">restaurant_menu</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto" id="features">
        <div className="text-center mb-16">
          <span className="text-[#A73A00] font-bold tracking-[0.2em] uppercase text-xs">Excellence Served</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2">Crafted for Fine Dining</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl outline outline-1 outline-[#E0C0B1]/25 hover:-translate-y-2 transition-all duration-500 shadow-[0_24px_48px_-4px_rgba(157,67,0,0.08)] group">
            <div className="w-16 h-16 rounded-2xl bg-orange-200/40 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#9D4300] text-3xl">smartphone</span>
            </div>
            <h3 className="text-2xl font-extrabold mb-4">Digital Menu</h3>
            <p className="text-zinc-500 leading-relaxed">
              A cinematic browsing experience for your guests. High-resolution imagery meets fluid navigation.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl outline outline-1 outline-[#E0C0B1]/25 hover:-translate-y-2 transition-all duration-500 shadow-[0_24px_48px_-4px_rgba(157,67,0,0.08)] group">
            <div className="w-16 h-16 rounded-2xl bg-orange-100/60 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#A73A00] text-3xl">qr_code_scanner</span>
            </div>
            <h3 className="text-2xl font-extrabold mb-4">QR Generator</h3>
            <p className="text-zinc-500 leading-relaxed">
              Instant, high-fidelity QR codes tailored to your brand&apos;s aesthetic. Print-ready in seconds.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl outline outline-1 outline-[#E0C0B1]/25 hover:-translate-y-2 transition-all duration-500 shadow-[0_24px_48px_-4px_rgba(157,67,0,0.08)] group">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#944A00] text-3xl">bolt</span>
            </div>
            <h3 className="text-2xl font-extrabold mb-4">Easy Management</h3>
            <p className="text-zinc-500 leading-relaxed">
              Update prices, dishes, and availability in real-time. The Digital Maître d&apos; never sleeps.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F3F3F3] relative overflow-hidden" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className="max-w-2xl">
              <span className="text-[#A73A00] font-bold tracking-[0.2em] uppercase text-xs">The Process</span>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-2">Simplicity by Design</h2>
            </div>
            <p className="text-zinc-500 text-lg max-w-sm">From kitchen to customer in three effortless movements.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative z-10">
              <div className="text-8xl font-black text-[#9D4300]/10 absolute -top-10 -left-4 select-none">01</div>
              <div className="pt-12">
                <h4 className="text-2xl font-bold mb-4">Create restaurant</h4>
                <p className="text-zinc-500 leading-relaxed">
                  Define your brand identity, upload your logo, and set the visual tone for your digital presence.
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-8xl font-black text-[#9D4300]/10 absolute -top-10 -left-4 select-none">02</div>
              <div className="pt-12">
                <h4 className="text-2xl font-bold mb-4">Add dishes</h4>
                <p className="text-zinc-500 leading-relaxed">
                  Craft your menu with beautiful descriptions and vivid photography that captivates the senses.
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-8xl font-black text-[#9D4300]/10 absolute -top-10 -left-4 select-none">03</div>
              <div className="pt-12">
                <h4 className="text-2xl font-bold mb-4">Share QR</h4>
                <p className="text-zinc-500 leading-relaxed">
                  Download your unique QR code and place it on tables, windows, or coasters. You&apos;re live.
                </p>
              </div>
            </div>

            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-[#9D4300]/20 via-[#9D4300]/5 to-transparent -translate-y-12" />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 overflow-hidden" id="testimonials">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1A1C1C] text-[#F9F9F9] rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex gap-1 mb-8">
                <span className="material-symbols-outlined text-[#F97316] [font-variation-settings:'FILL'_1]">star</span>
                <span className="material-symbols-outlined text-[#F97316] [font-variation-settings:'FILL'_1]">star</span>
                <span className="material-symbols-outlined text-[#F97316] [font-variation-settings:'FILL'_1]">star</span>
                <span className="material-symbols-outlined text-[#F97316] [font-variation-settings:'FILL'_1]">star</span>
                <span className="material-symbols-outlined text-[#F97316] [font-variation-settings:'FILL'_1]">star</span>
              </div>

              <blockquote className="text-2xl md:text-5xl font-extrabold tracking-tight mb-12 leading-tight">
                &quot;SwaadQR transformed our service. It&apos;s not just a QR code; it&apos;s a statement of quality that our guests
                appreciate from the first scan.&quot;
              </blockquote>

              <div className="flex flex-col items-center">
                <img
                  className="w-20 h-20 rounded-full border-4 border-orange-500/20 mb-4 object-cover"
                  alt="Chef testimonial"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDk53waPTGNtS00sPsxwlOfV0v58YMgRvupHt1jzhoTIVdgMw5_1UcFB0FWzdBKxtcGNn-xXS6rA0pUN7OwyiF8gIrL6Br3-4M1ojKs11dd9XAYtnqHv25mXCiIDC-Vubn4-dOv-_5I2nu995Cn8805BKPlNIpqTk1NefoYrWoEi_jCcL0iDgNkjOF9bfU5U50-X6TYJFaEggIswMSZrrfoHnshLZhvZoGy7OCLOgoW-dz9x6Gk8RJ1IlM6zcUqBqlyrd7uM79gHA_"
                />
                <div className="font-bold text-xl">Marco Rossi</div>
                <div className="text-[#F97316] font-medium">Executive Chef, L&apos;Anima</div>
              </div>

              <div className="mt-16 pt-16 border-t border-white/10 w-full">
                <div className="text-sm font-bold tracking-[0.2em] uppercase opacity-60 mb-8">Trusted by 500+ restaurants</div>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-40 grayscale contrast-125">
                  <span className="text-2xl font-black">LUMINA</span>
                  <span className="text-2xl font-black">ORCHID</span>
                  <span className="text-2xl font-black">NOIR</span>
                  <span className="text-2xl font-black">SAVOR</span>
                  <span className="text-2xl font-black">VELVET</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-zinc-200 bg-zinc-50">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-lg font-bold text-zinc-900">SwaadQR</div>
            <p className="leading-relaxed text-zinc-500">© {new Date().getFullYear()} SwaadQR. Serving Luminous Sophistication.</p>
          </div>

          <div className="flex gap-8">
            <a className="text-zinc-500 hover:text-orange-500 transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-zinc-500 hover:text-orange-500 transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-zinc-500 hover:text-orange-500 transition-colors" href="#">
              Contact Us
            </a>
          </div>

          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full bg-zinc-200/70 flex items-center justify-center text-zinc-600 hover:bg-orange-500 hover:text-white transition-all"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
            <a
              className="w-10 h-10 rounded-full bg-zinc-200/70 flex items-center justify-center text-zinc-600 hover:bg-orange-500 hover:text-white transition-all"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">language</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
