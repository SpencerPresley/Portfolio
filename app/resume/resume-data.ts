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

export type ResumeHonor = {
  text: string;
  href: string;
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
  honors: ResumeHonor[];
  skills: ResumeSkillGroup[];
};

export const resumeEducation = {
  institution: "Salisbury University",
  degree: "B.S. Computer Science, Minor in Mathematics",
  dates: "May 2025",
};

const honors = {
  bitcamp: {
    text: "1st Place / Best Hack — Bitcamp 2024, UMD (largest US East Coast hackathon) — TermBook",
    href: "/projects/termbook",
  },
  hackumbc: {
    text: "Best Educational Hack & 2nd Overall — HackUMBC 2024 — Testif.AI",
    href: "/projects/testifai",
  },
} satisfies Record<string, ResumeHonor>;

export type ResumeSection = {
  title: string;
  context: string;
  bullets: ResumeBullet[];
};

// Site-only: the edge/networking work behind the platform. Not on the one-page
// PDFs; shown on both resume tabs.
export const resumeEdgeWork: ResumeSection = {
  title: "Edge & networking",
  context:
    "CrunchAtlas: how the platform's on-prem GPU boxes are reached from the internet, all declared in Terraform.",
  bullets: [
    {
      lead: "Exposed on-prem boxes without opening a single inbound port",
      detail:
        ". A remotely managed Cloudflare Tunnel (`cloudflared`, outbound-only) carries traffic from Cloudflare's edge, where DNS, TLS, WAF rules, and bot management are declared in Terraform; the box holds only the daemon and its token.",
    },
    {
      lead: "Built a reusable AWS edge module",
      detail:
        ": an ALB terminates TLS behind a US-only WAF with a per-IP login rate limit and forwards to a single nginx bastion that reaches the on-box app over WireGuard. The whole bastion (packages, firewalld, WireGuard, nginx, journald, a tunnel probe) renders from Terraform user data, and plan-only `terraform test` runs cover it against mocked AWS.",
    },
    {
      lead: "Adopted two hand-built SSH reverse-tunnel edges into Terraform",
      detail:
        " with import blocks, exactly as they were, then hardened them one reviewed plan at a time: dedicated ALB security groups, WAF, Elastic IPs, VPC flow logs, CloudWatch health alarms, and certificate-expiry alerts through EventBridge and SNS.",
    },
    {
      lead: "Versioned every box's host config in the repo",
      detail:
        " (systemd units, supervisord-managed tunnels, firewall rules, WireGuard), with a deploy-time drift gate that fails the deploy when a box has diverged from what is committed.",
    },
  ],
};

