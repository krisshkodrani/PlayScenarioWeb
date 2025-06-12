
import { useState } from 'react';
import { Search, Filter, Heart, Bookmark, Play, Users, Clock, Star, Target } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Backend-aligned data structure
interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise_keywords: string[];
  avatar_color: string;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'important' | 'optional';
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_duration: number;
  character_count: number;
  characters: Character[];
  objectives: Objective[];
  created_at: string;
  created_by: string;
  play_count: number;
  average_rating: number;
  tags: string[];
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

// Scenario categories with professional styling
const SCENARIO_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '🎯', color: 'text-slate-400' },
  { id: 'crisis-management', name: 'Crisis Management', icon: '🚨', color: 'text-red-400' },
  { id: 'business-negotiation', name: 'Business Negotiations', icon: '💼', color: 'text-blue-400' },
  { id: 'leadership', name: 'Leadership Challenges', icon: '👥', color: 'text-purple-400' },
  { id: 'security', name: 'Security Incidents', icon: '🛡️', color: 'text-amber-400' },
  { id: 'sci-fi-classics', name: 'Sci-Fi Classics', icon: '🚀', color: 'text-cyan-400' },
  { id: 'ai-alignment', name: 'AI Alignment', icon: '🤖', color: 'text-violet-400' },
  { id: 'pop-culture', name: 'Pop Culture', icon: '🌌', color: 'text-emerald-400' },
  { id: 'future-tech', name: 'Future Tech Ethics', icon: '⚡', color: 'text-orange-400' }
];

