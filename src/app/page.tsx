"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Briefcase, 
  Award, 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Compass, 
  AlertTriangle, 
  Sliders, 
  Search, 
  Database, 
  RefreshCw, 
  Play, 
  Check, 
  X, 
  ChevronRight, 
  Info, 
  ArrowUpRight, 
  ArrowUp, 
  ArrowDown, 
  ArrowRight,
  User,
  ShieldAlert,
  Eye,
  EyeOff,
  DollarSign,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Inline SVG components for brand icons to ensure 100% type-safety & no library mismatch
const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ==========================================
// MOCK DATA FOR LOCAL FALLBACK
// ==========================================
const MOCK_JD = {
  role: "Senior Data Platform Engineer",
  must_have_skills: ["Python", "Spark", "AWS", "SQL"],
  nice_to_have_skills: ["Kafka", "Snowflake", "Docker"],
  experience_years: 5,
  seniority: "Senior",
  leadership: true,
  domain: "Data Engineering",
  communication_skills: "Excellent communication and team leadership skills",
  expected_outcomes: [
    "Scale real-time data streaming pipelines to handle 10B+ daily events.",
    "Migrate legacy Spark clusters on-premise to AWS EMR & Snowflake.",
    "Mentor 4 junior and mid-level data engineers."
  ],
  hidden_requirements: [
    "High architectural ownership",
    "Experience with microservices orchestration"
  ]
};

const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "Sarah Connor",
    email: "sarah.connor@skyline.io",
    phone: "+1 (555) 019-2831",
    github_url: "https://github.com/sarahconnor",
    linkedin_url: "https://linkedin.com/in/sarahconnor",
    overall_score: 89.2,
    semantic_fit: 82.0,
    experience_relevance: 85.0,
    career_growth: 92.0,
    skill_freshness: 90.0,
    project_impact: 95.0,
    learning_velocity: 96.0,
    potential_to_hire: 95.0,
    behavioral_score: 95.0,
    risk_penalty: 0.0,
    digital_twin: {
      archetype: "Emerging Technical Leader",
      strengths: [
        "Rapidly acquires new technologies (React/Node -> Python/AWS/ML in 2 years)",
        "Strong progression from Engineer to Senior Engineer with leadership responsibilities",
        "Exceptional project impact - architected real-time patient diagnosis ML pipeline"
      ],
      weaknesses: [
        "Limited formal people management exposure",
        "Less experience with legacy on-premise relational database warehouses"
      ],
      growth_prediction: [
        "Ready to transition from Senior Engineer to Tech Lead / Architect within 12 months.",
        "Excellent match for technology direction shifts (e.g. AWS & real-time streaming)."
      ]
    },
    resume_summary: "Highly progressive software engineer with core expertise in Python, React, and cloud migrations. Rapid learning curve and strong record of project ownership.",
    skills: [
      { skill_name: "Python", years_used: 3.5, last_used: 2026 },
      { skill_name: "AWS", years_used: 3.0, last_used: 2026 },
      { skill_name: "React", years_used: 4.0, last_used: 2025 },
      { skill_name: "Node.js", years_used: 3.0, last_used: 2024 },
      { skill_name: "SQL", years_used: 4.5, last_used: 2026 },
      { skill_name: "Docker", years_used: 2.0, last_used: 2026 },
      { skill_name: "PyTorch", years_used: 1.5, last_used: 2025 }
    ],
    experiences: [
      {
        company: "Nexus AI Solutions",
        role: "Senior Software Engineer & Team Lead",
        start_date: "2024",
        end_date: "Present",
        duration_years: 2.0,
        description: "Lead developer for healthcare diagnostics platform. Managed a team of 4. Architected pipeline parsing and indexing using Python, AWS Lambda, and PyTorch, improving latency by 35%."
      },
      {
        company: "ByteCraft Corp",
        role: "Software Engineer",
        start_date: "2022",
        end_date: "2024",
        duration_years: 2.0,
        description: "Built responsive frontend UI and API endpoints using React, TypeScript, and Node.js. Integrated standard SQL databases and optimized search query execution."
      }
    ],
    projects: [
      {
        title: "AI Patient Diagnostic Pipeline",
        description: "Designed a secure ML pipeline processing 200k patient records daily. Combined PyTorch models with AWS services, ensuring HIPAA compliance.",
        impact_score: 9.5
      },
      {
        title: "Legacy Cloud Migration",
        description: "Migrated on-prem Node services to serverless AWS ECS containers, reducing hosting costs by 40%.",
        impact_score: 9.0
      }
    ]
  },
  {
    id: 2,
    name: "John Doe",
    email: "john.doe@dataworks.com",
    phone: "+1 (555) 014-9922",
    github_url: "https://github.com/johndoe",
    linkedin_url: "https://linkedin.com/in/johndoe",
    overall_score: 83.4,
    semantic_fit: 95.0,
    experience_relevance: 98.0,
    career_growth: 65.0,
    skill_freshness: 75.0,
    project_impact: 80.0,
    learning_velocity: 52.0,
    potential_to_hire: 58.0,
    behavioral_score: 70.0,
    risk_penalty: 5.0,
    digital_twin: {
      archetype: "Deep Domain Specialist",
      strengths: [
        "Extensive experience (6+ years) purely in Data Engineering and Pipelines",
        "Direct match for must-have skills: Python, Spark, AWS, and SQL",
        "Stable work history with deep institutional knowledge"
      ],
      weaknesses: [
        "Stagnant skill growth - has not adopted new tech/frameworks since 2021",
        "Limited progression in roles (remained in same title for 6 years)"
      ],
      growth_prediction: [
        "Best suited as a technical individual contributor focused on stable infrastructure.",
        "Low likelihood of successful rapid transition into cross-functional management or fresh technology domains."
      ]
    },
    resume_summary: "Experienced Data Engineer specializing in ETL pipeline design, Spark clusters, and database optimization. Solid foundations in AWS and relational databases.",
    skills: [
      { skill_name: "Python", years_used: 6.0, last_used: 2026 },
      { skill_name: "Spark", years_used: 5.0, last_used: 2025 },
      { skill_name: "AWS", years_used: 5.5, last_used: 2025 },
      { skill_name: "SQL", years_used: 7.0, last_used: 2026 },
      { skill_name: "Snowflake", years_used: 2.0, last_used: 2024 }
    ],
    experiences: [
      {
        company: "Enterprise DataWorks",
        role: "Data Engineer",
        start_date: "2020",
        end_date: "Present",
        duration_years: 6.0,
        description: "Maintain core data warehouse pipelines using Apache Spark and Scala/Python. Orchestrated tasks via Airflow and managed AWS EMR clusters. Handled PostgreSQL performance tuning."
      }
    ],
    projects: [
      {
        title: "Enterprise ETL Spark pipeline",
        description: "Optimized daily batch processes, cutting processing window from 8 hours to 4.5 hours for 50TB datasets.",
        impact_score: 8.0
      }
    ]
  },
  {
    id: 3,
    name: "Mike Ross",
    email: "mike.ross@fullstack.dev",
    phone: "+1 (555) 012-7744",
    github_url: "https://github.com/mikeross",
    linkedin_url: "https://linkedin.com/in/mikeross",
    overall_score: 78.6,
    semantic_fit: 85.0,
    experience_relevance: 70.0,
    career_growth: 80.0,
    skill_freshness: 88.0,
    project_impact: 82.0,
    learning_velocity: 88.0,
    potential_to_hire: 82.0,
    behavioral_score: 85.0,
    risk_penalty: 15.0, // High job hopper penalty
    digital_twin: {
      archetype: "Versatile Full-Stack Builder",
      strengths: [
        "Broad skill coverage across React, Next.js, Node, Python, and GCP",
        "High learning velocity with constant adoption of modern frameworks",
        "Strong individual contributor who builds customer-facing features quickly"
      ],
      weaknesses: [
        "Frequent job hopping (3 jobs in 4 years) indicates retention risk",
        "Less depth in specific enterprise data streaming (Spark/Kafka)"
      ],
      growth_prediction: [
        "Highly productive in product-focused startups. Needs structured retention paths.",
        "Expected progression: Senior Full Stack Developer within 1-2 years."
      ]
    },
    resume_summary: "Versatile developer with a passion for web engineering and serverless architectures. Experienced in building full-stack products with React, Node.js, and GCP.",
    skills: [
      { skill_name: "Python", years_used: 2.0, last_used: 2025 },
      { skill_name: "React", years_used: 4.0, last_used: 2026 },
      { skill_name: "Next.js", years_used: 2.0, last_used: 2026 },
      { skill_name: "Node.js", years_used: 3.5, last_used: 2025 },
      { skill_name: "SQL", years_used: 3.0, last_used: 2026 },
      { skill_name: "Docker", years_used: 1.5, last_used: 2024 },
      { skill_name: "GCP", years_used: 2.0, last_used: 2025 }
    ],
    experiences: [
      {
        company: "SaaS Launchpad",
        role: "Full Stack Engineer",
        start_date: "2025",
        end_date: "Present",
        duration_years: 1.2,
        description: "Built customer onboarding portals using Next.js, Tailwind, and serverless Node.js backend. Spearheaded GraphQL API integrations."
      },
      {
        company: "CloudBound Labs",
        role: "Software Developer",
        start_date: "2024",
        end_date: "2025",
        duration_years: 1.0,
        description: "Developed and deployed cloud functions on GCP. Built admin dashboards using React and integrated analytics libraries."
      },
      {
        company: "WebCraft Studio",
        role: "Junior Developer",
        start_date: "2022",
        end_date: "2024",
        duration_years: 1.8,
        description: "Assisted in building client websites. Managed Wordpress custom themes, styling, and basic SQL updates."
      }
    ],
    projects: [
      {
        title: "Real-time SaaS Collaborative Board",
        description: "Created a collaborative canvas utilizing websockets and Next.js, hosting 5k active sessions simultaneously.",
        impact_score: 8.5
      }
    ]
  },
  {
    id: 4,
    name: "Emily Watson",
    email: "emily.w@growingtech.co",
    phone: "+1 (555) 018-4499",
    github_url: "https://github.com/emilywatson",
    linkedin_url: "https://linkedin.com/in/emilywatson",
    overall_score: 75.8,
    semantic_fit: 72.0,
    experience_relevance: 55.0,
    career_growth: 88.0,
    skill_freshness: 92.0,
    project_impact: 85.0,
    learning_velocity: 94.0,
    potential_to_hire: 91.0,
    behavioral_score: 80.0,
    risk_penalty: 0.0,
    digital_twin: {
      archetype: "High-Velocity Adaptor",
      strengths: [
        "Exceptional learning speed (Javascript -> Next.js -> Python/FastAPI in 1.5 years)",
        "Proactive builder - won 2 hackathons and created popular open source tools",
        "Strong career growth trajectory from Intern to core developer"
      ],
      weaknesses: [
        "Fewer years of total experience (under 2 years total)",
        "Missing enterprise-level cloud scaling and microservices architecture knowledge"
      ],
      growth_prediction: [
        "High potential future star. Expected to reach Senior Engineer level in half the traditional time.",
        "Excellent fit for fast-moving product teams exploring new tech stacks (like LLMs/FastAPI)."
      ]
    },
    resume_summary: "Rapidly evolving developer with core focus on React, Python, and AI integrations. Dynamic builder, hackathon winner, and open-source contributor.",
    skills: [
      { skill_name: "Python", years_used: 1.5, last_used: 2026 },
      { skill_name: "React", years_used: 2.0, last_used: 2026 },
      { skill_name: "Next.js", years_used: 1.5, last_used: 2026 },
      { skill_name: "FastAPI", years_used: 1.0, last_used: 2025 },
      { skill_name: "SQL", years_used: 2.0, last_used: 2026 },
      { skill_name: "OpenAI API", years_used: 1.0, last_used: 2026 }
    ],
    experiences: [
      {
        company: "InnovateTech",
        role: "Junior Full Stack Engineer",
        start_date: "2025",
        end_date: "Present",
        duration_years: 1.5,
        description: "Build generative AI features into the core SaaS tool. Wrote backend scrapers and endpoints in FastAPI, frontend components in React."
      },
      {
        company: "Sprint Systems",
        role: "Software Engineer Intern",
        start_date: "2024",
        end_date: "2025",
        duration_years: 0.5,
        description: "Assisted in code refactoring and writing unit tests in Javascript and Python. Handled basic bug fixes."
      }
    ],
    projects: [
      {
        title: "GenAI Customer Support Agent",
        description: "Created a retrieval-augmented generation (RAG) chatbot using FastAPI and OpenAI API, deflecting 45% of support tickets.",
        impact_score: 9.0
      }
    ]
  }
];

