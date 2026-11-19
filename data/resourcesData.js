// External Educational Resource Directory
// Curated list of verified official government portals, examination authorities, and openly accessible educational repositories.
// Follows strict legal compliance: direct outbound links to authoritative original sources, clear publisher attribution, no scraping.

export const RESOURCE_TYPES = [
  "All Types",
  "Official Mock Test",
  "Previous-Year Question Paper",
  "Official Syllabus",
  "Sample Question Paper",
  "Official Answer Key",
  "Public Question Bank",
  "Examination Notification"
];

export const VERIFIED_RESOURCES = [
  {
    id: "res_nta_mock_abhyas",
    name: "NTA National Test Abhyas (Official Free Mock Tests App & Web)",
    examination: "JEE Main & NEET UG",
    subject: "Physics, Chemistry, Maths, Biology",
    year: "2024–2025",
    resourceType: "Official Mock Test",
    sourceWebsite: "nta.ac.in/Abhyas",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2025-01-10",
    directUrl: "https://www.nta.ac.in/abhyas",
    description: "Official NTA app and portal offering full-length computer-based test (CBT) mock exams under exact examination conditions, timer, and negative marking."
  },
  {
    id: "res_jee_main_pyq_2024",
    name: "JEE Main 2024 Official Shift Question Papers with Final Answer Keys",
    examination: "JEE Main",
    subject: "PCM (Physics, Chemistry, Mathematics)",
    year: "2024",
    resourceType: "Previous-Year Question Paper",
    sourceWebsite: "jeemain.nta.nic.in",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2024-12-15",
    directUrl: "https://jeemain.nta.nic.in",
    description: "Official archive of all Session 1 & 2 question papers released by the National Testing Agency with finalized drop-questions and answer keys."
  },
  {
    id: "res_neet_ug_2024_paper",
    name: "NEET UG 2024 Official Question Paper Booklet & Final Answer Key",
    examination: "NEET UG",
    subject: "Physics, Chemistry, Biology",
    year: "2024",
    resourceType: "Previous-Year Question Paper",
    sourceWebsite: "neet.nta.nic.in",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2024-12-01",
    directUrl: "https://neet.nta.nic.in",
    description: "Official test booklet released by NTA for code-based NEET UG examination with comprehensive scoring key."
  },
  {
    id: "res_cbse_sqp_class10_2025",
    name: "CBSE Class 10 Official Sample Question Papers (SQP) & Marking Schemes",
    examination: "CBSE Class 10",
    subject: "All Subjects (Maths, Science, Social Science, English)",
    year: "2024–2025",
    resourceType: "Sample Question Paper",
    sourceWebsite: "cbseacademic.nic.in",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2025-01-05",
    directUrl: "https://cbseacademic.nic.in/sqp_classx_2024-25.html",
    description: "Official sample question papers issued by CBSE academic division detailing exact section-wise blueprint, word counts, and marking distribution."
  },
  {
    id: "res_cbse_sqp_class12_2025",
    name: "CBSE Class 12 Official Sample Question Papers & Marking Guidelines",
    examination: "CBSE Class 12",
    subject: "Physics, Chemistry, Mathematics, Biology, English",
    year: "2024–2025",
    resourceType: "Sample Question Paper",
    sourceWebsite: "cbseacademic.nic.in",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2025-01-05",
    directUrl: "https://cbseacademic.nic.in/sqp_classxii_2024-25.html",
    description: "CBSE official specimen board question papers including case-study questions, assertion-reason items, and detailed solution guidelines."
  },
  {
    id: "res_ncert_exemplar_portal",
    name: "NCERT Official Exemplar Problems & High-Order Thinking Questions",
    examination: "Class 6–12 & Foundation",
    subject: "Mathematics & Science",
    year: "Current Edition",
    resourceType: "Public Question Bank",
    sourceWebsite: "ncert.nic.in/exemplar-problems.php",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2025-01-12",
    directUrl: "https://ncert.nic.in/exemplar-problems.php",
    description: "Government-published repository of challenging analytical problems and MCQs designed to bridge textbook concepts with competitive examinations."
  },
  {
    id: "res_upsc_nda_pyq",
    name: "UPSC Official NDA & NA Previous Question Papers with Official Answer Keys",
    examination: "NDA",
    subject: "Mathematics and General Ability Test (GAT)",
    year: "2020–2024",
    resourceType: "Previous-Year Question Paper",
    sourceWebsite: "upsc.gov.in",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2024-11-20",
    directUrl: "https://upsc.gov.in/examinations/previous-question-papers",
    description: "Official Union Public Service Commission portal hosting PDF archives of Paper 1 (Maths) and Paper 2 (GAT) along with finalized answer keys."
  },
  {
    id: "res_cuet_ug_syllabus_nta",
    name: "CUET UG Official Detailed Domain-Specific Syllabus PDF Repository",
    examination: "CUET UG",
    subject: "All 27 Domain Subjects & General Test",
    year: "2024–2025",
    resourceType: "Official Syllabus",
    sourceWebsite: "cuetug.ntaonline.in",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2025-01-08",
    directUrl: "https://cuetug.ntaonline.in",
    description: "Official National Testing Agency portal listing detailed unit-by-unit syllabus and question distribution for undergraduate university entrance."
  },
  {
    id: "res_ssc_cgl_previous_papers",
    name: "SSC CGL Official Answer Keys & Question Paper Archive",
    examination: "SSC CGL",
    subject: "Tier 1: Reasoning, Quant, English, General Awareness",
    year: "2023–2024",
    resourceType: "Previous-Year Question Paper",
    sourceWebsite: "ssc.gov.in",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2024-12-10",
    directUrl: "https://ssc.gov.in",
    description: "Official Staff Selection Commission examination question paper release with normalized scoring guidelines."
  },
  {
    id: "res_swayam_moocs",
    name: "SWAYAM Government Online Courses & Question Banks (Ministry of Education)",
    examination: "Class 9–12 & University",
    subject: "All Core Disciplines",
    year: "Continuous",
    resourceType: "Public Question Bank",
    sourceWebsite: "swayam.gov.in",
    isOfficial: true,
    verifiedFree: true,
    lastCheckedDate: "2025-01-14",
    directUrl: "https://swayam.gov.in",
    description: "Government of India national education platform created to provide free access to curriculum modules, self-assessment quizzes, and video lectures."
  }
];
