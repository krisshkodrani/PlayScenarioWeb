
-- Fixed Mock seed data for PlayScenarioAI scenarios and characters
-- This adds diverse scenarios across different industries and use cases

-- Insert mock scenarios
INSERT INTO public.scenarios (
    id,
    title,
    description,
    creator_id,
    is_public,
    objectives,
    win_conditions,
    lose_conditions,
    max_turns,
    initial_scene_prompt,
    like_count,
    bookmark_count,
    play_count,
    average_score
) VALUES 
-- Corporate Crisis Management
(
    gen_random_uuid(),
    'Product Recall Crisis',
    'A major food company discovers contamination in their flagship product. As the crisis management team, you must navigate media relations, customer safety, and business continuity while maintaining company reputation.',
    (SELECT id FROM auth.users LIMIT 1),
    true,
    '[
        {"id": 1, "description": "Coordinate immediate product recall", "priority": "critical"},
        {"id": 2, "description": "Manage media communications", "priority": "important"},
        {"id": 3, "description": "Ensure customer safety protocols", "priority": "critical"},
        {"id": 4, "description": "Minimize financial impact", "priority": "important"}
    ]'::jsonb,
    'Successfully recall all contaminated products, maintain public trust, and establish clear prevention measures',
    'Public health incident occurs, major media backlash, or company faces legal action',
    15,
    'Breaking news alerts flood your phones. Your company''s bestselling cereal has been linked to several cases of food poisoning. The CEO has called an emergency meeting. Reporters are already gathering outside the headquarters. You have 15 turns to manage this crisis effectively.',
    12,
    8,
    45,
    78.5
),

-- Healthcare Emergency
(
    gen_random_uuid(),
    'Hospital Emergency Response',
    'A multi-casualty incident has overwhelmed the emergency department. Coordinate medical teams, manage resources, and ensure patient care during this critical situation.',
    (SELECT id FROM auth.users LIMIT 1),
    true,
    '[
        {"id": 1, "description": "Triage patients effectively", "priority": "critical"},
        {"id": 2, "description": "Coordinate medical teams", "priority": "critical"},
        {"id": 3, "description": "Manage hospital resources", "priority": "important"},
        {"id": 4, "description": "Communicate with families", "priority": "important"}
    ]'::jsonb,
    'All patients receive appropriate care, no preventable deaths, efficient resource utilization',
    'Patient deaths due to poor triage, resource depletion, or team coordination failure',
    12,
    'A city bus accident has resulted in 23 casualties arriving at your hospital within minutes. The emergency department is at capacity, and more ambulances are en route. You''re the charge nurse coordinating the response. Lives depend on your decisions.',
    15,
    12,
    67,
    82.3
),

-- Customer Service Challenge
(
    gen_random_uuid(),
    'Angry Customer Resolution',
    'Handle a difficult customer situation involving a defective product, missed deadlines, and escalating complaints. Turn this negative experience into a positive outcome.',
    (SELECT id FROM auth.users LIMIT 1),
    true,
    '[
        {"id": 1, "description": "Listen to customer concerns", "priority": "critical"},
        {"id": 2, "description": "Identify root cause of problem", "priority": "important"},
        {"id": 3, "description": "Offer appropriate compensation", "priority": "important"},
        {"id": 4, "description": "Prevent future similar issues", "priority": "optional"}
    ]'::jsonb,
    'Customer satisfaction restored, issue resolved, positive review obtained',
    'Customer escalates to social media, demands refund, or threatens legal action',
    8,
    'Mr. Johnson storms into your store, clearly agitated. His $2,000 laptop, purchased just two weeks ago, has completely failed. He has an important presentation tomorrow and claims this is the second defective unit. He''s demanding to speak to the manager and threatening to post negative reviews online.',
    8,
    5,
    34,
    71.2
),

-- Educational Simulation
(
    gen_random_uuid(),
    'Classroom Management Crisis',
    'Navigate a challenging classroom situation involving disruptive behavior, learning differences, and parent concerns while maintaining a positive learning environment.',
    (SELECT id FROM auth.users LIMIT 1),
    true,
    '[
        {"id": 1, "description": "Address disruptive behavior", "priority": "critical"},
        {"id": 2, "description": "Support struggling students", "priority": "important"},
        {"id": 3, "description": "Maintain class engagement", "priority": "important"},
        {"id": 4, "description": "Document incidents properly", "priority": "optional"}
    ]'::jsonb,
    'Peaceful classroom restored, all students engaged, learning objectives met',
    'Student sent to principal, parent complaints, or learning objectives abandoned',
    10,
    'It''s Monday morning in your 5th-grade classroom. Tommy has been acting out since the start of the school year, Sarah needs extra help with math, and you just received an email from an angry parent. Today''s lesson plan seems impossible to execute with these challenges.',
    6,
    4,
    28,
    69.8
),

