
import { Character, CharacterStats } from '@/types/character';

export const MOCK_CHARACTERS: Character[] = [
  {
    id: "char1",
    name: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    personality: "Calm under pressure, detail-oriented, prioritizes patient safety above all else. Has 15 years of emergency medicine experience.",
    expertise_keywords: ["medical", "emergency-response", "leadership", "crisis-management"],
    created_at: "2024-01-15T10:00:00Z",
    scenario_count: 3,
    total_responses: 142,
    average_rating: 4.7,
    avatar_color: "bg-emerald-500",
    last_used: "2024-01-20T14:30:00Z"
  },
  {
    id: "char2", 
    name: "Alex Rodriguez",
    role: "Security Chief",
    personality: "Direct communicator, security-focused, quick decision maker. Former military background shows in structured approach to problems.",
    expertise_keywords: ["security", "risk-assessment", "military-tactics", "physical-safety"],
    created_at: "2024-01-12T09:15:00Z",
    scenario_count: 5,
    total_responses: 203,
    average_rating: 4.4,
    avatar_color: "bg-red-500",
    last_used: "2024-01-18T11:45:00Z"
  },
  {
    id: "char3",
    name: "Jennifer Walsh",
    role: "Public Relations Director", 
    personality: "Diplomatic, media-savvy, excellent at managing public perception. Stays calm during PR crises and thinks strategically about messaging.",
    expertise_keywords: ["public-relations", "media-strategy", "communication", "reputation-management"],
    created_at: "2024-01-10T16:20:00Z",
    scenario_count: 2,
    total_responses: 89,
    average_rating: 4.9,
    avatar_color: "bg-violet-500",
    last_used: "2024-01-19T08:20:00Z"
  },
  {
    id: "char4",
    name: "Marcus Thompson",
    role: "Engineering Director",
    personality: "Analytical problem-solver, thrives on technical challenges. Prefers data-driven decisions and systematic approaches to complex issues.",
    expertise_keywords: ["engineering", "technical-solutions", "project-management", "innovation"],
    created_at: "2024-01-08T13:45:00Z",
    scenario_count: 4,
    total_responses: 167,
    average_rating: 4.5,
    avatar_color: "bg-blue-500",
    last_used: "2024-01-21T09:15:00Z"
  },
  {
    id: "char5",
    name: "Lisa Park",
    role: "Financial Advisor",
    personality: "Risk-averse, detail-oriented, excellent with numbers and financial planning. Provides conservative but sound financial guidance.",
    expertise_keywords: ["finance", "budgeting", "risk-management", "investment-strategy"],
    created_at: "2024-01-05T11:30:00Z",
    scenario_count: 1,
    total_responses: 45,
    average_rating: 4.8,
    avatar_color: "bg-amber-500",
    last_used: "2024-01-17T16:20:00Z"
  },
  {
    id: "char6",
    name: "David Kumar",
    role: "Operations Manager",
    personality: "Efficient, process-oriented, focuses on streamlining operations and improving productivity. Strong leadership and coordination skills.",
    expertise_keywords: ["operations", "logistics", "process-improvement", "team-management"],
    created_at: "2024-01-03T09:00:00Z",
    scenario_count: 6,
    total_responses: 234,
    average_rating: 4.3,
    avatar_color: "bg-indigo-500",
    last_used: "2024-01-22T10:30:00Z"
  },
  {
    id: "char7",
    name: "Captain Zara Voss",
    role: "Space Station Commander",
    personality: "Fearless leader with 20 years of space exploration experience. Makes tough decisions under extreme pressure and inspires unwavering loyalty from crew members. Has a dry wit that emerges during the most dangerous situations.",
    expertise_keywords: ["space-operations", "crisis-leadership", "astronaut-training", "interstellar-navigation"],
    created_at: "2024-01-02T14:20:00Z",
    scenario_count: 8,
    total_responses: 312,
    average_rating: 4.9,
    avatar_color: "bg-purple-500",
    last_used: "2024-01-23T16:45:00Z"
  },
  {
    id: "char8",
    name: "Phoenix Nakamura",
    role: "Cybersecurity Hacker",
    personality: "Brilliant digital detective with unconventional methods. Speaks in tech metaphors and thinks three steps ahead of cybercriminals. Prefers working alone but fiercely protective of digital privacy rights.",
    expertise_keywords: ["cybersecurity", "ethical-hacking", "digital-forensics", "encryption", "privacy-protection"],
    created_at: "2024-01-01T11:15:00Z",
    scenario_count: 7,
    total_responses: 278,
    average_rating: 4.6,
    avatar_color: "bg-cyan-500",
    last_used: "2024-01-24T13:20:00Z"
  },
  {
    id: "char9",
    name: "Dr. Amara Okafor",
    role: "Environmental Scientist",
    personality: "Passionate climate researcher who combines scientific rigor with environmental activism. Speaks with urgency about sustainability but maintains optimism about innovative solutions. Uses nature analogies to explain complex concepts.",
    expertise_keywords: ["climate-science", "sustainability", "environmental-policy", "renewable-energy", "ecosystem-management"],
    created_at: "2023-12-28T08:30:00Z",
    scenario_count: 5,
    total_responses: 189,
    average_rating: 4.8,
    avatar_color: "bg-green-600",
    last_used: "2024-01-25T10:15:00Z"
  },
  {
    id: "char10",
    name: "Lorenzo 'The Mediator' Santos",
    role: "Conflict Resolution Specialist",
    personality: "Former diplomat turned corporate mediator with an uncanny ability to find common ground. Speaks multiple languages fluently and uses cultural insights to bridge divides. Never raises his voice but commands respect through wisdom.",
    expertise_keywords: ["diplomacy", "negotiation", "cultural-intelligence", "conflict-resolution", "international-relations"],
    created_at: "2023-12-25T15:45:00Z",
    scenario_count: 9,
    total_responses: 356,
    average_rating: 4.7,
    avatar_color: "bg-orange-500",
    last_used: "2024-01-26T09:30:00Z"
  }
];

export const MOCK_CHARACTER_STATS: CharacterStats = {
  totalCharacters: 16,
  activeCharacters: 12,
  mostUsedCharacter: "Lorenzo 'The Mediator' Santos",
  averageRating: 4.7
};
