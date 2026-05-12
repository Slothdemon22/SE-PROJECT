import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Brain,
  Video,
  MessageSquare,
  Shield,
  Briefcase,
  Star,
  TrendingUp,
  Globe,
  Users
} from 'lucide-react';
import {
  HeroSection,
  AIFeaturesSection,
  VideoCallSection,
  HowItWorksSection,
  UseCasesSection,
  CTASection,
  Footer,
  LandingNav
} from '@/components/LandingPageSections';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  const featureCards = [
    {
      title: 'AI-Powered Matching',
      description:
        'Profile-aware scoring aligns students with the most relevant roles, teams, and projects instantly.',
      icon: Brain,
    },
    {
      title: 'Live Video Interviews',
      description:
        'Interview and collaborate in-browser with high quality media, recording, and screen sharing.',
      icon: Video,
    },
    {
      title: 'Real-Time Messaging',
      description:
        'Move conversations from discovery to decision with contextual messaging and persistent threads.',
      icon: MessageSquare,
    },
    {
      title: 'Structured Job Boards',
      description:
        'Clear categories and streamlined moderation keep opportunities useful, current, and trustworthy.',
      icon: Briefcase,
    },
    {
      title: 'Profile Intelligence',
      description:
        'Actionable scoring helps candidates improve visibility and helps teams identify fit faster.',
      icon: Star,
    },
    {
      title: 'Growth Analytics',
      description:
        'Track applications, team performance, and engagement with concise, decision-ready metrics.',
      icon: TrendingUp,
    },
    {
      title: 'Campus Network Layer',
      description:
        'Discover collaborators by department, interests, and experience across your university ecosystem.',
      icon: Globe,
    },
    {
      title: 'Role Flexibility',
      description:
        'Switch between Talent Seeker and Talent Finder modes without account fragmentation.',
      icon: Users,
    },
    {
      title: 'Secure by Default',
      description:
        'Built on modern authentication and permission patterns for safe student and recruiter interactions.',
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950">
      <LandingNav />
      <HeroSection />

      <section id="features" className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Everything needed for high-signal campus hiring
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base text-slate-400 md:text-lg">
              A modern suite that keeps discovery, coordination, and decision-making in one polished flow.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <article key={feature.title} className="surface-card-muted p-6 transition-colors hover:border-blue-500/30">
                <div className="mb-4 inline-flex rounded-xl border border-blue-500/25 bg-blue-500/10 p-2.5 text-blue-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AIFeaturesSection />
      <VideoCallSection />
      <HowItWorksSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
