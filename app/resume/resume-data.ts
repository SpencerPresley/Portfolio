export type ResumeFocus = "ai-llm" | "backend-platform";

export type ResumeBullet = {
  lead: string;
  detail: string;
};

export type ResumeExperience = {
  organization: string;
  role: string;
  dates: string;
  context: string;
  bullets: ResumeBullet[];
};

export type ResumeProject = {
  name: string;
  technologies: string[];
  bullets: ResumeBullet[];
};

export type ResumeSkillGroup = {
  label: string;
  skills: string[];
};

export type ResumeVariant = {
  id: ResumeFocus;
  label: string;
  shortLabel: string;
  headline: string;
  introduction: string;
  pdf: string;
  experience: ResumeExperience[];
  projects: ResumeProject[];
  honors: string[];
  skills: ResumeSkillGroup[];
};

export const resumeEducation = {
  institution: "Salisbury University",
  degree: "B.S. Computer Science, Minor in Mathematics",
  dates: "Aug 2021 – May 2025",
};

const honors = {
  bitcamp:
    "1st Place / Best Hack — Bitcamp 2024, UMD (largest US East Coast hackathon) — TermBook",
  hackumbc: "Best Educational Hack & 2nd Overall — HackUMBC 2024 — Testif.AI",
};

export const resumeVariants: Record<ResumeFocus, ResumeVariant> = {
  "ai-llm": {
    id: "ai-llm",
    label: "AI & LLM Systems",
    shortLabel: "AI / LLM",
    headline: "AI systems, grounded in the machinery underneath.",
    introduction: "Agent runtimes, local model serving, GPU admission, and evidence-grounded products—built as production systems rather than model demos.",
    pdf: "/spencer-presley-ai-llm-resume.pdf",
    experience: [
      {
        organization: "CrunchAtlas",
        role: "Software Engineer",
        dates: "Mar 2025 – Present",
        context: "Local-first, air-gapped AI security platform for critical infrastructure. Sole author of the systems below.",
        bullets: [
          {
            lead: "Created the company's agent platform from scratch",
            detail:
              ". A shared agent harness supplies model construction, retries, structured-output repair, context management, tool guardrails, per-task budgets, and typed lifecycle events; each agent adds only its domain prompt, tools, state, and graph.",
          },
          {
            lead: "Kept long-running agents on task beyond a single context window",
            detail:
              ". As context fills or the model repeats a tool call, the harness condenses the run to its objective, completed work, and next steps; oversized tool results move to searchable files the agent reads on demand instead of resending them with every model call.",
          },
          {
            lead: "Prevented context overruns and truncated model turns from corrupting an agent run",
            detail:
              ". Before every llama.cpp call, the harness renders and tokenizes the exact outgoing request and refuses any prompt, summary, or retry that won't fit. If generation hits its cap, it drops the partial turn before memory or tool execution and regenerates once.",
          },
          {
            lead: "Gave understaffed critical-infrastructure teams on-demand packet forensics",
            detail:
              " through the platform's most-used agent. It drives tshark, Zeek, and foremost from an IDS alert through protocol reconstruction, IOC extraction, file carving, and timeline analysis, then delivers a cited report and triage verdict for defenders to review.",
          },
          {
            lead: "Made the platform investigate on its own",
            detail:
              ": a background reconciler decides which AI work should exist and queues it with no analyst click, completing nearly 17,000 PCAP investigations in its first two months. Each dispatch commits independently behind a durable resume cursor, and a user's click promotes an already-queued run ahead of all background work.",
          },
          {
            lead: "Shipped PurpleHaze",
            detail:
              ", an autonomous penetration-testing product covering reconnaissance, exploitation, web, and credential testing. Its Metasploit tool keeps modules, options, and Meterpreter sessions alive across model turns and context compaction, so a full engagement ends in OWASP and NIST reports.",
          },
          {
            lead: "Replaced fixed LLM concurrency with token-priced GPU admission",
            detail:
              ". Five fixed 131k-token llama.cpp slots became one 655k-token KV pool that holds any job mix whose declared context fits, from 7 concurrent 128k-context agents to 160 4k-token jobs, sized byte-exact against llama.cpp's KV-cache allocation.",
          },
          {
            lead: "Kept long-running GPU and sandbox jobs independently cancellable",
            detail:
              " and returned in-flight work to a terminal state after crashes or hangs. The Postgres scheduler combines atomic `SELECT FOR UPDATE SKIP LOCKED` claims, interactive-first, per-customer fair-share ordering, per-run process isolation, heartbeats, and process-tree cancellation.",
          },
        ],
      },
      {
        organization: "Horn Point Laboratory",
        role: "Software Engineering Intern",
        dates: "May 2024 – Aug 2024",
        context: "",
        bullets: [
          {
            lead: "Made an NSF-funded Chesapeake Bay salinity corpus directly searchable",
            detail:
              " through a retrieval-augmented chatbot, built on FAISS/OpenAI retrieval and a streaming FastAPI/LangChain service; presented at MIT URTC.",
          },
        ],
      },
    ],
    projects: [
      {
        name: "docq",
        technologies: ["Python", "SQLite/FTS5", "Ollama"],
        bullets: [
          {
            lead: "Created a cited retrieval engine",
            detail:
              " that lets coding agents search a long reference instead of loading it into context. On a leakage-screened 266-case eval, hybrid BM25/vector retrieval reached 0.67 hit@1 and beat either channel alone; a skill-primed query-rewrite A/B raised it to 0.74 (p=0.0045).",
          },
        ],
      },
      {
        name: "BitNet b1.58 (from scratch)",
        technologies: ["PyTorch", "ternary-weight LM", "byte-level", "Android"],
        bullets: [
          {
            lead: "Trained ternary-weight ({−1, 0, +1}) language models from scratch",
            detail:
              " at three sizes up to 300M parameters, then deployed one to an Android phone and profiled on-device CPU, memory, and energy.",
          },
        ],
      },
    ],
    honors: [honors.bitcamp, honors.hackumbc],
    skills: [
      { label: "AI & agents", skills: ["Agent orchestration", "tool calling", "context engineering", "guardrails", "prompt-injection defense", "model evaluation", "RAG", "LLM serving", "LangChain", "LangGraph", "llama.cpp", "llama-swap", "Ollama", "OpenAI API", "PyTorch"] },
      { label: "Languages", skills: ["Python", "Rust", "TypeScript", "SQL", "Bash"] },
      { label: "Backend & infrastructure", skills: ["Django", "FastAPI", "PostgreSQL", "Redis", "Docker", "Linux", "AWS", "Terraform", "GitHub Actions"] },
    ],
  },
  "backend-platform": {
    id: "backend-platform",
    label: "Backend & Platform",
    shortLabel: "Backend",
    headline: "Backend systems built around explicit failure modes.",
    introduction: "Queues, crash isolation, GPU admission, cloud infrastructure, and durable local services—with the concurrency and recovery mechanics left visible.",
    pdf: "/spencer-presley-backend-platform-resume.pdf",
    experience: [
      {
        organization: "CrunchAtlas",
        role: "Software Engineer",
        dates: "Nov 2025 – Present",
        context: "Local-first, air-gapped AI security platform for critical infrastructure. Sole author of the systems below.",
        bullets: [
          {
            lead: "Replaced Celery with a Postgres-native job queue",
            detail:
              " for the platform's GPU, LLM, sandbox, and document jobs, so any one job can be cancelled without killing its worker. Workers claim atomically with `SELECT FOR UPDATE SKIP LOCKED`, interactive work always runs ahead of background work, customers take fair-share turns, and dependency DAGs gate what is claimable.",
          },
          {
            lead: "Made every job reach a terminal state even when its process dies",
            detail:
              ". Each runs under a spawned (not forked) supervisor that survives a segfault or OOM kill and reaps the child's process group, and a heartbeat sweeper fails jobs whose supervisor dies or freezes. Chaos tests SIGKILL live supervisors and kill the database mid-job.",
          },
          {
            lead: "Replaced fixed LLM concurrency with token-priced GPU admission",
            detail:
              ". Five fixed 131k-token llama.cpp slots became one 655k-token KV pool that holds 7 concurrent 128k-context agents or 160 4k-token jobs; a per-pool Postgres advisory lock admits a job only when its declared tokens fit, and a claimer that waited on the lock re-prices under `READ COMMITTED`.",
          },
          {
            lead: "Made the platform investigate on its own",
            detail:
              ": a background reconciler queues the AI work that should exist with no analyst click, completing nearly 17,000 PCAP investigations in its first two months. Each dispatch commits independently behind a durable resume cursor, and a user's click promotes a queued run ahead of all background work.",
          },
          {
            lead: "Cut the Files page query from 12.3 s to 1.5 ms",
            detail:
              " on a 7.2M-row table by moving per-document alert counts into a summary table kept exact by statement-level Postgres triggers, with a reconcile job that repairs any drift.",
          },
          {
            lead: "Created the agent harness every security agent runs on",
            detail:
              " (LangChain/LangGraph). Before each model call it tokenizes the exact outgoing request and compacts or refuses anything that won't fit; it also evicts oversized tool output, detects tool-call loops, and sandboxes each run in a network-isolated container.",
          },
          {
            lead: "Own AtlasCyber's AWS across GovCloud and commercial partitions",
            detail:
              ", managed in Terraform: EC2 and its reverse-proxy/tunnel fleet, load balancers, WAF, S3, IAM, VPC networking, CloudWatch alarms, and CloudFront.",
          },
          {
            lead: "Rewrote the network-capture sensor from scratch in Rust",
            detail:
              " (`#![forbid(unsafe_code)]` workspace-wide): a headless Linux daemon whose SQLite-WAL upload queue persists each capture before upload, so queued captures survive a restart instead of being lost with the old in-memory queue.",
          },
        ],
      },
      {
        organization: "CrunchAtlas",
        role: "Software Engineer, AtlasConnect",
        dates: "Mar 2025 – Nov 2025",
        context: "Sole developer and maintainer of an inherited codebase — Django REST, React/Vite, self-hosted LLM stack.",
        bullets: [
          {
            lead: "Turned pitch decks into structured deal fields",
            detail:
              " with a document-ingestion pipeline: PDF/DOCX/PPTX/DocSend extraction, parallel OCR only on pages without a text layer, and concurrent LangChain chains under a token budget.",
          },
        ],
      },
    ],
    projects: [
      {
        name: "docq",
        technologies: ["Python", "SQLite/FTS5", "Ollama"],
        bullets: [
          {
            lead: "Created a cited retrieval engine",
            detail:
              " that lets coding agents search a long reference instead of loading it into context. On a 266-case eval, hybrid BM25/vector retrieval beat either channel alone at 0.67 hit@1; a query-rewrite A/B raised it to 0.74 (p=0.0045).",
          },
        ],
      },
      {
        name: "Celery Fork-Safety Investigation",
        technologies: ["Python", "Celery", "GDB", "LLDB", "Docker"],
        bullets: [
          {
            lead: "Traced a hanging Celery task to a fork-safety bug",
            detail:
              ": a Rust-backed vector store initialized before `fork()` left the child holding a lock whose owner didn't survive the fork. Linux deadlocked on a futex (GDB); macOS crashed in libdispatch (LLDB).",
          },
        ],
      },
    ],
    honors: [honors.bitcamp, honors.hackumbc],
    skills: [
      { label: "Backend & infrastructure", skills: ["Django", "FastAPI", "PostgreSQL", "SQLite", "Redis", "Celery", "Linux", "AWS", "Terraform"] },
      { label: "DevOps & CI/CD", skills: ["Docker (multi-stage, BuildKit)", "GitHub Actions", "Jenkins", "supervisord", "systemd"] },
      { label: "Languages", skills: ["Python", "Rust", "TypeScript", "SQL", "Bash"] },
      { label: "AI & LLM", skills: ["LangGraph/LangChain", "llama.cpp", "llama-swap", "Ollama", "LLM serving", "GPU capacity planning"] },
    ],
  },
};

export const resumeFocuses = Object.keys(resumeVariants) as ResumeFocus[];
