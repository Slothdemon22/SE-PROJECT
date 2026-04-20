'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  Brain, Video, CheckCircle, Target, Zap, Clock,
  Award, Search, ArrowRight, Sparkles, Menu, X
} from 'lucide-react';

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--background)] border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              CampusConnect
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium hover:text-[#1E3A8A] transition-colors"
              style={{ color: 'var(--foreground)' }}
            >
              Features
            </a>
            <a
              href="#ai"
              className="text-sm font-medium hover:text-[#1E3A8A] transition-colors"
              style={{ color: 'var(--foreground)' }}
            >
              AI Power
            </a>
            <a
              href="#video"
              className="text-sm font-medium hover:text-[#1E3A8A] transition-colors"
              style={{ color: 'var(--foreground)' }}
            >
              Video Calls
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium hover:text-[#1E3A8A] transition-colors"
              style={{ color: 'var(--foreground)' }}
            >
              How It Works
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold hover:text-[var(--accent)] transition-colors"
              style={{ color: 'var(--foreground)' }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[#2D8CFF] hover:bg-[#1A75E5] text-white px-5 py-2 text-sm font-semibold rounded-md transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <a
              href="#features"
              className="block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#ai"
              className="block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              AI Power
            </a>
            <a
              href="#video"
              className="block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Video Calls
            </a>
            <a
              href="#how-it-works"
              className="block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>

            <div className="pt-4 space-y-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <Link
                href="/login"
                className="block px-4 py-2 text-center glass-card rounded-lg text-sm font-semibold"
                style={{ color: 'var(--foreground)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 text-center btn-gradient rounded-lg text-sm font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-text", { y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" });
      gsap.from(".hero-video", { scale: 0.95, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
      gsap.from(".trusted-logos > div", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.8, ease: "power2.out" });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Top Split Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full mb-24">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h1 className="hero-text text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1]" style={{ color: "var(--foreground)" }}>
              The only campus <br className="hidden sm:block" />
              <span style={{ color: "var(--accent)" }}>hiring platform</span> you <br className="hidden sm:block" />
              will ever need
            </h1>
            <p className="hero-text text-lg sm:text-xl max-w-xl mx-auto lg:mx-0" style={{ color: "var(--foreground-muted)" }}>
              Go beyond basic job boards, take campus networking and hiring to the next level with CampusConnect. AI-powered matching, built-in video interviews, infinitely extensible.
            </p>
            <div className="hero-text pt-4">
              <Link href="/signup" className="hover:bg-[#1A75E5] px-8 py-4 text-base font-semibold inline-block rounded-lg shadow-lg hover:shadow-xl transition-all font-sans flex items-center gap-2 justify-center w-max mx-auto lg:mx-0" style={{ background: "var(--accent)", color: "white" }}>
                Start hiring today <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="flex-1 hero-video relative w-full lg:w-[600px] aspect-video rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl">
            <video src="/Hero-1.webm" autoPlay muted loop playsInline className="w-full h-full object-cover"></video>
          </div>
        </div>

        {/* Logos Strip */}
        <div className="w-full text-center">
          <p className="hero-text text-sm font-bold tracking-[0.2em] uppercase mb-10" style={{ color: "var(--foreground-muted)" }}>
            TRUSTED BY STUDENTS AND RECRUITERS AT
          </p>
          <div className="trusted-logos flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500" style={{ color: "var(--foreground)" }}>
            {/* Logo representations based on image */}
            <div className="text-xl font-bold flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-[var(--foreground-muted)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--foreground-muted)]"></div>
              </div>
              Stanford
            </div>
            <div className="text-xl font-bold flex items-center gap-2">🍎 MIT</div>
            <div className="text-xl font-bold flex items-center gap-2">
              <div className="w-5 h-5 bg-[var(--foreground-muted)] rounded-sm text-[var(--background)] flex items-center justify-center text-xs">B</div>
              Berkeley
            </div>
            <div className="text-xl font-bold tracking-tighter">AMAZON</div>
            <div className="text-xl font-bold">Google</div>
            <div className="text-xl font-bold">Microsoft</div>
            <div className="text-xl font-bold">Meta</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AIFeaturesSection() {
  return (
    <section id="ai" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0E14] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="text-[var(--accent)] font-semibold tracking-wider text-sm uppercase mb-4">Precision Matching</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            AI That Works For You
          </h2>
          <p className="text-lg md:text-xl text-[var(--foreground-muted)]">
            Advanced machine learning algorithms that understand your profile and match you with the perfect opportunities, with enterprise-grade transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          <div className="bg-[#151A24] border border-[var(--border)] hover:border-[var(--border-light)] transition-colors p-8 rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-[#1D2B44] flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Smart Match Scoring</h3>
            <p className="text-[var(--foreground-muted)] leading-relaxed flex-1">
              Every opportunity gets an AI-calculated compatibility score (0-100%) based on your skills, interests, and experience.
            </p>
          </div>

          <div className="bg-[#151A24] border border-[var(--border)] hover:border-[var(--border-light)] transition-colors p-8 rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-[#1D2B44] flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Intelligent Recommendations</h3>
            <p className="text-[var(--foreground-muted)] leading-relaxed flex-1">
              Get personalized job recommendations based on your profile, application history, and success patterns in real-time.
            </p>
          </div>

          <div className="bg-[#151A24] border border-[var(--border)] hover:border-[var(--border-light)] transition-colors p-8 rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-[#1D2B44] flex items-center justify-center mb-6">
              <Award className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Profile Analytics</h3>
            <p className="text-[var(--foreground-muted)] leading-relaxed flex-1">
              AI evaluates your profile completeness and predicts hiring success rates with actionable optimization suggestions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function VideoCallSection() {
  return (
    <section id="video" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0E14] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <p className="text-[var(--accent)] font-semibold tracking-wider text-sm uppercase">Integrated Interviews</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Enterprise-grade <br />video interviews
            </h2>
            <p className="text-lg text-[var(--foreground-muted)] max-w-xl">
              Conduct interviews, team meetings, and collaboration sessions without leaving the platform.
            </p>

            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[#1A75E5] bg-opacity-20 p-2">
                  <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <span className="text-white font-medium">Sub-200ms latency for real-time interviews</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[#1A75E5] bg-opacity-20 p-2">
                  <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <span className="text-white font-medium">Automatic interview recording and transcription</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[#1A75E5] bg-opacity-20 p-2">
                  <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <span className="text-white font-medium">Built-in screen sharing for whiteboard sessions</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full lg:w-[600px] aspect-square lg:aspect-auto lg:h-[600px] bg-[#151A24] rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Minimal Code Mockup */}
            <div className="absolute inset-0 p-6 flex flex-col font-mono text-sm leading-relaxed text-[#A0AAB2]">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <div><span className="text-purple-400">import</span> {'{ Canvas }'} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;@100mslive/react-sdk&apos;</span>;</div>
              <br />
              <div><span className="text-blue-400">const</span> <span className="text-yellow-200">InterviewRoom</span> = () <span className="text-blue-400">{'=>'}</span> {'{'}</div>
              <div className="pl-4"><span className="text-blue-400">return</span> (</div>
              <div className="pl-8">{'<'}Canvas</div>
              <div className="pl-12">roomMode=<span className="text-green-400">&quot;interview&quot;</span></div>
              <div className="pl-12">recording=<span className="text-blue-400">{'{'}true{'}'}</span></div>
              <div className="pl-8">{'>'}</div>
              <div className="pl-12">{'<'}CandidateView /{'>'}</div>
              <div className="pl-12">{'<'}InterviewerPanel /{'>'}</div>
              <div className="pl-8">{'</'}Canvas{'>'}</div>
              <div className="pl-4">)</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0E14] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Developer-First Workflow
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[var(--foreground-muted)]">
            Go live with your hiring portal in minutes, not months. Simple, extensible, and scalable.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              number: '01',
              title: 'Integrate SDK',
              description: 'Install our completely typed SDK and components.',
            },
            {
              number: '02',
              title: 'Customize UI',
              description: 'Easily match our components to your brand identity.',
            },
            {
              number: '03',
              title: 'Manage Auth',
              description: 'Use built-in JWT based Auth to secure your rooms.',
            },
            {
              number: '04',
              title: 'Go Live',
              description: 'Production ready scaling right out of the box.',
            },
          ].map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-2xl h-full hover:border-[var(--accent)] transition-all">
                <div className="text-4xl font-black text-[#1D2B44] mb-6 group-hover:text-[var(--accent)] transition-colors">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-[var(--foreground-muted)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UseCasesSection() {
  const useCases = [
    {
      icon: '🎓',
      title: 'Academic Projects',
      description: 'Find team members for class projects, research collaborations, and academic competitions. Connect with students who have complementary skills.',
    },
    {
      icon: '🚀',
      title: 'Startup Teams',
      description: 'Building the next big thing? Find co-founders, developers, designers, and marketers. Turn your startup idea into reality with the right team.',
    },
    {
      icon: '💼',
      title: 'Part-Time Jobs',
      description: 'Discover flexible work opportunities on campus. From tutoring to research assistance, find jobs that fit your schedule and interests.',
    },
    {
      icon: '🏆',
      title: 'Hackathon Teams',
      description: 'Preparing for a hackathon? Form dream teams with diverse skill sets. Find developers, designers, and domain experts for your next win.',
    },
    {
      icon: '📚',
      title: 'Study Groups',
      description: 'Connect with classmates for study sessions and group projects. Find people taking the same courses or with similar academic interests.',
    },
    {
      icon: '🌟',
      title: 'Skill Exchange',
      description: 'Learn from peers and share your expertise. Trade skills, mentor others, and grow together as a community.',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0E14] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[var(--accent)] font-semibold tracking-wider text-sm uppercase mb-4">Versatile Platform</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Built For Every Need
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-[var(--foreground-muted)]">
            Whatever your goal, CampusConnect brings the right people together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-[#151A24] border border-[var(--border)] p-8 rounded-2xl hover:border-[var(--accent)] transition-all">
              <div className="text-4xl mb-6 bg-[#1D2B44] w-14 h-14 rounded-xl flex items-center justify-center">{useCase.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {useCase.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0E14] border-t border-[var(--border)] overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-black mb-8 text-white tracking-tight">
          Ready to Connect?
        </h2>
        <p className="text-xl mb-10 text-[var(--foreground-muted)] max-w-2xl mx-auto">
          Join thousands of students and recruiters building the future of campus hiring on our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-10 py-4 text-lg font-bold inline-flex items-center justify-center rounded-lg transition-colors text-white font-sans hover:bg-[#1A75E5]"
            style={{ background: 'var(--accent)' }}
          >
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="bg-transparent border border-[var(--border)] hover:bg-[#151A24] px-10 py-4 text-lg font-bold inline-flex items-center justify-center rounded-lg transition-colors text-white font-sans"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0B0E14] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-bold text-2xl mb-6 text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              CampusConnect
            </h3>
            <p className="text-[var(--foreground-muted)] mb-6 text-sm">
              The ultimate platform connecting university students with opportunities and collaborators worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white tracking-wide uppercase text-sm">Product</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground-muted)]">
              <li><a href="#features" className="hover:text-white transition-colors">Video API</a></li>
              <li><a href="#ai" className="hover:text-white transition-colors">AI Matching</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Prebuilt Roles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white tracking-wide uppercase text-sm">Developers</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground-muted)]">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SDKs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white tracking-wide uppercase text-sm">Company</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground-muted)]">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            © 2026 CampusConnect Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[var(--foreground-muted)] hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-[var(--foreground-muted)] hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-[var(--foreground-muted)] hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