// Skill chips link out when an entry exists here.
export const skillLinks: Record<string, string> = {
  Python: "https://www.python.org",
  Rust: "https://www.rust-lang.org",
  TypeScript: "https://www.typescriptlang.org",
  Bash: "https://www.gnu.org/software/bash/",
  LangChain: "https://www.langchain.com",
  LangGraph: "https://www.langchain.com/langgraph",
  "llama.cpp": "https://github.com/ggml-org/llama.cpp",
  "llama-swap": "https://github.com/mostlygeek/llama-swap",
  Ollama: "https://ollama.com",
  "OpenAI API": "https://platform.openai.com/docs",
  "Anthropic API (prompt caching)":
    "https://docs.claude.com/en/docs/build-with-claude/prompt-caching",
  Pydantic: "https://docs.pydantic.dev",
  NumPy: "https://numpy.org",
  "Django REST Framework": "https://www.django-rest-framework.org",
  Lambda: "https://aws.amazon.com/lambda/",
  SES: "https://aws.amazon.com/ses/",
  Amplify: "https://aws.amazon.com/amplify/",
  Zod: "https://zod.dev",
  Lua: "https://www.lua.org",
  PyTorch: "https://pytorch.org",
  Django: "https://www.djangoproject.com",
  "Django Ninja": "https://django-ninja.dev",
  FastAPI: "https://fastapi.tiangolo.com",
  PostgreSQL: "https://www.postgresql.org",
  SQLite: "https://sqlite.org",
  Redis: "https://redis.io",
  Celery: "https://docs.celeryq.dev",
  Linux: "https://www.kernel.org",
  EC2: "https://aws.amazon.com/ec2/",
  "RDS for PostgreSQL": "https://aws.amazon.com/rds/postgresql/",
  S3: "https://aws.amazon.com/s3/",
  "CloudFront (VPC origins, Functions)": "https://aws.amazon.com/cloudfront/",
  "Application Load Balancer":
    "https://aws.amazon.com/elasticloadbalancing/application-load-balancer/",
  WAF: "https://aws.amazon.com/waf/",
  "Certificate Manager": "https://aws.amazon.com/certificate-manager/",
  "Route 53": "https://aws.amazon.com/route53/",
  "VPC (NAT, endpoints, flow logs)": "https://aws.amazon.com/vpc/",
  "IAM (GitHub OIDC)": "https://aws.amazon.com/iam/",
  ECR: "https://aws.amazon.com/ecr/",
  "Systems Manager (Parameter Store, Run Command)":
    "https://aws.amazon.com/systems-manager/",
  CloudWatch: "https://aws.amazon.com/cloudwatch/",
  EventBridge: "https://aws.amazon.com/eventbridge/",
  SNS: "https://aws.amazon.com/sns/",
  "GovCloud (US)": "https://aws.amazon.com/govcloud-us/",
  "Cloudflare Tunnel":
    "https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/",
  "Cloudflare WAF": "https://developers.cloudflare.com/waf/",
  nginx: "https://nginx.org",
  WireGuard: "https://www.wireguard.com",
  "SSH reverse tunnels": "https://www.openssh.com",
  firewalld: "https://firewalld.org",
  "Terraform (modules, import blocks, terraform test)":
    "https://developer.hashicorp.com/terraform",
  "GitHub Actions (self-hosted runners, reusable workflows, OIDC)":
    "https://docs.github.com/actions",
  "Docker (multi-stage, BuildKit cache mounts)": "https://docs.docker.com",
  "Docker Compose (profiles, healthchecks, NVIDIA GPU)":
    "https://docs.docker.com/compose/",
  Jenkins: "https://www.jenkins.io",
  supervisord: "http://supervisord.org",
  systemd: "https://systemd.io",
  uv: "https://docs.astral.sh/uv/",
  Ruff: "https://docs.astral.sh/ruff/",
  Semgrep: "https://semgrep.dev",
  actionlint: "https://github.com/rhysd/actionlint",
  "pip-audit": "https://github.com/pypa/pip-audit",
  Tokio: "https://tokio.rs",
  Tauri: "https://tauri.app",
  axum: "https://github.com/tokio-rs/axum",
  rusqlite: "https://github.com/rusqlite/rusqlite",
  libpcap: "https://www.tcpdump.org",
  Clippy: "https://doc.rust-lang.org/clippy/",
  "cargo-deny": "https://embarkstudios.github.io/cargo-deny/",
  "cargo-deb": "https://github.com/kornelski/cargo-deb",
  React: "https://react.dev",
  "Next.js": "https://nextjs.org",
  Vite: "https://vite.dev",
  "TanStack Query": "https://tanstack.com/query",
  orval: "https://orval.dev",
  "Tailwind CSS": "https://tailwindcss.com",
  Playwright: "https://playwright.dev",
};