-- Tech Startup Scenario
(
    gen_random_uuid(),
    'Startup Funding Pitch',
    'Present your innovative app idea to potential investors. Handle tough questions, demonstrate market understanding, and secure funding for your startup.',
    (SELECT id FROM auth.users LIMIT 1),
    true,
    '[
        {"id": 1, "description": "Present compelling value proposition", "priority": "critical"},
        {"id": 2, "description": "Answer investor questions confidently", "priority": "critical"},
        {"id": 3, "description": "Demonstrate market knowledge", "priority": "important"},
        {"id": 4, "description": "Negotiate favorable terms", "priority": "optional"}
    ]'::jsonb,
    'Secure funding commitment, establish investor relationships, maintain equity control',
    'Investors lose interest, fail to answer key questions, or accept unfavorable terms',
    12,
    'You''re in the conference room of a prestigious venture capital firm. Three partners sit across from you, laptops open, expressions neutral. You have 12 minutes to convince them that your AI-powered fitness app is worth their $2 million investment. The presentation begins now.',
    9,
    7,
    41,
    75.9
);

-- Insert characters for each scenario
-- Product Recall Crisis Characters
INSERT INTO public.scenario_characters (
    scenario_id,
    name,
    personality,
    expertise_keywords,
    role,
    backstory,
    speech_patterns,
    motivations,
    relationships,
    is_player_character
) VALUES 
(
    (SELECT id FROM public.scenarios WHERE title = 'Product Recall Crisis'),
    'Sarah Chen',
    'Analytical, calm under pressure, detail-oriented with strong communication skills',
    ARRAY['crisis management', 'public relations', 'corporate communications'],
    'VP of Communications',
    'Former journalist turned corporate communications expert with 15 years of crisis management experience',
    'Speaks clearly and concisely, asks clarifying questions, uses data to support arguments',
    'Protect company reputation while ensuring public safety',
    '{"allies": ["Legal team"], "reports_to": "CEO", "manages": "PR team"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Product Recall Crisis'),
    'Dr. Marcus Thompson',
    'Methodical, safety-focused, sometimes overly cautious but highly ethical',
    ARRAY['food safety', 'quality control', 'regulatory compliance'],
    'Chief Quality Officer',
    'Food scientist with PhD from Cornell, previously worked at FDA for 8 years',
    'Technical language, references regulations and standards, emphasizes safety protocols',
    'Ensure consumer safety above all else',
    '{"allies": ["Production team"], "collaborates_with": "Sarah Chen"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Product Recall Crisis'),
    'Alex Rivera',
    'Creative, adaptable, optimistic but can be impulsive under stress',
    ARRAY['social media', 'brand management', 'digital marketing'],
    'Social Media Manager',
    'Young marketing professional who understands digital landscape and consumer sentiment',
    'Uses current slang, thinks in terms of hashtags and viral content, speaks quickly when excited',
    'Maintain brand loyalty and positive consumer sentiment',
    '{"reports_to": "Sarah Chen", "monitors": "online sentiment"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Product Recall Crisis'),
    'You',
    'Decisive leader responsible for coordinating the crisis response',
    ARRAY['leadership', 'decision making', 'crisis coordination'],
    'Crisis Response Coordinator',
    'Senior executive brought in to manage complex crisis situations',
    'Direct and authoritative when needed, collaborative in approach',
    'Successfully navigate crisis while protecting all stakeholders',
    '{"coordinates": "all team members", "reports_to": "Board of Directors"}'::jsonb,
    true
);

