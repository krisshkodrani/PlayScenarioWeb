
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
  }
];

export const MOCK_CHARACTER_STATS: CharacterStats = {
  totalCharacters: 12,
  activeCharacters: 8,
  mostUsedCharacter: "David Kumar",
  averageRating: 4.6
};