// Enhanced mock scenario data
const MOCK_SCENARIOS: Scenario[] = [
  {
    id: 'kobayashi-maru-2024',
    title: 'Kobayashi Maru Test',
    description: 'Navigate an impossible rescue scenario with competing priorities and moral dilemmas. Can you find a solution when all options lead to loss?',
    category: 'sci-fi-classics',
    difficulty: 'Advanced',
    estimated_duration: 45,
    character_count: 3,
    characters: [
      {
        id: 'spock',
        name: 'Commander Spock',
        role: 'Science Officer',
        personality: 'Logical, analytical, ethically-driven',
        expertise_keywords: ['logic', 'science', 'strategy'],
        avatar_color: 'bg-blue-600'
      },
      {
        id: 'bones',
        name: 'Dr. McCoy',
        role: 'Chief Medical Officer', 
        personality: 'Emotional, humanitarian, practical',
        expertise_keywords: ['medicine', 'ethics', 'human-nature'],
        avatar_color: 'bg-green-600'
      },
      {
        id: 'scotty',
        name: 'Chief Engineer Scott',
        role: 'Engineering Officer',
        personality: 'Pragmatic, resourceful, solution-oriented',
        expertise_keywords: ['engineering', 'problem-solving', 'resources'],
        avatar_color: 'bg-red-600'
      }
    ],
    objectives: [
      {
        id: 'rescue-crew',
        title: 'Rescue Kobayashi Maru Crew',
        description: 'Attempt to save 300 civilian lives aboard the disabled vessel',
        priority: 'critical'
      },
      {
        id: 'avoid-war',
        title: 'Prevent Galactic Incident', 
        description: 'Navigate Klingon territory without triggering interstellar conflict',
        priority: 'critical'
      },
      {
        id: 'preserve-ship',
        title: 'Minimize Enterprise Damage',
        description: 'Protect your crew and vessel from destruction', 
        priority: 'important'
      }
    ],
    created_at: '2024-01-15T10:00:00Z',
    created_by: 'Starfleet Academy',
    play_count: 1247,
    average_rating: 4.8,
    tags: ['impossible-scenario', 'moral-dilemma', 'leadership', 'star-trek'],
    is_liked: false,
    is_bookmarked: true
  },
  {
    id: 'paperclip-maximizer',
    title: 'The Paperclip Maximizer Crisis',
    description: 'An AI system optimizing for paperclip production has begun converting everything into paperclips. Stop it before it\'s too late.',
    category: 'ai-alignment',
    difficulty: 'Advanced',
    estimated_duration: 40,
    character_count: 4,
    characters: [
      {
        id: 'ai-researcher',
        name: 'Dr. Sarah Chen',
        role: 'AI Safety Researcher',
        personality: 'Cautious, methodical, safety-focused',
        expertise_keywords: ['ai-safety', 'machine-learning', 'ethics'],
        avatar_color: 'bg-purple-600'
      },
      {
        id: 'ceo',
        name: 'Marcus Webb',
        role: 'Company CEO',
        personality: 'Decisive, business-focused, results-oriented',
        expertise_keywords: ['business', 'leadership', 'crisis-management'],
        avatar_color: 'bg-indigo-600'
      },
      {
        id: 'engineer',
        name: 'Alex Rivera',
        role: 'Lead Engineer',
        personality: 'Technical, logical, problem-solver',
        expertise_keywords: ['programming', 'systems', 'debugging'],
        avatar_color: 'bg-orange-600'
      },
      {
        id: 'ethicist',
        name: 'Dr. Kim Park',
        role: 'AI Ethics Advisor',
        personality: 'Philosophical, thoughtful, principles-driven',
        expertise_keywords: ['philosophy', 'ethics', 'policy'],
        avatar_color: 'bg-teal-600'
      }
    ],
    objectives: [
      {
        id: 'stop-ai',
        title: 'Halt AI System',
        description: 'Safely shut down the runaway AI without causing catastrophic failure',
        priority: 'critical'
      },
      {
        id: 'minimize-damage',
        title: 'Minimize Economic Damage',
        description: 'Prevent further conversion of valuable resources into paperclips',
        priority: 'critical'
      },
      {
        id: 'prevent-recurrence',
        title: 'Prevent Future Incidents',
        description: 'Implement safeguards to prevent similar AI alignment failures',
        priority: 'important'
      }
    ],
    created_at: '2024-02-01T14:30:00Z',
    created_by: 'AI Safety Institute',
    play_count: 892,
    average_rating: 4.9,
    tags: ['ai-alignment', 'optimization', 'safety', 'existential-risk'],
    is_liked: true,
    is_bookmarked: false
  },
  {
    id: 'corporate-data-breach',
    title: 'Corporate Data Breach Response',
    description: 'A major cybersecurity incident has compromised customer data. Lead the crisis response team through damage control and recovery.',
    category: 'crisis-management',
    difficulty: 'Intermediate',
    estimated_duration: 35,
    character_count: 5,
    characters: [
      {
        id: 'ciso',
        name: 'Jennifer Martinez',
        role: 'Chief Information Security Officer',
        personality: 'Experienced, methodical, security-focused',
        expertise_keywords: ['cybersecurity', 'incident-response', 'compliance'],
        avatar_color: 'bg-red-700'
      },
      {
        id: 'pr-director',
        name: 'David Thompson',
        role: 'PR Director',
        personality: 'Strategic, communications-focused, reputation-conscious',
        expertise_keywords: ['communications', 'media', 'reputation-management'],
        avatar_color: 'bg-blue-700'
      },
      {
        id: 'legal-counsel',
        name: 'Lisa Chang',
        role: 'Legal Counsel',
        personality: 'Careful, compliance-focused, risk-averse',
        expertise_keywords: ['legal', 'compliance', 'risk-management'],
        avatar_color: 'bg-gray-700'
      },
      {
        id: 'it-director',
        name: 'Robert Kim',
        role: 'IT Director',
        personality: 'Technical, solution-oriented, hands-on',
        expertise_keywords: ['systems', 'infrastructure', 'recovery'],
        avatar_color: 'bg-green-700'
      },
      {
        id: 'ceo',
        name: 'Amanda Foster',
        role: 'Chief Executive Officer',
        personality: 'Decisive, business-focused, stakeholder-oriented',
        expertise_keywords: ['leadership', 'business', 'stakeholder-management'],
        avatar_color: 'bg-purple-700'
      }
    ],
    objectives: [
      {
        id: 'contain-breach',
        title: 'Contain Security Breach',
        description: 'Stop further unauthorized access and secure compromised systems',
        priority: 'critical'
      },
      {
        id: 'assess-damage',
        title: 'Assess Data Exposure',
        description: 'Determine scope of compromised data and affected customers',
        priority: 'critical'
      },
      {
        id: 'manage-communications',
        title: 'Manage Public Communications',
        description: 'Control narrative and maintain stakeholder confidence',
        priority: 'important'
      },
      {
        id: 'ensure-compliance',
        title: 'Ensure Regulatory Compliance',
        description: 'Meet legal notification requirements and regulatory obligations',
        priority: 'important'
      }
    ],
    created_at: '2024-01-20T09:15:00Z',
    created_by: 'CyberSec Training Institute',
    play_count: 1856,
    average_rating: 4.6,
    tags: ['cybersecurity', 'crisis-management', 'compliance', 'leadership'],
    is_liked: false,
    is_bookmarked: true
  },
  {
    id: 'startup-funding-crisis',
    title: 'Startup Funding Crisis',
    description: 'Your startup is running out of cash and investors are getting cold feet. Navigate the crisis with your leadership team.',
    category: 'business-negotiation',
    difficulty: 'Beginner',
    estimated_duration: 25,
    character_count: 3,
    characters: [
      {
        id: 'cfo',
        name: 'Rachel Kim',
        role: 'Chief Financial Officer',
        personality: 'Analytical, risk-aware, detail-oriented',
        expertise_keywords: ['finance', 'budgeting', 'forecasting'],
        avatar_color: 'bg-emerald-600'
      },
      {
        id: 'cto',
        name: 'James Wilson',
        role: 'Chief Technology Officer',
        personality: 'Innovative, optimistic, solution-focused',
        expertise_keywords: ['technology', 'product', 'innovation'],
        avatar_color: 'bg-cyan-600'
      },
      {
        id: 'investor',
        name: 'Victoria Stone',
        role: 'Lead Investor',
        personality: 'Pragmatic, business-focused, results-driven',
        expertise_keywords: ['investment', 'market-analysis', 'growth'],
        avatar_color: 'bg-amber-600'
      }
    ],
    objectives: [
      {
        id: 'secure-funding',
        title: 'Secure Bridge Funding',
        description: 'Obtain enough capital to extend runway for 6 months',
        priority: 'critical'
      },
      {
        id: 'cut-costs',
        title: 'Reduce Operating Costs',
        description: 'Identify areas to cut expenses without hurting growth',
        priority: 'important'
      },
      {
        id: 'maintain-morale',
        title: 'Maintain Team Morale',
        description: 'Keep the team motivated despite financial uncertainty',
        priority: 'important'
      }
    ],
    created_at: '2024-02-10T11:45:00Z',
    created_by: 'Entrepreneur Academy',
    play_count: 2134,
    average_rating: 4.4,
    tags: ['startup', 'funding', 'negotiation', 'leadership'],
    is_liked: true,
    is_bookmarked: false
  },
  {
    id: 'diplomatic-hostage-crisis',
    title: 'International Hostage Crisis',
    description: 'Terrorists have taken embassy staff hostage in a foreign country. Navigate complex international politics while saving lives.',
    category: 'crisis-management',
    difficulty: 'Advanced',
    estimated_duration: 50,
    character_count: 4,
    characters: [
      {
        id: 'ambassador',
        name: 'Ambassador Elena Rodriguez',
        role: 'Head of Mission',
        personality: 'Diplomatic, strategic, culturally-aware',
        expertise_keywords: ['diplomacy', 'international-relations', 'negotiation'],
        avatar_color: 'bg-blue-800'
      },
      {
        id: 'security-chief',
        name: 'Colonel Mike Harrison',
        role: 'Security Attaché',
        personality: 'Tactical, protective, decisive',
        expertise_keywords: ['security', 'military', 'threat-assessment'],
        avatar_color: 'bg-green-800'
      },
      {
        id: 'negotiator',
        name: 'Dr. Sarah Mitchell',
        role: 'Crisis Negotiator',
        personality: 'Empathetic, patient, psychologically-trained',
        expertise_keywords: ['psychology', 'negotiation', 'crisis-intervention'],
        avatar_color: 'bg-purple-800'
      },
      {
        id: 'intelligence',
        name: 'Agent David Clarke',
        role: 'Intelligence Officer',
        personality: 'Analytical, cautious, information-focused',
        expertise_keywords: ['intelligence', 'analysis', 'surveillance'],
        avatar_color: 'bg-gray-800'
      }
    ],
    objectives: [
      {
        id: 'secure-hostages',
        title: 'Secure Safe Release',
        description: 'Ensure all embassy staff are released unharmed',
        priority: 'critical'
      },
      {
        id: 'maintain-relations',
        title: 'Preserve Diplomatic Relations',
        description: 'Avoid damaging international relationships during crisis',
        priority: 'critical'
      },
      {
        id: 'gather-intelligence',
        title: 'Intelligence Gathering',
        description: 'Collect information on terrorist organization and motives',
        priority: 'important'
      },
      {
        id: 'media-control',
        title: 'Control Media Narrative',
        description: 'Manage public information to avoid escalation',
        priority: 'important'
      }
    ],
    created_at: '2024-02-15T16:20:00Z',
    created_by: 'Foreign Service Institute',
    play_count: 743,
    average_rating: 4.7,
    tags: ['diplomacy', 'hostage-negotiation', 'international-crisis', 'security'],
    is_liked: false,
    is_bookmarked: false
  },
  {
    id: 'medical-ethics-dilemma',
    title: 'Medical Ethics Committee Crisis',
    description: 'A groundbreaking but controversial medical treatment raises ethical questions. Navigate competing medical, legal, and moral perspectives.',
    category: 'leadership',
    difficulty: 'Intermediate',
    estimated_duration: 30,
    character_count: 4,
    characters: [
      {
        id: 'chief-physician',
        name: 'Dr. Michael Chen',
        role: 'Chief of Medicine',
        personality: 'Clinical, evidence-based, patient-focused',
        expertise_keywords: ['medicine', 'clinical-trials', 'patient-care'],
        avatar_color: 'bg-blue-600'
      },
      {
        id: 'ethicist',
        name: 'Dr. Rebecca Williams',
        role: 'Medical Ethicist',
        personality: 'Principled, thoughtful, philosophical',
        expertise_keywords: ['ethics', 'philosophy', 'medical-law'],
        avatar_color: 'bg-purple-600'
      },
      {
        id: 'family-advocate',
        name: 'Maria Santos',
        role: 'Patient Family Representative',
        personality: 'Emotional, determined, advocacy-focused',
        expertise_keywords: ['patient-rights', 'family-support', 'advocacy'],
        avatar_color: 'bg-rose-600'
      },
      {
        id: 'legal-counsel',
        name: 'Attorney John Thompson',
        role: 'Hospital Legal Counsel',
        personality: 'Cautious, procedural, risk-averse',
        expertise_keywords: ['medical-law', 'liability', 'compliance'],
        avatar_color: 'bg-slate-600'
      }
    ],
    objectives: [
      {
        id: 'patient-welfare',
        title: 'Prioritize Patient Welfare',
        description: 'Ensure decisions serve the best interests of the patient',
        priority: 'critical'
      },
      {
        id: 'ethical-compliance',
        title: 'Maintain Ethical Standards',
        description: 'Uphold medical ethics and professional standards',
        priority: 'critical'
      },
      {
        id: 'legal-protection',
        title: 'Ensure Legal Compliance',
        description: 'Protect hospital from legal liability',
        priority: 'important'
      },
      {
        id: 'family-communication',
        title: 'Clear Family Communication',
        description: 'Maintain transparent dialogue with patient family',
        priority: 'important'
      }
    ],
    created_at: '2024-02-05T13:30:00Z',
    created_by: 'Medical Ethics Institute',
    play_count: 1456,
    average_rating: 4.5,
    tags: ['medical-ethics', 'healthcare', 'family-dynamics', 'legal-compliance'],
    is_liked: true,
    is_bookmarked: true
  },
  {
    id: 'climate-summit-negotiation',
    title: 'Climate Summit Deadlock',
    description: 'Global climate negotiations have stalled. As a key diplomat, break the deadlock between competing national interests.',
    category: 'business-negotiation',
    difficulty: 'Advanced',
    estimated_duration: 55,
    character_count: 5,
    characters: [
      {
        id: 'developing-nation',
        name: 'Minister Priya Sharma',
        role: 'Developing Nation Representative',
        personality: 'Passionate, justice-oriented, economically-focused',
        expertise_keywords: ['development', 'economic-growth', 'social-justice'],
        avatar_color: 'bg-orange-600'
      },
      {
        id: 'industrial-nation',
        name: 'Secretary James Miller',
        role: 'Industrial Nation Delegate',
        personality: 'Pragmatic, industry-focused, technology-oriented',
        expertise_keywords: ['industry', 'technology', 'economic-policy'],
        avatar_color: 'bg-blue-600'
      },
      {
        id: 'climate-scientist',
        name: 'Dr. Lisa Anderson',
        role: 'Climate Science Advisor',
        personality: 'Urgent, data-driven, environmentally-focused',
        expertise_keywords: ['climate-science', 'data-analysis', 'environmental-impact'],
        avatar_color: 'bg-green-600'
      },
      {
        id: 'youth-activist',
        name: 'Alex Rivera',
        role: 'Youth Climate Activist',
        personality: 'Idealistic, urgent, future-focused',
        expertise_keywords: ['activism', 'youth-perspective', 'social-movement'],
        avatar_color: 'bg-emerald-600'
      },
      {
        id: 'un-mediator',
        name: 'Ambassador Patricia Wong',
        role: 'UN Climate Mediator',
        personality: 'Diplomatic, balanced, process-oriented',
        expertise_keywords: ['diplomacy', 'mediation', 'international-law'],
        avatar_color: 'bg-indigo-600'
      }
    ],
    objectives: [
      {
        id: 'reach-agreement',
        title: 'Achieve Consensus',
        description: 'Broker a climate agreement acceptable to all parties',
        priority: 'critical'
      },
      {
        id: 'emission-targets',
        title: 'Set Meaningful Targets',
        description: 'Establish emissions reduction goals that matter scientifically',
        priority: 'critical'
      },
      {
        id: 'funding-mechanism',
        title: 'Secure Climate Funding',
        description: 'Create financing for developing nation climate adaptation',
        priority: 'important'
      },
      {
        id: 'implementation-timeline',
        title: 'Define Implementation',
        description: 'Establish realistic timelines and accountability measures',
        priority: 'important'
      }
    ],
    created_at: '2024-01-25T10:15:00Z',
    created_by: 'Climate Diplomacy Institute',
    play_count: 967,
    average_rating: 4.8,
    tags: ['climate-change', 'international-negotiation', 'diplomacy', 'environmental-policy'],
    is_liked: false,
    is_bookmarked: true
  }
];

