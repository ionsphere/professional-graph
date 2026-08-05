window.ProfessionalModel = (() => {
  const dimensions = {
    abstractReasoning:'Abstract reasoning', quantitative:'Quantitative reasoning', investigation:'Investigation', systems:'Systems thinking',
    building:'Building and repair', technology:'Technology', creativity:'Creative expression', design:'Design', writing:'Writing and language',
    teaching:'Teaching', care:'Care and support', persuasion:'Persuasion', leadership:'Leadership', organization:'Organization', detail:'Attention to detail',
    risk:'Risk and urgency', movement:'Physical movement', outdoors:'Outdoor work', social:'Social interaction', autonomy:'Autonomy'
  };
  const V=(...pairs)=>Object.fromEntries(pairs);
  const sectors = [
    {id:'computing',label:'Computing & Digital',hue:210,traits:V(['systems',.9],['technology',1],['abstractReasoning',.7],['building',.5]),groups:[
      ['Software Engineering',['Frontend Developer','Backend Developer','Mobile App Developer','Embedded Software Engineer','Game Developer'],V(['building',.8],['systems',.85])],
      ['Data & AI',['Data Analyst','Data Engineer','Data Scientist','Machine Learning Engineer','AI Research Scientist'],V(['quantitative',.8],['investigation',.8])],
      ['Infrastructure & Security',['Cloud Engineer','Site Reliability Engineer','Network Engineer','Cybersecurity Analyst','Database Administrator'],V(['detail',.7],['risk',.45])],
      ['Digital Product',['Product Manager','UX Researcher','UX Designer','Technical Writer','QA Engineer'],V(['design',.65],['social',.55],['organization',.55])]
    ]},
    {id:'mathematics',label:'Mathematics & Statistics',hue:260,traits:V(['abstractReasoning',1],['quantitative',1],['investigation',.75],['detail',.65]),groups:[
      ['Pure Mathematics',['Algebraist','Geometer','Number Theorist','Topologist','Mathematical Logic Researcher'],V(['abstractReasoning',1],['autonomy',.6])],
      ['Applied Mathematics',['Applied Mathematician','Operations Research Analyst','Cryptographer','Computational Mathematician','Mathematical Modeler'],V(['systems',.75],['technology',.45])],
      ['Statistics',['Statistician','Biostatistician','Survey Statistician','Econometrician','Sports Statistician'],V(['investigation',.8],['detail',.75])],
      ['Actuarial & Quantitative Finance',['Actuary','Quantitative Analyst','Risk Modeler','Financial Engineer','Pricing Analyst'],V(['risk',.55],['organization',.55])]
    ]},
    {id:'natural-science',label:'Natural Sciences',hue:285,traits:V(['investigation',1],['abstractReasoning',.75],['detail',.65]),groups:[
      ['Physics & Space',['Physicist','Astronomer','Astrophysicist','Optical Scientist','Particle Physicist'],V(['quantitative',.8])],
      ['Chemistry & Materials',['Chemist','Materials Scientist','Polymer Scientist','Food Chemist','Laboratory Scientist'],V(['building',.3],['risk',.3])],
      ['Life Sciences',['Biologist','Microbiologist','Geneticist','Neuroscientist','Marine Biologist'],V(['care',.25],['outdoors',.3])],
      ['Earth & Environment',['Geologist','Meteorologist','Environmental Scientist','Hydrologist','Climate Scientist'],V(['outdoors',.65],['systems',.6])]
    ]},
    {id:'engineering',label:'Engineering',hue:225,traits:V(['building',1],['systems',.9],['quantitative',.75],['technology',.7]),groups:[
      ['Mechanical & Industrial',['Mechanical Engineer','Industrial Engineer','Manufacturing Engineer','Robotics Engineer','Aerospace Engineer'],V(['detail',.65])],
      ['Electrical & Electronic',['Electrical Engineer','Electronics Engineer','Control Systems Engineer','Power Systems Engineer','Semiconductor Engineer'],V(['abstractReasoning',.65])],
      ['Civil & Built Environment',['Civil Engineer','Structural Engineer','Transportation Engineer','Geotechnical Engineer','Surveying Engineer'],V(['outdoors',.45],['organization',.5])],
      ['Chemical & Biomedical',['Chemical Engineer','Biomedical Engineer','Materials Engineer','Process Engineer','Environmental Engineer'],V(['investigation',.55],['care',.25])]
    ]},
    {id:'health',label:'Health & Medicine',hue:350,traits:V(['care',1],['investigation',.65],['social',.7],['detail',.75]),groups:[
      ['Physicians',['Family Physician','Surgeon','Pediatrician','Psychiatrist','Radiologist'],V(['risk',.65],['leadership',.45])],
      ['Nursing & Direct Care',['Registered Nurse','Nurse Practitioner','Midwife','Paramedic','Medical Assistant'],V(['movement',.6],['risk',.65])],
      ['Therapy & Rehabilitation',['Physical Therapist','Occupational Therapist','Speech Therapist','Respiratory Therapist','Audiologist'],V(['teaching',.55],['social',.8])],
      ['Diagnostics & Pharmacy',['Pharmacist','Medical Laboratory Technologist','Radiology Technologist','Sonographer','Pathologist Assistant'],V(['detail',.9],['technology',.45])]
    ]},
    {id:'social-science',label:'Social & Behavioral Sciences',hue:310,traits:V(['investigation',.75],['social',.7],['writing',.55],['care',.45]),groups:[
      ['Psychology',['Clinical Psychologist','Research Psychologist','Neuropsychologist','Organizational Psychologist','School Psychologist'],V(['care',.7],['investigation',.8])],
      ['Society & Culture',['Sociologist','Anthropologist','Archaeologist','Demographer','Criminologist'],V(['outdoors',.25],['writing',.65])],
      ['Economics & Policy',['Economist','Policy Analyst','Political Scientist','Public Administration Researcher','Development Economist'],V(['quantitative',.55],['systems',.65])],
      ['Human Services',['Social Worker','Marriage Counselor','Substance Abuse Counselor','Community Organizer','Case Manager'],V(['care',1],['social',.9])]
    ]},
    {id:'education',label:'Education & Learning',hue:48,traits:V(['teaching',1],['social',.85],['care',.6],['organization',.5]),groups:[
      ['School Teaching',['Primary Teacher','Secondary Teacher','Special Education Teacher','Language Teacher','STEM Teacher'],V(['leadership',.45])],
      ['Higher Education',['Professor','Lecturer','Academic Researcher','Laboratory Instructor','Academic Advisor'],V(['investigation',.6],['writing',.55])],
      ['Learning Design',['Instructional Designer','Curriculum Developer','Corporate Trainer','Education Technologist','Assessment Specialist'],V(['design',.55],['technology',.4])],
      ['Libraries & Museums',['Librarian','Archivist','Museum Educator','Curator','Conservator'],V(['detail',.7],['organization',.7])]
    ]},
    {id:'arts',label:'Arts, Media & Design',hue:25,traits:V(['creativity',1],['design',.8],['autonomy',.55]),groups:[
      ['Visual Design',['Graphic Designer','Illustrator','Animator','Industrial Designer','Fashion Designer'],V(['technology',.4],['detail',.55])],
      ['Writing & Publishing',['Writer','Journalist','Editor','Copywriter','Screenwriter'],V(['writing',1],['investigation',.4])],
      ['Film & Performance',['Actor','Film Director','Cinematographer','Theater Director','Producer'],V(['social',.65],['leadership',.5])],
      ['Music & Audio',['Musician','Composer','Sound Engineer','Music Producer','Conductor'],V(['technology',.35],['leadership',.35])]
    ]},
    {id:'business',label:'Business & Management',hue:150,traits:V(['leadership',.85],['organization',.75],['social',.7],['persuasion',.7]),groups:[
      ['Strategy & Operations',['Management Consultant','Operations Manager','Project Manager','Supply Chain Manager','Business Analyst'],V(['systems',.65],['quantitative',.45])],
      ['Finance & Accounting',['Accountant','Auditor','Financial Analyst','Investment Analyst','Treasury Manager'],V(['detail',.85],['quantitative',.65])],
      ['Marketing & Sales',['Marketing Manager','Sales Manager','Brand Strategist','Market Research Analyst','Advertising Specialist'],V(['creativity',.5],['persuasion',.95])],
      ['People & Organizations',['Human Resources Manager','Recruiter','Compensation Analyst','Learning Manager','Organizational Development Specialist'],V(['care',.4],['social',.9])]
    ]},
    {id:'law-public',label:'Law & Public Service',hue:190,traits:V(['writing',.75],['persuasion',.65],['organization',.65],['social',.55]),groups:[
      ['Law',['Lawyer','Judge','Paralegal','Legal Researcher','Mediator'],V(['abstractReasoning',.7],['detail',.8])],
      ['Government & Diplomacy',['Diplomat','Policy Officer','City Manager','Legislative Analyst','Foreign Service Officer'],V(['systems',.55],['leadership',.55])],
      ['Public Safety',['Police Officer','Firefighter','Emergency Manager','Military Officer','Intelligence Analyst'],V(['risk',1],['movement',.6])],
      ['Planning & Inspection',['Urban Planner','Building Inspector','Environmental Health Inspector','Code Enforcement Officer','Transportation Planner'],V(['outdoors',.35],['detail',.7])]
    ]},
    {id:'trades',label:'Skilled Trades & Construction',hue:10,traits:V(['building',1],['movement',.85],['detail',.6]),groups:[
      ['Building Trades',['Carpenter','Electrician','Plumber','HVAC Technician','Roofer'],V(['outdoors',.45])],
      ['Metal & Fabrication',['Welder','Machinist','Sheet Metal Worker','Toolmaker','CNC Operator'],V(['technology',.35],['risk',.35])],
      ['Vehicle & Equipment',['Auto Mechanic','Aircraft Mechanic','Diesel Mechanic','Heavy Equipment Technician','Bicycle Mechanic'],V(['systems',.55])],
      ['Construction Leadership',['Construction Manager','Site Supervisor','Estimator','Safety Inspector','Building Surveyor'],V(['leadership',.6],['organization',.7])]
    ]},
    {id:'transport',label:'Transport & Logistics',hue:95,traits:V(['movement',.9],['organization',.65],['risk',.55]),groups:[
      ['Road Transport',['Truck Driver','Bus Driver','Taxi Driver','Ride-share Driver','Delivery Driver'],V(['autonomy',.55])],
      ['Air Transport',['Airline Pilot','Helicopter Pilot','Air Traffic Controller','Flight Dispatcher','Aircraft Loadmaster'],V(['technology',.65],['detail',.85])],
      ['Rail & Maritime',['Train Operator','Railway Dispatcher','Ship Captain','Marine Engineer','Deck Officer'],V(['systems',.55],['outdoors',.4])],
      ['Logistics',['Logistics Planner','Warehouse Manager','Freight Broker','Fleet Manager','Customs Broker'],V(['organization',.9],['persuasion',.4])]
    ]},
    {id:'agriculture',label:'Agriculture & Environment',hue:115,traits:V(['outdoors',1],['movement',.75],['building',.45]),groups:[
      ['Plant & Land',['Farmer','Horticulturist','Arborist','Landscape Technician','Soil Scientist'],V(['investigation',.35])],
      ['Animals',['Veterinarian','Veterinary Technician','Animal Trainer','Zoologist','Livestock Manager'],V(['care',.75])],
      ['Forestry & Conservation',['Forester','Park Ranger','Conservation Scientist','Wildlife Biologist','Environmental Restoration Specialist'],V(['investigation',.55])],
      ['Food Production',['Agricultural Engineer','Food Production Manager','Agricultural Inspector','Winemaker','Aquaculture Manager'],V(['organization',.55],['technology',.35])]
    ]},
    {id:'service',label:'Service & Hospitality',hue:330,traits:V(['social',.9],['care',.55],['movement',.55]),groups:[
      ['Food & Hospitality',['Chef','Baker','Restaurant Manager','Hotel Manager','Sommelier'],V(['creativity',.45],['organization',.55])],
      ['Personal Services',['Barber','Cosmetologist','Massage Therapist','Fitness Trainer','Personal Stylist'],V(['care',.65],['autonomy',.5])],
      ['Travel & Events',['Event Planner','Tour Guide','Travel Advisor','Flight Attendant','Conference Coordinator'],V(['organization',.65],['risk',.25])],
      ['Customer & Security',['Customer Support Specialist','Security Guard','Concierge','Property Manager','Funeral Director'],V(['detail',.45],['risk',.35])]
    ]}
  ];

  const questionSets = {
    abstractReasoning:['I enjoy working with ideas that have no immediate physical form.','I like proving why a rule must be true.','Abstract symbols and formal logic feel satisfying rather than intimidating.','I enjoy discovering hidden structure in complicated concepts.','I would happily spend hours thinking through a difficult theoretical problem.'],
    quantitative:['I enjoy using numbers to compare competing explanations.','I like estimating quantities and checking whether results are plausible.','I enjoy finding patterns in numerical data.','Probability and uncertainty are interesting to me.','I prefer decisions supported by measurement rather than intuition alone.'],
    investigation:['I enjoy gathering evidence before forming a conclusion.','I like designing tests that could prove an idea wrong.','I enjoy finding the cause of an unexpected result.','Researching an unfamiliar topic deeply is appealing.','I like questions whose answers are not yet known.'],
    systems:['I naturally think about how parts influence one another.','I enjoy tracing failures across a complex system.','I like improving processes with many dependencies.','I enjoy modeling feedback loops and second-order effects.','I notice when optimizing one part could harm the whole.'],
    building:['I enjoy making or repairing tangible things.','Using tools to turn a plan into a working object is satisfying.','I like diagnosing mechanical or structural problems.','I would rather prototype something than only discuss it.','I enjoy seeing a physical result at the end of the day.'],
    technology:['I enjoy learning how unfamiliar technology works.','Configuring technical systems feels rewarding.','I like automating repetitive work.','I enjoy keeping up with rapidly changing tools.','I am comfortable troubleshooting devices or software.'],
    creativity:['I enjoy inventing original visual, musical, or narrative ideas.','I like work where there can be many good answers.','Expressing a distinctive personal style matters to me.','I enjoy transforming ordinary material into something surprising.','I would choose originality over strict convention when appropriate.'],
    design:['I notice how shape, layout, and interaction affect people.','I enjoy balancing usefulness, beauty, and constraints.','I like refining a rough concept through repeated prototypes.','I enjoy imagining how another person will experience a product or space.','Small details of presentation matter to me.'],
    writing:['I enjoy choosing precise words for difficult ideas.','I like organizing information into a clear narrative.','Editing unclear writing is satisfying.','I enjoy interviewing, documenting, or explaining through text.','I care about tone, nuance, and language.'],
    teaching:['I enjoy explaining a concept in several different ways.','Helping someone develop a skill is rewarding.','I like noticing exactly where another person became confused.','I would enjoy designing lessons or learning exercises.','I am patient when understanding takes repeated attempts.'],
    care:['Supporting someone through illness or distress feels meaningful.','I notice other people’s emotional or physical needs.','I would accept inconvenience to improve another person’s wellbeing.','I am comfortable with work involving vulnerability and trust.','I value direct human benefit more than prestige.'],
    persuasion:['I enjoy convincing others when I believe in an idea.','Negotiation feels energizing rather than uncomfortable.','I like adapting a message to different audiences.','I am comfortable asking people to make a decision.','I enjoy creating enthusiasm around an opportunity.'],
    leadership:['I am willing to take responsibility for a group outcome.','I enjoy setting direction when priorities conflict.','Making decisions for a team feels natural.','I like coordinating people around a shared goal.','I am comfortable being accountable when a plan fails.'],
    organization:['I enjoy turning a vague goal into a sequence of steps.','Schedules, records, and checklists help me think.','I like coordinating deadlines and resources.','I notice missing information before it becomes a problem.','Closing loops and finishing tasks is satisfying.'],
    detail:['I notice small errors that others overlook.','I enjoy work requiring exact standards.','Checking accuracy repeatedly does not bother me.','I prefer careful verification before release.','I can sustain attention on precise repetitive tasks.'],
    risk:['I can make consequential decisions with incomplete information.','Urgent situations sharpen my focus.','I remain functional when mistakes could have serious consequences.','I am comfortable working around controlled hazards.','I would accept responsibility during emergencies.'],
    movement:['I prefer moving around to sitting at one desk all day.','Physical activity makes a workday more satisfying.','I enjoy operating vehicles, equipment, or tools.','I like work that changes location during the day.','I would rather act directly than spend all day in meetings.'],
    outdoors:['I enjoy working outside in changing conditions.','Weather and dirt would not automatically discourage me.','I like observing natural or built environments firsthand.','Fieldwork is more appealing than only reviewing reports.','I would enjoy caring for land, plants, animals, or infrastructure.'],
    social:['Frequent interaction with many people gives me energy.','I enjoy meeting unfamiliar people as part of work.','I like understanding what different people need.','Collaborative work is usually more satisfying than solitary work.','I am comfortable handling disagreement face to face.'],
    autonomy:['I prefer deciding how to approach my work.','I am comfortable working without frequent supervision.','Owning a result from start to finish is appealing.','I like setting my own priorities when possible.','Independent responsibility motivates me.']
  };
  const questions=[];
  Object.entries(questionSets).forEach(([dimension,texts])=>texts.forEach((text,i)=>questions.push({id:`${dimension}-${i+1}`,text,weights:{[dimension]:1},dimension})));
  return { dimensions, sectors, questions };
})();
