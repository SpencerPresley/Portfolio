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
    introduction:
      "Agent runtimes, local model serving, GPU admission, and evidence-grounded products—built as production systems rather than model demos.",
    pdf: "/spencer-presley-ai-llm-resume.pdf",
    experience: [
      {
        organization: "CrunchAtlas",
        role: "Software Engineer",
        dates: "Mar 2025 – Present",
        context:
          "Local-first, air-gapped AI security platform for critical infrastructure. Sole author of the systems below.",
        bullets: [
          {
            lead: "Built the PCAP analysis agent",
            detail:
              ", the platform's most-used investigation agent: an autonomous LLM works a packet capture end to end (protocol recon, DNS/HTTP/TLS, file carving, IOC extraction, timeline) into a cited report and triage verdict. It reasons only over the output of a real forensic toolchain it drives (tshark, Zeek, foremost), never raw packets, so every value it reports traces to tool evidence.",
          },
          {
            lead: "Built PurpleHaze",
            detail:
              ", an autonomous penetration-testing product: a local LLM drives Metasploit and real offensive tooling through a full multi-step engagement, holds session state across long runs, and produces compliance-grade OWASP and NIST reports, with no human in the loop.",
          },
          {
            lead: "Built the in-house agent runtime",
            detail:
              " every analysis agent runs on (LangChain/LangGraph): context compaction that counts real tokens and fails closed instead of overflowing, plus tool-output eviction, loop detection, and per-run container sandboxing (fresh, network-isolated, self-reaping).",
          },
          {
            lead: "Built the Postgres-native job queue",
            detail:
              " that replaced Celery for the platform's GPU, LLM, and sandbox jobs, so a burst of heavy AI work can't OOM an air-gapped box and any one job can be cancelled without killing its worker. It runs on atomic per-lane claiming (`SELECT FOR UPDATE SKIP LOCKED`), priority-FIFO ordering, dependency DAGs with cycle detection, and lock-free single-flight.",
          },
          {
            lead: "Built the local LLM serving stack",
            detail:
              " (llama.cpp behind llama-swap) with a byte-exact VRAM fit-proof: a Python model reproduces llama.cpp's KV-cache allocation to the exact byte across grouped-query attention, sliding-window layers, and per-K/V quantization, so a deployment's fit is proven in CI with no GPU or running server.",
          },
          {
            lead: "Built GPU-memory admission control",
            detail:
              " so concurrent LLM jobs can't overcommit one card: a per-pool Postgres advisory lock admits a job only when its declared context-token cost fits the pool's live budget, and a runtime `READ COMMITTED` requirement makes a claimer that waited on the lock re-price against just-committed usage instead of a stale snapshot.",
          },
          {
            lead: "Built the agent that maps captured network activity to MITRE ATT&CK",
            detail:
              ": capture-time validation rejects technique IDs the model hallucinates, and a measurable retrieval eval (Recall@k/MRR with regression floors) gates changes before any agent runs.",
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
            lead: "Built a retrieval-augmented chatbot",
            detail:
              " for an NSF-funded Chesapeake Bay salinity project (SaltCast) at Horn Point Laboratory: FAISS retrieval over OpenAI embeddings feeding a streaming FastAPI/LangChain service; presented at the MIT Undergraduate Research Technology Conference.",
          },
        ],
      },
    ],
    projects: [
      {
        name: "BitNet b1.58 (from scratch)",
        technologies: [
          "PyTorch",
          "ternary-weight LM",
          "byte-level",
          "Android",
        ],
        bullets: [
          {
            lead: "Reimplemented and trained BitNet b1.58",
            detail:
              " ternary-weight ({−1, 0, +1}) language models from scratch at three sizes up to 300M parameters (byte-level, on enwik8/9), and deployed a trained checkpoint to an Android phone (Chaquopy), profiling on-device CPU, memory, and energy—undergraduate research on quantization-native models for edge inference.",
          },
        ],
      },
      {
        name: "gloss",
        technologies: ["Python", "SQLite/FTS5", "Ollama"],
        bullets: [
          {
            lead: "Built a hybrid retrieval engine",
            detail:
              " that fuses BM25 with a local-embedding vector channel via reciprocal-rank fusion to return a source document's verbatim, cited passages—tuned against a 266-case evaluation gated by a paired significance test (hit@5 0.94, hit@1 0.71).",
          },
        ],
      },
    ],
    honors: [honors.hackumbc, honors.bitcamp],
    skills: [
      {
        label: "AI & LLM",
        skills: [
          "LangGraph/LangChain",
          "llama.cpp",
          "llama-swap",
          "Ollama",
          "OpenAI API",
          "RAG",
          "FAISS/vector search",
          "model fine-tuning",
          "LLM serving",
          "GPU memory management",
          "tiktoken",
        ],
      },
      {
        label: "Languages",
        skills: ["Python", "Rust", "TypeScript", "SQL", "Bash"],
      },
      {
        label: "Backend & Infrastructure",
        skills: [
          "Django",
          "FastAPI",
          "PostgreSQL",
          "MongoDB",
          "Redis",
          "Celery",
          "Docker",
          "Linux",
          "AWS",
        ],
      },
    ],
  },
  "backend-platform": {
    id: "backend-platform",
    label: "Backend & Platform",
    shortLabel: "Backend",
    headline: "Backend systems built around explicit failure modes.",
    introduction:
      "Queues, crash isolation, GPU admission, cloud infrastructure, and durable local services—with the concurrency and recovery mechanics left visible.",
    pdf: "/spencer-presley-backend-platform-resume.pdf",
    experience: [
      {
        organization: "CrunchAtlas",
        role: "Software Engineer",
        dates: "Nov 2025 – Present",
        context:
          "Local-first, air-gapped AI security platform for critical infrastructure. Sole author of the systems below.",
        bullets: [
          {
            lead: "Built the Postgres-native job queue",
            detail:
              " that replaced Celery for the platform's GPU, LLM, and sandbox jobs, so a burst of heavy AI work can't OOM an air-gapped box and any one job can be cancelled without killing its worker. It runs on atomic per-lane claiming (`SELECT FOR UPDATE SKIP LOCKED`), priority-FIFO ordering, dependency DAGs with cycle detection, and lock-free single-flight.",
          },
          {
            lead: "Engineered the queue's crash-isolation",
            detail:
              " so no job hangs non-terminal: each job runs in a spawned (not forked) supervisor that survives a segfault or OOM-kill and reaps the child's process group, while a heartbeat sweeper force-fails jobs whose supervisor dies or freezes (catching a frozen-but-alive one a PID check would miss). Chaos tests SIGKILL live supervisors and kill the database mid-job to prove it.",
          },
          {
            lead: "Built GPU-memory admission control",
            detail:
              " so concurrent LLM jobs can't overcommit one card: a per-pool Postgres advisory lock admits a job only when its declared context-token cost fits the pool's live budget, and a runtime `READ COMMITTED` requirement makes a claimer that waited on the lock re-price against just-committed usage instead of a stale snapshot.",
          },
          {
            lead: "Built the in-house agent runtime",
            detail:
              " the platform's security agents run on (LangChain/LangGraph): context compaction that counts real tokens and fails closed instead of overflowing, plus tool-output eviction, loop detection, and per-run container sandboxing (fresh, network-isolated, self-reaping).",
          },
          {
            lead: "Built PurpleHaze",
            detail:
              ", an autonomous penetration-testing product: a local LLM drives Metasploit and real offensive tooling through a full multi-step engagement, holds session state across long runs, and produces compliance-grade OWASP and NIST reports, with no human in the loop.",
          },
          {
            lead: "Sole owner of AtlasCyber's AWS",
            detail:
              ", end to end across GovCloud and commercial partitions: EC2 (with a reverse-proxy/tunnel fleet), S3, IAM, VPC networking, and CloudFront.",
          },
          {
            lead: "Rewrote the network-capture sensor from scratch in Rust",
            detail:
              ", memory-safe workspace-wide (`#![forbid(unsafe_code)]`): a headless Linux daemon around a crash-safe SQLite-WAL upload queue that persists each capture before upload and survives a restart without dropping data, replacing the prior lossy in-memory queue.",
          },
        ],
      },
      {
        organization: "CrunchAtlas",
        role: "Software Engineer, AtlasConnect",
        dates: "Mar 2025 – Nov 2025",
        context:
          "Sole developer and maintainer of an inherited codebase—Django REST, React/Vite, self-hosted LLM stack.",
        bullets: [
          {
            lead: "Built the document-ingestion pipeline",
            detail:
              " for deal intake: multi-format extraction (PDF/DOCX/PPTX/DocSend) with selective parallel OCR on scanned pages, feeding concurrent LangChain chains under a managed token budget.",
          },
        ],
      },
    ],
    projects: [
      {
        name: "gloss",
        technologies: ["Python", "SQLite/FTS5", "Ollama"],
        bullets: [
          {
            lead: "Built a hybrid retrieval engine",
            detail:
              " that fuses BM25 with a local-embedding vector channel via reciprocal-rank fusion to return a source document's verbatim, cited passages, tuned against a 266-case evaluation gated by a paired significance test (hit@5 0.94, hit@1 0.71).",
          },
        ],
      },
      {
        name: "Celery Fork-Safety Investigation",
        technologies: ["Python", "Celery", "GDB", "LLDB", "Docker"],
        bullets: [
          {
            lead: "Root-caused a Celery prefork fork-safety bug",
            detail:
              " to the register level: a Rust-backed vector store initialized before `fork()` left the child inheriting a lock whose owner didn't survive the fork—a permanent futex deadlock on Linux (traced in GDB) and a libdispatch semaphore crash on macOS (traced in LLDB). One cause, two OS-level failure modes.",
          },
        ],
      },
    ],
    honors: [honors.bitcamp, honors.hackumbc],
    skills: [
      {
        label: "Backend & Infrastructure",
        skills: [
          "Django",
          "FastAPI",
          "PostgreSQL",
          "MongoDB",
          "SQLite",
          "Redis",
          "Celery",
          "Linux",
          "AWS",
        ],
      },
      {
        label: "DevOps & CI/CD",
        skills: [
          "Docker (multi-stage, BuildKit)",
          "GitHub Actions",
          "Jenkins",
          "supervisord",
          "systemd",
        ],
      },
      {
        label: "Languages",
        skills: ["Python", "Rust", "TypeScript", "SQL", "Bash"],
      },
      {
        label: "AI & LLM",
        skills: [
          "LangGraph/LangChain",
          "llama.cpp",
          "llama-swap",
          "Ollama",
          "LLM serving",
          "GPU memory management",
        ],
      },
    ],
  },
};

export const resumeFocuses = Object.keys(resumeVariants) as ResumeFocus[];
