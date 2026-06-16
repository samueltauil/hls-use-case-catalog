// Enrichment: maps the catalog's Azure Workload Mapping strings to canonical products
// and OFFICIAL documentation links (Microsoft Learn / GitHub Docs).
//
// All URLs are official product/documentation hubs. They are verified by
// tools/check-links.mjs. No links are invented; unresolved workloads simply render
// without a link rather than guessing a URL.
(function () {
  // Canonical product entries: { name, short, learn, github, desc }
  // `short` is a chip-friendly display label (used in compact UIs like the architecture
  // diagram); `name` remains the full canonical name shown elsewhere.
  const P = {
    aml: { name: "Azure Machine Learning", short: "Machine Learning", learn: "https://learn.microsoft.com/azure/machine-learning/", desc: "Build, train, and deploy ML models." },
    openai: { name: "Azure OpenAI in Azure AI Foundry Models", short: "Azure OpenAI", learn: "https://learn.microsoft.com/azure/ai-services/openai/", desc: "GPT and reasoning models via Azure OpenAI." },
    foundry: { name: "Azure AI Foundry", short: "AI Foundry", learn: "https://learn.microsoft.com/azure/ai-foundry/", desc: "Platform for building and operating AI apps and agents." },
    aisearch: { name: "Azure AI Search", short: "AI Search", learn: "https://learn.microsoft.com/azure/search/", desc: "Retrieval and RAG grounding over your data." },
    speech: { name: "Azure AI Speech", short: "AI Speech", learn: "https://learn.microsoft.com/azure/ai-services/speech-service/", desc: "Speech-to-text, text-to-speech, translation." },
    vision: { name: "Azure AI Vision", short: "AI Vision", learn: "https://learn.microsoft.com/azure/ai-services/computer-vision/", desc: "Image analysis and document/OCR extraction." },
    botservice: { name: "Azure AI Bot Service", short: "AI Bot Service", learn: "https://learn.microsoft.com/azure/bot-service/", desc: "Build and host conversational agents and bots." },
    copilotStudio: { name: "Microsoft Copilot Studio", short: "Copilot Studio", learn: "https://learn.microsoft.com/microsoft-copilot-studio/", desc: "Low-code agents and copilots." },
    gpu: { name: "GPU-accelerated VMs (AI infrastructure)", short: "GPU VMs", learn: "https://learn.microsoft.com/azure/virtual-machines/sizes/overview", desc: "GPU compute for training and inference." },

    appservice: { name: "Azure App Service", short: "App Service", learn: "https://learn.microsoft.com/azure/app-service/", desc: "Managed web app and API hosting." },
    aca: { name: "Azure Container Apps", short: "Container Apps", learn: "https://learn.microsoft.com/azure/container-apps/", desc: "Serverless containers and microservices." },
    aks: { name: "Azure Kubernetes Service (AKS)", short: "AKS", learn: "https://learn.microsoft.com/azure/aks/", desc: "Managed Kubernetes for cloud-native apps." },
    functions: { name: "Azure Functions", short: "Functions", learn: "https://learn.microsoft.com/azure/azure-functions/", desc: "Event-driven serverless compute." },
    logicapps: { name: "Azure Logic Apps", short: "Logic Apps", learn: "https://learn.microsoft.com/azure/logic-apps/", desc: "Workflow automation and integration." },
    apim: { name: "Azure API Management", short: "API Management", learn: "https://learn.microsoft.com/azure/api-management/", desc: "Publish, secure, and govern APIs." },
    servicebus: { name: "Azure Service Bus", short: "Service Bus", learn: "https://learn.microsoft.com/azure/service-bus-messaging/", desc: "Enterprise messaging and queues." },
    eventgrid: { name: "Azure Event Grid", short: "Event Grid", learn: "https://learn.microsoft.com/azure/event-grid/", desc: "Event routing at scale." },
    acs: { name: "Azure Communication Services", short: "Communication Services", learn: "https://learn.microsoft.com/azure/communication-services/", desc: "Voice, video, chat, and SMS (incl. SignalR)." },

    ghcopilot: { name: "GitHub Copilot", short: "GitHub Copilot", learn: "https://docs.github.com/copilot", github: "https://github.com/features/copilot", desc: "AI pair programmer for developers." },
    ghas: { name: "GitHub Advanced Security", short: "GitHub Adv. Security", learn: "https://docs.github.com/code-security", desc: "Code, secret, and dependency scanning." },
    ghe: { name: "GitHub Enterprise", short: "GitHub Enterprise", learn: "https://docs.github.com/enterprise-cloud@latest", desc: "Enterprise source control and DevOps." },
    azdevops: { name: "Azure DevOps", short: "Azure DevOps", learn: "https://learn.microsoft.com/azure/devops/", desc: "Pipelines, boards, and repos." },

    cosmos: { name: "Azure Cosmos DB", short: "Cosmos DB", learn: "https://learn.microsoft.com/azure/cosmos-db/", desc: "Globally distributed NoSQL database." },
    postgres: { name: "Azure Database for PostgreSQL", short: "PostgreSQL", learn: "https://learn.microsoft.com/azure/postgresql/", desc: "Managed PostgreSQL (Flexible Server)." },
    sqldb: { name: "Azure SQL Database", short: "SQL Database", learn: "https://learn.microsoft.com/azure/azure-sql/database/", desc: "Fully managed PaaS SQL database." },
    sqlmi: { name: "Azure SQL Managed Instance", short: "SQL Managed Instance", learn: "https://learn.microsoft.com/azure/azure-sql/managed-instance/", desc: "Managed SQL with near-full engine compatibility." },
    sqlvm: { name: "SQL Server on Azure VMs", short: "SQL Server on VMs", learn: "https://learn.microsoft.com/azure/azure-sql/virtual-machines/", desc: "Lift-and-shift SQL Server on IaaS." },
    arcsql: { name: "Azure Arc-enabled SQL Server", short: "Arc-enabled SQL", learn: "https://learn.microsoft.com/sql/sql-server/azure-arc/overview", desc: "Manage and secure SQL Server anywhere." },
    fabric: { name: "Microsoft Fabric", short: "Microsoft Fabric", learn: "https://learn.microsoft.com/fabric/", desc: "Unified analytics platform on OneLake." },
    powerbi: { name: "Power BI", short: "Power BI", learn: "https://learn.microsoft.com/power-bi/", desc: "Self-service BI and reporting." },
    databricks: { name: "Azure Databricks", short: "Databricks", learn: "https://learn.microsoft.com/azure/databricks/", desc: "Lakehouse analytics and data engineering." },
    storage: { name: "Azure Storage", short: "Storage", learn: "https://learn.microsoft.com/azure/storage/", desc: "Blob, files, ADLS, and disk storage." },
    anf: { name: "Azure NetApp Files", short: "NetApp Files", learn: "https://learn.microsoft.com/azure/azure-netapp-files/", desc: "High-performance file storage." },
    purview: { name: "Microsoft Purview", short: "Purview", learn: "https://learn.microsoft.com/purview/", desc: "Unified data governance and security." },

    defender: { name: "Microsoft Defender for Cloud", short: "Defender for Cloud", learn: "https://learn.microsoft.com/azure/defender-for-cloud/", desc: "Cloud security posture and workload protection." },
    sentinel: { name: "Microsoft Sentinel", short: "Sentinel", learn: "https://learn.microsoft.com/azure/sentinel/", desc: "Cloud-native SIEM and SOAR." },
    secCopilot: { name: "Microsoft Security Copilot", short: "Security Copilot", learn: "https://learn.microsoft.com/copilot/security/", desc: "Generative AI for security operations." },
    entra: { name: "Microsoft Entra External ID", short: "Entra External ID", learn: "https://learn.microsoft.com/entra/external-id/", desc: "Identity for customers and partners." },
    firewall: { name: "Azure network security (Firewall, WAF, DDoS, Front Door, Bastion)", short: "Network security", learn: "https://learn.microsoft.com/azure/firewall/", desc: "Network protection and edge security." },

    monitor: { name: "Azure Monitor", short: "Monitor", learn: "https://learn.microsoft.com/azure/azure-monitor/", desc: "Observability, logs, and metrics." },
    governance: { name: "Azure governance (Policy & management)", short: "Governance", learn: "https://learn.microsoft.com/azure/governance/", desc: "Policy, cost, and operations at scale." },
    arc: { name: "Azure Arc-enabled servers", short: "Arc-enabled servers", learn: "https://learn.microsoft.com/azure/azure-arc/servers/", desc: "Govern and secure servers anywhere (incl. ESU)." },
    bcdr: { name: "Azure business continuity & disaster recovery", short: "BCDR", learn: "https://learn.microsoft.com/azure/reliability/concept-business-continuity-high-availability-disaster-recovery", desc: "Backup, Site Recovery, and resilience." },
    iot: { name: "Azure IoT", short: "Azure IoT", learn: "https://learn.microsoft.com/azure/iot/", desc: "Device connectivity and telemetry." },
    hpc: { name: "Azure High-Performance Computing", short: "Azure HPC", learn: "https://learn.microsoft.com/azure/architecture/topics/high-performance-computing", desc: "Elastic HPC for simulation and screening." },
    lustre: { name: "Azure Managed Lustre", short: "Managed Lustre", learn: "https://learn.microsoft.com/azure/azure-managed-lustre/", desc: "High-throughput parallel file system for HPC." },
    windows: { name: "Windows Server on Azure", short: "Windows Server", learn: "https://learn.microsoft.com/azure/virtual-machines/windows/", desc: "Run Windows Server workloads on Azure." },
    linux: { name: "Linux on Azure (incl. Red Hat)", short: "Linux on Azure", learn: "https://learn.microsoft.com/azure/virtual-machines/linux/", desc: "Run Linux and RHEL workloads on Azure." },
    sap: { name: "SAP on Azure", short: "SAP on Azure", learn: "https://learn.microsoft.com/azure/sap/", desc: "Run and modernize SAP (RISE, S/4HANA)." },
    epic: { name: "Epic on Azure", short: "Epic on Azure", learn: "https://learn.microsoft.com/industry/healthcare/", desc: "Host Epic EHR workloads on Azure." },
    mainframe: { name: "Mainframe & midrange migration", short: "Mainframe migration", learn: "https://learn.microsoft.com/azure/cloud-adoption-framework/infrastructure/mainframe-migration/", desc: "Migrate legacy mainframe/midrange to Azure." },
    oraclePg: { name: "Migrate Oracle to Azure Database for PostgreSQL", short: "Oracle → PostgreSQL", learn: "https://learn.microsoft.com/azure/postgresql/", desc: "Re-platform Oracle to open-source PostgreSQL." },
    expressroute: { name: "Azure networking & ExpressRoute", short: "ExpressRoute", learn: "https://learn.microsoft.com/azure/expressroute/", desc: "Private connectivity and core networking." },
  };

  // Prefixes used in the catalog (stripped before matching).
  const PREFIX_RE = /^(AI|Apps|Data|Sec|Infra|Security|Power Platform)\s*:\s*/i;

  // Ordered matching rules — first match wins. Most specific first.
  const RULES = [
    [/foundry models\s*-\s*openai|azure openai|\bopenai\b/i, "openai"],
    [/foundry models\s*-\s*anthropic/i, "foundry"],
    [/foundry models|ai foundry/i, "foundry"],
    [/azure machine learning|\bmachine learning\b/i, "aml"],
    [/conversational agents|bots/i, "botservice"],
    [/copilot studio/i, "copilotStudio"],
    [/security copilot/i, "secCopilot"],
    [/ai infra|gpus?/i, "gpu"],
    [/\bsearch\b/i, "aisearch"],
    [/speech/i, "speech"],
    [/vision/i, "vision"],

    [/github copilot/i, "ghcopilot"],
    [/github security|ghas/i, "ghas"],
    [/github enterprise/i, "ghe"],
    [/azure devops|devops/i, "azdevops"],

    [/api management/i, "apim"],
    [/container apps/i, "aca"],
    [/kubernetes|aks/i, "aks"],
    [/app service/i, "appservice"],
    [/functions/i, "functions"],
    [/logic apps/i, "logicapps"],
    [/service bus/i, "servicebus"],
    [/event grid/i, "eventgrid"],
    [/acs|communication services|signalr|^others/i, "acs"],

    [/arc-enabled sql/i, "arcsql"],
    [/sql paygo|sql.*payg/i, "sqlvm"],
    [/azure sql mi|sql mi|managed instance/i, "sqlmi"],
    [/azure sql db|sql.*sql db|sql database/i, "sqldb"],
    [/sql on-prem|sql vm|sql server/i, "sqlvm"],
    [/oracle/i, "oraclePg"],
    [/cosmos/i, "cosmos"],
    [/postgresql|postgres/i, "postgres"],
    [/fabric/i, "fabric"],
    [/power bi/i, "powerbi"],
    [/databricks/i, "databricks"],
    [/storage\s*-\s*anf|netapp|\banf\b/i, "anf"],
    [/hpc storage/i, "lustre"],
    [/\bhpc\b/i, "hpc"],
    [/storage|file systems|blob|adls/i, "storage"],
    [/purview|data governance/i, "purview"],

    [/defender for ai|defender for cloud|defender/i, "defender"],
    [/sentinel/i, "sentinel"],
    [/entra/i, "entra"],
    [/network security|firewall|waf|ddos|front door|bastion/i, "firewall"],
    [/expressroute|networking/i, "expressroute"],
    [/monitoring|log analytics|monitor/i, "monitor"],
    [/operations & governance|governance/i, "governance"],
    [/arc/i, "arc"],
    [/bcdr/i, "bcdr"],
    [/\biot\b/i, "iot"],
    [/windows/i, "windows"],
    [/linux|redhat|red hat/i, "linux"],
    [/sap/i, "sap"],
    [/epic/i, "epic"],
    [/mainframe|midrange/i, "mainframe"],
  ];

  function resolveWorkload(raw) {
    if (!raw) return null;
    const cleaned = String(raw).replace(PREFIX_RE, "").trim();
    for (const [re, key] of RULES) {
      if (re.test(cleaned)) {
        return { key, rawName: cleaned, ...P[key] };
      }
    }
    return { rawName: cleaned }; // no canonical match -> renders without a link
  }

  // Official Microsoft solution-area references per solution-pattern category.
  // Titles + canonical Microsoft Learn URLs (verified by tools/check-links.mjs).
  const REFERENCES = {
    AI: [
      { title: "Azure AI Foundry", url: "https://learn.microsoft.com/azure/ai-foundry/" },
      { title: "Responsible AI (Microsoft)", url: "https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai" },
    ],
    Apps: [
      { title: "Azure Architecture Center", url: "https://learn.microsoft.com/azure/architecture/" },
      { title: "Azure Well-Architected Framework", url: "https://learn.microsoft.com/azure/well-architected/" },
    ],
    Analytics: [
      { title: "Microsoft Fabric", url: "https://learn.microsoft.com/fabric/" },
      { title: "Power BI", url: "https://learn.microsoft.com/power-bi/" },
    ],
    Data: [
      { title: "Microsoft Fabric & OneLake", url: "https://learn.microsoft.com/fabric/" },
      { title: "Microsoft Purview", url: "https://learn.microsoft.com/purview/" },
    ],
    Infra: [
      { title: "Cloud Adoption Framework", url: "https://learn.microsoft.com/azure/cloud-adoption-framework/overview" },
      { title: "Azure Well-Architected Framework", url: "https://learn.microsoft.com/azure/well-architected/" },
    ],
    Security: [
      { title: "Microsoft Zero Trust", url: "https://learn.microsoft.com/security/zero-trust/zero-trust-overview" },
      { title: "Microsoft Defender for Cloud", url: "https://learn.microsoft.com/azure/defender-for-cloud/" },
    ],
  };
  // Healthcare & Life Sciences industry reference shown on every play.
  const INDUSTRY_REF = { title: "Microsoft Cloud for Healthcare", url: "https://learn.microsoft.com/industry/healthcare/" };

  // Featured Microsoft reference architecture per solution-pattern category.
  // Each is a real, named reference from Microsoft Architecture Center / Cloud Adoption
  // Framework / Industry Cloud. All links are verified by tools/check-links.mjs.
  const FEATURED_ARCH = {
    AI: {
      title: "Baseline Microsoft Foundry chat reference architecture",
      desc: "Production-grade chat with Microsoft Foundry, Azure OpenAI, and Azure AI Search — private networking, zone redundancy, content safety, and identity-based access.",
      learn: "https://learn.microsoft.com/azure/architecture/ai-ml/architecture/baseline-microsoft-foundry-chat",
      github: "https://github.com/Azure-Samples/microsoft-foundry-baseline",
      services: ["Microsoft Foundry", "Azure OpenAI", "Azure AI Search", "Azure App Service"],
    },
    Apps: {
      title: "Reliable Web App pattern",
      desc: "Prescriptive guidance to replatform web apps for the cloud — App Service + Azure Front Door + Managed Redis with Retry, Circuit Breaker, and Cache-Aside patterns.",
      learn: "https://learn.microsoft.com/azure/architecture/web-apps/guides/enterprise-app-patterns/reliable-web-app/dotnet/guidance",
      github: "https://github.com/Azure/reliable-web-app-pattern-dotnet",
      services: ["Azure App Service", "Azure Front Door", "Azure Managed Redis", "Microsoft Entra ID"],
    },
    Analytics: {
      title: "Analytics end-to-end with Microsoft Fabric",
      desc: "Unified data platform on Fabric and OneLake — ingestion, lakehouse / warehouse / eventhouse, machine learning, and Power BI on a single Delta Lake foundation.",
      learn: "https://learn.microsoft.com/azure/architecture/example-scenario/dataplate2e/data-platform-end-to-end",
      services: ["Microsoft Fabric", "OneLake", "Power BI", "Real-Time Intelligence"],
    },
    Data: {
      title: "Medallion lakehouse architecture for Microsoft Fabric with OneLake",
      desc: "Bronze → silver → gold layers in OneLake with Delta Lake — ACID guarantees, time-travel, and integrated lineage and governance.",
      learn: "https://learn.microsoft.com/fabric/onelake/onelake-medallion-lakehouse-architecture",
      services: ["Microsoft Fabric", "OneLake", "Delta Lake", "Microsoft Purview"],
    },
    Infra: {
      title: "Azure landing zone (Cloud Adoption Framework)",
      desc: "Enterprise-scale, hub-spoke target architecture aligned to CAF design areas — identity, networking, security, management, governance, and platform automation.",
      learn: "https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/",
      github: "https://github.com/Azure/Enterprise-Scale",
      services: ["Hub-spoke network", "Microsoft Entra ID", "Azure Policy", "Azure Monitor"],
    },
    Security: {
      title: "Apply Zero Trust principles to Azure infrastructure",
      desc: "Reference architecture applying Verify-explicitly · Least-privilege · Assume-breach across identity, network, data, and apps on Azure.",
      learn: "https://learn.microsoft.com/security/zero-trust/azure-infrastructure-overview",
      services: ["Microsoft Entra ID", "Azure Firewall", "Microsoft Defender for Cloud", "Microsoft Sentinel"],
    },
  };

  // Healthcare-industry reference architecture (Microsoft Cloud for Healthcare).
  // Surfaced on every Health Providers / Health Payers play.
  const HEALTHCARE_ARCH = {
    title: "Microsoft for Healthcare end-to-end reference architecture",
    desc: "Microsoft Cloud for Healthcare with Azure Health Data Services — FHIR, DICOM, and MedTech services for HIPAA/HITRUST-aligned PHI exchange and analytics.",
    learn: "https://learn.microsoft.com/industry/healthcare/architecture/fhir-workloads",
    services: ["Azure Health Data Services", "FHIR service", "DICOM service", "MedTech service"],
  };

  // The five Microsoft Azure Well-Architected Framework pillars (universal — same for every
  // workload). Concerns and URLs are taken verbatim from the WAF pillars page on Microsoft Learn.
  const WAF_PILLARS = [
    { id: "Reliability",            short: "RE", icon: "shield",    concern: "Resiliency, availability, and recovery",          url: "https://learn.microsoft.com/azure/well-architected/reliability/" },
    { id: "Security",               short: "SE", icon: "lock",      concern: "Data protection, threat detection, and mitigation", url: "https://learn.microsoft.com/azure/well-architected/security/" },
    { id: "Cost Optimization",      short: "CO", icon: "trending",  concern: "Cost modeling, budgets, and reducing waste",      url: "https://learn.microsoft.com/azure/well-architected/cost-optimization/" },
    { id: "Operational Excellence", short: "OE", icon: "spark",     concern: "Observability and DevOps practices",              url: "https://learn.microsoft.com/azure/well-architected/operational-excellence/" },
    { id: "Performance Efficiency", short: "PE", icon: "bolt",      concern: "Scalability and adaptability under load",         url: "https://learn.microsoft.com/azure/well-architected/performance-efficiency/" },
  ];
  const WAF_OVERVIEW_URL = "https://learn.microsoft.com/azure/well-architected/pillars";

  function referencesFor(category) {
    return (REFERENCES[category] || []).concat([INDUSTRY_REF]);
  }
  function featuredArchFor(category, subverticalId) {
    const f = FEATURED_ARCH[category] || null;
    const industry = (subverticalId === "health-providers" || subverticalId === "health-payers") ? HEALTHCARE_ARCH : null;
    return { featured: f, industry };
  }

  window.ENRICHMENT = {
    products: P, resolveWorkload,
    references: REFERENCES, industryRef: INDUSTRY_REF, referencesFor,
    featured: FEATURED_ARCH, healthcareArch: HEALTHCARE_ARCH,
    featuredArchFor, wafPillars: WAF_PILLARS, wafOverviewUrl: WAF_OVERVIEW_URL,
  };
  window.resolveWorkload = resolveWorkload;
  window.referencesFor = referencesFor;
  window.featuredArchFor = featuredArchFor;
})();