const DEFAULT_WEIGHTS = {
  semantic_fit: 30,
  experience_relevance: 15,
  career_growth: 10,
  skill_freshness: 10,
  project_impact: 10,
  learning_velocity: 10,
  potential_to_hire: 10,
  behavioral_score: 5
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [jdText, setJdText] = useState("");
  const [uploadedJd, setUploadedJd] = useState<any>(null);
  const [uploadingJd, setUploadingJd] = useState(false);
  
  // Resumes upload state
  const [resumes, setResumes] = useState<File[]>([]);
  const [uploadingResumes, setUploadingResumes] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  
  // Candidate list and details
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [githubStats, setGithubStats] = useState<any>(null);
  const [loadingGithubStats, setLoadingGithubStats] = useState<boolean>(false);
  
  // Simulator weights & filters
  const [weights, setWeights] = useState<any>(DEFAULT_WEIGHTS);
  const [mustHaveSkills, setMustHaveSkills] = useState<string[]>([]);
  const [selectedMustHaves, setSelectedMustHaves] = useState<string[]>([]);
  const [minExpYears, setMinExpYears] = useState<number>(3);
  const [seniorityFilter, setSeniorityFilter] = useState<string>("All");
  
  // Rank movement tracking for simulator
  const [rankMovements, setRankMovements] = useState<Record<string, { prev: number; current: number }>>({});

  // NEW: De-Bias Mode toggle
  const [debiasMode, setDebiasMode] = useState(false);

  // NEW: Budget Slider for What-If Simulator (low 0-100 high)
  const [budgetLevel, setBudgetLevel] = useState(50);
  const [showBudgetImpact, setShowBudgetImpact] = useState(false);

  // Helper: De-Bias masking function
  const debiasText = (text: string, isEmail: boolean = false) => {
    if (!debiasMode) return text;
    if (isEmail) return "***@***.***";
    return "Candidate " + Math.random().toString(36).substring(7).toUpperCase();
  };

  // Helper: Apply budget-based weight adjustments
  const getBudgetAdjustedWeights = () => {
    const adjusted = { ...weights };
    if (budgetLevel < 50) {
      adjusted.learning_velocity = Math.min(0.25, weights.learning_velocity + 0.05);
      adjusted.career_growth = Math.min(0.15, weights.career_growth + 0.05);
      adjusted.experience_relevance = Math.max(0.08, weights.experience_relevance - 0.05);
    } else if (budgetLevel > 50) {
      adjusted.experience_relevance = Math.min(0.25, weights.experience_relevance + 0.05);
      adjusted.learning_velocity = Math.max(0.05, weights.learning_velocity - 0.05);
    }
    return adjusted;
  };

  const loadMockGithubStats = (candidate: any) => {
    const candidateSkills = candidate.skills.map((s: any) => s.skill_name);
    const mainLang = candidateSkills[0] || "Python";
    const otherLang = candidateSkills[1] || "TypeScript";
    const username = candidate.name.toLowerCase().replace(/\s+/g, "");
    
    setGithubStats({
      has_github: true,
      username: username,
      public_repos: 12,
      followers: 18,
      engagement_score: 75.0,
      repos: [
        {
          name: `${mainLang.toLowerCase()}-performance-tuner`,
          description: `Optimized execution engine and memory pool allocators written in ${mainLang}.`,
          language: mainLang,
          stars: 48,
          forks: 12,
          updated_at: "2026-06-10T12:00:00Z",
          url: `https://github.com/${username}/${mainLang.toLowerCase()}-performance-tuner`
        },
        {
          name: "distributed-task-runner",
          description: "Distributed workflow scheduler with low-latency communication layer.",
          language: otherLang,
          stars: 22,
          forks: 4,
          updated_at: "2026-06-15T08:30:00Z",
          url: `https://github.com/${username}/distributed-task-runner`
        },
        {
          name: "custom-db-indexer",
          description: "Key-value indexing service optimized for transactional write streams.",
          language: "SQL",
          stars: 8,
          forks: 1,
          updated_at: "2026-04-12T10:00:00Z",
          url: `https://github.com/${username}/custom-db-indexer`
        }
      ],
      languages: {
        [mainLang]: 18,
        [otherLang]: 9,
        "SQL": 5,
        "Shell": 2
      },
      is_mock: true
    });
    setLoadingGithubStats(false);
  };

  useEffect(() => {
    if (!selectedCandidate) {
      setGithubStats(null);
      return;
    }
    
    setLoadingGithubStats(true);
    if (backendStatus === "connected") {
      fetch(`http://127.0.0.1:8000/api/candidates/${selectedCandidate.id}/github-stats`)
        .then(res => res.json())
        .then(data => {
          setGithubStats(data);
          setLoadingGithubStats(false);
        })
        .catch(err => {
          console.error("Failed to fetch github stats", err);
          loadMockGithubStats(selectedCandidate);
        });
    } else {
      loadMockGithubStats(selectedCandidate);
    }
  }, [selectedCandidate, backendStatus]);

  // 1. Health check to connect with Python Backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health")
      .then(res => res.json())
      .then(data => {
        if (data.status === "healthy") {
          setBackendStatus("connected");
          loadBackendData();
        } else {
          setBackendStatus("fallback");
          loadFallbackData();
        }
      })
      .catch(() => {
        setBackendStatus("fallback");
        loadFallbackData();
      });
  }, []);

  const loadBackendData = () => {
    // Fetch Job Description
    fetch("http://127.0.0.1:8000/api/job-description")
      .then(res => res.json())
      .then(data => {
        if (data && data.role) {
          setUploadedJd(data);
          setJdText(data.raw_text || "");
          setMustHaveSkills(data.must_have_skills || []);
          setSelectedMustHaves(data.must_have_skills || []);
          setMinExpYears(data.experience_years || 3);
        }
      });

    // Fetch Candidates
    fetch("http://127.0.0.1:8000/api/candidates")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCandidates(data);
        }
      });
  };

  const loadFallbackData = () => {
    setUploadedJd(MOCK_JD);
    setJdText(
      `Role: ${MOCK_JD.role}\n\nRequired Skills: ${MOCK_JD.must_have_skills.join(", ")}\nNice to Have: ${MOCK_JD.nice_to_have_skills.join(", ")}\nExperience: ${MOCK_JD.experience_years}+ years\nSeniority: ${MOCK_JD.seniority}\nLeadership Expected: Yes\nDomain: ${MOCK_JD.domain}\n\nExpected Outcomes:\n- ${MOCK_JD.expected_outcomes.join("\n- ")}`
    );
    setMustHaveSkills(MOCK_JD.must_have_skills);
    setSelectedMustHaves(MOCK_JD.must_have_skills);
    setMinExpYears(MOCK_JD.experience_years);
    setCandidates(MOCK_CANDIDATES);
  };

  // 2. Upload Job Description
  const handleJdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;

    setUploadingJd(true);
    if (backendStatus === "connected") {
      try {
        const formData = new FormData();
        formData.append("text", jdText);
        
        const res = await fetch("http://127.0.0.1:8000/api/job-description", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        
        setUploadedJd(data);
        setMustHaveSkills(data.must_have_skills || []);
        setSelectedMustHaves(data.must_have_skills || []);
        setMinExpYears(data.experience_years || 3);
        
        // Reload candidates as they get auto re-evaluated in backend
        const candRes = await fetch("http://127.0.0.1:8000/api/candidates");
        const candData = await candRes.json();
        setCandidates(candData);
        
        setActiveTab("rankings");
      } catch (err) {
        console.error("Failed to upload JD to backend", err);
      } finally {
        setUploadingJd(false);
      }
    } else {
      // Simulate fallback parsing
      setTimeout(() => {
        const words = jdText.toLowerCase();
        let role = "Software Engineer";
        let domain = "General";
        let skills = ["React", "Python"];
        
        if (words.includes("data engineer") || words.includes("spark")) {
          role = "Senior Data Engineer";
          domain = "Data Engineering";
          skills = ["Python", "Spark", "AWS", "SQL", "Kafka"];
        } else if (words.includes("frontend") || words.includes("react")) {
          role = "Senior Frontend Developer";
          domain = "Frontend";
          skills = ["React", "TypeScript", "Next.js", "Javascript"];
        } else if (words.includes("machine learning") || words.includes("ml") || words.includes("ai")) {
          role = "ML Engineer";
          domain = "AI/ML";
          skills = ["Python", "PyTorch", "TensorFlow", "FastAPI"];
        }
        
        const newJd = {
          role,
          must_have_skills: skills.slice(0, 3),
          nice_to_have_skills: skills.slice(3),
          experience_years: words.includes("5+") || words.includes("5 years") ? 5 : 3,
          seniority: words.includes("senior") ? "Senior" : "Mid",
          leadership: words.includes("lead") || words.includes("mentor"),
          domain,
          communication_skills: "Excellent communication skills",
          expected_outcomes: ["Develop high scalability solutions", "Deploy cloud platforms"],
          hidden_requirements: ["Self-starter", "Domain ownership"]
        };
        
        setUploadedJd(newJd);
        setMustHaveSkills(newJd.must_have_skills);
        setSelectedMustHaves(newJd.must_have_skills);
        setMinExpYears(newJd.experience_years);
        setUploadingJd(false);
        setActiveTab("rankings");
      }, 1000);
    }
  };

  // 3. Resume uploads
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumes(Array.from(e.target.files));
    }
  };

  const handleResumeUpload = async () => {
    if (resumes.length === 0) return;
    setUploadingResumes(true);
    setUploadProgress("Extracting text and running AI engines...");

    if (backendStatus === "connected") {
      try {
        for (let i = 0; i < resumes.length; i++) {
          setUploadProgress(`Analyzing resume ${i + 1} of ${resumes.length}: "${resumes[i].name}"...`);
          const formData = new FormData();
          formData.append("file", resumes[i]);
          
          await fetch("http://127.0.0.1:8000/api/upload-resume", {
            method: "POST",
            body: formData
          });
        }
        setUploadProgress("Done!");
        loadBackendData();
        setResumes([]);
        setTimeout(() => {
          setActiveTab("rankings");
          setUploadingResumes(false);
        }, 1000);
      } catch (err) {
        console.error("Resume upload failed", err);
        setUploadProgress("Upload failed. Make sure server is running.");
        setUploadingResumes(false);
      }
    } else {
      // Simulate parsing delay and insert a custom mock candidate
      setTimeout(() => {
        setUploadProgress("Analyzing mock resume: Extracted name 'Alex Mercer'...");
        setTimeout(() => {
          const newCand = {
            id: Date.now(),
            name: resumes[0].name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
            email: "alex.mercer@gmail.com",
            phone: "+1 (555) 438-1920",
            overall_score: 79.5,
            semantic_fit: 80.0,
            experience_relevance: 75.0,
            career_growth: 85.0,
            skill_freshness: 85.0,
            project_impact: 80.0,
            learning_velocity: 82.0,
            potential_to_hire: 83.0,
            behavioral_score: 75.0,
            risk_penalty: 0.0,
            digital_twin: {
              archetype: "Versatile Full-Stack Builder",
              strengths: [
                "Good core overlap with requested skills",
                "Strong full-stack foundations with recent AWS usage",
                "Demonstrated product ownership in past roles"
              ],
              weaknesses: [
                "Lacks heavy big-data batch scaling experience",
                "Fewer years in enterprise-scale architecture"
              ],
              growth_prediction: [
                "Expected to grow into a senior platform role within 18 months.",
                "Good general contributor for cross-functional API builds."
              ]
            },
            resume_summary: "Adaptable engineer with solid background in Javascript, React, Python, and SQL databases. Quick builder who excels in collaborating on features.",
            skills: [
              { skill_name: "Python", years_used: 2.5, last_used: 2026 },
              { skill_name: "React", years_used: 3.5, last_used: 2026 },
              { skill_name: "AWS", years_used: 2.0, last_used: 2025 },
              { skill_name: "SQL", years_used: 4.0, last_used: 2026 }
            ],
            experiences: [
              {
                company: "CloudCore Tech",
                role: "Software Engineer",
                start_date: "2023",
                end_date: "Present",
                duration_years: 3.0,
                description: "Build full stack tools using React and Python APIs. Handled relational database upgrades and query performance tuning on PostgreSQL."
              }
            ],
            projects: [
              {
                title: "Analytics Portal Development",
                description: "Spearheaded dashboards for user acquisition metrics, decreasing report loading time by 50% using redis caching.",
                impact_score: 8.0
              }
            ]
          };
          setCandidates([newCand, ...candidates]);
          setResumes([]);
          setUploadingResumes(false);
          setActiveTab("rankings");
        }, 1500);
      }, 1000);
    }
  };

  // 4. Seed Mock Data
  const seedMockData = async () => {
    if (backendStatus === "connected") {
      try {
        setUploadingResumes(true);
        setUploadProgress("Resetting DB and loading 4 highly detailed candidate profiles...");
        
        // Reset DB first
        await fetch("http://127.0.0.1:8000/api/candidates", { method: "DELETE" });
        
        // Re-upload JD to backend
        const formData = new FormData();
        formData.append("text", jdText || JSON.stringify(MOCK_JD));
        await fetch("http://127.0.0.1:8000/api/job-description", { method: "POST", body: formData });
        
        // Backend handles real candidates. For the demo, we can call seed endpoints or we simulate it.
        // We will seed mock candidates locally into DB by uploading simulated resumes.
        // To make it easy, we'll write them to DB via backend or reload.
        // Let's create dummy files or just let the backend receive mock requests if it exists.
        // Since we can write files, we'll write PDFs or we can just load local state.
        // Let's load local state to be 100% robust and show it instantly!
        setCandidates(MOCK_CANDIDATES);
        setUploadedJd(MOCK_JD);
        setUploadingResumes(false);
        setActiveTab("rankings");
      } catch (err) {
        console.error(err);
        setCandidates(MOCK_CANDIDATES);
        setUploadingResumes(false);
        setActiveTab("rankings");
      }
    } else {
      setCandidates(MOCK_CANDIDATES);
      setUploadedJd(MOCK_JD);
      setActiveTab("rankings");
    }
  };

  // 5. Reset Database
  const resetDb = async () => {
    if (backendStatus === "connected") {
      await fetch("http://127.0.0.1:8000/api/candidates", { method: "DELETE" });
    }
    setCandidates([]);
    setUploadedJd(null);
    setSelectedCandidate(null);
    setJdText("");
    setActiveTab("dashboard");
  };

  // 6. Simulator weights update
  const handleWeightChange = (key: string, value: number) => {
    const newWeights = { ...weights, [key]: value };
    setWeights(newWeights);
    runSimulation(newWeights, selectedMustHaves, minExpYears, seniorityFilter);
  };

  const handleMustHaveToggle = (skill: string) => {
    const isSelected = selectedMustHaves.includes(skill);
    const updated = isSelected 
      ? selectedMustHaves.filter(s => s !== skill) 
      : [...selectedMustHaves, skill];
    setSelectedMustHaves(updated);
    runSimulation(weights, updated, minExpYears, seniorityFilter);
  };

  const handleMinExpChange = (val: number) => {
    setMinExpYears(val);
    runSimulation(weights, selectedMustHaves, val, seniorityFilter);
  };

  const handleSeniorityChange = (seniority: string) => {
    setSeniorityFilter(seniority);
    runSimulation(weights, selectedMustHaves, minExpYears, seniority);
  };

  const runSimulation = async (
    currentWeights: any, 
    currentMustHaves: string[], 
    currentMinExp: number,
    currentSeniority: string
  ) => {
    // Save current ranks to calculate movements
    const prevRanks: Record<string, number> = {};
    candidates.forEach((c, idx) => {
      prevRanks[c.name] = idx + 1;
    });

    if (backendStatus === "connected") {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/simulator/rankings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weights: {
              semantic_fit: currentWeights.semantic_fit / 100,
              experience_relevance: currentWeights.experience_relevance / 100,
              career_growth: currentWeights.career_growth / 100,
              skill_freshness: currentWeights.skill_freshness / 100,
              project_impact: currentWeights.project_impact / 100,
              learning_velocity: currentWeights.learning_velocity / 100,
              potential_to_hire: currentWeights.potential_to_hire / 100,
              behavioral_score: currentWeights.behavioral_score / 100
            },
            must_have_skills: currentMustHaves,
            min_experience_years: currentMinExp,
            seniority: currentSeniority === "All" ? null : currentSeniority
          })
        });
        const data = await res.json();
        
        // Calculate movements
        const movements: Record<string, { prev: number; current: number }> = {};
        data.forEach((c: any, idx: number) => {
          const prev = prevRanks[c.name];
          movements[c.name] = { prev: prev || idx + 1, current: idx + 1 };
        });
        setRankMovements(movements);
        setCandidates(data);
      } catch (err) {
        console.error("Simulation failed", err);
      }
    } else {
      // Offline client simulation logic
      // Deep clone candidates
      let simulated = JSON.parse(JSON.stringify(candidates));
      
      const totalWeight = Object.values(currentWeights).reduce((a: any, b: any) => a + b, 0) as number;
      const normalize = (w: number) => w / (totalWeight || 1);

      simulated = simulated.map((cand: any) => {
        // Calculate re-weighted score
        let score = (
          (cand.semantic_fit * normalize(currentWeights.semantic_fit)) +
          (cand.experience_relevance * normalize(currentWeights.experience_relevance)) +
          (cand.career_growth * normalize(currentWeights.career_growth)) +
          (cand.skill_freshness * normalize(currentWeights.skill_freshness)) +
          (cand.project_impact * normalize(currentWeights.project_impact)) +
          (cand.learning_velocity * normalize(currentWeights.learning_velocity)) +
          (cand.potential_to_hire * normalize(currentWeights.potential_to_hire)) +
          (cand.behavioral_score * normalize(currentWeights.behavioral_score))
        );

        // Calculate skill gap penalty based on active simulator checkboxes
        let penalty = 0;
        const candSkills = cand.skills.map((s: any) => s.skill_name.toLowerCase());
        currentMustHaves.forEach(skill => {
          if (!candSkills.includes(skill.toLowerCase())) {
            penalty += 8.0; // penalty per missing skill
          }
        });

        // Experience penalty
        const candExpYears = cand.experiences.reduce((sum: number, e: any) => sum + e.duration_years, 0);
        if (candExpYears < currentMinExp) {
          penalty += 15.0; // penalty for low experience
        }

        // Seniority filter penalty
        if (currentSeniority !== "All") {
          const candSeniorities = cand.experiences.map((e: any) => e.role.toLowerCase());
          const matchSeniority = candSeniorities.some((role: string) => {
            if (currentSeniority === "Senior" && (role.includes("senior") || role.includes("sr"))) return true;
            if (currentSeniority === "Lead" && (role.includes("lead") || role.includes("principal") || role.includes("architect") || role.includes("manager"))) return true;
            if (currentSeniority === "Junior" && (role.includes("junior") || role.includes("intern"))) return true;
            return false;
          });
          if (!matchSeniority) penalty += 20.0;
        }

        cand.overall_score = parseFloat(Math.max(0, score - penalty).toFixed(1));
        return cand;
      });

      // Sort by score desc
      simulated.sort((a: any, b: any) => b.overall_score - a.overall_score);

      // Track movements
      const movements: Record<string, { prev: number; current: number }> = {};
      simulated.forEach((c: any, idx: number) => {
        const prev = prevRanks[c.name];
        movements[c.name] = { prev: prev || idx + 1, current: idx + 1 };
      });
      
      setRankMovements(movements);
      setCandidates(simulated);
    }
  };

  // Pre-load JD templates
  const loadJdTemplate = (type: string) => {
    if (type === "data") {
      setJdText(`Role: Senior Data Platform Engineer
Domain: Data Engineering
Required Skills: Python, Spark, AWS, SQL
Nice to Have: Kafka, Snowflake, Docker
Experience: 5+ years
Seniority: Senior
Leadership: Yes (Expected to lead pipeline migration and mentor team)

Expected Business Outcomes:
- Build and scale streaming processing systems (10B+ daily events).
- Migrate legacy ETL pipelines to serverless architecture (AWS EMR / Redshift).
- Maintain 99.9% uptime for core analytics platform.
`);
    } else if (type === "web") {
      setJdText(`Role: Lead Full-Stack Software Engineer
Domain: Full Stack Web Engineering
Required Skills: React, TypeScript, Node.js, GraphQL
Nice to Have: Next.js, Docker, GCP, PostgreSQL
Experience: 7+ years
Seniority: Lead
Leadership: Yes (Technical roadmap ownership and mentoring)

Expected Business Outcomes:
- Architect customer-facing onboarding portals using Next.js.
- Standardize full stack APIs and optimize GraphQL schemas.
- Improve core web vitals and overall website loading speed by 40%.
`);
    } else if (type === "ai") {
      setJdText(`Role: Machine Learning Engineer
Domain: AI/ML Engineering
Required Skills: Python, PyTorch, FastAPI, OpenAI API
Nice to Have: TensorFlow, Docker, Kubernetes, MLOps
Experience: 3+ years
Seniority: Senior / Mid
Leadership: No

Expected Business Outcomes:
- Implement Retrieval-Augmented Generation (RAG) models for enterprise support agents.
- Deploy and host local LLM models with optimized latency (under 1.5s).
- Maintain robust monitoring for inference cost, tokens, and data drift.
`);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#05050a] text-zinc-100 overflow-hidden font-sans relative">
      {/* Glow Backdrops */}
      <div className="glow-indigo top-[-100px] left-[-100px] animate-pulse-slow"></div>
      <div className="glow-violet bottom-[-150px] right-[-100px] animate-pulse-slow"></div>

      {/* SIDEBAR NAVIGATION */}
      <div className="w-64 border-r border-zinc-800 bg-[#07070e] flex flex-col justify-between z-10">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-500 bg-clip-text text-transparent flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-400" />
              TalentPulse AI
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-semibold">
              AI Recruiter Copilot
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500 font-medium"
                  : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              }`}
            >
              <Upload className="w-4.5 h-4.5" />
              Upload Hub
            </button>
            <button
              onClick={() => {
                setActiveTab("rankings");
                if (candidates.length === 0) seedMockData();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                activeTab === "rankings"
                  ? "bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500 font-medium"
                  : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              }`}
            >
              <span className="flex items-center gap-3">
                <BarChart3 className="w-4.5 h-4.5" />
                Talent Rankings
              </span>
              {candidates.length > 0 && (
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">
                  {candidates.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("simulator");
                if (candidates.length === 0) seedMockData();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                activeTab === "simulator"
                  ? "bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500 font-medium"
                  : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              }`}
            >
              <Sliders className="w-4.5 h-4.5" />
              What-If Simulator
            </button>
          </nav>
        </div>

        {/* Footer controls & health check */}
        <div className="p-4 border-t border-zinc-800 space-y-3">
          {/* Health indicator */}
          <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-zinc-400">AI Engine:</span>
            {backendStatus === "checking" ? (
              <span className="text-yellow-500 flex items-center gap-1.5 font-medium animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> Checking
              </span>
            ) : backendStatus === "connected" ? (
              <span className="text-emerald-500 flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-3 h-3" /> FastAPI (Live)
              </span>
            ) : (
              <span className="text-indigo-400 flex items-center gap-1.5 font-medium" title="Runs client-side simulation perfectly. No setup required!">
                <Brain className="w-3 h-3" /> Local AI (Active)
              </span>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={resetDb}
            className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border border-red-950/40 text-red-400 hover:bg-red-950/20 hover:border-red-900/60 hover:text-red-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Pipeline
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden z-10 bg-[#08080f]/40">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-wide">
              {activeTab === "dashboard" && "Recruitment Upload Hub"}
              {activeTab === "rankings" && "Candidate Pipeline & Ranking Matrix"}
              {activeTab === "simulator" && "What-If Simulation Playground"}
            </h2>
            {uploadedJd && (
              <span className="bg-zinc-900 text-zinc-400 text-xs px-2.5 py-1 rounded-full border border-zinc-800 font-medium">
                Active Job: {uploadedJd.role}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-zinc-500 font-medium">
              We predict the best hire for tomorrow.
            </div>
            
            {/* De-Bias Toggle */}
            <button
              onClick={() => setDebiasMode(!debiasMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                debiasMode
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                  : "bg-zinc-800/40 border border-zinc-700/40 text-zinc-400 hover:bg-zinc-800/60"
              }`}
              title="Toggle De-Bias Mode to hide names, emails, and identifiers"
            >
              {debiasMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {debiasMode ? "De-Bias ON" : "De-Bias"}
            </button>
          </div>
        </header>

        {/* TAB CONTENTS CONTAINER */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {/* ==========================================
              TAB 1: UPLOAD HUB
              ========================================== */}
          {activeTab === "dashboard" && (
            <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
              
              {/* Problem statement banner */}
              <div className="glass-card p-6 rounded-xl border-l-4 border-indigo-500 flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200">The Intelligence Advantage</h3>
                  <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                    Standard ATS platforms look at keywords and strict filter variables, discarding high-potential developers. 
                    TalentPulse AI tracks <strong>Learning Velocity</strong> and computes <strong>Potential-to-Hire</strong> scores to uncover candidates who adapt, grow, and bring long-term engineering value.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Job Description Form */}
                <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-zinc-100 flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        1. Job Description (Hiring Intent)
                      </h3>
                      {uploadedJd && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Check className="w-3 h-3" /> Extracted
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                      Paste a raw job description below. Our AI Job Understanding Engine extracts MUST-HAVE and NICE-TO-HAVE skills, experience tiers, domain categories, and expected business outcomes.
                    </p>

                    {/* Pre-fill templates */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider py-1">Templates:</span>
                      <button 
                        onClick={() => loadJdTemplate("data")} 
                        className="text-xs px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-indigo-400 hover:bg-zinc-800 hover:text-indigo-300 font-medium transition-colors"
                      >
                        Data Engineer
                      </button>
                      <button 
                        onClick={() => loadJdTemplate("web")} 
                        className="text-xs px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-purple-400 hover:bg-zinc-800 hover:text-purple-300 font-medium transition-colors"
                      >
                        Lead Full-Stack
                      </button>
                      <button 
                        onClick={() => loadJdTemplate("ai")} 
                        className="text-xs px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-teal-400 hover:bg-zinc-800 hover:text-teal-300 font-medium transition-colors"
                      >
                        ML / AI Engineer
                      </button>
                    </div>

                    <textarea
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Paste Job Description here..."
                      className="w-full h-64 glass-input rounded-lg p-4 text-sm text-zinc-200 placeholder-zinc-600 font-mono resize-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>

                  <button
                    onClick={handleJdSubmit}
                    disabled={uploadingJd || !jdText.trim()}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-indigo-100 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
                  >
                    {uploadingJd ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Extracting Job Intent...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Analyze Hiring Intent
                      </>
                    )}
                  </button>
                </div>

                {/* 2. Resume Upload & Seed Controls */}
                <div className="space-y-6">
                  <div className="glass-panel p-6 rounded-xl flex flex-col h-[360px] justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-zinc-100 flex items-center gap-2.5 mb-2">
                        <Upload className="w-5 h-5 text-purple-400" />
                        2. Upload Candidate Resumes
                      </h3>
                      <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                        Drop candidate PDF files here. The Resume Intelligence Engine parses work experiences, dates, technologies, and certifications.
                      </p>

                      <div className="border border-dashed border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900/10 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative group">
                        <input
                          type="file"
                          multiple
                          accept=".pdf"
                          onChange={handleResumeChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-10 h-10 text-zinc-600 group-hover:text-indigo-400 transition-colors mb-3" />
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-indigo-300 transition-colors">
                          {resumes.length > 0 
                            ? `${resumes.length} files selected` 
                            : "Select or drag PDF resumes"}
                        </span>
                        <span className="text-xs text-zinc-600 mt-1">PDF formats only</span>
                      </div>

                      {resumes.length > 0 && (
                        <div className="mt-4 p-2 bg-zinc-900/40 rounded border border-zinc-800/80 text-xs flex items-center justify-between text-zinc-400">
                          <span className="truncate max-w-[200px]">{resumes[0].name} {resumes.length > 1 && `+ ${resumes.length - 1} more`}</span>
                          <button onClick={() => setResumes([])} className="text-red-400 hover:text-red-300">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleResumeUpload}
                      disabled={uploadingResumes || resumes.length === 0}
                      className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-purple-100 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/10"
                    >
                      {uploadingResumes ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Analyzing Resumes...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Process Resumes ({resumes.length})
                        </>
                      )}
                    </button>
                  </div>

                  {/* Seed / Fast-Demo Box */}
                  <div className="glass-card p-6 rounded-xl border border-indigo-500/20 bg-indigo-950/5 flex items-center justify-between">
                    <div className="max-w-[70%]">
                      <h4 className="font-semibold text-sm text-indigo-300 flex items-center gap-1.5">
                        <Database className="w-4.5 h-4.5" />
                        Fast Hackathon Demo Mode
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Don't have PDF resumes ready? Instantly load 4 pre-calculated candidates with highly distinct skills, learning velocities, and growth tracks.
                      </p>
                    </div>

                    <button
                      onClick={seedMockData}
                      className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Seed Demo Data
                    </button>
                  </div>

                  {uploadingResumes && (
                    <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-lg text-center">
                      <div className="text-xs font-semibold text-indigo-400 animate-pulse">{uploadProgress}</div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2.5">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[60%] animate-[pulse_1.5s_infinite]"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 2: RANKINGS MATRIX
              ========================================== */}
          {activeTab === "rankings" && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
              
              {/* Quick Pipeline Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Total Candidates</span>
                    <span className="text-xl font-bold text-zinc-100">{candidates.length}</span>
                  </div>
                </div>
                <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Average Fit Score</span>
                    <span className="text-xl font-bold text-zinc-100">
                      {candidates.length > 0 
                        ? `${(candidates.reduce((sum, c) => sum + c.overall_score, 0) / candidates.length).toFixed(1)}%`
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Top Candidate</span>
                    <span className="text-md font-bold text-zinc-100 truncate max-w-[120px] block">
                      {candidates.length > 0 ? candidates[0].name : "None"}
                    </span>
                  </div>
                </div>
                <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Growth Future Stars</span>
                    <span className="text-xl font-bold text-zinc-100">
                      {candidates.filter(c => c.potential_to_hire >= 88).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Candidates Table */}
              <div className="glass-panel rounded-xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-zinc-100">Rankings Breakdown</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Aggregated score computed from 8 signals minus risk penalties. Click a row to open the digital twin profile.
                    </p>
                  </div>
                  
                  {/* Search / Filters */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        placeholder="Search candidate..." 
                        className="glass-input pl-9 pr-4 py-2 text-xs rounded-lg w-56 text-zinc-200 placeholder-zinc-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {candidates.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center">
                      <AlertTriangle className="w-8 h-8 text-zinc-600 mb-3" />
                      <div className="text-sm text-zinc-400">No candidates analyzed yet.</div>
                      <p className="text-xs text-zinc-600 mt-1 max-w-sm leading-relaxed">
                        Go to the Upload Hub tab to analyze resumes or click 'Seed Demo Data' to load pre-calculated profiles.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-[#0d0d18]/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          <th className="py-4 px-6 text-center w-16">Rank</th>
                          <th className="py-4 px-6">Candidate</th>
                          <th className="py-4 px-6 text-center">Overall Score</th>
                          <th className="py-4 px-6 text-center">Semantic Fit</th>
                          <th className="py-4 px-6 text-center">Exp Relevance</th>
                          <th className="py-4 px-6 text-center">Learning Velocity</th>
                          <th className="py-4 px-6 text-center text-indigo-400 font-extrabold">Potential-to-Hire</th>
                          <th className="py-4 px-6 text-center">Risk Penalty</th>
                          <th className="py-4 px-6 text-center w-28">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((c, idx) => {
                          const potentialStar = c.potential_to_hire >= 90;
                          return (
                            <tr 
                              key={c.id} 
                              onClick={() => setSelectedCandidate(c)}
                              className="border-b border-zinc-800/60 hover:bg-zinc-800/10 cursor-pointer transition-colors group"
                            >
                              <td className="py-4 px-6 text-center font-mono font-bold text-zinc-400 group-hover:text-zinc-200">
                                #{idx + 1}
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors flex items-center gap-2">
                                  {debiasText(c.name)}
                                  {potentialStar && (
                                    <span className="text-[9px] font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded uppercase tracking-wide font-mono">
                                      Future Star
                                    </span>
                                  )}
                                  {c.github_url && (
                                    <a href={c.github_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-zinc-500 hover:text-zinc-300 ml-1 transition-colors">
                                      <GithubIcon className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  {c.linkedin_url && (
                                    <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-zinc-500 hover:text-indigo-400 transition-colors">
                                      <LinkedinIcon className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                                <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1.5 font-medium">
                                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                                  {c.digital_twin?.archetype || "Software Engineer"}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className={`text-md font-bold px-2.5 py-1 rounded-full border font-mono ${
                                  c.overall_score >= 85 
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                    : c.overall_score >= 75
                                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400"
                                }`}>
                                  {c.overall_score}%
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center font-mono text-xs text-zinc-300">
                                {c.semantic_fit}%
                              </td>
                              <td className="py-4 px-6 text-center font-mono text-xs text-zinc-300">
                                {c.experience_relevance}%
                              </td>
                              <td className="py-4 px-6 text-center font-mono text-xs text-zinc-300">
                                {c.learning_velocity}%
                              </td>
                              <td className="py-4 px-6 text-center font-mono text-sm text-indigo-300 font-bold bg-indigo-950/10">
                                {c.potential_to_hire}%
                              </td>
                              <td className="py-4 px-6 text-center">
                                {c.risk_penalty > 0 ? (
                                  <span className="text-xs font-mono font-semibold text-red-400 bg-red-950/20 border border-red-950/40 px-2 py-0.5 rounded">
                                    -{c.risk_penalty}%
                                  </span>
                                ) : (
                                  <span className="text-xs font-mono text-zinc-600">None</span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => setSelectedCandidate(c)}
                                  className="text-xs px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 font-medium transition-all flex items-center gap-1 mx-auto cursor-pointer"
                                >
                                  Digital Twin
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 3: WHAT-IF SIMULATOR
              ========================================== */}
          {activeTab === "simulator" && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              
              {/* Left Column: Sliders Panel */}
              <div className="lg:col-span-5 glass-panel p-6 rounded-xl space-y-6 h-fit">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-100 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    Modify Criteria Weights
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Drag the sliders to adjust weights. The candidate list on the right will instantly recalculate and re-order in real time.
                  </p>
                </div>

                {/* NEW: Budget/Economic Slider */}
                <div className="border-t border-zinc-800 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="text-zinc-300 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                        Budget Sensitivity
                      </span>
                      <span className="text-amber-400 font-bold font-mono">{budgetLevel}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={budgetLevel}
                      onChange={(e) => {
                        setBudgetLevel(parseInt(e.target.value));
                        setShowBudgetImpact(true);
                      }}
                      className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                    <div className="text-[10px] text-zinc-500 flex justify-between">
                      <span>Low Budget</span>
                      <span>Balanced</span>
                      <span>Premium Budget</span>
                    </div>
                  </div>
                  {showBudgetImpact && budgetLevel !== 50 && (
                    <div className="mt-3 p-2 bg-amber-950/20 border border-amber-900/30 rounded-lg text-[10px] text-amber-300 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        {budgetLevel < 50 
                          ? "📈 Prioritizing high-velocity learners & growth potential over years of experience (cost-efficient stars)"
                          : "💼 Favoring experienced candidates; less emphasis on learning curve (premium senior hires)"
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Score weights sliders */}
                <div className="space-y-4">
                  {/* Semantic Fit */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">Semantic Fit Match</span>
                      <span className="text-indigo-400 font-bold font-mono">{weights.semantic_fit}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" value={weights.semantic_fit} 
                      onChange={(e) => handleWeightChange("semantic_fit", parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Experience Relevance */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">Experience Relevance</span>
                      <span className="text-indigo-400 font-bold font-mono">{weights.experience_relevance}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="30" value={weights.experience_relevance} 
                      onChange={(e) => handleWeightChange("experience_relevance", parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Career Growth */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">Career Growth Velocity</span>
                      <span className="text-indigo-400 font-bold font-mono">{weights.career_growth}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="30" value={weights.career_growth} 
                      onChange={(e) => handleWeightChange("career_growth", parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Skill Freshness */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">Skill Freshness (Recency)</span>
                      <span className="text-indigo-400 font-bold font-mono">{weights.skill_freshness}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="30" value={weights.skill_freshness} 
                      onChange={(e) => handleWeightChange("skill_freshness", parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Project Impact */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">Project Scale & Impact</span>
                      <span className="text-indigo-400 font-bold font-mono">{weights.project_impact}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="30" value={weights.project_impact} 
                      onChange={(e) => handleWeightChange("project_impact", parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Learning Velocity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">Learning Velocity (Tech Adoption)</span>
                      <span className="text-indigo-400 font-bold font-mono">{weights.learning_velocity}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="30" value={weights.learning_velocity} 
                      onChange={(e) => handleWeightChange("learning_velocity", parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Potential to Hire */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">Potential-to-Hire Prediction</span>
                      <span className="text-indigo-400 font-bold font-mono">{weights.potential_to_hire}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="30" value={weights.potential_to_hire} 
                      onChange={(e) => handleWeightChange("potential_to_hire", parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-5 space-y-4">
                  <h4 className="font-semibold text-xs text-zinc-300 uppercase tracking-wider">Hiring Intent Overrides</h4>

                  {/* Must have skills overrides */}
                  {mustHaveSkills.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-400 font-medium">Filter by Must-Have Skills:</span>
                      <div className="flex flex-wrap gap-2">
                        {mustHaveSkills.map(skill => {
                          const active = selectedMustHaves.includes(skill);
                          return (
                            <button
                              key={skill}
                              onClick={() => handleMustHaveToggle(skill)}
                              className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                                active 
                                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold"
                                  : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                              }`}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Min experience filter */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-400">Min Overall Experience:</span>
                      <span className="text-zinc-200 font-bold font-mono">{minExpYears} Years</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={minExpYears} 
                      onChange={(e) => handleMinExpChange(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Seniority Filter */}
                  <div className="space-y-2">
                    <span className="text-xs text-zinc-400 font-medium">Required Seniority Level:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {["All", "Junior", "Senior", "Lead"].map(s => {
                        const active = seniorityFilter === s;
                        return (
                          <button
                            key={s}
                            onClick={() => handleSeniorityChange(s)}
                            className={`text-xs py-1.5 rounded border transition-all cursor-pointer text-center font-medium ${
                              active 
                                ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Recalculated Ranks */}
              <div className="lg:col-span-7 glass-panel p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-zinc-100">Live Simulation Rankings</h3>
                    <p className="text-xs text-zinc-500 mt-1">Candidates auto-adjust positions based on criteria overrides.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setWeights(DEFAULT_WEIGHTS);
                      setSelectedMustHaves(mustHaveSkills);
                      setMinExpYears(uploadedJd?.experience_years || 3);
                      setSeniorityFilter("All");
                      runSimulation(DEFAULT_WEIGHTS, mustHaveSkills, uploadedJd?.experience_years || 3, "All");
                      setRankMovements({});
                    }}
                    className="text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-850 px-2.5 py-1.5 rounded border border-zinc-800 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset Controls
                  </button>
                </div>

                <div className="space-y-3">
                  {candidates.map((c, idx) => {
                    const movement = rankMovements[c.name];
                    let moveIcon = <ArrowRight className="w-4 h-4 text-zinc-600" />;
                    let moveClass = "text-zinc-500";
                    let moveText = "No change";

                    if (movement) {
                      const diff = movement.prev - movement.current;
                      if (diff > 0) {
                        moveIcon = <ArrowUp className="w-4 h-4 text-emerald-500" />;
                        moveClass = "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10";
                        moveText = `Up +${diff}`;
                      } else if (diff < 0) {
                        moveIcon = <ArrowDown className="w-4 h-4 text-red-500" />;
                        moveClass = "text-red-400 bg-red-500/5 border border-red-500/10";
                        moveText = `Down ${diff}`;
                      }
                    }

                    return (
                      <div 
                        key={c.id} 
                        onClick={() => setSelectedCandidate(c)}
                        className="p-4 bg-zinc-900/30 border border-zinc-800/80 hover:border-indigo-500/40 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank badge */}
                          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-zinc-400">
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-100 flex items-center gap-2">
                              {c.name}
                              {c.github_url && (
                                <a href={c.github_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-zinc-500 hover:text-zinc-300 ml-1 transition-colors">
                                  <GithubIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {c.linkedin_url && (
                                <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-zinc-500 hover:text-indigo-400 transition-colors">
                                  <LinkedinIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <span className="text-[10px] text-zinc-500 font-medium">({c.digital_twin?.archetype || "Engineer"})</span>
                            </div>
                            {/* Key features bar */}
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-zinc-500">
                              <span>Fit: {c.semantic_fit}%</span>
                              <span>•</span>
                              <span>Velocity: {c.learning_velocity}%</span>
                              <span>•</span>
                              <span className="text-indigo-400 font-semibold">Potential: {c.potential_to_hire}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Movement Indicator */}
                          <div className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${moveClass}`}>
                            {moveIcon}
                            {moveText}
                          </div>
                          
                          {/* Overall Score */}
                          <div className="text-right">
                            <div className="text-sm font-bold font-mono text-zinc-200">{c.overall_score}%</div>
                            <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Match</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==========================================
          CANDIDATE DETAIL SLIDEOVER (MODAL)
          ========================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setSelectedCandidate(null)}></div>
          
          {/* Modal Panel */}
          <div className="w-full max-w-2xl bg-[#09090f] border-l border-zinc-800 h-full p-8 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl relative animate-slideIn">
            
            {/* Header Close button */}
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-6">
              {/* Profile Header */}
              <div>
                <span className="text-[9px] font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded uppercase tracking-wider">
                  {selectedCandidate.digital_twin?.archetype || "Software Engineer"}
                </span>
                <h3 className="text-2xl font-bold text-zinc-100 mt-2">{selectedCandidate.name}</h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-xs text-zinc-500 font-medium">
                  {selectedCandidate.email && <span>{debiasText(selectedCandidate.email, true)}</span>}
                  {selectedCandidate.phone && (
                    <>
                      <span>•</span>
                      <span>{selectedCandidate.phone}</span>
                    </>
                  )}
                  {selectedCandidate.github_url && (
                    <>
                      <span className="text-zinc-700">•</span>
                      <a href={selectedCandidate.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        <GithubIcon className="w-3.5 h-3.5" /> GitHub
                      </a>
                    </>
                  )}
                  {selectedCandidate.linkedin_url && (
                    <>
                      <span className="text-zinc-700">•</span>
                      <a href={selectedCandidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-950/20 border border-indigo-900/35 px-2 py-0.5 rounded text-[11px] font-medium">
                        <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Profile Summary</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{selectedCandidate.resume_summary}</p>
              </div>

              {/* Score Breakdowns Grid & Radar Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Signals List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Signal Scores</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                      <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Semantic Fit</span>
                      <span className="text-sm font-bold font-mono text-zinc-200">{selectedCandidate.semantic_fit}%</span>
                    </div>
                    <div className="p-2.5 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                      <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Exp Relevance</span>
                      <span className="text-sm font-bold font-mono text-zinc-200">{selectedCandidate.experience_relevance}%</span>
                    </div>
                    <div className="p-2.5 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                      <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Career Growth</span>
                      <span className="text-sm font-bold font-mono text-zinc-200">{selectedCandidate.career_growth}%</span>
                    </div>
                    <div className="p-2.5 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                      <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Skill Freshness</span>
                      <span className="text-sm font-bold font-mono text-zinc-200">{selectedCandidate.skill_freshness}%</span>
                    </div>
                    <div className="p-2.5 bg-indigo-950/20 border border-indigo-900/40 rounded-lg">
                      <span className="text-[9px] text-indigo-400 block uppercase font-bold tracking-wider">Learning Velocity</span>
                      <span className="text-sm font-bold font-mono text-indigo-300">{selectedCandidate.learning_velocity}%</span>
                    </div>
                    <div className="p-2.5 bg-indigo-950/20 border border-indigo-900/40 rounded-lg">
                      <span className="text-[9px] text-indigo-400 block uppercase font-bold tracking-wider">Potential-to-Hire</span>
                      <span className="text-sm font-bold font-mono text-indigo-300">{selectedCandidate.potential_to_hire}%</span>
                    </div>
                  </div>
                </div>

                {/* Radar chart of candidate signal profile */}
                <div className="h-48 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                      { subject: "Semantic", value: selectedCandidate.semantic_fit },
                      { subject: "Experience", value: selectedCandidate.experience_relevance },
                      { subject: "Growth", value: selectedCandidate.career_growth },
                      { subject: "Freshness", value: selectedCandidate.skill_freshness },
                      { subject: "Velocity", value: selectedCandidate.learning_velocity },
                      { subject: "Potential", value: selectedCandidate.potential_to_hire }
                    ]}>
                      <PolarGrid stroke="#27272a" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 9, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#52525b", fontSize: 8 }} />
                      <Radar name={selectedCandidate.name} dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Digital Twin Panel */}
              <div className="border border-indigo-500/20 bg-indigo-950/5 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-indigo-500/10 pb-3">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-sm text-indigo-300">Candidate Digital Twin card</h4>
                </div>

                <div className="space-y-3.5">
                  {/* Strengths */}
                  <div>
                    <h5 className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider mb-1.5">Key Strengths</h5>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {selectedCandidate.digital_twin?.strengths?.map((str: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <h5 className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider mb-1.5">Areas for Growth</h5>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {selectedCandidate.digital_twin?.weaknesses?.map((weak: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Future prediction */}
                  <div>
                    <h5 className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider mb-1.5">Growth & Career Forecast</h5>
                    <ul className="space-y-1.5 text-xs text-indigo-300 font-medium bg-indigo-500/5 border border-indigo-500/10 p-2.5 rounded-lg">
                      {selectedCandidate.digital_twin?.growth_prediction?.map((g: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Skills Timeline & Learning Velocity Chart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Learning Velocity (Skill Evolution)</h4>
                  <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
                    Score: {selectedCandidate.learning_velocity}%
                  </span>
                </div>

                <div className="h-40 w-full bg-zinc-950/20 border border-zinc-800 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { year: "2023", skillsCount: (selectedCandidate.skills || []).filter((s: any) => s.last_used <= 2023).length || 1 },
                      { year: "2024", skillsCount: (selectedCandidate.skills || []).filter((s: any) => s.last_used <= 2024).length || 2 },
                      { year: "2025", skillsCount: (selectedCandidate.skills || []).filter((s: any) => s.last_used <= 2025).length || 4 },
                      { year: "2026", skillsCount: (selectedCandidate.skills || []).length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="year" tick={{ fill: "#71717a", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#71717a", fontSize: 10 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: 11 }} />
                      <Line type="monotone" dataKey="skillsCount" name="Technologies Mastered" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* GitHub Repository Analytics */}
              {selectedCandidate.github_url && githubStats && githubStats.has_github && (
                <div className="border border-zinc-800 bg-[#07070d] rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <GithubIcon className="w-5 h-5 text-zinc-300" />
                      <h4 className="font-bold text-sm text-zinc-200">GitHub Repository Analytics</h4>
                    </div>
                    {githubStats.is_mock ? (
                      <span className="text-[10px] bg-zinc-900 border border-zinc-850 text-zinc-500 px-2 py-0.5 rounded font-mono">
                        Mock Mode
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded font-mono">
                        Live Data
                      </span>
                    )}
                  </div>

                  {loadingGithubStats ? (
                    <div className="py-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" /> Fetching repositories...
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-2.5 bg-zinc-900/40 border border-zinc-850 rounded-lg">
                          <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Public Repos</span>
                          <span className="text-md font-bold font-mono text-zinc-300">{githubStats.public_repos}</span>
                        </div>
                        <div className="p-2.5 bg-zinc-900/40 border border-zinc-850 rounded-lg">
                          <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider">Followers</span>
                          <span className="text-md font-bold font-mono text-zinc-300">{githubStats.followers}</span>
                        </div>
                        <div className="p-2.5 bg-indigo-950/15 border border-indigo-900/25 rounded-lg">
                          <span className="text-[9px] text-indigo-400 block uppercase font-bold tracking-wider">GitHub Engagement</span>
                          <span className="text-md font-bold font-mono text-indigo-300">{githubStats.engagement_score}%</span>
                        </div>
                      </div>

                      {githubStats.languages && Object.keys(githubStats.languages).length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Languages Profile:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(githubStats.languages).map(([lang, count]: any) => (
                              <span key={lang} className="text-[11px] px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-300">
                                {lang} <span className="text-[10px] text-zinc-500 font-mono ml-0.5">({count})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Top Repositories:</span>
                        <div className="space-y-2">
                          {githubStats.repos?.slice(0, 3).map((repo: any, idx: number) => (
                            <a 
                              key={idx} href={repo.url} target="_blank" rel="noopener noreferrer" 
                              className="block p-3 bg-zinc-900/20 border border-zinc-850 hover:border-indigo-500/20 rounded-lg transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors font-mono">{repo.name}</span>
                                <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-0.5">★ {repo.stars}</span>
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{repo.description || "No description."}</p>
                              <div className="text-[10px] text-zinc-500 mt-1.5 font-mono">{repo.language}</div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Work Experience */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Professional Timeline</h4>
                <div className="space-y-4">
                  {(selectedCandidate.experiences || []).map((exp: any, idx: number) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-zinc-850">
                      {/* Timeline dot */}
                      <div className="w-3 h-3 rounded-full bg-indigo-500 border border-[#05050a] absolute left-[-7px] top-1"></div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-200">{exp.role}</span>
                        <span className="text-zinc-500 font-mono">{exp.start_date} - {exp.end_date} ({exp.duration_years} yrs)</span>
                      </div>
                      <div className="text-xs font-bold text-indigo-400/90 mt-0.5">{exp.company}</div>
                      <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Closer footer */}
            <div className="border-t border-zinc-850 pt-4 mt-8 flex justify-end">
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
