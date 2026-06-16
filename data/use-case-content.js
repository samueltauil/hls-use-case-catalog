// Use case content layer — adds reference-demo-level narrative depth to every use case.
// window.UCCONTENT exposes a persona, a "day in the life" moment, before/after
// states, and a how-it-works workflow for each of the 20 subvertical×stage buckets.
//
// GROUNDING POLICY: everything here is QUALITATIVE, role/stage-appropriate framing —
// personas are clearly illustrative (named example users, like the reference demos),
// and pains/gains describe the typical situation WITHOUT inventing metrics, customer
// facts, or sourced statistics. All hard numbers shown anywhere in the deck still come
// only from the catalog's own businessValue/problem text (see app.js parseMetrics).
(function () {
  // Frontline-user name pools per subvertical (illustrative example personas).
  const NAMES = {
    "health-providers": ["Maya Okonkwo", "Daniel Reyes", "Priya Nair", "Sam Whitfield", "Lena Hartmann", "Omar Haddad"],
    "health-payers": ["Carla Jensen", "Marcus Bell", "Nadia Rahman", "Tony Alvarez", "Grace Kim", "Derek Shaw"],
    "pharma-life-sciences": ["Aisha Bello", "Viktor Petrov", "Hannah Cole", "Raj Malhotra", "Sofia Marin", "Ben Tanaka"],
    "medtech": ["Elena Vasquez", "Chris Boateng", "Yuki Tanaka", "Paul Andersson", "Dana Frost", "Ravi Iyer"],
    _: ["Alex Morgan", "Jordan Lee", "Casey Brooks", "Robin Patel", "Taylor Cruz", "Jamie Fox"],
  };

  // One bucket per subvertical|stage. role/where/moment build the persona vignette;
  // today[] = current-state pains; gains[] = with-this-use-case improvements; steps[] map
  // 1:1 to the architecture flow (ingest → reason → ground → act) for "how it works".
  const STAGE = {
    // ---- Health Providers --------------------------------------------------
    "health-providers|access-and-patient-engagement": {
      role: "Patient Access Lead", where: "a multi-site ambulatory network",
      moment: "starts each shift facing a full voicemail queue while the lobby is already backing up",
      today: ["Patients wait on hold or abandon online booking", "Agents juggle scheduling, triage, and routine questions by hand", "After-hours and non-English requests go unanswered"],
      gains: ["Self-service scheduling and answers around the clock", "Staff freed for the complex, high-value calls", "Consistent access across languages and channels"],
      steps: ["Patient reaches out", "AI understands the intent", "Check slots, policy & eligibility", "Book or hand off to staff"],
    },
    "health-providers|care-delivery-and-clinical-operations": {
      role: "Hospitalist", title: "Dr.", where: "a busy inpatient service",
      moment: "finishes rounds by six but won't close the day's charts until well after nine",
      today: ["Documentation eats into patient time and personal time", "Critical signals sit buried across long charts", "Handoffs rely on memory and scattered notes"],
      gains: ["Notes drafted from the visit itself", "Key history and risks surfaced in seconds", "Cleaner, safer clinical handoffs"],
      steps: ["Capture the encounter", "Structure into the record", "Ground in chart & guidelines", "Clinician reviews & signs"],
    },
    "health-providers|revenue-cycle-and-financial-performance": {
      role: "Revenue Cycle Manager", where: "a regional health system's billing office",
      moment: "watches denials pile up faster than the team can rework them",
      today: ["Claims denied for avoidable, repeat reasons", "Staff rekey data across portals and systems", "Cash is tied up in aging accounts"],
      gains: ["Issues caught before the claim goes out", "Authorization and coding work assisted, not manual", "Faster, cleaner cash collection"],
      steps: ["Pull claim & coverage data", "Score risk & gaps", "Apply payer policy & guidance", "Submit or route for fix"],
    },
    "health-providers|workforce-and-operations": {
      role: "Director of Nursing Operations", where: "a 400-bed acute-care hospital",
      moment: "rebuilds the staffing grid by hand every time a shift falls through",
      today: ["Schedules built manually against shifting demand", "Premium agency and overtime spend creeps up", "Supplies and assets aren't where they're needed"],
      gains: ["Demand-matched, fairer schedules", "Lower reliance on premium labor", "The right resources in the right place"],
      steps: ["Gather demand & availability", "Forecast & optimize", "Check rules & constraints", "Publish the plan to teams"],
    },
    "health-providers|data-ai-and-platform-foundation": {
      role: "Enterprise Data & AI Lead", where: "a health system modernizing off legacy platforms",
      moment: "spends more time wiring data pipelines together than putting the data to work",
      today: ["Data is siloed across clinical and operational systems", "Each AI idea starts from scratch with no guardrails", "Compliance and data lineage are hard to prove"],
      gains: ["A governed, interoperable data foundation", "Reusable, secure AI building blocks", "Auditable lineage and access by design"],
      steps: ["Connect & normalize sources", "Build on a governed platform", "Apply security & policy", "Serve apps, AI & analytics"],
    },
    // ---- Health Payers -----------------------------------------------------
    "health-payers|member-acquisition-and-experience": {
      role: "Member Experience Lead", where: "a regional health plan's contact center",
      moment: "sees the same benefit and coverage questions flood the queue every renewal season",
      today: ["Members can't get quick answers on benefits and coverage", "Agents repeat the same explanations all day", "Onboarding and outreach feel generic"],
      gains: ["Clear self-service answers on coverage", "Agents focused on calls that need a human", "Personalized onboarding and outreach"],
      steps: ["Member asks a question", "AI grounds in plan & benefits", "Check eligibility & rules", "Answer or route to an agent"],
    },
    "health-payers|claims-payment-and-core-administration": {
      role: "Claims Operations Manager", where: "a national payer's claims operation",
      moment: "still watches a stack of claims drop to manual review every single day",
      today: ["High-volume claims fall to slow manual review", "Document intake is keyed by hand", "Errors surface late, after payment"],
      gains: ["More claims adjudicated straight through", "Document intake captured automatically", "Issues caught before payment goes out"],
      steps: ["Ingest the claim & documents", "Extract & validate", "Apply policy & payment rules", "Adjudicate or route to review"],
    },
    "health-payers|risk-quality-and-medical-management": {
      role: "Utilization Management Nurse", cred: "RN", where: "a Medicare Advantage plan's clinical team",
      moment: "works prior-auth and care-gap lists that never seem to get shorter",
      today: ["Authorizations and reviews are slow and manual", "Risk and quality gaps are found too late", "Clinical staff are buried in document review"],
      gains: ["Faster, guideline-aligned reviews", "Care and coding gaps surfaced proactively", "Clinicians focused on the cases that matter"],
      steps: ["Pull clinical & claims context", "Summarize against guidelines", "Flag gaps & risk", "Recommend action for review"],
    },
    "health-payers|fraud-waste-and-abuse": {
      role: "Special Investigations Analyst", where: "a payer's program-integrity unit",
      moment: "chases yesterday's suspicious claims after the money has already gone out the door",
      today: ["Suspicious patterns are spotted after payment", "Rules-only systems miss novel schemes", "Investigators drown in false positives"],
      gains: ["Risky claims flagged before payment", "Emerging patterns detected, not just known ones", "Investigators focused on real leads"],
      steps: ["Stream claims & provider data", "Score for anomalies & risk", "Correlate with known patterns", "Route strong leads to investigators"],
    },
    "health-payers|data-ai-and-platform-foundation": {
      role: "Payer Data & Analytics Lead", where: "a health plan modernizing its data estate",
      moment: "meets the same regulatory and reporting requests with brittle, hand-built pipelines",
      today: ["Member, claims, and clinical data sit in silos", "Interoperability mandates strain legacy systems", "Each analytics request is a one-off build"],
      gains: ["A unified, compliant data foundation", "Interoperability handled by design", "Reusable analytics and AI services"],
      steps: ["Connect & normalize sources", "Build on a governed platform", "Apply security & policy", "Serve apps, AI & analytics"],
    },
    // ---- Pharma / Life Sciences -------------------------------------------
    "pharma-life-sciences|research-and-discovery": {
      role: "Computational Biologist", title: "Dr.", where: "a discovery research group",
      moment: "loses days hunting across papers and assay data for signals that may already be known",
      today: ["Insights buried across papers, patents, and assays", "Hypotheses tested one slow cycle at a time", "Knowledge locked in individual scientists' heads"],
      gains: ["Relevant evidence surfaced in seconds", "Faster hypothesis-to-result cycles", "Institutional knowledge made searchable"],
      steps: ["Aggregate literature & lab data", "Mine for patterns & candidates", "Ground in proprietary knowledge", "Surface evidence to scientists"],
    },
    "pharma-life-sciences|clinical-development-and-trials": {
      role: "Clinical Trial Manager", where: "a sponsor's clinical operations team",
      moment: "watches enrollment timelines slip while eligible patients go unmatched",
      today: ["Patient matching and site selection are slow", "Protocol and submission writing is laborious", "Safety signals are tracked across fragmented data"],
      gains: ["Faster patient-to-protocol matching", "Assisted protocol and document authoring", "Earlier, clearer safety insight"],
      steps: ["Aggregate trial & patient data", "Match & draft against criteria", "Ground in protocol & guidelines", "Route to clinical reviewers"],
    },
    "pharma-life-sciences|manufacturing-and-supply-chain": {
      role: "Manufacturing Quality Lead", where: "a GMP drug-manufacturing site",
      moment: "loses production hours each time a deviation triggers a manual investigation",
      today: ["Deviations are investigated slowly, by hand", "Equipment issues are found after they cause downtime", "Supply and quality data sit in separate systems"],
      gains: ["Faster deviation investigation", "Issues predicted before downtime", "Connected supply and quality visibility"],
      steps: ["Stream process & equipment data", "Detect anomalies & deviations", "Check against batch records & specs", "Alert and guide the team"],
    },
    "pharma-life-sciences|commercial-and-market-access": {
      role: "Field Medical (MSL) Lead", title: "Dr.", where: "a commercial & medical-affairs team",
      moment: "spends prep time digging for the right approved content instead of with HCPs",
      today: ["Reps and MSLs hunt for approved content", "Market-access and value materials are slow to assemble", "Engagement isn't tailored to each HCP"],
      gains: ["Approved answers and content on demand", "Faster value-dossier and access support", "More relevant, compliant HCP engagement"],
      steps: ["Gather approved content & data", "Retrieve & draft on request", "Ground in compliant sources", "Deliver to the field"],
    },
    "pharma-life-sciences|data-ai-and-platform-foundation": {
      role: "R&D Data & AI Lead", where: "a life-sciences organization unifying R&D data",
      moment: "stitches together study, lab, and real-world data by hand for every new question",
      today: ["R&D and commercial data sit in silos", "Every AI effort re-solves the data plumbing", "GxP compliance and lineage are hard to evidence"],
      gains: ["A governed, connected data fabric", "Reusable, validated AI building blocks", "Traceable lineage for regulators"],
      steps: ["Connect & normalize sources", "Build on a governed platform", "Apply GxP security & policy", "Serve apps, AI & analytics"],
    },
    // ---- MedTech -----------------------------------------------------------
    "medtech|product-innovation-and-r-and-d": {
      role: "R&D Systems Engineer", where: "a medical-device product team",
      moment: "waits on physical test cycles to learn what a model could have shown in hours",
      today: ["Design iterations are gated by slow physical testing", "Device and field data are underused in R&D", "Software and firmware cycles are lengthy"],
      gains: ["Faster, simulation-assisted design", "Field and device data feeding R&D", "Shorter software iteration cycles"],
      steps: ["Ingest device & test data", "Model, simulate & analyze", "Validate against requirements", "Feed insight back to design"],
    },
    "medtech|regulatory-quality-and-compliance": {
      role: "Regulatory & Quality Manager", where: "a device manufacturer's quality organization",
      moment: "races complaint and CAPA deadlines while the evidence sits scattered across systems",
      today: ["Complaint and CAPA handling is manual and slow", "Submissions are assembled from scattered evidence", "Post-market signals surface late"],
      gains: ["Assisted complaint and CAPA workflows", "Faster, better-organized submissions", "Earlier post-market signal detection"],
      steps: ["Intake complaints & evidence", "Summarize & classify", "Check against regulations & specs", "Route for review & action"],
    },
    "medtech|manufacturing-and-supply-chain": {
      role: "Manufacturing Operations Lead", where: "a device production facility",
      moment: "finds defects and equipment faults only after they've already slowed the line",
      today: ["Visual inspection is manual and inconsistent", "Equipment failures cause unplanned downtime", "Supply and quality data aren't connected"],
      gains: ["Consistent, automated inspection", "Maintenance before failures hit", "Connected supply and quality visibility"],
      steps: ["Stream line & sensor data", "Detect defects & anomalies", "Check against specs & thresholds", "Alert and guide operators"],
    },
    "medtech|commercial-service-and-customer-success": {
      role: "Field Service Lead", where: "a medtech service organization",
      moment: "dispatches technicians reactively after a device in the field has already gone down",
      today: ["Service is reactive, after a device fails", "Technicians lack guided troubleshooting", "Customer and device insights are fragmented"],
      gains: ["Proactive, condition-based service", "Guided resolution for technicians", "A connected view of each customer"],
      steps: ["Monitor connected devices", "Detect & diagnose issues", "Ground in manuals & history", "Guide the tech or customer"],
    },
    "medtech|data-ai-and-platform-foundation": {
      role: "MedTech Data & AI Lead", where: "a device company unifying product and field data",
      moment: "rebuilds device-data pipelines for each new analytics or AI request",
      today: ["Device, manufacturing, and field data sit in silos", "Every AI effort re-solves the data plumbing", "Compliance and traceability are hard to prove"],
      gains: ["A governed, connected data foundation", "Reusable, secure AI building blocks", "Traceable lineage and access control"],
      steps: ["Connect & normalize sources", "Build on a governed platform", "Apply security & policy", "Serve apps, AI & analytics"],
    },
  };

  const FALLBACK = {
    role: "Operations Lead", where: "a healthcare organization",
    moment: "spends the day working around disconnected systems and manual steps",
    today: ["Manual, repetitive work slows the team down", "Insight is scattered across systems", "It's hard to scale what works"],
    gains: ["Automation of the repetitive work", "A connected, trusted view of the data", "A repeatable path to scale"],
    steps: ["Connect the data", "Apply AI", "Ground & govern", "Deliver to users"],
  };

  function hash(s) {
    let h = 0;
    const str = String(s || "");
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }
  function bucket(uc) {
    return STAGE[uc.subverticalId + "|" + uc.stageId] || FALLBACK;
  }
  function initials(name) {
    return String(name).split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }
  function persona(uc) {
    const b = bucket(uc);
    const pool = NAMES[uc.subverticalId] || NAMES._;
    const name = pool[hash(uc.id) % pool.length];
    const display = (b.title ? b.title + " " : "") + name + (b.cred ? ", " + b.cred : "");
    return {
      name: display,
      initials: initials(name),
      role: b.role,
      where: b.where,
      moment: display + " " + b.moment + ".",
    };
  }
  function today(uc) { return bucket(uc).today.slice(); }
  function gains(uc) { return bucket(uc).gains.slice(); }
  function steps(uc) { return bucket(uc).steps.slice(); }

  window.UCCONTENT = { persona, today, gains, steps, bucket };
})();
