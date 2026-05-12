'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  Brain,
  CheckCircle,
  Target,
  Award,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  Briefcase,
  Users,
  ChevronRight,
  Rocket,
  GraduationCap,
  Layers,
  BookOpen,
  Wand2
} from 'lucide-react';

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              CampusConnect
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#ai"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              AI Power
            </a>
            <a
              href="#video"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Video Calls
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              How It Works
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="focus-ring rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="focus-ring rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>

          <button
            className="rounded-lg p-2 transition-colors hover:bg-white/5 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-2 border-t border-white/10 py-4 md:hidden">
            <a
              href="#features"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#ai"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              AI Power
            </a>
            <a
              href="#video"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Video Calls
            </a>
            <a
              href="#how-it-works"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <Link
                href="/login"
                className="focus-ring block rounded-lg border border-white/10 px-4 py-2 text-center text-sm font-semibold text-slate-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="focus-ring block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-text', { y: 30, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out' });
      gsap.from('.hero-visual', { scale: 0.96, opacity: 0, duration: 0.9, delay: 0.25, ease: 'power3.out' });
      gsap.from('.trust-item', { y: 16, opacity: 0, duration: 0.65, stagger: 0.08, delay: 0.45, ease: 'power2.out' });
    }, containerRef);
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -left-16 top-36 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-14 top-44 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-7">
            <p className="hero-text inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <Wand2 className="h-3.5 w-3.5" />
              Premium Campus Hiring Stack
            </p>
            <h1 className="hero-text text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Stunning UI. Powerful AI.
              <span className="block text-blue-300">Built for modern student careers.</span>
            </h1>
            <p className="hero-text max-w-xl text-base text-slate-300 sm:text-lg">
              CampusConnect unifies opportunity discovery, collaboration, and hiring into one elegant experience.
              Match faster, interview smarter, and ship outcomes with less friction.
            </p>
            <div className="hero-text flex flex-wrap items-center gap-3">
              <Link href="/signup" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-900/70 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800">
                Explore Platform
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="hero-text grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Active Campuses', value: '40+' },
                { label: 'Monthly Matches', value: '12K+' },
                { label: 'Interview SLA', value: '<24h' },
              ].map((metric) => (
                <div key={metric.label} className="surface-kpi">
                  <p className="text-xl font-bold text-white">{metric.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual surface-card relative overflow-hidden p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,140,255,0.2),transparent_40%)]" />
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              <video
                src="/Hero-1.webm"
                autoPlay
                muted
                loop
                playsInline
                className="h-full max-h-[420px] w-full object-cover"
              />
            </div>
            <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
              <div className="surface-card-muted p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">AI Match Confidence</p>
                <p className="mt-1 text-2xl font-bold text-emerald-300">96%</p>
              </div>
              <div className="surface-card-muted p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Live Interviews Today</p>
                <p className="mt-1 text-2xl font-bold text-blue-300">328</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <p className="hero-text mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Trusted by teams from
          </p>
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-slate-900/50 p-3 sm:grid-cols-4 md:grid-cols-6">
            {['Stanford', 'MIT', 'Berkeley', 'Amazon', 'Google', 'Microsoft'].map((name) => (
              <div key={name} className="trust-item rounded-lg border border-white/5 bg-slate-950/50 px-3 py-2 text-center text-sm font-semibold text-slate-300">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AIFeaturesSection() {
  const aiCards = [
    {
      title: 'Smart Match Scoring',
      description: 'Compatibility scored from profile signals, goals, and real engagement behavior.',
      icon: Brain,
    },
    {
      title: 'Opportunity Intelligence',
      description: 'Recommendations adapt continuously as your skills and priorities evolve.',
      icon: Target,
    },
    {
      title: 'Profile Strength Analytics',
      description: 'Clear, actionable suggestions that improve discoverability and response quality.',
      icon: Award,
    },
  ];

  return (
    <section id="ai" className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Precision Matching</p>
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            AI that explains every recommendation
          </h2>
          <p className="mt-4 text-base text-slate-400 md:text-lg">
            Move from guesswork to confident decisions with transparent scoring, contextual suggestions, and real-time alignment.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {aiCards.map((card) => (
            <article key={card.title} className="surface-card-muted p-6 transition-colors hover:border-blue-500/30">
              <div className="mb-4 inline-flex rounded-xl border border-blue-500/30 bg-blue-500/10 p-2.5 text-blue-300">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VideoCallSection() {
  return (
    <section id="video" className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Integrated Interviews</p>
            <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
              Enterprise-grade video interviews built in
            </h2>
            <p className="max-w-xl text-base text-slate-400 md:text-lg">
              Host meetings, interview loops, and async follow-ups without app switching or setup overhead.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/20 p-2">
                  <CheckCircle className="h-5 w-5 text-blue-300" />
                </div>
                <span className="font-medium text-slate-200">Sub-200ms global interview latency</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/20 p-2">
                  <CheckCircle className="h-5 w-5 text-blue-300" />
                </div>
                <span className="font-medium text-slate-200">Recordings and transcripts for better hiring notes</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/20 p-2">
                  <CheckCircle className="h-5 w-5 text-blue-300" />
                </div>
                <span className="font-medium text-slate-200">Native screen share and whiteboard sessions</span>
              </div>
            </div>
          </div>

          <div className="surface-card relative overflow-hidden p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_40%)]" />
            <div className="relative rounded-xl border border-white/10 bg-slate-950/80 p-5 font-mono text-sm leading-relaxed text-slate-300">
              <div className="mb-5 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
              </div>
              <div><span className="text-violet-300">import</span> {'{ Canvas }'} <span className="text-violet-300">from</span> <span className="text-emerald-300">&apos;@100mslive/react-sdk&apos;</span>;</div>
              <br />
              <div><span className="text-cyan-300">const</span> <span className="text-amber-100">InterviewRoom</span> = () <span className="text-cyan-300">{'=>'}</span> {'{'}</div>
              <div className="pl-4"><span className="text-cyan-300">return</span> (</div>
              <div className="pl-8">{'<'}Canvas roomMode=<span className="text-emerald-300">&quot;interview&quot;</span>{'>'}</div>
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
  const steps = [
    {
      number: '01',
      title: 'Build Your Profile',
      description: 'Create a credible profile with focused skills, interests, and goals.',
    },
    {
      number: '02',
      title: 'Get Matched',
      description: 'AI scoring surfaces high-fit opportunities and collaborators quickly.',
    },
    {
      number: '03',
      title: 'Connect & Interview',
      description: 'Use messaging and built-in video calls to move faster together.',
    },
    {
      number: '04',
      title: 'Ship Outcomes',
      description: 'Track applications, feedback loops, and team progress in one place.',
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            A calm, predictable workflow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 md:text-lg">
            Every step is optimized for clarity, speed, and consistency.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step) => (
            <article key={step.title} className="surface-card-muted p-6 transition-colors hover:border-blue-500/30">
              <div className="mb-3 text-3xl font-black text-blue-300/70">
                  {step.number}
              </div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UseCasesSection() {
  const useCases = [
    {
      icon: GraduationCap,
      title: 'Academic Projects',
      description: 'Form stronger class and research teams with role-aware skill matching.',
    },
    {
      icon: Rocket,
      title: 'Startup Teams',
      description: 'Find co-builders across product, engineering, design, and growth.',
    },
    {
      icon: Briefcase,
      title: 'Part-Time Jobs',
      description: 'Track flexible work opportunities with clearer requirements and timelines.',
    },
    {
      icon: Users,
      title: 'Hackathon Teams',
      description: 'Assemble balanced, high-velocity squads before deadlines hit.',
    },
    {
      icon: BookOpen,
      title: 'Study Groups',
      description: 'Connect by course, year, and subject focus to learn faster together.',
    },
    {
      icon: Layers,
      title: 'Skill Exchange',
      description: 'Mentor peers, trade expertise, and grow with structured collaboration.',
    },
  ];

  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Versatile Platform</p>
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            Built for every campus workflow
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-400 md:text-lg">
            From first-year projects to startup hiring, the experience stays clean and consistent.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <article key={useCase.title} className="surface-card-muted p-6 transition-colors hover:border-blue-500/30">
              <div className="mb-5 inline-flex rounded-xl border border-blue-500/25 bg-blue-500/10 p-2.5 text-blue-300">
                <useCase.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">{useCase.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{useCase.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-slate-900/80 to-slate-900 p-8 text-center md:p-12">
        <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
          Ready to level up your campus career network?
        </h2>
        <p className="mx-auto mb-10 mt-5 max-w-2xl text-lg text-slate-300">
          Join students, builders, and hiring teams using CampusConnect to move faster with better-fit opportunities.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="focus-ring inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-bold text-white transition-colors hover:bg-blue-700"
          >
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="focus-ring inline-flex items-center justify-center rounded-lg border border-white/20 bg-slate-900/40 px-8 py-3 text-base font-bold text-slate-100 transition-colors hover:bg-slate-800"
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
    <footer className="border-t border-white/10 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-2xl font-bold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              CampusConnect
            </h3>
            <p className="text-sm text-slate-400">
              Premium campus collaboration and hiring platform for modern student ecosystems.
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wide text-white">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
              <li><a href="#ai" className="transition-colors hover:text-white">AI Matching</a></li>
              <li><a href="#video" className="transition-colors hover:text-white">Video Calls</a></li>
              <li><a href="#how-it-works" className="transition-colors hover:text-white">Workflow</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wide text-white">Use Cases</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Startup teams</li>
              <li>Hackathons</li>
              <li>Study groups</li>
              <li>Skill exchange</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wide text-white">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>About</li>
              <li>Security</li>
              <li>Terms</li>
              <li>Privacy</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">
            © 2026 CampusConnect Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 transition-colors hover:text-white">Twitter</a>
            <a href="#" className="text-slate-500 transition-colors hover:text-white">GitHub</a>
            <a href="#" className="text-slate-500 transition-colors hover:text-white">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

