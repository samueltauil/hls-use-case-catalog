// Demo scenario data — realistic, clearly-illustrative SYNTHETIC content that makes
// each mock demo feel real and specific to the use case. window.DEMOSCENES.get(uc, kind)
// returns a domain-matched dataset (chosen by subvertical + use-case keywords).
//
// IMPORTANT: every value here is FICTIONAL sample data — invented patients, members,
// codes, IDs, and figures used only to illustrate the experience. Nothing is a real
// customer, person, or claim, and no number is presented as a customer outcome. Demos
// remain labeled "illustrative sample" in the UI. Hard ROI/metric figures shown on the
// narrative slides still come only from the catalog text (app.js parseMetrics).
(function () {
  function kw(uc) { return (uc.title + " " + uc.solutionPatternText + " " + uc.problem).toLowerCase(); }
  function has(uc, re) { return re.test(kw(uc)); }

  // ===================================================================== CHAT
  // Grounded conversational assistant — realistic Q&A per audience.
  const CHAT = {
    patient: {
      who: "patient", grounding: "Azure AI Search",
      intro: "Hi — I can help you book visits, understand costs, and get ready for your appointment. I answer from your plan and our clinic's approved information, with sources.",
      qa: [
        { q: "I need to book an appointment", a: "Happy to help. Dr. Nguyen (Family Medicine) has openings Thursday Jun 18 at 9:40 AM or Friday Jun 19 at 2:15 PM at the Riverside clinic. Want me to hold the Thursday slot for you?", src: "Scheduling + provider directory" },
        { q: "What will this visit cost me?", a: "On your PPO plan a standard office visit is a $30 copay. Any labs are billed separately. You've met $420 of your $1,500 deductible so far this year.", src: "Eligibility & benefits" },
        { q: "Can I get this in Spanish?", a: "Claro que sí. Puedo continuar en español y enviarle un resumen de su cita por mensaje de texto. ¿Desea que reserve la cita del jueves a las 9:40 AM?", src: "Multilingual response (sample)" },
        { q: "Where do I go and what should I bring?", a: "Riverside Clinic, 2nd floor, Suite 210. Please bring your insurance card, a photo ID, and your current medication list, and arrive about 15 minutes early to check in.", src: "Clinic information" },
      ],
    },
    member: {
      who: "member", grounding: "Azure AI Search",
      intro: "Hi — I can explain your benefits, claims, and coverage. I answer from your specific plan documents and claim history, with citations.",
      qa: [
        { q: "What does my plan cover for physical therapy?", a: "Your Gold PPO covers PT at 80% after deductible, up to 30 visits per year. You've used 6. No prior authorization is needed for the first 12 visits.", src: "Plan benefits — SBC" },
        { q: "Why do I owe $32 on this claim?", a: "Claim CLM-77204 (visit 5/12): billed $240, plan allowed $160, plan paid 80% = $128, leaving $32 coinsurance. Your deductible was already met, so this is your share of cost.", src: "Claim CLM-77204" },
        { q: "Is Dr. Patel in network?", a: "Yes — Dr. Anita Patel (NPI 1093847562) is in-network for your plan in 2026. In-network office visits are a $25 copay.", src: "Provider network directory" },
      ],
    },
    broker: {
      who: "broker", grounding: "Azure AI Search",
      intro: "Hi — I can compare plans, check eligibility rules, and start quotes for your groups. I answer from current plan and underwriting guidance.",
      qa: [
        { q: "Which plan fits a 25-person group?", a: "For a 25-life group with a mixed age band, the Silver HMO (est. $412 PEPM) and Gold PPO (est. $498 PEPM) are most competitive. The Gold PPO adds out-of-network coverage. Want a side-by-side?", src: "Quoting engine (sample)" },
        { q: "What's the eligibility rule for dependents?", a: "Dependents are eligible up to age 26 regardless of student status. Newborns are covered automatically for the first 31 days; add them to enroll beyond that.", src: "Underwriting guidelines" },
        { q: "Can you start a quote for me?", a: "Started quote Q-2026-0488 for 25 lives, effective Aug 1. I pre-filled SIC code and ZIP rating area; just confirm the census and I'll generate rates.", src: "Quoting engine (sample)" },
      ],
    },
    clinician: {
      who: "care team", grounding: "Azure AI Search",
      intro: "Hi — I summarize charts, surface relevant guidelines, and draft documentation for your review. Every answer is grounded in the record with citations.",
      qa: [
        { q: "Summarize this patient for me", a: "Marcus Reed, 58 M. T2DM + HTN. Latest A1c 8.4% (up from 7.6% in Jan). BP 146/88 today. Overdue for retinal screen and foot exam. Meds: metformin 1000 mg BID, lisinopril 20 mg daily. Last visit 3/14.", src: "Chart summary (sample)" },
        { q: "What do guidelines say about his A1c?", a: "With A1c 8.4% on metformin monotherapy, ADA guidance supports adding a second agent. Given HTN and CV risk, a GLP-1 RA or SGLT2 inhibitor is preferred for organ protection. Confirm renal function first.", src: "Guideline reference (sample)" },
        { q: "Draft a note for today's visit", a: "Draft ready: Assessment — T2DM uncontrolled, HTN suboptimal. Plan — add SGLT2 inhibitor, reinforce diet, order BMP + lipid panel, refer ophthalmology, recheck in 6 weeks. Please review and sign.", src: "Drafted from encounter (sample)" },
      ],
    },
    processor: {
      who: "processor", grounding: "Azure AI Search",
      intro: "Hi — I explain edits, policy, and next steps for the claim in front of you. I answer from current payment policy and claim data.",
      qa: [
        { q: "Why was this claim flagged?", a: "Claim CLM-88321 hit edit E-237: CPT 29881 was billed with modifier 59 but no distinct-procedure documentation is attached. Until that's resolved, it can't auto-adjudicate.", src: "Payment policy — edit E-237" },
        { q: "What's the guidance to resolve it?", a: "Policy requires an operative note supporting a distinct procedural service for modifier 59. Request the op note from the provider, or if NCCI bundling applies, reprocess without modifier 59.", src: "Payment policy" },
        { q: "Is the provider in network?", a: "Yes — TIN 84-1729305, in-network effective 2026. Contracted rate for 29881 is $612; billed amount $1,040 will be repriced to contract.", src: "Provider contract (sample)" },
      ],
    },
    researcher: {
      who: "researcher", grounding: "Azure AI Search",
      intro: "Hi — I search internal studies, assays, and literature, and summarize what's known. I cite every source so you can verify.",
      qa: [
        { q: "Has anyone studied this target internally?", a: "Yes — 3 internal programs touch this target. PX-2207 (2024) showed dose-dependent inhibition in a cell-line panel; PX-1185 flagged an off-target liability. See the linked assay records for IC50 values.", src: "Internal knowledge graph (sample)" },
        { q: "Summarize prior findings on this pathway", a: "Across 11 internal reports and 240 external papers: consistent efficacy signal in inflammatory models, a recurring hepatic safety question at high dose, and an unexplored combination opportunity. Citations attached.", src: "Literature + internal reports (sample)" },
        { q: "Which assays are most relevant?", a: "Top matches: ASY-3391 (binding affinity), ASY-4102 (selectivity panel), ASY-2750 (tox screen). All three were run on the closest analog; results are in the linked datasets.", src: "Assay repository (sample)" },
      ],
    },
    rep: {
      who: "field team", grounding: "Azure AI Search",
      intro: "Hi — I prep you for HCP visits with approved content, account history, and the latest data. Everything I share is MLR-approved with sources.",
      qa: [
        { q: "Get me ready for this account", a: "Dr. Alvarez, oncology, high prescriber at Lakeside Cancer Center. Last interaction 4/2. Open medical inquiry on dosing in renal impairment (approved response available). New Phase III data published 5/2026 — approved slide deck attached.", src: "CRM + approved content (sample)" },
        { q: "What's the approved response on renal dosing?", a: "Approved answer: no dose adjustment for mild-to-moderate impairment (CrCl 30-89); for severe impairment, refer to the PI and recommend specialist consultation. Source: PI section 8.6 (approved).", src: "Medical information (approved)" },
        { q: "What's new since my last visit?", a: "Two updates: the Phase III OS data (approved deck v4), and a new patient-support program for co-pay assistance. Both are cleared for proactive use. Want me to add them to your visit plan?", src: "Approved content library (sample)" },
      ],
    },
    user: {
      who: "user", grounding: "Azure AI Search",
      intro: "Hi — I'm a grounded assistant for this use case. I answer from approved sources with citations and hand off to a person when needed.",
      qa: [
        { q: "What can you help me with?", a: "I handle the common requests for this workflow end to end: I confirm details, retrieve the right approved information, complete what I can, and route anything sensitive to a person.", src: "Approved knowledge base (sample)" },
        { q: "How do you keep answers accurate?", a: "I only answer from current, approved sources via Azure AI Search, every answer carries a citation, and I escalate low-confidence cases to a human rather than guessing.", src: "Grounding policy (sample)" },
      ],
    },
  };

  function chat(uc, aud) {
    const base = CHAT[aud] || CHAT.user;
    return JSON.parse(JSON.stringify(base));
  }

  // =============================================================== EXTRACTION
  // Realistic document + extracted fields, chosen by domain.
  const DOCS = {
    claim: {
      url: "idp.demo.local/claim-intake", docTitle: "CMS-1500 Health Insurance Claim",
      text: [
        "HEALTH INSURANCE CLAIM FORM  (CMS-1500)",
        "Patient: Reed, Marcus J.        DOB: 04/18/1968   Sex: M",
        "Member ID: MBR-4471-02          Group: GRP-22817",
        "Rendering provider: A. Patel, MD    NPI: 1093847562",
        "Service date: 05/12/2026   Place of service: 11 (office)",
        "Dx: E11.9 (T2DM), I10 (HTN)   CPT: 99214, 80053, 83036",
        "Billed charges: $318.00     Accept assignment: YES",
      ],
      fields: [
        { k: "Document type", v: "CMS-1500 claim", c: "high" },
        { k: "Member ID", v: "MBR-4471-02", c: "high" },
        { k: "Patient", v: "Marcus J. Reed", c: "high" },
        { k: "Service date", v: "2026-05-12", c: "high" },
        { k: "Provider NPI", v: "1093847562", c: "high" },
        { k: "Diagnosis (ICD-10)", v: "E11.9, I10", c: "med" },
        { k: "Procedures (CPT)", v: "99214, 80053, 83036", c: "med" },
        { k: "Billed amount", v: "$318.00", c: "med" },
        { k: "Prior auth #", v: "— not found —", c: "low" },
      ],
    },
    referral: {
      url: "idp.demo.local/referral-intake", docTitle: "Specialist Referral Form",
      text: [
        "OUTPATIENT REFERRAL",
        "Patient: Cruz, Elena      DOB: 09/02/1991   Sex: F",
        "Referring: J. Nguyen, MD (Family Medicine)",
        "Refer to: Cardiology — Riverside Heart Center",
        "Reason: palpitations + exertional dyspnea x 3 weeks",
        "Dx: R00.2 (palpitations)   Priority: routine (within 2 wks)",
        "Insurance: Gold PPO   Member ID: MBR-7782-15",
      ],
      fields: [
        { k: "Document type", v: "Referral form", c: "high" },
        { k: "Patient", v: "Elena Cruz", c: "high" },
        { k: "Refer to", v: "Cardiology", c: "high" },
        { k: "Reason", v: "Palpitations, exertional dyspnea", c: "high" },
        { k: "Diagnosis (ICD-10)", v: "R00.2", c: "med" },
        { k: "Priority", v: "Routine (≤2 weeks)", c: "med" },
        { k: "Member ID", v: "MBR-7782-15", c: "med" },
        { k: "Insurance auth", v: "— verify required —", c: "low" },
      ],
    },
    adverse: {
      url: "idp.demo.local/case-intake", docTitle: "Adverse Event Intake",
      text: [
        "ADVERSE EVENT REPORT (intake)",
        "Reporter: HCP (cardiologist)   Date received: 06/03/2026",
        "Product: Compound PX-340 (50 mg tablet)",
        "Patient: 62 F   Onset: ~7 days after start",
        "Event: elevated ALT/AST, fatigue   Outcome: recovering",
        "Seriousness: non-serious   Causality (reporter): possible",
        "Batch/lot: LOT-PX340-2271",
      ],
      fields: [
        { k: "Document type", v: "Adverse event report", c: "high" },
        { k: "Product", v: "PX-340 50 mg", c: "high" },
        { k: "Event term (MedDRA)", v: "Hepatic enzyme increased", c: "med" },
        { k: "Seriousness", v: "Non-serious", c: "high" },
        { k: "Causality (reporter)", v: "Possible", c: "med" },
        { k: "Lot number", v: "LOT-PX340-2271", c: "high" },
        { k: "Onset latency", v: "~7 days", c: "med" },
        { k: "Narrative completeness", v: "— follow-up needed —", c: "low" },
      ],
    },
    complaint: {
      url: "idp.demo.local/complaint-intake", docTitle: "Device Complaint Record",
      text: [
        "PRODUCT COMPLAINT (intake)",
        "Product: CardioSense X2 monitor   Model: CS-X2",
        "Serial: DV-88231   Firmware: 4.2.1",
        "Site: Lakeside Hospital   Date: 06/05/2026",
        "Issue: intermittent ECG signal dropout during telemetry",
        "Patient impact: none reported   Use continued: no",
        "Returned: yes (RMA-50194)",
      ],
      fields: [
        { k: "Document type", v: "Device complaint", c: "high" },
        { k: "Product / model", v: "CardioSense X2 (CS-X2)", c: "high" },
        { k: "Serial number", v: "DV-88231", c: "high" },
        { k: "Firmware", v: "4.2.1", c: "med" },
        { k: "Reported issue", v: "Intermittent ECG dropout", c: "high" },
        { k: "Patient harm", v: "None reported", c: "high" },
        { k: "RMA number", v: "RMA-50194", c: "med" },
        { k: "MDR reportability", v: "— assessment required —", c: "low" },
      ],
    },
    invoice: {
      url: "idp.demo.local/invoice-intake", docTitle: "Supplier Invoice",
      text: [
        "SUPPLIER INVOICE",
        "Vendor: Meridian Medical Supply   PO: PO-2026-4471",
        "Invoice #: INV-77310   Date: 05/28/2026   Terms: Net 30",
        "Line 1: Single-use sensors (qty 500)   $4,250.00",
        "Line 2: Calibration kit (qty 12)        $1,860.00",
        "Tax: $356.20   Total due: $6,466.20",
      ],
      fields: [
        { k: "Document type", v: "Supplier invoice", c: "high" },
        { k: "Vendor", v: "Meridian Medical Supply", c: "high" },
        { k: "Invoice #", v: "INV-77310", c: "high" },
        { k: "PO match", v: "PO-2026-4471", c: "high" },
        { k: "Line items", v: "2 lines, qty 512", c: "med" },
        { k: "Total due", v: "$6,466.20", c: "high" },
        { k: "Terms", v: "Net 30", c: "med" },
        { k: "3-way match", v: "— GR pending —", c: "low" },
      ],
    },
  };
  function extraction(uc) {
    let key = "claim";
    if (has(uc, /referral|intake|front door|access/)) key = "referral";
    if (uc.subverticalId === "health-payers") key = "claim";
    if (uc.subverticalId === "pharma-life-sciences") key = has(uc, /invoice|supply|procure/) ? "invoice" : "adverse";
    if (uc.subverticalId === "medtech") key = has(uc, /invoice|supply|procure/) ? "invoice" : "complaint";
    if (uc.subverticalId === "health-providers") key = has(uc, /claim|revenue|billing|coding/) ? "claim" : "referral";
    return JSON.parse(JSON.stringify(DOCS[key]));
  }

  // ================================================================ SUMMARIZE
  const SUMS = {
    clinicalNote: {
      srcTitle: "Visit transcript (ambient capture)",
      src: [
        "Dr: Good to see you, Marcus. How have the mornings been?",
        "Pt: Still thirsty a lot, up twice a night to use the bathroom.",
        "Dr: Any numbness in the feet? Vision changes?",
        "Pt: Feet feel fine. Vision's about the same.",
        "Dr: Your sugar's been running high. Let's adjust treatment and",
        "    get your eyes and feet checked this year.",
      ],
      outTitle: "Drafted SOAP note", review: true,
      sections: [
        ["Subjective", "58 M with T2DM and HTN reports persistent polydipsia and nocturia x2. Denies peripheral neuropathy or visual changes."],
        ["Objective", "BP 146/88. A1c 8.4% (prior 7.6%). On metformin 1000 mg BID, lisinopril 20 mg daily. Retinal screen and foot exam overdue."],
        ["Assessment", "1) T2DM, uncontrolled. 2) HTN, suboptimal control."],
        ["Plan", "Add SGLT2 inhibitor (confirm renal function), reinforce lifestyle, order BMP + lipid panel, refer ophthalmology, recheck in 6 weeks."],
      ],
      cite: "Drafted from the encounter; clinician reviews and signs",
    },
    chartSummary: {
      srcTitle: "Longitudinal chart (excerpt)",
      src: [
        "Problem list: T2DM, HTN, hyperlipidemia, obesity (BMI 32).",
        "Recent labs: A1c 8.4%, LDL 132, eGFR 71, K 4.2.",
        "Meds: metformin, lisinopril, atorvastatin.",
        "Encounters: 4 in past 12 months; 1 ED visit (hypoglycemia).",
        "Care gaps: retinal screen, foot exam, pneumococcal vaccine.",
      ],
      outTitle: "Pre-visit summary & handoff", review: true,
      sections: [
        ["One-line", "58 M, poorly controlled T2DM + HTN, three open care gaps, recent ED visit for hypoglycemia."],
        ["Watch for", "Rising A1c trend; review hypoglycemia risk before intensifying therapy."],
        ["Action items", "Close retinal screen, foot exam, and pneumococcal vaccine; reconcile meds."],
      ],
      cite: "Summarized from the chart with source citations; for clinician review",
    },
    claimSummary: {
      srcTitle: "Claim + appeal packet (excerpt)",
      src: [
        "Claim CLM-88321 denied: CO-197 (auth missing).",
        "Service: knee MRI (CPT 73721), DOS 05/09/2026.",
        "Provider note attached: 6 wks conservative therapy, persistent pain.",
        "Member: Gold PPO; imaging requires prior auth.",
        "Prior auth AUTH-33villa filed 05/02, status pending.",
      ],
      outTitle: "Appeal summary & recommendation", review: true,
      sections: [
        ["Why denied", "CO-197 — no prior authorization on file at adjudication."],
        ["Supporting evidence", "Documentation shows 6 weeks of failed conservative therapy, meeting medical-necessity criteria for advanced imaging."],
        ["Recommendation", "Overturn likely: attach AUTH-33 (filed pre-service) and resubmit with the conservative-therapy note."],
      ],
      cite: "Assembled from the claim packet; an examiner confirms before action",
    },
    protocolDraft: {
      srcTitle: "Study concept & template (sample)",
      src: [
        "Indication: moderate-to-severe plaque psoriasis.",
        "Phase: II   Design: randomized, double-blind, placebo-controlled.",
        "Primary endpoint: PASI-75 at week 16.",
        "Population: adults 18-75, PASI ≥ 12, BSA ≥ 10%.",
        "Reuse: eligibility + safety language from template T-204.",
      ],
      outTitle: "Drafted protocol section", review: true,
      sections: [
        ["Objectives", "Primary: proportion achieving PASI-75 at Week 16 vs placebo. Secondary: PASI-90, sPGA 0/1, safety."],
        ["Key eligibility", "Adults 18-75 with PASI ≥ 12 and BSA ≥ 10%; excludes active infection, recent biologics, pregnancy."],
        ["Open items", "Confirm sample size assumptions and the stratification factors with biostatistics."],
      ],
      cite: "Drafted from approved templates; medical writing reviews before use",
    },
    dossierDraft: {
      srcTitle: "Evidence library (approved, sample)",
      src: [
        "Phase III OS benefit: HR 0.74 vs comparator (approved).",
        "Budget-impact model v4 (approved).",
        "ICER threshold context for payer audience.",
        "Comparator landscape: 3 agents in class.",
        "Reuse: approved value messages M-11, M-14.",
      ],
      outTitle: "Drafted payer value section", review: true,
      sections: [
        ["Clinical value", "Significant OS benefit (HR 0.74) with a manageable, well-characterized safety profile vs in-class comparators."],
        ["Economic value", "Budget-impact model indicates offset from reduced downstream utilization; full model attached (approved v4)."],
        ["Open items", "Confirm the payer-specific pricing scenario and regional access terms before sharing."],
      ],
      cite: "Assembled from approved evidence; MLR review required before external use",
    },
    capaSummary: {
      srcTitle: "Complaint cluster (excerpt)",
      src: [
        "12 complaints in 30 days: ECG dropout on CardioSense X2.",
        "Common thread: firmware 4.2.1, telemetry mode.",
        "No patient harm reported; 7 units returned.",
        "Engineering: suspected buffer overflow under signal load.",
        "Field inventory on 4.2.1: ~1,900 units.",
      ],
      outTitle: "CAPA summary & risk assessment", review: true,
      sections: [
        ["Problem statement", "Intermittent ECG signal dropout on CS-X2 units running firmware 4.2.1 in telemetry mode; 12 complaints / 30 days."],
        ["Risk", "No patient harm to date; severity moderate, detectability low — recommend prioritized investigation."],
        ["Proposed action", "Root-cause the 4.2.1 telemetry buffer, validate fix in 4.2.2, plan field update for ~1,900 units; assess MDR reportability."],
      ],
      cite: "Summarized from complaint records; quality reviews before disposition",
    },
  };
  function summarize(uc, isDraft) {
    const sv = uc.subverticalId;
    if (isDraft) {
      if (sv === "pharma-life-sciences") return JSON.parse(JSON.stringify(has(uc, /dossier|market access|value|payer|commercial/) ? SUMS.dossierDraft : SUMS.protocolDraft));
      if (sv === "medtech") return JSON.parse(JSON.stringify(SUMS.capaSummary));
      return JSON.parse(JSON.stringify(SUMS.protocolDraft));
    }
    if (sv === "health-payers") return JSON.parse(JSON.stringify(SUMS.claimSummary));
    if (sv === "medtech") return JSON.parse(JSON.stringify(SUMS.capaSummary));
    if (sv === "pharma-life-sciences") return JSON.parse(JSON.stringify(SUMS.protocolDraft));
    return JSON.parse(JSON.stringify(has(uc, /handoff|chart (review|summar)|pre-visit/) ? SUMS.chartSummary : SUMS.clinicalNote));
  }

  // ==================================================================== AGENT
  const AGENTS = {
    priorAuth: {
      caseTitle: "Prior authorization — knee MRI",
      caseFields: [["Member", "E. Cruz · MBR-7782-15"], ["Request", "MRI knee w/o contrast (73721)"], ["Ordering", "Dr. Nguyen · NPI 1093847562"], ["Plan", "Gold PPO — imaging requires PA"]],
      steps: [
        { t: "Receive request", d: "Intake the PA request and validate member, code (73721), and ordering provider." },
        { t: "Retrieve policy & records", d: "Pull the imaging policy and the member's chart; locate the conservative-therapy note." },
        { t: "Evaluate medical necessity", d: "6 weeks of failed PT documented + persistent pain → meets InterQual criteria for advanced imaging." },
        { t: "Human review", d: "Nurse reviewer confirms the recommendation before any approval is issued.", gate: true },
        { t: "Decide & log", d: "Approve AUTH-33, notify member and provider, and log every input and decision for audit." },
      ],
      cite: "Orchestrated with a human-in-the-loop approval gate",
    },
    denialRework: {
      caseTitle: "Denial rework — missing authorization",
      caseFields: [["Claim", "CLM-88321 · $1,040"], ["Denial", "CO-197 (auth missing)"], ["Service", "Knee MRI (73721)"], ["Provider", "Riverside Imaging"]],
      steps: [
        { t: "Receive denial", d: "Ingest the 835 remittance and parse the CO-197 denial reason." },
        { t: "Gather evidence", d: "Locate the pre-service auth (AUTH-33) and the conservative-therapy documentation." },
        { t: "Build corrected claim", d: "Attach the auth, correct the claim, and check for other NCCI/edit issues." },
        { t: "Human review", d: "A biller confirms the corrected claim before resubmission.", gate: true },
        { t: "Resubmit & track", d: "Resubmit to the payer, set a follow-up tickler, and log the full audit trail." },
      ],
      cite: "Orchestrated with a human-in-the-loop approval gate",
    },
    credentialing: {
      caseTitle: "Provider credentialing — primary source verify",
      caseFields: [["Provider", "Dr. A. Patel · NPI 1093847562"], ["Specialty", "Internal Medicine"], ["Action", "Re-credentialing (3-yr cycle)"], ["Due", "Aug 2026"]],
      steps: [
        { t: "Open file", d: "Start the re-credentialing packet and pull the standardized application." },
        { t: "Primary-source verify", d: "Check license, DEA, board certification, NPDB, and sanctions across sources." },
        { t: "Flag exceptions", d: "One item needs attention: malpractice COI expires in 30 days — request renewal." },
        { t: "Human review", d: "The credentialing committee approves before the provider is activated.", gate: true },
        { t: "Activate & log", d: "Update the roster and directory, notify contracting, and log the verification trail." },
      ],
      cite: "Orchestrated with a human-in-the-loop approval gate",
    },
    deviation: {
      caseTitle: "Manufacturing deviation — batch investigation",
      caseFields: [["Batch", "LOT-PX340-2271"], ["Signal", "Tablet hardness out of spec"], ["Line", "Compression line 3"], ["Status", "On hold"]],
      steps: [
        { t: "Detect deviation", d: "Hardness readings drift below the lower spec limit on line 3; batch placed on hold." },
        { t: "Gather context", d: "Pull batch records, environmental data, and recent maintenance for the press." },
        { t: "Assess root cause", d: "Pattern matches a known feeder-calibration drift; correlate with the last PM date." },
        { t: "Human review", d: "QA reviews the proposed disposition and CAPA before release.", gate: true },
        { t: "Disposition & log", d: "Recommend rework + feeder recalibration; document the investigation per GMP." },
      ],
      cite: "Orchestrated with a human-in-the-loop approval gate",
    },
    complaintTriage: {
      caseTitle: "Complaint triage — MDR assessment",
      caseFields: [["Complaint", "ECG dropout · CS-X2"], ["Serial", "DV-88231 · fw 4.2.1"], ["Harm", "None reported"], ["Cluster", "12 in 30 days"]],
      steps: [
        { t: "Intake complaint", d: "Capture the complaint, link the serial/firmware, and check for related cases." },
        { t: "Assess reportability", d: "Apply the MDR decision tree: no harm, but malfunction could cause harm if recurring." },
        { t: "Cluster & prioritize", d: "Group with 11 similar 4.2.1 cases; severity moderate, detectability low." },
        { t: "Human review", d: "A regulatory specialist confirms the reportability decision.", gate: true },
        { t: "Route & log", d: "Open a CAPA, route to engineering, and log the assessment for audit." },
      ],
      cite: "Orchestrated with a human-in-the-loop approval gate",
    },
    generic: {
      caseTitle: "Automated workflow",
      caseFields: [["Request", "Sample case"], ["Owner", "Operations"], ["Priority", "Standard"], ["SLA", "Within policy"]],
      steps: [
        { t: "Receive request", d: "Intake the request and validate the inputs." },
        { t: "Retrieve policy & data", d: "Gather approved policy and case data via grounded retrieval." },
        { t: "Evaluate criteria", d: "Apply rules and criteria to reach a recommendation." },
        { t: "Human review", d: "A person approves before any action is taken.", gate: true },
        { t: "Complete & log", d: "Execute the approved action and log every decision for audit." },
      ],
      cite: "Orchestrated with a human-in-the-loop approval gate",
    },
  };
  function agent(uc) {
    const sv = uc.subverticalId;
    let key = "generic";
    if (has(uc, /prior auth|authorization|utilization/)) key = "priorAuth";
    else if (has(uc, /denial|adjustment|correction|claim|rework|appeal/) && sv !== "medtech") key = "denialRework";
    else if (has(uc, /credential|provider data|roster/)) key = "credentialing";
    else if (sv === "pharma-life-sciences" && has(uc, /deviation|manufactur|batch|quality/)) key = "deviation";
    else if (sv === "medtech" && has(uc, /complaint|capa|regulat|post-market|quality/)) key = "complaintTriage";
    else if (sv === "health-payers") key = "priorAuth";
    return JSON.parse(JSON.stringify(AGENTS[key]));
  }

  // ==================================================================== MATCH
  const MATCHES = {
    trial: {
      criteria: "Matching patients to trial PX-204 (psoriasis, Phase II) — a coordinator confirms eligibility",
      cands: [
        { n: "Patient 6841 · 47 F", sub: "PASI 18 · BSA 14% · biologic-naïve", score: 94, why: ["Meets PASI ≥ 12 and BSA ≥ 10%", "No recent biologics", "No exclusionary comorbidities", "Lives 12 mi from site"] },
        { n: "Patient 2207 · 53 M", sub: "PASI 13 · BSA 11% · prior topical only", score: 81, why: ["Meets severity criteria", "Washout period needs confirmation", "Otherwise eligible"] },
        { n: "Patient 9930 · 38 F", sub: "PASI 9 · BSA 7%", score: 36, why: ["Below PASI/BSA threshold", "Two exclusion criteria met", "Likely not eligible"] },
      ],
    },
    program: {
      criteria: "Matching members to a care-management program — a care manager makes the final call",
      cands: [
        { n: "Member MBR-4471 · 58 M", sub: "T2DM + HTN · recent ED visit", score: 90, why: ["Rising A1c (7.6→8.4%)", "ED visit for hypoglycemia", "3 open care gaps", "High readmission risk"] },
        { n: "Member MBR-7782 · 34 F", sub: "Asthma · 2 refills missed", score: 67, why: ["Moderate adherence risk", "Eligible for coaching", "Confirm contact preference"] },
        { n: "Member MBR-1185 · 71 M", sub: "Stable CHF · adherent", score: 38, why: ["Well-controlled currently", "Low near-term risk", "Monitor only"] },
      ],
    },
    referral: {
      criteria: "Matching a referral to the right in-network specialist — staff confirm before booking",
      cands: [
        { n: "Dr. R. Okafor · Cardiology", sub: "Riverside Heart Center · 4.2 mi", score: 93, why: ["In-network for Gold PPO", "Next opening in 6 days", "Accepts new patients", "Subspecialty match (arrhythmia)"] },
        { n: "Dr. L. Hsu · Cardiology", sub: "Downtown Cardiology · 9 mi", score: 78, why: ["In-network", "Next opening in 3 weeks", "General cardiology"] },
        { n: "Dr. P. Mensah · Cardiology", sub: "Out-of-network", score: 34, why: ["Out-of-network — higher cost", "Longer travel", "Not recommended"] },
      ],
    },
  };
  function match(uc) {
    const sv = uc.subverticalId;
    let key = "referral";
    if (sv === "pharma-life-sciences" || has(uc, /trial|protocol|recruit|patient-to-protocol/)) key = "trial";
    else if (sv === "health-payers" || has(uc, /care manage|program|member|risk/)) key = "program";
    else if (sv === "health-providers" && has(uc, /referral|leakage|specialist|network/)) key = "referral";
    return JSON.parse(JSON.stringify(MATCHES[key]));
  }

  // ==================================================================== SCORE
  const SCORES = {
    fraud: {
      title: "Pre-payment fraud & abuse scoring", unit: "risk",
      columns: ["Score", "Claim / provider", "Why flagged"],
      items: [
        { id: "CLM-90418", name: "Dr. office · $8,420 · 14 units same-day", score: 0.93, why: "Improbable daily volume + upcoding pattern" },
        { id: "CLM-90377", name: "DME supplier · $3,110", score: 0.81, why: "Member geography mismatch; duplicate billing signal" },
        { id: "CLM-90402", name: "Lab · $1,940", score: 0.62, why: "Panel unbundling vs NCCI edits" },
        { id: "CLM-90391", name: "Clinic · $640", score: 0.38, why: "Minor modifier anomaly" },
        { id: "CLM-90360", name: "PCP · $210", score: 0.11, why: "Within expected pattern" },
      ],
      cite: "Scored pre-payment; investigators review flagged claims",
    },
    readmit: {
      title: "30-day readmission risk", unit: "risk",
      columns: ["Score", "Patient", "Top risk drivers"],
      items: [
        { id: "Bed 4A", name: "M. Reed · 58 M · CHF exacerbation", score: 0.88, why: "Prior admit < 30d, polypharmacy, lives alone" },
        { id: "Bed 7C", name: "E. Cruz · 34 F · pneumonia", score: 0.64, why: "O2 requirement, missed follow-up history" },
        { id: "Bed 2B", name: "J. Whitaker · 67 M · COPD", score: 0.57, why: "Smoking, low med adherence" },
        { id: "Bed 9D", name: "A. Khan · 45 F · cellulitis", score: 0.31, why: "Responding well, strong support" },
        { id: "Bed 1A", name: "T. Boone · 29 M · appendectomy", score: 0.09, why: "Routine recovery" },
      ],
      cite: "Scored from the chart; care team prioritizes outreach",
    },
    equipment: {
      title: "Predictive equipment failure", unit: "risk",
      columns: ["Score", "Asset", "Sensor signal"],
      items: [
        { id: "DV-88231", name: "CardioSense X2 · Lakeside ICU", score: 0.90, why: "Vibration + thermal drift trending up 6 days" },
        { id: "DV-88110", name: "Infusion pump · Ward 3", score: 0.72, why: "Occlusion alarms rising; motor current variance" },
        { id: "DV-88044", name: "Imaging gantry · Suite 2", score: 0.55, why: "Minor calibration drift" },
        { id: "DV-88260", name: "Telemetry hub · ED", score: 0.33, why: "Within normal range" },
        { id: "DV-88019", name: "Monitor · Recovery", score: 0.10, why: "Healthy" },
      ],
      cite: "Scored from device telemetry; service team schedules maintenance",
    },
    churn: {
      title: "Member churn / propensity", unit: "propensity",
      columns: ["Score", "Member / account", "Signal"],
      items: [
        { id: "GRP-22817", name: "Group · 220 lives · renewal in 60d", score: 0.86, why: "Rising complaints, competitor quote detected" },
        { id: "MBR-7782", name: "Individual · Gold PPO", score: 0.69, why: "Two denied claims, low portal engagement" },
        { id: "MBR-4471", name: "Individual · Silver HMO", score: 0.52, why: "Premium sensitivity at renewal" },
        { id: "MBR-1185", name: "Individual · Gold PPO", score: 0.28, why: "Engaged, recent positive NPS" },
        { id: "MBR-3390", name: "Individual · Platinum", score: 0.08, why: "Loyal, multi-year" },
      ],
      cite: "Scored from engagement signals; retention team prioritizes outreach",
    },
    staffing: {
      title: "Shift demand & coverage risk", unit: "risk",
      columns: ["Score", "Unit / shift", "Driver"],
      items: [
        { id: "ED · Fri PM", name: "Emergency Dept · 19:00-07:00", score: 0.84, why: "Forecast census +18%, 2 open shifts" },
        { id: "ICU · Sat", name: "Intensive Care · day", score: 0.66, why: "1 call-out, high acuity mix" },
        { id: "Med-Surg · Sun", name: "4 West · night", score: 0.49, why: "Tight but covered" },
        { id: "L&D · Mon", name: "Labor & Delivery", score: 0.27, why: "Balanced" },
        { id: "Clinic · Tue", name: "Outpatient", score: 0.08, why: "Fully staffed" },
      ],
      cite: "Scored from demand forecast; managers fill gaps proactively",
    },
  };
  function score(uc) {
    const sv = uc.subverticalId;
    let key = "fraud";
    if (has(uc, /fraud|waste|abuse|payment integrity|\bsiu\b/)) key = "fraud";
    else if (has(uc, /readmiss|deteriorat|surveillance|early warning|clinical risk/)) key = "readmit";
    else if (has(uc, /maintenance|equipment|asset|device (health|failure)|downtime/)) key = "equipment";
    else if (has(uc, /churn|propensity|retention|acquisition|lead|market/)) key = "churn";
    else if (has(uc, /shift|workforce|staff|schedul|demand|capacity/)) key = "staffing";
    else if (sv === "health-payers") key = "fraud";
    else if (sv === "medtech") key = "equipment";
    else if (sv === "health-providers") key = "readmit";
    return JSON.parse(JSON.stringify(SCORES[key]));
  }

  // =================================================================== VISION
  const VIS = {
    chestXray: { caption: "Chest radiograph (PA)", boxTop: "34%", boxLeft: "58%", boxW: "22%", boxH: "20%",
      finding: "Right lower-lobe airspace opacity", conf: 0.86, note: "Pattern consistent with infiltrate; recommend clinical correlation and comparison with priors.", cite: "Assisted read; a radiologist confirms every study" },
    pathology: { caption: "Whole-slide image (H&E)", boxTop: "42%", boxLeft: "40%", boxW: "26%", boxH: "24%",
      finding: "Region with high mitotic density", conf: 0.82, note: "Flagged for pathologist review; grading and final diagnosis require confirmation.", cite: "Assisted read; a pathologist confirms every case" },
    deviceDefect: { caption: "Inline inspection frame", boxTop: "38%", boxLeft: "46%", boxW: "18%", boxH: "16%",
      finding: "Surface scratch on housing", conf: 0.91, note: "Exceeds cosmetic spec C-12; routed for QA disposition.", cite: "Automated inspection; QA confirms before reject/accept" },
    derm: { caption: "Dermoscopic image", boxTop: "40%", boxLeft: "44%", boxW: "20%", boxH: "20%",
      finding: "Asymmetric pigmented lesion", conf: 0.79, note: "Suggest specialist review; not a diagnosis.", cite: "Assisted read; a clinician confirms every read" },
  };
  function vision(uc) {
    let key = "chestXray";
    if (uc.subverticalId === "medtech") key = "deviceDefect";
    else if (has(uc, /pathology|whole-slide|histolog/)) key = "pathology";
    else if (has(uc, /derm|skin|lesion/)) key = "derm";
    else if (has(uc, /radiolog|x-ray|imaging|chest|ct\b|mri/)) key = "chestXray";
    return JSON.parse(JSON.stringify(VIS[key]));
  }

  // ===================================================================== CODE
  const CODES = {
    fhir: {
      lang: "TypeScript", prompt: "validate an incoming FHIR Patient resource",
      pre: ["// Copilot: validate an incoming FHIR Patient resource", "// must have id, name, and a valid birthDate"],
      suggestion: [
        "function validatePatient(p: fhir.Patient): Result {",
        "  if (!p.id) return err('missing id');",
        "  if (!p.name?.length) return err('missing name');",
        "  if (!isValidDate(p.birthDate)) return err('bad birthDate');",
        "  return ok(p);",
        "}",
      ],
      scan: "No secrets, no injection sinks — security scan passed",
    },
    eligibility: {
      lang: "TypeScript", prompt: "check member eligibility for a service",
      pre: ["// Copilot: check member eligibility before scheduling", "// return covered + remaining deductible"],
      suggestion: [
        "function checkEligibility(member: Member, cpt: string): Coverage {",
        "  const plan = getPlan(member.planId);",
        "  const benefit = plan.benefits[cpt] ?? plan.default;",
        "  const remaining = plan.deductible - member.ytdSpend;",
        "  return { covered: benefit.covered, remaining };",
        "}",
      ],
      scan: "Input validated, no PII logged — security scan passed",
    },
  };
  function code(uc) {
    const key = (uc.subverticalId === "health-payers" || has(uc, /eligib|benefit|coverage|claim/)) ? "eligibility" : "fhir";
    return JSON.parse(JSON.stringify(CODES[key]));
  }

  // ===================================================================== APPS
  const APPS = {
    patient: [
      { t: "Sign in", s: "Secure identity", d: "Elena signs in with a passwordless, verified identity. No real credentials are used in this demo." },
      { t: "Find care", s: "Self-service", d: "She searches symptoms, sees in-network options, and picks Cardiology at Riverside Heart Center." },
      { t: "Book & pre-register", s: "Guided flow", d: "She selects Jun 18 at 9:40 AM, confirms insurance, and completes intake forms on her phone." },
      { t: "Confirmation", s: "Done", d: "She gets an instant confirmation with directions and a reminder; the visit syncs to the EHR." },
    ],
    member: [
      { t: "Sign in", s: "Secure identity", d: "The member signs in to the plan portal with verified identity (sample)." },
      { t: "Check a claim", s: "Self-service", d: "They open claim CLM-77204 and see exactly why they owe $32, in plain language." },
      { t: "Take action", s: "Guided flow", d: "They set up autopay, find an in-network specialist, and message support — all in one place." },
      { t: "Confirmation", s: "Done", d: "Changes are confirmed instantly and synced to the core admin system (sample)." },
    ],
    service: [
      { t: "Sign in", s: "Secure identity", d: "The field technician signs in to the service app with verified identity (sample)." },
      { t: "See the work order", s: "Self-service", d: "Device DV-88231 flagged a fault; the app shows history, manuals, and the likely fix." },
      { t: "Guided repair", s: "Guided flow", d: "Step-by-step diagnostics confirm the issue and the right replacement part is reserved." },
      { t: "Close out", s: "Done", d: "The tech logs the fix, the customer signs off, and the asset record updates automatically." },
    ],
  };
  function apps(uc) {
    let key = "patient";
    if (uc.subverticalId === "health-payers") key = "member";
    else if (uc.subverticalId === "medtech" || has(uc, /service|field|technician|asset/)) key = "service";
    return JSON.parse(JSON.stringify(APPS[key]));
  }

  // ================================================================ ANALYTICS
  const ANALYTICS = {
    "health-providers": {
      kpis: [{ l: "Avg ED wait", v: "−22 min", c: "up" }, { l: "30-day readmits", v: "−1.8 pts", c: "up" }, { l: "Clinician time back", v: "+1.6 hr/day", c: "up" }],
      views: [
        { id: "throughput", label: "Throughput", unit: "/day", cats: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], bars: [612, 634, 651, 690, 712, 745] },
        { id: "readmits", label: "Readmits by service", unit: "%", cats: ["CHF", "COPD", "Pneu", "AMI", "Sepsis"], bars: [18, 15, 12, 11, 9] },
        { id: "forecast", label: "Census forecast", unit: "beds", cats: ["W1", "W2", "W3", "W4", "W5", "W6"], bars: [284, 291, 300, 312, 326, 339] },
      ],
    },
    "health-payers": {
      kpis: [{ l: "Auto-adjudication", v: "+9 pts", c: "up" }, { l: "Denial rate", v: "−2.3 pts", c: "up" }, { l: "Avg handle time", v: "−31 sec", c: "up" }],
      views: [
        { id: "auto", label: "Auto-adjudication", unit: "%", cats: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], bars: [74, 76, 78, 80, 83, 86] },
        { id: "denials", label: "Denials by reason", unit: "%", cats: ["Auth", "Coding", "Elig", "Dup", "Other"], bars: [34, 26, 18, 12, 10] },
        { id: "mlr", label: "Cost trend", unit: "idx", cats: ["Q1", "Q2", "Q3", "Q4"], bars: [104, 101, 99, 97] },
      ],
    },
    "pharma-life-sciences": {
      kpis: [{ l: "Enrollment cycle", v: "−18 days", c: "up" }, { l: "Screen-fail rate", v: "−4.1 pts", c: "up" }, { l: "Deviation closure", v: "+12 pts", c: "up" }],
      views: [
        { id: "enroll", label: "Cumulative enrollment", unit: "pts", cats: ["M1", "M2", "M3", "M4", "M5", "M6"], bars: [40, 96, 168, 244, 322, 401] },
        { id: "sites", label: "Screen-fail by site", unit: "%", cats: ["S1", "S2", "S3", "S4", "S5"], bars: [28, 22, 19, 14, 11] },
        { id: "yield", label: "Batch yield", unit: "%", cats: ["B1", "B2", "B3", "B4", "B5", "B6"], bars: [91, 92, 90, 94, 95, 96] },
      ],
    },
    "medtech": {
      kpis: [{ l: "OEE", v: "+6.4 pts", c: "up" }, { l: "Defect escape", v: "−0.7 pts", c: "up" }, { l: "Mean time to repair", v: "−2.3 hr", c: "up" }],
      views: [
        { id: "oee", label: "OEE", unit: "%", cats: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], bars: [78, 80, 81, 84, 86, 88] },
        { id: "defects", label: "Defects by type", unit: "ppm", cats: ["Cosmetic", "Dimensional", "Electrical", "Assembly", "Other"], bars: [320, 210, 140, 90, 60] },
        { id: "uptime", label: "Fleet uptime", unit: "%", cats: ["W1", "W2", "W3", "W4", "W5", "W6"], bars: [96, 97, 97, 98, 99, 99] },
      ],
    },
  };
  function analytics(uc) {
    const a = ANALYTICS[uc.subverticalId] || ANALYTICS["health-providers"];
    return JSON.parse(JSON.stringify(a));
  }

  // ===================================================================== DATA
  const DATA = {
    "health-providers": { sources: ["EHR / clinical (FHIR)", "Claims & billing", "Scheduling & ops", "Patient-generated / SDOH"], consumers: ["Clinical analytics & BI", "AI grounding & copilots", "Population health"] },
    "health-payers": { sources: ["Claims (837/835)", "Eligibility & enrollment", "Clinical / HEDIS", "Provider & network"], consumers: ["Actuarial & BI", "AI grounding & copilots", "Care & UM apps"] },
    "pharma-life-sciences": { sources: ["Lab & assay (LIMS)", "Clinical trial (EDC)", "Manufacturing (MES)", "Real-world & literature"], consumers: ["R&D analytics & BI", "AI grounding & copilots", "Regulatory & safety"] },
    "medtech": { sources: ["Device telemetry (IoT)", "Manufacturing (MES)", "Complaints & quality", "Service & CRM"], consumers: ["Product analytics & BI", "AI grounding & copilots", "Field service apps"] },
  };
  function data(uc) {
    const d = DATA[uc.subverticalId] || DATA["health-providers"];
    return JSON.parse(JSON.stringify(d));
  }

  // ==================================================================== INFRA
  const INFRA = {
    "health-providers": { current: ["On-prem EHR integration bus", "Aging SQL clusters", "Manual DR runbooks"], rto: "RTO 4h → 15 min" },
    "health-payers": { current: ["Mainframe core admin", "Batch claims jobs", "Tape-based DR"], rto: "RTO 8h → 30 min" },
    "pharma-life-sciences": { current: ["On-prem HPC for R&D", "Siloed lab servers", "Manual DR"], rto: "RTO 6h → 20 min" },
    "medtech": { current: ["On-prem device data store", "Plant-floor servers", "Manual failover"], rto: "RTO 5h → 15 min" },
  };
  function infra(uc) {
    const i = INFRA[uc.subverticalId] || INFRA["health-providers"];
    return JSON.parse(JSON.stringify(i));
  }

  // ================================================================= SECURITY
  const SEC = {
    "health-providers": [
      { sev: "high", t: "Impossible-travel sign-in", s: "Clinician account: logins from two regions 11 min apart", detail: "Identity risk auto-raised; session revoked and step-up MFA enforced. Investigation playbook started." },
      { sev: "med", t: "Unusual PHI access", s: "Service account queried 9,400 patient records off-hours", detail: "Access isolated and reviewed; volume far exceeds baseline. Data-exfil playbook engaged." },
      { sev: "low", t: "Exposed endpoint", s: "Test API reachable from public internet", detail: "Posture scan flagged; network rule remediation proposed automatically." },
    ],
    "health-payers": [
      { sev: "high", t: "Credential stuffing", s: "Member portal: 4,200 failed logins in 10 min", detail: "Rate-limiting and bot defense engaged; affected accounts forced to reset." },
      { sev: "med", t: "Anomalous claims export", s: "Analyst exported 50k claim records", detail: "DLP held the export; access reviewed against need-to-know." },
      { sev: "low", t: "Misconfiguration", s: "Storage container set to broad access", detail: "Auto-remediation tightened access to least privilege." },
    ],
    "pharma-life-sciences": [
      { sev: "high", t: "IP exfiltration attempt", s: "Large download from the research data lake", detail: "Session isolated; transfer blocked pending review. Insider-risk playbook engaged." },
      { sev: "med", t: "Unusual GxP system access", s: "Off-hours access to a validated system", detail: "Access logged and flagged for QA; step-up auth applied." },
      { sev: "low", t: "Unpatched VM", s: "HPC node missing a critical update", detail: "Patch scheduled automatically in the next window." },
    ],
    "medtech": [
      { sev: "high", t: "Anomalous device fleet traffic", s: "Spike in outbound from connected devices", detail: "Segment isolated; firmware integrity check started. Device-compromise playbook engaged." },
      { sev: "med", t: "Plant-floor account misuse", s: "Shared account used from an unknown host", detail: "Session blocked; unique identities enforced for OT access." },
      { sev: "low", t: "Open management port", s: "Device management port exposed", detail: "Posture scan flagged; rule remediation proposed." },
    ],
  };
  function security(uc) {
    const s = SEC[uc.subverticalId] || SEC["health-providers"];
    return JSON.parse(JSON.stringify(s));
  }

  window.DEMOSCENES = { chat, extraction, summarize, agent, match, score, vision, code, apps, analytics, data, infra, security };
})();
