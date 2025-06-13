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
      title: "Real-World Scenario Training",
      description: "Practice high-stakes situations like crisis management, business negotiations, and leadership challenges with intelligent AI characters"
    },
    {
      icon: Target,
      title: "Mission-Based Learning",
      description: "Complete specific objectives while managing competing priorities, time constraints, and stakeholder relationships"
    },
    {
      icon: Users,
      title: "Dynamic Team Conversations",
      description: "Engage with 2-5 AI characters simultaneously, each with distinct expertise, personalities, and perspectives on your decisions"
    }
  ];

  const stats = [
    { label: "Live Scenarios", value: "50+", color: "text-primary" },
    { label: "AI Characters", value: "200+", color: "text-secondary" },
    { label: "Training Hours", value: "25K+", color: "text-accent" }
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/demo')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Try Demo
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="glow-primary">
              Get Started
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
              Multi-Agent AI Scenario Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Master Real-World & Futuristic
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Scenarios with AI Characters
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Practice critical decision-making through immersive conversations with multiple AI characters. From crisis management to strategic negotiations - develop your skills in realistic, consequence-free scenarios.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="glow-primary px-8 py-3 text-lg font-semibold"
                onClick={() => navigate('/demo')}
              >
                <Play className="w-5 h-5 mr-2" />
                Try Live Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-primary/30 hover:border-primary/50">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Training Scenarios
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
              Professional Skills Training Platform
            </h2>
            <p className="text-lg text-muted-foreground">
              Build critical decision-making abilities through realistic scenarios powered by advanced multi-agent AI technology.
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

      {/* Demo Preview */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience Multi-Character Conversations
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See how multiple AI characters respond dynamically to your decisions in real-time
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/demo')}
              className="glow-primary px-8 py-3 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Interactive Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-1">
              <div className="bg-background rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Multi-Character Dialogues</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Navigate conversations with 2-5 AI characters at once</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span>Monitor mission objectives and success metrics live</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>Experience realistic consequences for every decision</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="bg-card border border-border/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">DC</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary">Dr. Chen</div>
                          <div className="text-xs text-muted-foreground">Crisis Manager</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground bg-muted/20 rounded p-3">
                        "We need immediate damage control. The board is meeting in 30 minutes and they want answers..."
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              Ready to Level Up Your Decision-Making?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join professionals and students training their leadership and crisis management skills through realistic AI-powered scenarios.
            </p>
            <Button size="lg" className="glow-primary px-8 py-3 text-lg font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Start Training Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
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
              © 2024 PlayScenarioAI. Advancing professional training through AI-powered scenarios.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;