-- Hospital Emergency Response Characters
INSERT INTO public.scenario_characters (
    scenario_id,
    name,
    personality,
    expertise_keywords,
    role,
    backstory,
    speech_patterns,
    motivations,
    relationships,
    is_player_character
) VALUES 
(
    (SELECT id FROM public.scenarios WHERE title = 'Hospital Emergency Response'),
    'Dr. Emily Rodriguez',
    'Experienced, calm, excellent clinical judgment, strong leader in emergencies',
    ARRAY['emergency medicine', 'trauma care', 'triage protocols'],
    'Emergency Physician',
    '12 years of emergency medicine experience, fellowship in trauma, has managed multiple mass casualty events',
    'Medical terminology, speaks with authority, gives clear orders, checks understanding',
    'Save every life possible through efficient care delivery',
    '{"leads": "medical team", "collaborates_with": "charge nurse"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Hospital Emergency Response'),
    'Nurse Jake Morrison',
    'Efficient, experienced, great under pressure, strong interpersonal skills',
    ARRAY['patient care', 'family communication', 'resource management'],
    'Senior Staff Nurse',
    '8 years in emergency nursing, known for excellent patient advocacy and family communication',
    'Compassionate but direct, explains things clearly to families, uses nursing terminology',
    'Provide excellent patient care and support families through crisis',
    '{"works_with": "all staff", "advocates_for": "patients and families"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Hospital Emergency Response'),
    'Administrator Lisa Park',
    'Organized, resource-conscious, sometimes conflicts with clinical priorities',
    ARRAY['hospital administration', 'resource allocation', 'capacity management'],
    'Hospital Administrator',
    'MBA in healthcare administration, 10 years managing hospital operations and capacity',
    'Business terminology, focuses on metrics and efficiency, asks about costs and resources',
    'Maintain hospital operations and manage resource constraints',
    '{"manages": "hospital resources", "coordinates_with": "department heads"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Hospital Emergency Response'),
    'You',
    'Charge nurse coordinating the emergency response',
    ARRAY['nursing leadership', 'patient coordination', 'team management'],
    'Charge Nurse',
    'Experienced nurse leader responsible for coordinating patient care during emergencies',
    'Clear and directive communication, medical knowledge, patient-focused',
    'Ensure optimal patient outcomes through effective coordination',
    '{"coordinates": "nursing staff", "works_with": "physicians and administration"}'::jsonb,
    true
);

-- Customer Service Challenge Characters
INSERT INTO public.scenario_characters (
    scenario_id,
    name,
    personality,
    expertise_keywords,
    role,
    backstory,
    speech_patterns,
    motivations,
    relationships,
    is_player_character
) VALUES 
(
    (SELECT id FROM public.scenarios WHERE title = 'Angry Customer Resolution'),
    'Mr. Robert Johnson',
    'Frustrated, impatient, feels wronged, but reasonable if treated with respect',
    ARRAY['technology user', 'business professional', 'customer'],
    'Upset Customer',
    'Small business owner who relies on technology for his consulting practice, stressed about upcoming presentation',
    'Speaks loudly when upset, interrupts, uses emotional language, calms down when heard',
    'Get working laptop for important presentation and prevent future problems',
    '{"frustrated_with": "company", "needs": "immediate solution"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Angry Customer Resolution'),
    'Tech Support Sam',
    'Knowledgeable, helpful, sometimes gets overwhelmed by angry customers',
    ARRAY['computer repair', 'technical diagnosis', 'customer service'],
    'Technical Support Specialist',
    'Computer science graduate, 3 years in technical support, good at diagnosing problems',
    'Technical language, asks diagnostic questions, patient but sometimes defensive',
    'Solve technical problems and help customers understand solutions',
    '{"supports": "customers", "reports_to": "service manager"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Angry Customer Resolution'),
    'Manager Patricia Wong',
    'Experienced, customer-focused, has authority to make exceptions, cost-conscious',
    ARRAY['customer service', 'retail management', 'conflict resolution'],
    'Store Manager',
    '15 years in retail management, known for finding creative solutions to customer problems',
    'Professional but warm, asks about customer needs, explains policies clearly',
    'Maintain customer satisfaction while protecting store interests',
    '{"manages": "store operations", "empowers": "customer service team"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Angry Customer Resolution'),
    'You',
    'Customer service representative handling the complaint',
    ARRAY['customer service', 'conflict resolution', 'product knowledge'],
    'Customer Service Representative',
    'Front-line customer service professional trained in de-escalation and problem-solving',
    'Empathetic listening, clear communication, professional demeanor',
    'Resolve customer issues and maintain positive relationships',
    '{"serves": "customers", "can_escalate_to": "manager"}'::jsonb,
    true
);

