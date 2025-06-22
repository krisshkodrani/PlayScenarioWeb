
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Users, Target, Brain, ArrowRight, Play, BookOpen, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Today's Headlines, Tomorrow's Implications",
      description: "Navigate scenarios that bridge current events and future possibilities. From AI regulation debates to climate adaptation strategies - explore how today's decisions shape tomorrow's world."
    },
    {
      icon: Target,
      title: "Realistic Future Challenges",
      description: "Practice handling plausible 2025-2035 scenarios: AGI governance committees, Mars colony management, post-automation economics, and other challenges our generation will actually face."
    },
    {
      icon: Users,
      title: "Multi-Stakeholder Future Planning",
      description: "Engage with AI characters representing diverse perspectives on complex issues. Navigate conversations between policymakers, technologists, ethicists, and citizens shaping our shared future."
    }
  ];

  const stats = [
    { label: "Future Scenarios", value: "50+", color: "text-primary" },
    { label: "Expert Perspectives", value: "200+", color: "text-secondary" },
    { label: "Future-Planning Hours", value: "25K+", color: "text-accent" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PlayScenarioAI
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="glow-primary" onClick={() => navigate('/register')}>
              Create Account
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 circuit-bg opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Realistic & Futuristic Scenario Explorer
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Navigate Tomorrow's Challenges Today:
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Realistic & Futuristic Scenarios
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore realistic scenarios spanning from today's headlines to plausible 2030+ futures. Practice navigating AI governance debates, climate adaptation strategies, space colonization decisions, and other challenges that shape our world's trajectory.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="glow-primary px-8 py-3 text-lg font-semibold"
                onClick={() => navigate('/register')}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Exploring Futures
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg border-primary/30 hover:border-primary/50"
                onClick={() => navigate('/browse')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Preview Scenarios
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Future-Proofing Through Realistic Scenario Planning
            </h2>
            <p className="text-lg text-muted-foreground">
              Practice navigating the complex challenges ahead. From AI alignment decisions to climate adaptation strategies, explore realistic scenarios that bridge today's news and tomorrow's possibilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scenario Preview Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Explore Scenarios That Matter
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From AGI governance to Mars colony management, practice making decisions that will shape our future.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">AGI Safety Committee</h3>
                      <p className="text-sm text-muted-foreground">2026 Scenario</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    An AI system has achieved apparent general intelligence. Navigate the first emergency ethics board meeting deciding humanity's response.
                  </p>
                </div>
                
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🌍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Miami Climate Adaptation</h3>
                      <p className="text-sm text-muted-foreground">2029 Scenario</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Sea levels have risen faster than predicted. Lead the managed retreat planning for 100,000 residents.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🚀</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Mars Colony Governance</h3>
                      <p className="text-sm text-muted-foreground">2031 Scenario</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    The first Mars colony faces a constitutional crisis. Earth laws don't apply - help draft new governance frameworks.
                  </p>
                </div>
                
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Tech Platform Regulation</h3>
                      <p className="text-sm text-muted-foreground">2025 Scenario</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Congress is voting on comprehensive social media regulation. Advise key senators on balancing innovation and safety.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="glow-primary px-8 py-3 text-lg font-semibold"
                onClick={() => navigate('/register')}
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Start Exploring These Futures
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Navigate Tomorrow's Challenges?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join futurists, policy makers, and forward-thinking individuals exploring realistic scenarios that prepare us for an uncertain but fascinating future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="glow-primary px-8 py-3 text-lg font-semibold"
                onClick={() => navigate('/register')}
              >
                <Play className="w-5 h-5 mr-2" />
                Create Your Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg border-primary/30"
                onClick={() => navigate('/browse')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Scenarios
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center">
                <Zap className="w-4 h-4 text-background" />
              </div>
              <span className="font-semibold text-foreground">PlayScenarioAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 PlayScenarioAI. Advancing future planning through realistic scenario exploration.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