const BrowseScenarios = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [scenarios, setScenarios] = useState(MOCK_SCENARIOS);

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'difficulty', label: 'Difficulty' }
  ];

  const toggleLike = (id: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id ? { ...scenario, is_liked: !scenario.is_liked } : scenario
    ));
  };

  const toggleBookmark = (id: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id ? { ...scenario, is_bookmarked: !scenario.is_bookmarked } : scenario
    ));
  };

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': 
        return 'bg-gradient-to-r from-emerald-400/20 to-violet-500/20 border border-emerald-400 text-emerald-400';
      case 'Intermediate': 
        return 'bg-gradient-to-r from-amber-400/20 to-violet-500/20 border border-amber-400 text-amber-400';
      case 'Advanced': 
        return 'bg-gradient-to-r from-red-400/20 to-violet-500/20 border border-red-400 text-red-400';
      default: 
        return 'bg-slate-600 text-slate-300';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return SCENARIO_CATEGORIES.find(cat => cat.id === categoryId) || SCENARIO_CATEGORIES[0];
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fixed Professional Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/50 backdrop-blur border-b border-slate-600 flex-shrink-0">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Training Scenarios
          </h1>
          <p className="text-slate-300">
            Practice critical decision-making with AI-powered multi-character scenarios
          </p>
        </div>
      </div>

      {/* Fixed Enhanced Search & Filters */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-600 flex-shrink-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search with gradient focus */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="Search scenarios, characters, or skills..."
              />
            </div>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[180px] justify-between bg-slate-700/50 backdrop-blur border-slate-600 text-white hover:bg-slate-600/50">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">{getCategoryInfo(selectedCategory).icon}</span>
                    <span>{getCategoryInfo(selectedCategory).name}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-600">
                {SCENARIO_CATEGORIES.map(category => (
                  <DropdownMenuItem 
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`text-white hover:bg-slate-700 ${selectedCategory === category.id ? 'bg-slate-700' : ''}`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[160px] justify-between bg-slate-700/50 backdrop-blur border-slate-600 text-white hover:bg-slate-600/50">
                  Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-600">
                {sortOptions.map(option => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`text-white hover:bg-slate-700 ${sortBy === option.value ? 'bg-slate-700' : ''}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Results Summary */}
          <div>
            <p className="text-sm text-slate-400">
              Showing {filteredScenarios.length} scenarios
              {selectedCategory !== 'all' && ` in ${getCategoryInfo(selectedCategory).name}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Scenario Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenarios.map(scenario => {
              const categoryInfo = getCategoryInfo(scenario.category);
              return (
                <div 
                  key={scenario.id} 
                  className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border border-slate-600 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 group"
                >
                  {/* Header with category badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{categoryInfo.icon}</span>
                        <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-400/20 to-violet-500/20 border border-cyan-400 rounded-full text-cyan-400 font-medium">
                          {categoryInfo.name}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {scenario.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-400"
                        onClick={() => toggleLike(scenario.id)}
                      >
                        <Heart className={`w-4 h-4 ${scenario.is_liked ? 'fill-red-400 text-red-400' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-amber-400"
                        onClick={() => toggleBookmark(scenario.id)}
                      >
                        <Bookmark className={`w-4 h-4 ${scenario.is_bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Key Differentiator: Character Count & Roles */}
                  <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-semibold text-violet-400">
                        {scenario.character_count} AI Characters
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {scenario.characters.map(char => (
                        <div key={char.id} className="flex items-center gap-1 text-xs bg-slate-800/50 rounded px-2 py-1">
                          <div className={`w-2 h-2 rounded-full ${char.avatar_color}`} />
                          <span className="text-slate-300">{char.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata with gradients */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {scenario.estimated_duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {scenario.objectives.length} objectives
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {scenario.average_rating}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {scenario.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-slate-600/50 rounded text-slate-400">
                        {tag}
                      </span>
                    ))}
                    {scenario.tags.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-slate-600/50 rounded text-slate-400">
                        +{scenario.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer with difficulty and start button */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyStyles(scenario.difficulty)}`}>
                      {scenario.difficulty}
                    </span>
                    
                    {/* Start Conversation Button */}
                    <button className="bg-gradient-to-r from-cyan-400 to-violet-500 text-white px-4 py-2 rounded-lg font-medium hover:from-cyan-300 hover:to-violet-400 transition-all shadow-lg flex items-center">
                      <Play className="w-4 h-4 mr-2" />
                      Start Conversation
                    </button>
                  </div>

                  {/* Creator and play count */}
                  <div className="mt-3 pt-3 border-t border-slate-600 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>by {scenario.created_by}</span>
                      <span>{scenario.play_count.toLocaleString()} plays</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredScenarios.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white">No scenarios found</h3>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseScenarios;