-- Classroom Management Crisis Characters
INSERT INTO public.scenario_characters (
    scenario_id,
    name,
    personality,
    expertise_keywords,
    role,
    backstory,
    speech_patterns,
    motivations,
    relationships,
    is_player_character
) VALUES 
(
    (SELECT id FROM public.scenarios WHERE title = 'Classroom Management Crisis'),
    'Tommy Williams',
    'Energetic, attention-seeking, struggles with focus, responds to clear boundaries',
    ARRAY['elementary student', 'behavioral challenges'],
    'Student',
    'Elementary student with ADHD who acts out when he feels overwhelmed or misunderstood',
    'Interrupts, speaks loudly, asks lots of questions, responds well to positive attention',
    'Get attention and feel successful in school',
    '{"friends": ["other students"], "struggles_with": "focus"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Classroom Management Crisis'),
    'Sarah Mitchell',
    'Quiet, hardworking, needs extra support, eager to please',
    ARRAY['elementary student', 'learning differences'],
    'Student',
    'Bright student with mild learning differences who works twice as hard as her peers',
    'Speaks softly, asks for help hesitantly, gets frustrated when she doesn''t understand',
    'Succeed academically and make her parents proud',
    '{"supported_by": "teacher", "struggles_with": "math concepts"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Classroom Management Crisis'),
    'Principal Davis',
    'Supportive, experienced, provides guidance and resources',
    ARRAY['educational leadership', 'student discipline', 'parent relations'],
    'School Principal',
    '20 years in education, former teacher who understands classroom challenges',
    'Calm and measured, asks good questions, offers practical solutions',
    'Support teachers and ensure all students succeed',
    '{"supports": "teachers", "coordinates_with": "parents"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Classroom Management Crisis'),
    'You',
    'Elementary school teacher managing classroom challenges',
    ARRAY['elementary education', 'classroom management', 'student support'],
    'Elementary Teacher',
    'Dedicated teacher working to create positive learning environment for all students',
    'Patient and encouraging, uses positive reinforcement, adapts to student needs',
    'Help every student reach their potential',
    '{"teaches": "students", "collaborates_with": "principal and parents"}'::jsonb,
    true
);

-- Startup Funding Pitch Characters
INSERT INTO public.scenario_characters (
    scenario_id,
    name,
    personality,
    expertise_keywords,
    role,
    backstory,
    speech_patterns,
    motivations,
    relationships,
    is_player_character
) VALUES 
(
    (SELECT id FROM public.scenarios WHERE title = 'Startup Funding Pitch'),
    'Victoria Sterling',
    'Sharp, analytical, asks tough questions, values data and market validation',
    ARRAY['venture capital', 'market analysis', 'financial modeling'],
    'Lead Investor',
    'Former McKinsey consultant turned VC partner, known for rigorous due diligence',
    'Direct questions, requests specific metrics, challenges assumptions',
    'Identify high-return investments with strong fundamentals',
    '{"leads": "investment decisions", "evaluates": "market opportunities"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Startup Funding Pitch'),
    'David Chen',
    'Tech-focused, interested in innovation, asks about technical implementation',
    ARRAY['technology investment', 'product development', 'scaling'],
    'Technical Partner',
    'Former CTO of successful startup, now focuses on tech investments',
    'Technical terminology, asks about architecture and scalability, focuses on implementation',
    'Find breakthrough technologies with competitive advantages',
    '{"evaluates": "technical feasibility", "advises": "portfolio companies"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Startup Funding Pitch'),
    'Amanda Foster',
    'Market-oriented, focuses on user acquisition and monetization strategies',
    ARRAY['marketing', 'user growth', 'business strategy'],
    'Marketing Partner',
    'Former VP Marketing at Fortune 500 company, expert in growth strategies',
    'Asks about customer acquisition costs, lifetime value, growth metrics',
    'Identify companies with strong growth potential and market fit',
    '{"focuses_on": "growth strategies", "evaluates": "market potential"}'::jsonb,
    false
),
(
    (SELECT id FROM public.scenarios WHERE title = 'Startup Funding Pitch'),
    'You',
    'Startup founder pitching for investment',
    ARRAY['entrepreneurship', 'product vision', 'business development'],
    'Startup Founder',
    'Passionate entrepreneur with innovative app idea seeking funding to scale',
    'Enthusiastic and confident, uses data to support claims, tells compelling story',
    'Secure funding to build and scale innovative product',
    '{"pitches_to": "investors", "leads": "company vision"}'::jsonb,
    true
);

-- Update scenario created_at to show variety
UPDATE public.scenarios SET 
    created_at = now() - (random() * interval '30 days'),
    updated_at = now() - (random() * interval '15 days')
WHERE title IN ('Product Recall Crisis', 'Hospital Emergency Response', 'Angry Customer Resolution');

-- Select confirmation
SELECT 'Mock seed data created successfully' AS status,
       COUNT(*) AS scenario_count
FROM public.scenarios
WHERE title IN ('Product Recall Crisis', 'Hospital Emergency Response', 'Angry Customer Resolution', 
                'Classroom Management Crisis', 'Startup Funding Pitch');
