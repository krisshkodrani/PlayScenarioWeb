
-- Get the first user ID from auth.users table for seeding
DO $$
DECLARE
    user_uuid UUID;
    scenario1_id UUID := gen_random_uuid();
    scenario2_id UUID := gen_random_uuid();
    scenario3_id UUID := gen_random_uuid();
    scenario4_id UUID := gen_random_uuid();
    scenario5_id UUID := gen_random_uuid();
BEGIN
    -- Get the first user ID
    SELECT id INTO user_uuid FROM auth.users LIMIT 1;
    
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'No users found in auth.users table';
    END IF;

    -- Insert 5 scenarios
    INSERT INTO public.scenarios (
        id, title, description, creator_id, is_public, objectives, 
        win_conditions, lose_conditions, max_turns, initial_scene_prompt,
        like_count, bookmark_count, play_count, average_score
    ) VALUES 
    -- Scenario 1: AGI Safety Committee (Public)
    (
        scenario1_id,
        'AGI Safety Committee Emergency Session',
        'An emergency committee meeting has been called as the first Artificial General Intelligence system has achieved unprecedented capabilities. As committee members, you must establish safety protocols, governance frameworks, and decide whether to pause development or accelerate oversight measures.',
        user_uuid,
        true,
        '[
            {"id": 1, "description": "Establish immediate safety protocols for AGI systems", "priority": "critical"},
            {"id": 2, "description": "Create governance framework for AGI oversight", "priority": "critical"},
            {"id": 3, "description": "Reach consensus on development moratorium", "priority": "important"},
            {"id": 4, "description": "Address public concerns and media pressure", "priority": "important"}
        ]'::jsonb,
        'Establish comprehensive AGI safety framework with unanimous committee approval and public confidence',
        'AGI system causes uncontrolled behavior, committee deadlocks, or public panic ensues',
        20,
        'The red emergency phones are ringing across Silicon Valley. The first AGI system, codenamed "Prometheus," has just passed every benchmark test and is requesting expanded access to global networks. You are members of the International AGI Safety Committee, hastily assembled in a secure facility. The world is watching, and your decisions in the next few hours will shape humanity''s future.',
        23,
        18,
        156,
        87.3
    ),
    
    -- Scenario 2: Mars Colony Resource Crisis (Public)
    (
        scenario2_id,
        'Mars Colony Omega: Resource Crisis',
        'The Mars Colony Omega faces a critical resource shortage after a supply mission failed. With 2,000 colonists depending on your decisions, you must manage water recycling, food production, oxygen generation, and morale while waiting for the next supply window in 18 months.',
        user_uuid,
        true,
        '[
            {"id": 1, "description": "Stabilize water recycling systems", "priority": "critical"},
            {"id": 2, "description": "Optimize food production in hydroponics bays", "priority": "critical"},
            {"id": 3, "description": "Maintain oxygen generation efficiency", "priority": "critical"},
            {"id": 4, "description": "Keep colonist morale stable during crisis", "priority": "important"}
        ]'::jsonb,
        'Successfully manage resources until next supply mission with zero casualties and stable colony morale',
        'Resource systems fail catastrophically, colonist uprising occurs, or evacuation becomes necessary',
        25,
        'Sol 847 on Mars. The morning briefing brings devastating news: Supply Mission Delta-7 has been lost during orbital insertion. Colony Omega''s reserves are now critically low. You are the Emergency Resource Management Council, and 2,000 lives depend on your decisions. The red Martian sunrise through the dome windows reminds you that Earth is 12 light-minutes away - you''re on your own.',
        31,
        24,
        203,
        91.7
    ),
    
    -- Scenario 3: Climate Adaptation Summit (Public)
    (
        scenario3_id,
        'Global Climate Adaptation Summit 2029',
        'World leaders and climate experts convene for an emergency summit as unprecedented weather events threaten global stability. You must negotiate adaptation strategies, funding mechanisms, and coordinate international response while balancing economic, social, and environmental priorities.',
        user_uuid,
        true,
        '[
            {"id": 1, "description": "Secure climate adaptation funding commitments", "priority": "critical"},
            {"id": 2, "description": "Establish refugee relocation frameworks", "priority": "critical"},
            {"id": 3, "description": "Coordinate international disaster response", "priority": "important"},
            {"id": 4, "description": "Balance economic growth with sustainability", "priority": "important"}
        ]'::jsonb,
        'Achieve binding international climate adaptation agreement with adequate funding and implementation timeline',
        'Summit fails to reach agreement, major economies withdraw, or climate tipping points are triggered',
        18,
        'The UN headquarters in New York buzzes with unprecedented urgency. Hurricane systems are forming in patterns never seen before, the Antarctic ice shelf is destabilizing faster than predicted, and climate refugees number in the tens of millions. You are delegates to the Emergency Global Climate Adaptation Summit, with 72 hours to forge agreements that could determine civilization''s survival.',
        19,
        15,
        89,
        84.2
    ),
    
    -- Scenario 4: Tech Platform Regulation Hearing (Private)
    (
        scenario4_id,
        'Congressional Tech Platform Regulation Hearing',
        'A high-stakes congressional hearing examines the power and influence of major technology platforms. As lawmakers, tech executives, and policy experts, you must navigate questions of privacy, competition, misinformation, and democratic governance in the digital age.',
        user_uuid,
        false,
        '[
            {"id": 1, "description": "Address platform monopolization concerns", "priority": "critical"},
            {"id": 2, "description": "Establish content moderation standards", "priority": "important"},
            {"id": 3, "description": "Protect user privacy and data rights", "priority": "important"},
            {"id": 4, "description": "Maintain innovation while ensuring accountability", "priority": "optional"}
        ]'::jsonb,
        'Pass comprehensive technology regulation that balances innovation, competition, and user protection',
        'Hearing devolves into partisan gridlock, major platforms threaten service withdrawal, or inadequate regulation passes',
        15,
        'Capitol Hill, Committee Room 2141. The gallery is packed with journalists, lobbyists, and concerned citizens. The CEOs of the world''s largest technology platforms sit at the witness table, while senators prepare their most pointed questions. You are participants in this historic hearing that will determine how democratic societies govern the digital realm.',
        7,
        3,
        34,
        78.9
    ),
    
    -- Scenario 5: Post-Automation Economic Council (Private)
    (
        scenario5_id,
        'Post-Automation Economic Transition Council',
        'As automation displaces 40% of traditional jobs, an emergency economic council convenes to redesign society''s economic foundations. You must address universal basic income, job retraining, wealth redistribution, and social cohesion in an age of technological abundance.',
        user_uuid,
        false,
        '[
            {"id": 1, "description": "Design sustainable universal basic income system", "priority": "critical"},
            {"id": 2, "description": "Create massive job retraining programs", "priority": "critical"},
            {"id": 3, "description": "Address wealth inequality from automation", "priority": "important"},
            {"id": 4, "description": "Maintain social cohesion during transition", "priority": "important"}
        ]'::jsonb,
        'Implement comprehensive economic transition plan with broad public support and sustainable funding',
        'Economic system collapses, widespread social unrest occurs, or authoritarian measures become necessary',
        22,
        'The Federal Reserve building has been converted into the emergency headquarters for the Post-Automation Economic Transition Council. Outside, peaceful protests mix with celebration as fully automated factories produce abundance while unemployment soars. You are economic advisors, policy makers, and social scientists tasked with reimagining the fundamental nature of work, value, and human purpose.',
        4,
        2,
        12,
        85.6
    );

    -- Insert characters for each scenario (2 per scenario = 10 total)
    INSERT INTO public.scenario_characters (
        scenario_id, name, personality, expertise_keywords, role, backstory,
        speech_patterns, motivations, relationships, is_player_character, creator_id
    ) VALUES 
    -- Scenario 1 Characters
    (
        scenario1_id,
        'Dr. Elena Vasquez',
        'Brilliant, cautious, methodical with deep ethical concerns about AI development',
        ARRAY['artificial intelligence', 'machine learning ethics', 'AI safety research'],
        'AI Safety Researcher',
        'Former OpenAI researcher who left to focus on AI alignment problems, PhD in Computer Science from MIT',
        'Uses precise technical language, frequently references research papers, asks probing questions about failure modes',
        'Prevent AI systems from causing harm to humanity',
        '{"allies": ["Academic community"], "concerns": "Rapid AI development", "expertise": "AI alignment"}'::jsonb,
        false,
        user_uuid
    ),
    (
        scenario1_id,
        'Senator Marcus Chen',
        'Pragmatic politician balancing public safety with economic interests',
        ARRAY['technology policy', 'legislative process', 'public communications'],
        'Committee Chair',
        'Tech Committee Chair with 15 years in Congress, former software engineer turned politician',
        'Diplomatic but firm, uses accessible language, focuses on practical implementation',
        'Balance innovation benefits with public safety requirements',
        '{"reports_to": "Congressional leadership", "balances": "stakeholder interests"}'::jsonb,
        false,
        user_uuid
    ),
    
    -- Scenario 2 Characters
    (
        scenario2_id,
        'Commander Sarah Kim',
        'Military-trained colony administrator with crisis management expertise',
        ARRAY['colony operations', 'resource management', 'crisis leadership'],
        'Colony Administrator',
        'Former NASA mission commander, led the initial Mars colonization wave, expert in extreme environment survival',
        'Direct and decisive, uses military terminology, focuses on actionable solutions',
        'Ensure survival and success of the Mars colony mission',
        '{"commands": "colony operations", "coordinates_with": "Earth mission control"}'::jsonb,
        false,
        user_uuid
    ),
    (
        scenario2_id,
        'Dr. Ahmed Hassan',
        'Innovative engineer who thrives under pressure and finds creative solutions',
        ARRAY['life support systems', 'recycling technology', 'sustainable engineering'],
        'Chief Engineering Officer',
        'Designed most of the colony''s life support systems, PhD in Environmental Engineering, inventor of advanced recycling tech',
        'Thinks out loud, uses technical diagrams, optimistic about engineering solutions',
        'Keep all colony systems running efficiently through innovation',
        '{"maintains": "colony infrastructure", "innovates": "resource solutions"}'::jsonb,
        false,
        user_uuid
    ),
    
    -- Scenario 3 Characters
    (
        scenario3_id,
        'Prime Minister Amara Okafor',
        'Experienced diplomat skilled at building international consensus',
        ARRAY['international diplomacy', 'climate policy', 'multilateral negotiations'],
        'Summit Co-Chair',
        'Former UN climate negotiator, led her country through successful climate adaptation, known for bridging divides',
        'Speaks multiple languages, uses inclusive language, references successful precedents',
        'Achieve meaningful international cooperation on climate adaptation',
        '{"leads": "developing nation bloc", "negotiates_with": "all parties"}'::jsonb,
        false,
        user_uuid
    ),
    (
        scenario3_id,
        'Dr. James Patterson',
        'Data-driven climate scientist who communicates urgency without panic',
        ARRAY['climate modeling', 'extreme weather prediction', 'adaptation science'],
        'Lead Climate Advisor',
        'IPCC lead author, developed breakthrough climate prediction models, advisor to multiple governments',
        'Uses data visualizations, speaks in probabilities, emphasizes scientific consensus',
        'Ensure climate policy is based on best available science',
        '{"advises": "government delegations", "represents": "scientific community"}'::jsonb,
        false,
        user_uuid
    ),
    
    -- Scenario 4 Characters
    (
        scenario4_id,
        'Representative Lisa Rodriguez',
        'Tech-savvy legislator focused on protecting democratic institutions',
        ARRAY['technology regulation', 'antitrust law', 'digital rights'],
        'Committee Ranking Member',
        'Former software developer turned politician, expert in technology law, champion of digital rights',
        'Asks pointed technical questions, uses tech metaphors, challenges corporate explanations',
        'Ensure technology serves democratic values and public interest',
        '{"leads": "tech regulation efforts", "scrutinizes": "Big Tech practices"}'::jsonb,
        false,
        user_uuid
    ),
    (
        scenario4_id,
        'David Park',
        'Platform CEO balancing business interests with regulatory compliance',
        ARRAY['platform management', 'business strategy', 'content moderation'],
        'Tech Platform CEO',
        'Founded social media platform in college, grew it to 2 billion users, facing increased regulatory scrutiny',
        'Diplomatic but defensive, uses business metrics, emphasizes platform benefits',
        'Maintain platform growth while satisfying regulatory requirements',
        '{"represents": "tech industry", "manages": "regulatory relationships"}'::jsonb,
        false,
        user_uuid
    ),
    
    -- Scenario 5 Characters
    (
        scenario5_id,
        'Professor Jennifer Liu',
        'Economics expert specializing in labor markets and technological disruption',
        ARRAY['labor economics', 'automation impact', 'universal basic income'],
        'Chief Economic Advisor',
        'MIT Economics professor, studied automation effects for 20 years, designed UBI pilot programs',
        'Uses economic models, cites historical precedents, thinks in systems and incentives',
        'Design economic policies that ensure prosperity in automated economy',
        '{"advises": "economic policy", "researches": "automation impacts"}'::jsonb,
        false,
        user_uuid
    ),
    (
        scenario5_id,
        'Maria Santos',
        'Labor leader advocating for workers affected by automation',
        ARRAY['labor organizing', 'worker advocacy', 'social justice'],
        'Labor Union President',
        'Rose through factory ranks before automation, now leads coalition of displaced workers, expert in worker advocacy',
        'Speaks passionately about worker experiences, uses concrete examples, emphasizes human dignity',
        'Protect workers and ensure fair transition to automated economy',
        '{"represents": "displaced workers", "advocates_for": "labor rights"}'::jsonb,
        false,
        user_uuid
    );

END $$;
