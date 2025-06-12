import { Scenario } from '@/types/scenario';

export const MOCK_SCENARIOS: Scenario[] = [
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
