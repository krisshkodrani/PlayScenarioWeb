
import { useState } from 'react';
import { Search, Filter, Heart, Bookmark, Play, Users, Clock, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  playerCount: string;
  rating: number;
  playCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  creator: string;
  tags: string[];
}

const mockScenarios: Scenario[] = [
  {
    id: '1',
    title: 'The AI Ethics Committee',
    description: 'Navigate complex ethical decisions as a member of an AI oversight committee reviewing controversial AI applications.',
    category: 'Ethics',
    difficulty: 'Advanced',
    duration: '45-60 min',
    playerCount: '1-4 players',
    rating: 4.8,
    playCount: 1247,
    isLiked: false,
    isBookmarked: true,
    creator: 'Dr. Sarah Chen',
    tags: ['Ethics', 'Corporate', 'Decision Making']
  },
  {
    id: '2',
    title: 'Rogue AI Investigation',
    description: 'Investigate a series of anomalous AI behaviors across a smart city network to uncover the source of the disruption.',
    category: 'Mystery',
    difficulty: 'Intermediate',
    duration: '30-45 min',
    playerCount: '1-2 players',
    rating: 4.6,
    playCount: 892,
    isLiked: true,
    isBookmarked: false,
    creator: 'Alex Rivera',
    tags: ['Investigation', 'Sci-Fi', 'Problem Solving']
  },
  {
    id: '3',
    title: 'AI Rights Tribunal',
    description: 'Participate in a groundbreaking legal case determining whether advanced AI systems deserve legal rights and protections.',
    category: 'Legal',
    difficulty: 'Advanced',
    duration: '60+ min',
    playerCount: '2-6 players',
    rating: 4.9,
    playCount: 567,
    isLiked: false,
    isBookmarked: false,
    creator: 'Prof. Marcus Webb',
    tags: ['Legal', 'Philosophy', 'Debate']
  },
  {
    id: '4',
    title: 'Corporate AI Integration',
    description: 'Lead a team implementing AI solutions in a traditional company while managing resistance and ethical concerns.',
    category: 'Business',
    difficulty: 'Beginner',
    duration: '20-30 min',
    playerCount: '1-3 players',
    rating: 4.3,
    playCount: 1856,
    isLiked: true,
    isBookmarked: true,
    creator: 'Jennifer Park',
    tags: ['Business', 'Management', 'Strategy']
  }
];

const BrowseScenarios = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [scenarios, setScenarios] = useState(mockScenarios);

  const categories = ['All', 'Ethics', 'Mystery', 'Legal', 'Business', 'Technical', 'Philosophy'];
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'difficulty', label: 'Difficulty' }
  ];

  const toggleLike = (id: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id ? { ...scenario, isLiked: !scenario.isLiked } : scenario
    ));
  };

  const toggleBookmark = (id: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id ? { ...scenario, isBookmarked: !scenario.isBookmarked } : scenario
    ));
  };

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || scenario.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-accent';
      case 'Intermediate': return 'text-primary';
      case 'Advanced': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Scenarios</h1>
          <p className="text-muted-foreground">
            Discover AI-powered interactive experiences and strategic simulations
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search scenarios, tags, or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border focus:border-primary glow-primary"
            />
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px] justify-between">
                <Filter className="w-4 h-4 mr-2" />
                {selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-accent' : ''}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px] justify-between">
                Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map(option => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? 'bg-accent' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredScenarios.length} scenarios
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map(scenario => (
            <Card key={scenario.id} className="group hover:glow-primary transition-all duration-300 holo-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                      {scenario.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-surface-dark text-primary">
                        {scenario.category}
                      </span>
                      <span className={`text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleLike(scenario.id)}
                    >
                      <Heart className={`w-4 h-4 ${scenario.isLiked ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleBookmark(scenario.id)}
                    >
                      <Bookmark className={`w-4 h-4 ${scenario.isBookmarked ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {scenario.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-surface-light mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {scenario.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {scenario.playerCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    {scenario.rating}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {scenario.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-surface-light">
                    <div>by {scenario.creator}</div>
                    <div>{scenario.playCount.toLocaleString()} plays</div>
                  </div>
                  <Button className="glow-primary hover:bg-primary/90">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredScenarios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No scenarios found</h3>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseScenarios;
