
import { Scenario } from '@/types/scenario';

export const mapDatabaseScenario = (dbScenario: any): Scenario => {
  // Extract category from description or use default
  const getCategoryFromDescription = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('business') || lowerDesc.includes('corporate') || lowerDesc.includes('management')) {
      return 'business-training';
    }
    if (lowerDesc.includes('sales') || lowerDesc.includes('negotiation')) {
      return 'sales-training';
    }
    if (lowerDesc.includes('customer') || lowerDesc.includes('service')) {
      return 'customer-service';
    }
    if (lowerDesc.includes('leadership') || lowerDesc.includes('team')) {
      return 'leadership-development';
    }
    if (lowerDesc.includes('medical') || lowerDesc.includes('healthcare')) {
      return 'healthcare-training';
    }
    if (lowerDesc.includes('education') || lowerDesc.includes('teaching')) {
      return 'educational';
    }
    return 'general';
  };

  // Determine difficulty based on max_turns and complexity
  const getDifficultyLevel = (maxTurns: number | null, description: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
    const complexityIndicators = ['crisis', 'advanced', 'expert', 'complex', 'strategic'];
    const isComplex = complexityIndicators.some(indicator => 
      description.toLowerCase().includes(indicator)
    );
    
    if (isComplex || (maxTurns && maxTurns > 30)) {
      return 'Advanced';
    }
    if (maxTurns && maxTurns > 15) {
      return 'Intermediate';
    }
    return 'Beginner';
  };

  // Generate tags from description and title
  const generateTags = (title: string, description: string): string[] => {
    const text = `${title} ${description}`.toLowerCase();
    const possibleTags = [
      'leadership', 'communication', 'crisis-management', 'business',
      'teamwork', 'negotiation', 'customer-service', 'sales',
      'training', 'management', 'strategy', 'healthcare',
      'education', 'problem-solving', 'decision-making'
    ];
    
    return possibleTags.filter(tag => 
      text.includes(tag.replace('-', ' ')) || text.includes(tag)
    ).slice(0, 4);
  };

  const category = getCategoryFromDescription(dbScenario.description);
  const difficulty = getDifficultyLevel(dbScenario.max_turns, dbScenario.description);
  const tags = generateTags(dbScenario.title, dbScenario.description);

  return {
    id: dbScenario.id,
    title: dbScenario.title,
    description: dbScenario.description,
    category,
    difficulty,
    estimated_duration: dbScenario.max_turns ? dbScenario.max_turns * 2 : 30,
    character_count: 0,
    characters: [],
    objectives: Array.isArray(dbScenario.objectives) ? dbScenario.objectives : [],
    created_at: dbScenario.created_at,
    created_by: dbScenario.profiles?.username || 'Unknown',
    play_count: dbScenario.play_count || 0,
    average_rating: dbScenario.average_score ? Number(dbScenario.average_score) : 0,
    tags,
    is_liked: false,
    is_bookmarked: false,
    is_public: dbScenario.is_public
  };
};

export const generateAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500'
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

export const enrichScenarioWithCharacters = (scenario: Scenario, dbScenario: any): Scenario => {
  if (dbScenario.scenario_characters) {
    scenario.characters = dbScenario.scenario_characters.map((char: any) => ({
      id: char.id,
      name: char.name,
      role: char.role,
      personality: char.personality,
      expertise_keywords: char.expertise_keywords,
      avatar_color: generateAvatarColor(char.name)
    }));
    scenario.character_count = scenario.characters.length;
  }
  return scenario;
};
