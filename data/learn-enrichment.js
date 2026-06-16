// Microsoft Learn-sourced enrichment.
// Capability highlights and objection guidance are grounded in official Microsoft Learn
// documentation; each carries a `source`/`url` link for verification. No customer-specific
// facts, metrics, or claims are invented here. Verified by tools/check-links.mjs.
(function () {
  // Official capability highlights per canonical product (keys match data/enrichment.js).
  const CAPABILITIES = {
    openai: { source: "https://learn.microsoft.com/azure/ai-foundry/openai/overview", items: [
      "GPT-4o and o-series reasoning models, with fine-tuning",
      "Built-in content filtering and Responsible AI controls",
      "Private networking and Microsoft Entra managed identity",
    ] },
    foundry: { source: "https://learn.microsoft.com/azure/ai-foundry/", items: [
      "Build, evaluate, and operate AI apps and agents",
      "Access models from OpenAI, Microsoft, and partners",
      "Built-in evaluations, tracing, and content safety",
    ] },
    aisearch: { source: "https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview", items: [
      "Hybrid vector + keyword retrieval with semantic ranking",
      "Grounds LLM answers (RAG) with citation tracking",
      "Document-level security trimming and private endpoints",
    ] },
    speech: { source: "https://learn.microsoft.com/azure/ai-services/speech-service/", items: [
      "Real-time and batch speech to text",
      "Text to speech with natural and custom voices",
      "Speech translation across many languages",
    ] },
    vision: { source: "https://learn.microsoft.com/azure/ai-services/computer-vision/", items: [
      "Image analysis and OCR text extraction",
      "Document and form understanding",
      "Spatial analysis and image tagging",
    ] },
    botservice: { source: "https://learn.microsoft.com/azure/bot-service/", items: [
      "Build and host conversational agents",
      "Connect to web, Teams, and telephony channels",
      "Human handoff with conversation transcripts",
    ] },
    copilotStudio: { source: "https://learn.microsoft.com/microsoft-copilot-studio/", items: [
      "Low-code authoring of agents and copilots",
      "Knowledge grounding with generative answers",
      "Actions and connectors with governance",
    ] },
    aml: { source: "https://learn.microsoft.com/azure/machine-learning/", items: [
      "Train, deploy, and manage ML models",
      "MLOps pipelines and managed online endpoints",
      "Responsible AI dashboard for fairness and explainability",
    ] },
    fabric: { source: "https://learn.microsoft.com/fabric/", items: [
      "Unified analytics on OneLake — one copy of data",
      "Data engineering, warehouse, and real-time intelligence",
      "Power BI and Copilot built in",
    ] },
    databricks: { source: "https://learn.microsoft.com/azure/databricks/", items: [
      "Lakehouse for data engineering and ML",
      "Delta Lake reliable, governed storage",
      "Collaborative notebooks and scheduled jobs",
    ] },
    purview: { source: "https://learn.microsoft.com/purview/", items: [
      "Data discovery, classification, and lineage",
      "Sensitivity labeling and data loss prevention",
      "Unified data governance and security",
    ] },
    sentinel: { source: "https://learn.microsoft.com/azure/sentinel/", items: [
      "Cloud-native SIEM with analytics rules",
      "SOAR automation playbooks",
      "Threat intelligence and proactive hunting",
    ] },
    defender: { source: "https://learn.microsoft.com/azure/defender-for-cloud/", items: [
      "Cloud security posture management (CSPM)",
      "Workload protection for servers, data, and AI",
      "Secure score and regulatory compliance",
    ] },
    appservice: { source: "https://learn.microsoft.com/azure/app-service/", items: [
      "Managed hosting for web apps and APIs",
      "Autoscale, deployment slots, and CI/CD",
      "Built-in authentication and TLS",
    ] },
    aks: { source: "https://learn.microsoft.com/azure/aks/", items: [
      "Managed Kubernetes for containerized apps",
      "Autoscaling and self-healing",
      "Integrated identity and monitoring",
    ] },
    aca: { source: "https://learn.microsoft.com/azure/container-apps/", items: [
      "Serverless containers and microservices",
      "Scale to zero and event-driven scaling",
      "Built-in Dapr and ingress",
    ] },
    functions: { source: "https://learn.microsoft.com/azure/azure-functions/", items: [
      "Event-driven serverless compute",
      "Rich set of triggers and bindings",
      "Consumption billing and scale on demand",
    ] },
    logicapps: { source: "https://learn.microsoft.com/azure/logic-apps/", items: [
      "Low-code workflow automation",
      "Hundreds of prebuilt connectors",
      "Enterprise integration patterns",
    ] },
    apim: { source: "https://learn.microsoft.com/azure/api-management/", items: [
      "Publish, secure, and version APIs",
      "Policies for throttling and transformation",
      "Developer portal and analytics",
    ] },
    cosmos: { source: "https://learn.microsoft.com/azure/cosmos-db/", items: [
      "Globally distributed NoSQL database",
      "Low latency with elastic scale",
      "Multiple APIs and integrated vector search",
    ] },
    postgres: { source: "https://learn.microsoft.com/azure/postgresql/", items: [
      "Managed PostgreSQL (Flexible Server)",
      "High availability and automated backups",
      "pgvector for AI/RAG workloads",
    ] },
    sqlmi: { source: "https://learn.microsoft.com/azure/azure-sql/managed-instance/", items: [
      "Managed SQL with near-full engine compatibility",
      "Automated patching, backups, and HA",
      "Lift-and-shift with minimal code changes",
    ] },
    entra: { source: "https://learn.microsoft.com/entra/external-id/", items: [
      "Identity for customers and partners (CIAM)",
      "Social and federated sign-in",
      "Conditional Access and multifactor auth",
    ] },
    iot: { source: "https://learn.microsoft.com/azure/iot/", items: [
      "Device connectivity and telemetry at scale",
      "Device provisioning and management",
      "Edge-to-cloud data flow",
    ] },
    acs: { source: "https://learn.microsoft.com/azure/communication-services/", items: [
      "Voice, video, chat, and SMS",
      "Same network that powers Microsoft Teams",
      "SDKs for web and mobile",
    ] },
    hpc: { source: "https://learn.microsoft.com/azure/architecture/topics/high-performance-computing", items: [
      "Elastic HPC for simulation and screening",
      "GPU and CPU clusters on demand",
      "High-performance parallel storage",
    ] },
  };

  // Objection-handling guidance grounded in official Microsoft Learn guidance.
  const GUIDANCE = {
    phi: {
      label: "Protecting sensitive data & PHI",
      text: "Apply Zero Trust, encryption, and unified data governance so sensitive data and PHI stay protected and access stays least-privilege.",
      links: [
        { title: "Microsoft Zero Trust", url: "https://learn.microsoft.com/security/zero-trust/zero-trust-overview" },
        { title: "Microsoft Purview", url: "https://learn.microsoft.com/purview/" },
      ],
    },
    ai: {
      label: "AI accuracy, safety & trust",
      text: "Ground AI on approved data, filter harmful content, and keep humans in the loop — guided by Microsoft's Responsible AI practices.",
      links: [
        { title: "Responsible AI", url: "https://learn.microsoft.com/azure/machine-learning/concept-responsible-ai" },
        { title: "Azure AI Content Safety", url: "https://learn.microsoft.com/azure/ai-services/content-safety/overview" },
      ],
    },
    integration: {
      label: "Integration with existing systems",
      text: "Adopt incrementally behind a standards-based API facade and proven connectors rather than replacing systems at once.",
      links: [
        { title: "Azure API Management", url: "https://learn.microsoft.com/azure/api-management/" },
        { title: "Azure Architecture Center", url: "https://learn.microsoft.com/azure/architecture/" },
      ],
    },
    adoption: {
      label: "Delivery, cost & adoption risk",
      text: "De-risk with a scoped start and the Cloud Adoption and Well-Architected frameworks to guide cost, reliability, and operations.",
      links: [
        { title: "Cloud Adoption Framework", url: "https://learn.microsoft.com/azure/cloud-adoption-framework/overview" },
        { title: "Well-Architected Framework", url: "https://learn.microsoft.com/azure/well-architected/" },
      ],
    },
  };

  // Choose guidance themes relevant to a use case (always PHI for HLS; AI for AI plays; etc.).
  function guidanceFor(uc) {
    const out = [GUIDANCE.phi];
    if (uc.solutionCategory === "AI") out.push(GUIDANCE.ai);
    if (["Apps", "Data", "Infra", "Analytics"].includes(uc.solutionCategory)) out.push(GUIDANCE.integration);
    out.push(GUIDANCE.adoption);
    // de-dupe and cap at 3
    return out.filter((g, i, a) => a.indexOf(g) === i).slice(0, 3);
  }

  window.LEARN = { capabilities: CAPABILITIES, guidance: GUIDANCE, guidanceFor };
  window.capabilitiesFor = function (key) { return CAPABILITIES[key] || null; };
})();