const skillGroups = {
  ai: {
    label: "AI & agents",
    skills: [
      "Agent orchestration",
      "tool calling",
      "context engineering",
      "guardrails",
      "prompt-injection defense",
      "model evaluation",
      "RAG",
      "LLM serving",
      "GPU capacity planning",
      "LangChain",
      "LangGraph",
      "llama.cpp",
      "llama-swap",
      "Ollama",
      "OpenAI API",
      "Anthropic API (prompt caching)",
      "Pydantic",
      "model fine-tuning",
      "PyTorch",
      "NumPy",
    ],
  },
  languages: {
    label: "Languages",
    skills: ["Python", "Rust", "TypeScript", "SQL", "Bash", "Lua"],
  },
  backend: {
    label: "Backend & data",
    skills: [
      "Django",
      "Django REST Framework",
      "Django Ninja",
      "FastAPI",
      "PostgreSQL",
      "SQLite",
      "Redis",
      "Celery",
      "Linux",
    ],
  },
  aws: {
    label: "AWS",
    skills: [
      "EC2",
      "RDS for PostgreSQL",
      "S3",
      "CloudFront (VPC origins, Functions)",
      "Application Load Balancer",
      "WAF",
      "Certificate Manager",
      "Route 53",
      "VPC (NAT, endpoints, flow logs)",
      "IAM (GitHub OIDC)",
      "ECR",
      "Lambda",
      "SES",
      "Amplify",
      "Systems Manager (Parameter Store, Run Command)",
      "CloudWatch",
      "EventBridge",
      "SNS",
      "GovCloud (US)",
    ],
  },
  edge: {
    label: "Edge & networking",
    skills: [
      "Cloudflare Tunnel",
      "Cloudflare WAF",
      "nginx",
      "WireGuard",
      "SSH reverse tunnels",
      "firewalld",
    ],
  },
  delivery: {
    label: "IaC, CI/CD & containers",
    skills: [
      "Terraform (modules, import blocks, terraform test)",
      "GitHub Actions (self-hosted runners, reusable workflows, OIDC)",
      "Docker (multi-stage, BuildKit cache mounts)",
      "Docker Compose (profiles, healthchecks, NVIDIA GPU)",
      "Jenkins",
      "supervisord",
      "systemd",
      "uv",
      "Ruff",
      "Semgrep",
      "actionlint",
      "pip-audit",
    ],
  },
  rust: {
    label: "Rust & systems",
    skills: [
      "Tokio",
      "Tauri",
      "axum",
      "rusqlite",
      "libpcap",
      "Clippy",
      "cargo-deny",
      "cargo-deb",
    ],
  },
  frontend: {
    label: "Frontend",
    skills: [
      "React",
      "Next.js",
      "Vite",
      "TanStack Query",
      "orval",
      "Zod",
      "Tailwind CSS",
      "Playwright",
    ],
  },
} satisfies Record<string, ResumeSkillGroup>;

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
            lead: "Created the company's agent platform from scratch.",
            detail:
              " A shared harness supplies model construction, retries, structured-output repair, context management, tool guardrails, per-task budgets, LangGraph-checkpointed run state, and typed lifecycle events; each agent adds only its domain prompt, tools, state, and graph.",
          },
          {
            lead: "Kept long agent runs inside a bounded context.",
            detail:
              " Before every llama.cpp call the harness tokenizes the exact request and refuses anything that won't fit; it condenses a filling run to its objective, completed work, and next steps, moves oversized tool results to searchable files, and drops a truncated turn before memory or tools see it.",
          },
          {
            lead: "Gave understaffed critical-infrastructure teams on-demand packet forensics",
            detail:
              " through the platform's most-used agent. It drives tshark, Zeek, and foremost from an IDS alert through protocol reconstruction, IOC extraction, file carving, and timeline analysis, then delivers a cited report and triage verdict.",
          },
          {
            lead: "Made the platform investigate on its own",
            detail:
              ", completing nearly 17,000 PCAP investigations in its first two months with no analyst click. A background reconciler decides which AI work should exist and queues it, recording its progress durably so a crash loses nothing already queued.",
          },
          {
            lead: "Shipped PurpleHaze",
            detail:
              ", an autonomous penetration-testing product covering reconnaissance, exploitation, web, and credential testing. Its Metasploit tool keeps modules, options, and Meterpreter sessions alive across model turns and context compaction, so a full engagement ends in OWASP and NIST reports.",
          },
          {
            lead: "Replaced fixed LLM concurrency with token-budgeted GPU scheduling.",
            detail:
              " Five fixed 131k-token llama.cpp slots became one 655k-token KV-cache pool that holds any job mix whose declared context fits, from 7 concurrent 128k-context agents to 160 4k-token jobs, sized byte-exact against llama.cpp's KV cache.",
          },
          {
            lead: "Kept long-running GPU and sandbox jobs independently cancellable",
            detail:
              " and returned in-flight work to a terminal state after crashes or hangs. The Postgres scheduler combines atomic `SELECT FOR UPDATE SKIP LOCKED` claims, interactive-first fair-share ordering, per-run process isolation, heartbeats, and process-tree cancellation.",
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
            lead: "Made an NSF-funded Chesapeake Bay salinity corpus searchable",
            detail:
              " through a RAG chatbot (FAISS, OpenAI, streaming FastAPI/LangChain); presented at the MIT Undergraduate Research Technology Conference.",
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
              " that lets coding agents search a long reference instead of loading all of it. On a leakage-screened 266-case eval, hybrid BM25/vector retrieval reached 0.67 hit@1 and beat either channel alone; a instruction-based query-rewrite A/B raised it to 0.74 (p=0.0045).",
          },
        ],
      },
      {
        name: "BitNet b1.58 Reimplementation",
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
      skillGroups.ai,
      skillGroups.languages,
      skillGroups.backend,
      skillGroups.aws,
      skillGroups.edge,
      skillGroups.delivery,
      skillGroups.rust,
      skillGroups.frontend,
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
            lead: "Replaced Celery with a Postgres-native job queue",
            detail:
              " for the platform's GPU, LLM, sandbox, and document jobs, so any one job can be cancelled without killing its worker. Interactive work runs ahead of background work, customers take fair-share turns, dependency DAGs gate what is claimable, and workers claim with `SELECT FOR UPDATE SKIP LOCKED`.",
          },
          {
            lead: "Made every job reach a terminal state, even when its process dies.",
            detail:
              " Each runs under a spawned (not forked) supervisor that survives a segfault or OOM kill and reaps the child's process group, and a heartbeat sweeper fails jobs whose supervisor dies or freezes. Chaos tests SIGKILL live supervisors and kill the database mid-job.",
          },
          {
            lead: "Replaced fixed LLM concurrency with token-budgeted GPU scheduling.",
            detail:
              " Five fixed 131k-token llama.cpp slots became one 655k-token KV-cache pool that holds 7 concurrent 128k-context agents or 160 4k-token jobs; a per-pool Postgres advisory lock admits a job only when its tokens fit, re-pricing under `READ COMMITTED` after any wait.",
          },
          {
            lead: "Made the platform investigate on its own",
            detail:
              ", completing nearly 17,000 PCAP investigations in its first two months with no analyst click. A background reconciler queues the AI work that should exist, recording its progress durably so a crash loses nothing already queued.",
          },
          {
            lead: "Cut the main document-list query from 12.3 s to 1.5 ms",
            detail:
              " on a 7.2M-row table by moving per-document alert counts into a summary table kept exact by statement-level Postgres triggers, with a reconcile job that repairs drift.",
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
              " (`#![forbid(unsafe_code)]`): a headless Linux daemon whose SQLite-WAL upload queue persists each capture before upload, so queued captures survive a restart.",
          },
        ],
      },
      {
        organization: "CrunchAtlas",
        role: "Software Engineer, AtlasConnect",
        dates: "Mar 2025 – Nov 2025",
        context:
          "Sole developer and maintainer of an inherited codebase — Django REST, React/Vite, self-hosted LLM stack.",
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
              " that lets coding agents search a long reference without loading it. On a 266-case eval, hybrid BM25/vector retrieval beat either channel alone at 0.67 hit@1; a query-rewrite A/B raised it to 0.74 (p=0.0045).",
          },
        ],
      },
      {
        name: "Celery Fork-Safety Investigation",
        technologies: ["Python", "Celery", "GDB", "LLDB", "Docker"],
        bullets: [
          {
            lead: "Traced a Celery hang to fork safety",
            detail:
              ": a Rust-backed vector store initialized before `fork()` left the child holding a lock whose owning thread didn't survive the fork. Linux deadlocked on a futex (GDB); macOS crashed in libdispatch (LLDB).",
          },
        ],
      },
    ],
    honors: [honors.bitcamp, honors.hackumbc],
    skills: [
      skillGroups.backend,
      skillGroups.aws,
      skillGroups.edge,
      skillGroups.delivery,
      skillGroups.languages,
      skillGroups.rust,
      skillGroups.ai,
      skillGroups.frontend,
    ],
  },
};

export const resumeFocuses = Object.keys(resumeVariants) as ResumeFocus[];
