import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, User, Users, Brain, Gamepad2, Rocket, Briefcase, MessageSquare, Target, LineChart, CheckCircle2, Clock, Coins, CreditCard, Sparkles, ShieldCheck, BookOpen, ArrowRight, Trophy } from 'lucide-react';
const Index: React.FC = () => {
  const navigate = useNavigate();

  // Basic SEO for the landing page
  useEffect(() => {
    const title = 'Learn, Play, and Master Real Skills with AI | PlayScenarioAI';
    const description = 'AI scenarios that challenge your mind. Practice real skills or explore for fun with 200 free credits monthly. No credit card required.';
    document.title = title;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', description);

    // Canonical tag
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}/`);

    // Structured data (Organization + WebSite)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PlayScenarioAI',
      url: window.location.origin,
      slogan: 'Where training meets adventure',
      sameAs: []
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);

    // Remove old if present
    const existing = document.getElementById('ld-org');
    if (existing) existing.remove();
    script.id = 'ld-org';
    document.head.appendChild(script);
  }, []);
  const stats = [{
    label: 'Unique scenarios',
    value: '1,000+'
  }, {
    label: 'Multi‑character interactions',
    value: 'Yes'
  }, {
    label: 'New content weekly',
    value: '✓'
  }, {
    label: 'Active creators',
    value: 'Community‑driven'
  }];
  const categories = [{
    title: 'Professional Development',
    color: 'from-cyan-400/10 to-violet-400/10',
    items: [{
      name: 'Business & Leadership',
      desc: 'Navigate office politics, lead teams through crises'
    }, {
      name: 'Communication Skills',
      desc: 'Master difficult conversations, negotiations'
    }, {
      name: 'Customer Service',
      desc: 'Handle challenging situations with grace'
    }]
  }, {
    title: 'Educational Exploration',
    color: 'from-emerald-400/10 to-cyan-400/10',
    items: [{
      name: 'Historical Simulations',
      desc: 'Advise historical figures, change history'
    }, {
      name: 'Science & Ethics',
      desc: 'Tackle moral dilemmas, explore hypotheticals'
    }, {
      name: 'Language Practice',
      desc: 'Conversational learning with native AI speakers'
    }]
  }, {
    title: 'Pure Entertainment',
    color: 'from-violet-400/10 to-fuchsia-400/10',
    items: [{
      name: 'Mystery & Detective',
      desc: 'Solve crimes by interrogating AI suspects'
    }, {
      name: 'Sci‑Fi Adventures',
      desc: 'Command space stations, first contact scenarios'
    }, {
      name: 'Social Experiments',
      desc: 'Navigate complex social dynamics'
    }]
  }, {
    title: 'Creative Challenges',
    color: 'from-amber-400/10 to-orange-400/10',
    items: [{
      name: 'Storytelling',
      desc: 'Co‑create narratives with AI characters'
    }, {
      name: 'Problem Solving',
      desc: 'Escape rooms, logic puzzles with AI partners'
    }, {
      name: 'Role Reversal',
      desc: 'Play the villain, mentor, or wildcard'
    }]
  }];
  const featured = [{
    title: 'The Hostile Takeover',
    subtitle: 'Corporate Drama',
    desc: 'Navigate a boardroom coup with multiple AI executives.',
    tags: ['Leadership', 'Negotiation', 'Strategy'],
    iconBg: 'bg-amber-400/20',
    emoji: '🏢'
  }, {
    title: 'Station Omega Crisis',
    subtitle: 'Sci‑Fi Thriller',
    desc: 'Lead your crew through an impending disaster.',
    tags: ['Problem‑Solving', 'Team Management', 'Adventure'],
    iconBg: 'bg-cyan-400/20',
    emoji: '🛰️'
  }, {
    title: 'The Difficult Patient',
    subtitle: 'Medical Training',
    desc: 'Practice bedside manner with challenging cases.',
    tags: ['Healthcare', 'Communication', 'Empathy'],
    iconBg: 'bg-emerald-400/20',
    emoji: '🩺'
  }, {
    title: 'Murder at the Gala',
    subtitle: 'Mystery',
    desc: 'Interview suspects and solve the crime.',
    tags: ['Logic', 'Investigation', 'Entertainment'],
    iconBg: 'bg-violet-400/20',
    emoji: '🎭'
  }];
  const plans = [{
    name: 'Free Forever',
    price: '200 Credits Monthly',
    badge: 'Most Accessible',
    highlights: ['Access all scenario types', 'Basic progress tracking', 'Community scenarios', 'Perfect for casual players'],
    cta: 'Sign Up Free',
    onClick: () => navigate('/register'),
    popular: false
  }, {
    name: 'Enthusiast',
    price: '5,000 Credits • $4.99/mo',
    badge: 'Most Popular',
    highlights: ['Much more play time', 'Create custom scenarios', 'Advanced analytics', 'Priority AI response', 'Early access to features'],
    cta: 'Upgrade',
    onClick: () => navigate('/credits'),
    popular: true
  }, {
    name: 'Professional',
    price: '20,000 Credits • $14.99/mo',
    badge: 'For Power Users',
    highlights: ['Maximum flexibility', 'Unlimited scenario creation', 'Team sharing features', 'API access', 'Download conversation logs', 'Priority support'],
    cta: 'Choose Professional',
    onClick: () => navigate('/credits'),
    popular: false
  }, {
    name: 'Organization',
    price: 'Unlimited Credits • Custom',
    badge: 'For Teams',
    highlights: ['Bulk user management', 'Custom AI training', 'Private scenario library', 'Usage analytics', 'Dedicated support'],
    cta: 'Contact Sales',
    onClick: () => navigate('/profile'),
    popular: false
  }];
  return <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700/60 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-400/30">
              <Zap className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold tracking-tight">PlayScenarioAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-slate-300">
            <button className="story-link" onClick={() => navigate('/browse')}>Browse</button>
            <button className="story-link" onClick={() => navigate('/scenario/create')}>Create</button>
            <button className="story-link" onClick={() => navigate('/login')}>Sign in</button>
            <Button size="sm" className="bg-cyan-400 text-slate-900 hover:bg-cyan-300 hover:scale-105 shadow-lg shadow-cyan-400/30" onClick={() => navigate('/register')}>
              Sign Up Free
            </Button>
          </nav>
        </div>
      </header>

      <main role="main">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="circuit-bg opacity-30" />
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 relative">
            <div className="max-w-3xl">
              <h1 id="hero-title" className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Learn, Play, and Master Real Skills with AI
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8">
                Engage with intelligent AI characters in scenarios ranging from boardroom negotiations to space station emergencies. Practice real skills or just explore for fun.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 max-w-xl">
                <Button size="lg" aria-label="Sign up free and get monthly credits" className="bg-cyan-400 text-slate-900 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-cyan-300 hover:scale-105 shadow-lg shadow-cyan-400/30" onClick={() => navigate('/register')}>
                  Sign Up Free - Get 200 Credits Monthly
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-slate-400">No credit card required</p>
              </div>
              
            </div>
          </div>
        </section>

        {/* Value propositions */}
        <section aria-labelledby="value-title" className="py-16 md:py-20 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 id="value-title" className="sr-only">Why PlayScenarioAI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
              icon: InfinityIcon,
              title: 'Endless Possibilities',
              desc: 'From corporate training to creative storytelling - find scenarios that match your mood and goals'
            }, {
              icon: Brain,
              title: 'Learn Through Play',
              desc: 'Develop real skills while having genuinely engaging experiences with sophisticated AI characters'
            }, {
              icon: Clock,
              title: 'Your Pace, Your Way',
              desc: 'Serious skill‑building on Monday, casual mystery‑solving on Friday'
            }, {
              icon: Coins,
              title: 'Always Free to Play',
              desc: '200 credits every month - enjoy multiple scenarios without paying a cent'
            }].map(({
              icon: Icon,
              title,
              desc
            }) => <Card key={title} className="bg-slate-800 border border-gray-700 rounded-xl hover:shadow-cyan-400/20 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <CardTitle className="text-white text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">{desc}</CardDescription>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Scenario Categories */}
        <section aria-labelledby="categories-title" className="py-16 md:py-20 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 id="categories-title" className="text-2xl md:text-3xl font-semibold mb-8">Scenario Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(cat => <div key={cat.title} className={`rounded-xl border border-gray-700 bg-gradient-to-br ${cat.color} p-5`}>
                  <h3 className="text-lg font-semibold mb-3">{cat.title}</h3>
                  <ul className="space-y-3 text-slate-300">
                    {cat.items.map(it => <li key={it.name} className="flex gap-3 items-start">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-white">{it.name}</p>
                          <p className="text-sm text-slate-400">{it.desc}</p>
                        </div>
                      </li>)}
                  </ul>
                </div>)}
            </div>
          </div>
        </section>

        {/* Features (dual purpose) */}
        <section aria-labelledby="features-title" className="py-16 md:py-20 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 id="features-title" className="text-2xl md:text-3xl font-semibold mb-8">Features for Work and Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
              icon: Users,
              title: 'Intelligent Multi‑Character System',
              desc: 'Practice team dynamics at work or enjoy complex narrative adventures at home.'
            }, {
              icon: Target,
              title: 'Objective‑Based Gameplay',
              desc: 'Clear goals keep you engaged—from certifications to solving mysteries.'
            }, {
              icon: LineChart,
              title: 'Adaptive Difficulty',
              desc: 'Challenging for professionals, accessible for casual exploration.'
            }, {
              icon: ShieldCheck,
              title: 'Progress Tracking',
              desc: 'Track growth in skills—or your adventure achievements.'
            }].map(({
              icon: Icon,
              title,
              desc
            }) => <Card key={title} className="bg-slate-800 border border-gray-700 rounded-xl">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <CardTitle className="text-white text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">{desc}</CardDescription>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section aria-labelledby="usecases-title" className="py-16 md:py-20 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 id="usecases-title" className="text-2xl md:text-3xl font-semibold mb-8">Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
              title: 'Monday Morning',
              desc: 'Practice that important client presentation with an AI board of directors',
              icon: Briefcase
            }, {
              title: 'Lunch Break',
              desc: 'Quick crisis management scenario to sharpen decision‑making',
              icon: Clock
            }, {
              title: 'Evening Relaxation',
              desc: 'Unwind by solving a murder mystery with quirky AI detectives',
              icon: Gamepad2
            }, {
              title: 'Weekend Fun',
              desc: 'Explore a sci‑fi adventure where your choices shape an alien first contact',
              icon: Rocket
            }].map(({
              title,
              desc,
              icon: Icon
            }) => <Card key={title} className="bg-slate-800 border border-gray-700 rounded-xl">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <CardTitle className="text-white text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">{desc}</CardDescription>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-title" className="py-16 md:py-20 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 id="how-title" className="text-2xl md:text-3xl font-semibold mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
              step: '1',
              title: 'Sign Up in Seconds',
              desc: 'Create your free account. Get 200 credits immediately. Credits refresh every month.'
            }, {
              step: '2',
              title: 'Choose Your Adventure',
              desc: 'Browse scenarios by category. Pick based on your mood—from quick scenes to epic journeys.'
            }, {
              step: '3',
              title: 'Engage with AI Characters',
              desc: 'Meet unique personalities. Make meaningful choices. Watch the story unfold.'
            }, {
              step: '4',
              title: 'Track Your Journey',
              desc: 'Monitor progress, review scenarios, and build skills over time.'
            }].map(({
              step,
              title,
              desc
            }) => <div key={title} className="rounded-xl border border-gray-700 bg-slate-800 p-5">
                  <div className="w-8 h-8 rounded-md bg-cyan-400 text-slate-900 flex items-center justify-center font-bold mb-3">{step}</div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-slate-300 text-sm">{desc}</p>
                </div>)}
            </div>
          </div>
        </section>

        {/* Scenario showcase */}
        <section aria-labelledby="showcase-title" className="py-16 md:py-20 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 id="showcase-title" className="text-2xl md:text-3xl font-semibold mb-8">Featured Scenarios This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(s => <div key={s.title} className="bg-slate-800 border border-gray-700 rounded-xl p-5">
                  <div className={`w-10 h-10 ${s.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                    <span className="text-lg" aria-hidden>{s.emoji}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{s.subtitle}</p>
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <p className="text-slate-300 text-sm mt-2">{s.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {s.tags.map(t => <Badge key={t} variant="secondary" className="bg-slate-700 text-slate-200 border border-gray-600">
                        {t}
                      </Badge>)}
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Why PSAI */}
        <section aria-labelledby="why-title" className="py-16 md:py-20 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 id="why-title" className="text-2xl md:text-3xl font-semibold mb-8">Why PlayScenarioAI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {['Not just chat—real scenarios with multiple characters, objectives, and outcomes', 'Professional‑grade training scenarios for real skill development', 'Engaging stories and adventures that rival interactive fiction games', 'Advanced AI that maintains character consistency in long conversations', 'Generous free tier — 200 credits monthly means you can always play'].map(text => <li key={text} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5" />
                    <span className="text-slate-300">{text}</span>
                  </li>)}
              </ul>
              <div className="rounded-xl border border-gray-700 bg-slate-800 p-5">
                <h3 className="font-semibold text-white mb-3">Trust & Privacy</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  {['Secure & Private', 'Your conversations stay yours', 'Transparent pricing', 'No hidden fees', 'Cancel anytime'].map(t => <li key={t} className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400" /> {t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing (credits) */}
        <section aria-labelledby="pricing-title" className="py-16 md:py-20 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 id="pricing-title" className="text-2xl md:text-3xl font-semibold mb-8">Simple, Credit‑Based Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {plans.map(p => <div key={p.name} className={`rounded-xl border ${p.popular ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' : 'border-gray-700'} bg-slate-800 p-6`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                    {p.popular && <span className="text-xs px-2 py-1 rounded bg-cyan-400 text-slate-900 font-medium">Most Popular</span>}
                  </div>
                  <p className="text-slate-300 mb-4">{p.price}</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {p.highlights.map(h => <li key={h} className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-cyan-400 mt-0.5" /> {h}</li>)}
                  </ul>
                  <Button onClick={p.onClick} className="w-full mt-6 bg-cyan-400 text-slate-900 hover:bg-cyan-300 hover:scale-105 shadow-lg shadow-cyan-400/30">
                    {p.cta}
                  </Button>
                </div>)}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section aria-labelledby="bottom-cta-title" className="py-20 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            <h2 id="bottom-cta-title" className="text-3xl md:text-4xl font-bold">Join thousands exploring AI‑powered scenarios</h2>
            <p className="text-slate-300 mt-3">200 free credits every month. No credit card required.</p>
            <div className="mt-6">
              <Button size="lg" className="bg-cyan-400 text-slate-900 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-cyan-300 hover:scale-105 shadow-lg shadow-cyan-400/30" onClick={() => navigate('/register')}>
                Sign Up and Start Playing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 text-sm text-slate-400">
              <div>✓ Free forever option</div>
              <div>✓ No credit card needed</div>
              <div>✓ Cancel anytime</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/60 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-white mb-3">Explore</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li><button onClick={() => navigate('/browse')} className="hover:underline">Browse Scenarios</button></li>
                <li><button onClick={() => navigate('/browse')} className="hover:underline">Featured This Week</button></li>
                <li><button onClick={() => navigate('/browse')} className="hover:underline">Community Creations</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Create</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li><button onClick={() => navigate('/scenario/create')} className="hover:underline">Build Scenarios</button></li>
                <li><button onClick={() => navigate('/character/create')} className="hover:underline">Character Designer</button></li>
                <li><button onClick={() => navigate('/learn')} className="hover:underline">Publishing Guide</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Learn</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li><button onClick={() => navigate('/how-it-works')} className="hover:underline">How It Works</button></li>
                <li><button onClick={() => navigate('/learn')} className="hover:underline">Getting Started</button></li>
                <li><button onClick={() => navigate('/learn')} className="hover:underline">Tips & Tricks</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li><button onClick={() => navigate('/about')} className="hover:underline">About</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:underline">Blog</button></li>
                <li><button onClick={() => navigate('/support')} className="hover:underline">Support</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:underline">Contact</button></li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-slate-900" />
              </div>
              <span className="font-medium">PlayScenarioAI</span>
            </div>
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} PlayScenarioAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};

// Local icon for Infinity symbol (to avoid extra deps)
const InfinityIcon: React.FC<{
  className?: string;
}> = ({
  className = ''
}) => <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8c-2 0-3.5 1.5-6 4-2.5-2.5-4-4-6-4C3.79 8 2 9.79 2 12s1.79 4 4 4c2 0 3.5-1.5 6-4 2.5 2.5 4 4 6 4 2.21 0 4-1.79 4-4s-1.79-4-4-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
export default Index;