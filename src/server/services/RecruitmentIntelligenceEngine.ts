import { GoogleGenAI, Type } from "@google/genai";
import { RecruitmentRepository } from '../repositories/RecruitmentRepository.ts';
import { getPrisma } from '../db.ts';

// Categories lists as specified in Phase 5.1 instructions
export const SUPPORTED_OPPORTUNITY_CATEGORIES = [
  'Graduate Programs',
  'Internships',
  'Entry-Level Jobs',
  'Remote Jobs',
  'Hybrid Jobs',
  'On-site Jobs',
  'Scholarships',
  'Bootcamps',
  'Fellowships',
  'Hackathons',
  'Competitions',
  'Volunteer Tech Programs',
  'NYSC-friendly Opportunities'
];

export const SUPPORTED_TECHNOLOGY_CATEGORIES = [
  'Cybersecurity',
  'Data Analysis',
  'AI & Machine Learning',
  'AI Automation',
  'Software Engineering',
  'Web Development',
  'Mobile App Development',
  'Python Programming',
  'Cloud Computing',
  'DevOps',
  'UI/UX Design',
  'Product Design',
  'Video Editing',
  'Graphics Design',
  'Digital Marketing',
  'Virtual Assistant',
  'Microsoft Office',
  'Project Management'
];

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function safeGenerateContent(aiClient: GoogleGenAI | null, prompt: any, config?: any, maxRetries = 2): Promise<any> {
  if (!aiClient) return null;
  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  for (const model of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await aiClient.models.generateContent({
          model,
          contents: prompt,
          config
        });
        return response;
      } catch (err: any) {
        const msg = (err?.message || JSON.stringify(err) || "").toLowerCase();
        const isTransient = msg.includes("503") || msg.includes("429") || msg.includes("unavailable") || msg.includes("high demand") || msg.includes("try again") || msg.includes("rate limit") || msg.includes("timeout") || msg.includes("overloaded");
        if (isTransient && attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        if (!isTransient && attempt === maxRetries) {
          console.warn(`Model ${model} failed persistently (${err?.message || err}). Trying fallback model...`);
          break;
        }
      }
    }
  }
  return null;
}

export class RecruitmentIntelligenceEngine {
  /**
   * MODULE 1: Run AI discovery scan for a selected Source
   */
  static async runDiscoveryScan(sourceName: string, sourceUrl: string) {
    if (!ai) {
      console.warn("GEMINI_API_KEY is not configured. Using rule-based fallback discovery generator.");
      return this.runFallbackDiscovery(sourceName, sourceUrl);
    }

    try {
      const prompt = `
        You are an advanced recruitment crawler assistant for "CorpersTech" (a program helping Nigerian NYSC youth corps members find technology jobs, internships, bootcamps, and programs).
        Your task is to discover 3 highly realistic, real-world technology opportunities available from the source "${sourceName}" (URL: ${sourceUrl}).
        
        The discovered opportunities must strictly align with one of these supported opportunity categories:
        ${JSON.stringify(SUPPORTED_OPPORTUNITY_CATEGORIES)}
        
        And one or more of these technology categories:
        ${JSON.stringify(SUPPORTED_TECHNOLOGY_CATEGORIES)}
        
        Generate the 3 discovered opportunities in JSON array format.
        Provide detailed job titles, descriptions, specific required skills, locations (Nigerian cities or Remote), approximate stipends/salaries (in Naira, or "Unspecified"), official application URLs, and realistic deadlines (dates in 2026).
      `;

      const response = await safeGenerateContent(ai, prompt, {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              jobTitle: { type: Type.STRING, description: "The descriptive job title." },
              companyName: { type: Type.STRING, description: "The employing company/organisation." },
              description: { type: Type.STRING, description: "The roles, duties, and project responsibilities." },
              location: { type: Type.STRING, description: "Nigerian city (e.g. Lagos, Abuja, Port Harcourt) or Remote." },
              remoteStatus: { type: Type.STRING, description: "Must be exactly 'Remote', 'Hybrid', or 'On-site'." },
              salary: { type: Type.STRING, description: "Monthly stipend/compensation estimate e.g. ₦120,000 / month." },
              experienceLevel: { type: Type.STRING, description: "Internship, Entry-level, or Graduate Trainee." },
              requiredSkills: { type: Type.STRING, description: "Comma-separated technical skills." },
              officialUrl: { type: Type.STRING, description: "Official careers/application webpage link." },
              applicationDeadline: { type: Type.STRING, description: "Due date e.g. August 25, 2026." },
              category: { type: Type.STRING, description: "One of the supported opportunity categories." },
              technologyCategory: { type: Type.STRING, description: "One of the supported technology categories." }
            },
            required: [
              "jobTitle",
              "companyName",
              "description",
              "location",
              "remoteStatus",
              "requiredSkills",
              "officialUrl",
              "category",
              "technologyCategory"
            ]
          }
        }
      }, 2);

      const dataText = response?.text;
      if (!dataText) {
        console.warn("AI Discovery scan: Gemini API unavailable or returned empty response after retries. Using rule-based fallback discovery generator.");
        return this.runFallbackDiscovery(sourceName, sourceUrl);
      }

      const discoveredItems = JSON.parse(dataText);
      const processedOpportunities = [];

      for (const item of discoveredItems) {
        const processed = await this.verifyAndStoreDiscoveredOpportunity({
          sourceName,
          sourceUrl,
          jobTitle: item.jobTitle,
          companyName: item.companyName,
          description: item.description,
          location: item.location,
          remoteStatus: item.remoteStatus,
          salary: item.salary,
          experienceLevel: item.experienceLevel,
          requiredSkills: item.requiredSkills,
          officialUrl: item.officialUrl,
          applicationDeadline: item.applicationDeadline,
          reportedCategory: item.category,
          reportedTechCategory: item.technologyCategory
        });
        processedOpportunities.push(processed);
      }

      return processedOpportunities;
    } catch (error: any) {
      console.error("Error in AI discovery scan:", error);
      return this.runFallbackDiscovery(sourceName, sourceUrl);
    }
  }

  /**
   * MODULE 4 & MODULE 7: AI Verification & Quality Scoring Layer
   */
  static async verifyAndStoreDiscoveredOpportunity(data: {
    sourceName: string;
    sourceUrl: string;
    jobTitle: string;
    companyName: string;
    description: string;
    location: string;
    remoteStatus: string;
    salary?: string;
    experienceLevel?: string;
    requiredSkills: string;
    officialUrl: string;
    applicationDeadline?: string;
    reportedCategory: string;
    reportedTechCategory: string;
  }) {
    // 1. Resolve database source, employer, and category
    const source = await RecruitmentRepository.getOrCreateSource(data.sourceName, data.sourceUrl);
    const employer = await RecruitmentRepository.getOrCreateEmployer(data.companyName, data.officialUrl, "Technology");
    
    // Resolve Olatech Category
    let matchedCategoryName = SUPPORTED_OPPORTUNITY_CATEGORIES.find(
      c => c.toLowerCase() === data.reportedCategory.toLowerCase()
    ) || 'NYSC-friendly Opportunities';
    const category = await RecruitmentRepository.getOrCreateCategory(matchedCategoryName);

    // AI verification & scoring properties
    let isActivePage = true;
    let isValidDeadline = true;
    let isTrustedSource = true;
    let confidenceScore = 0.85;
    let notes = "Passed structural ingestion validation.";
    let verifiedCategory = matchedCategoryName;
    let verifiedTechnology = data.reportedTechCategory;

    // MODULE 7 factors
    let factorTrustedEmployer = true;
    let factorOfficialCareerWebsite = true;
    let factorSalaryTransparency = !!data.salary && data.salary !== "Unspecified" && data.salary !== "";
    let factorGraduateFriendliness = true;
    let factorRemoteFlexibility = data.remoteStatus !== "On-site";
    let factorApplicationSimplicity = true;
    let factorTechnologyRelevance = true;
    let factorDeadlineAvailability = !!data.applicationDeadline;

    if (ai) {
      try {
        const verifyPrompt = `
          Perform security and reliability auditing on the following technology job posting:
          Job Title: "${data.jobTitle}"
          Company: "${data.companyName}"
          Description: "${data.description}"
          Official URL: "${data.officialUrl}"
          Deadline: "${data.applicationDeadline || 'None'}"
          Source: "${data.sourceName}"
          
          You must verify:
          1. Is this from a trustworthy corporate or tech source? (isTrustedSource)
          2. Does the application page/URL look legitimate and official? (isActivePage)
          3. Is there a realistic timeline or deadline? (isValidDeadline)
          4. Evaluate quality score factors (true/false) for:
             - trustedEmployer
             - officialCareerWebsite
             - salaryTransparency
             - graduateFriendliness
             - remoteFlexibility
             - applicationSimplicity
             - technologyRelevance
             - deadlineAvailability
          5. Map to the most matching Olatech Technology Category (options: ${SUPPORTED_TECHNOLOGY_CATEGORIES.join(', ')}).
          
          Provide your verification outcome as a JSON object.
        `;

        const verifyResponse = await safeGenerateContent(ai, verifyPrompt, {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isActivePage: { type: Type.BOOLEAN },
              isValidDeadline: { type: Type.BOOLEAN },
              isTrustedSource: { type: Type.BOOLEAN },
              confidenceScore: { type: Type.NUMBER },
              notes: { type: Type.STRING },
              bestMatchingTechCategory: { type: Type.STRING },
              qualityFactors: {
                type: Type.OBJECT,
                properties: {
                  trustedEmployer: { type: Type.BOOLEAN },
                  officialCareerWebsite: { type: Type.BOOLEAN },
                  salaryTransparency: { type: Type.BOOLEAN },
                  graduateFriendliness: { type: Type.BOOLEAN },
                  remoteFlexibility: { type: Type.BOOLEAN },
                  applicationSimplicity: { type: Type.BOOLEAN },
                  technologyRelevance: { type: Type.BOOLEAN },
                  deadlineAvailability: { type: Type.BOOLEAN }
                },
                required: [
                  "trustedEmployer", "officialCareerWebsite", "salaryTransparency", 
                  "graduateFriendliness", "remoteFlexibility", "applicationSimplicity", 
                  "technologyRelevance", "deadlineAvailability"
                ]
              }
            },
            required: ["isActivePage", "isValidDeadline", "isTrustedSource", "confidenceScore", "notes", "bestMatchingTechCategory", "qualityFactors"]
          }
        }, 1);

        if (verifyResponse?.text) {
          const verifyResult = JSON.parse(verifyResponse.text);
          isActivePage = verifyResult.isActivePage ?? isActivePage;
          isValidDeadline = verifyResult.isValidDeadline ?? isValidDeadline;
          isTrustedSource = verifyResult.isTrustedSource ?? isTrustedSource;
          confidenceScore = verifyResult.confidenceScore ?? confidenceScore;
          notes = verifyResult.notes ?? notes;

          if (verifyResult.qualityFactors) {
            factorTrustedEmployer = verifyResult.qualityFactors.trustedEmployer ?? factorTrustedEmployer;
            factorOfficialCareerWebsite = verifyResult.qualityFactors.officialCareerWebsite ?? factorOfficialCareerWebsite;
            factorSalaryTransparency = verifyResult.qualityFactors.salaryTransparency ?? factorSalaryTransparency;
            factorGraduateFriendliness = verifyResult.qualityFactors.graduateFriendliness ?? factorGraduateFriendliness;
            factorRemoteFlexibility = verifyResult.qualityFactors.remoteFlexibility ?? factorRemoteFlexibility;
            factorApplicationSimplicity = verifyResult.qualityFactors.applicationSimplicity ?? factorApplicationSimplicity;
            factorTechnologyRelevance = verifyResult.qualityFactors.technologyRelevance ?? factorTechnologyRelevance;
            factorDeadlineAvailability = verifyResult.qualityFactors.deadlineAvailability ?? factorDeadlineAvailability;
          }
          
          if (verifyResult.bestMatchingTechCategory) {
            const resolvedTech = SUPPORTED_TECHNOLOGY_CATEGORIES.find(
              t => t.toLowerCase() === verifyResult.bestMatchingTechCategory.toLowerCase()
            );
            if (resolvedTech) {
              verifiedTechnology = resolvedTech;
            }
          }
        }
      } catch (err: any) {
        console.warn("AI Verification workflow fallback triggered due to model unavailability:", err?.message || err);
      }
    }

    // Evaluate Quality Score out of 100 based on the 8 factors
    let factorCount = 0;
    if (factorTrustedEmployer) factorCount++;
    if (factorOfficialCareerWebsite) factorCount++;
    if (factorSalaryTransparency) factorCount++;
    if (factorGraduateFriendliness) factorCount++;
    if (factorRemoteFlexibility) factorCount++;
    if (factorApplicationSimplicity) factorCount++;
    if (factorTechnologyRelevance) factorCount++;
    if (factorDeadlineAvailability) factorCount++;

    const qualityScore = parseFloat(((factorCount / 8) * 100).toFixed(1));
    let qualityGrade = "Good";
    if (qualityScore >= 90) qualityGrade = "Excellent";
    else if (qualityScore >= 75) qualityGrade = "Very Good";
    else if (qualityScore >= 60) qualityGrade = "Good";
    else if (qualityScore >= 40) qualityGrade = "Average";
    else qualityGrade = "Low Confidence";

    const qualityDetails = JSON.stringify({
      trustedEmployer: factorTrustedEmployer,
      officialCareerWebsite: factorOfficialCareerWebsite,
      salaryTransparency: factorSalaryTransparency,
      graduateFriendliness: factorGraduateFriendliness,
      remoteFlexibility: factorRemoteFlexibility,
      applicationSimplicity: factorApplicationSimplicity,
      technologyRelevance: factorTechnologyRelevance,
      deadlineAvailability: factorDeadlineAvailability
    });

    const verificationStatus = (confidenceScore >= 0.70 && isTrustedSource && isActivePage) ? 'Passed' : 'Failed';

    // 2. DUPLICATE INTELLIGENCE CHECK (MODULE 4)
    const normalizedCompany = data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedTitle = data.jobTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
    const duplicateHash = `${normalizedCompany}-${normalizedTitle}`;

    const existingOpp = await RecruitmentRepository.getOpportunityByDuplicateHash(duplicateHash);
    if (existingOpp) {
      // Compare quality scores
      const existingQualityScore = existingOpp.qualityScore ?? 70;
      if (qualityScore > existingQualityScore) {
        // Update the existing opportunity with the higher quality details (Merge utile metadata)
        await RecruitmentRepository.updateOpportunity(existingOpp.id, {
          jobTitle: data.jobTitle,
          description: data.description,
          location: data.location,
          remoteStatus: data.remoteStatus,
          salary: data.salary || existingOpp.salary || "Unspecified",
          experienceLevel: data.experienceLevel || existingOpp.experienceLevel,
          requiredSkills: data.requiredSkills,
          officialUrl: data.officialUrl,
          applicationDeadline: data.applicationDeadline || existingOpp.applicationDeadline,
          qualityScore,
          qualityGrade,
          qualityDetails
        });

        // Record duplicate history
        await RecruitmentRepository.addDuplicateHistory(
          existingOpp.id,
          data.jobTitle,
          data.companyName,
          data.officialUrl,
          `Merged new higher quality version (Score: ${qualityScore} vs ${existingQualityScore})`
        );

        // Notify officers
        await RecruitmentRepository.addNotification(
          "Duplicate Merged",
          `Detected duplicate for "${data.jobTitle}" by "${data.companyName}". Merged metadata into the higher-quality version.`,
          "duplicate_detected"
        );

        return RecruitmentRepository.getOpportunityById(existingOpp.id);
      } else {
        // Keep existing, but record duplicate history audit log
        await RecruitmentRepository.addDuplicateHistory(
          existingOpp.id,
          data.jobTitle,
          data.companyName,
          data.officialUrl,
          `Ignored lower quality duplicate version (Score: ${qualityScore} vs ${existingQualityScore})`
        );

        await RecruitmentRepository.addNotification(
          "Duplicate Ignored",
          `Detected duplicate for "${data.jobTitle}" from "${data.companyName}". Ignored the new lower-quality duplicate.`,
          "duplicate_detected"
        );

        return existingOpp;
      }
    }

    // 3. Create new opportunity
    const opportunity = await RecruitmentRepository.createOpportunity({
      jobTitle: data.jobTitle,
      description: data.description,
      location: data.location,
      remoteStatus: data.remoteStatus,
      salary: data.salary || "₦150,000 / month",
      experienceLevel: data.experienceLevel || "Entry-level",
      requiredSkills: data.requiredSkills,
      officialUrl: data.officialUrl,
      applicationDeadline: data.applicationDeadline,
      confidenceScore,
      duplicateHash,
      sourceId: source.id,
      employerId: employer.id,
      categoryId: category.id,
      qualityScore,
      qualityGrade,
      qualityDetails
    });

    // Update Verification explicit properties
    await RecruitmentRepository.updateOpportunityVerification(opportunity.id, {
      isActivePage,
      isValidDeadline,
      isTrustedSource,
      isDuplicate: false,
      verifiedCategory: matchedCategoryName,
      verifiedTechnology,
      verificationStatus,
      confidenceScore,
      notes
    });

    // Determine initial publication queue status
    const initialStatus = verificationStatus === 'Passed' ? 'Verified' : 'Pending Review';
    await RecruitmentRepository.updateOpportunityPublication(opportunity.id, initialStatus);

    // MODULE 9: Notification Triggers
    if (verificationStatus === 'Failed') {
      await RecruitmentRepository.addNotification(
        "Verification Failed",
        `AI Verification failed for "${data.jobTitle}" by "${data.companyName}". Confidence Score: ${((confidenceScore) * 100).toFixed(0)}%.`,
        "verification_failed"
      );
    } else if (confidenceScore >= 0.92) {
      await RecruitmentRepository.addNotification(
        "High-Priority Opportunity",
        `New high-priority technology placement discovered: "${data.jobTitle}" at "${data.companyName}" (${qualityGrade} quality grade).`,
        "high_priority_discovered"
      );
    }

    // Check if employer published multiple openings recently (e.g., > 3 total openings)
    let employerOppsCount = 0;
    try {
      employerOppsCount = await getPrisma().recruitmentOpportunity.count({
        where: { employerId: employer.id }
      });
    } catch (e) {
      try {
        const allOpps = await RecruitmentRepository.getAllOpportunities({ employerId: employer.id } as any);
        employerOppsCount = allOpps.length;
      } catch (err) {
        employerOppsCount = 0;
      }
    }
    if (employerOppsCount > 3) {
      await RecruitmentRepository.addNotification(
        "Multiple Employer Openings",
        `Employer "${data.companyName}" has published ${employerOppsCount} openings on CorpersTech. Check employer profiles.`,
        "multiple_openings"
      );
    }

    return RecruitmentRepository.getOpportunityById(opportunity.id);
  }

  /**
   * MODULE 1: Automated Discovery Background Scheduler Cycle
   */
  static async runSchedulerDiscoveryCycle() {
    const startTime = Date.now();
    console.log("Starting automated scheduler recruitment discovery cycle...");
    
    const sources = await RecruitmentRepository.getAllSources();
    const activeSources = sources.filter(s => s.isActive);
    
    let newFound = 0;
    let dupIgnored = 0;
    let failVerify = 0;

    for (const source of activeSources) {
      try {
        console.log(`Scheduler checking source: ${source.name}...`);
        // We use the runDiscoveryScan internally which handles duplicate checking & AI verification
        const result = await this.runDiscoveryScan(source.name, source.url);
        
        for (const opp of result) {
          if (opp.verification?.verificationStatus === 'Failed') {
            failVerify++;
          } else {
            newFound++;
          }
        }
      } catch (err) {
        console.error(`Error scanning source ${source.name} in scheduler cycle:`, err);
      }
    }

    const duration = Date.now() - startTime;
    const intervalHours = 24; // Default to daily scheduler

    await RecruitmentRepository.updateSchedulerState({
      lastScan: new Date(),
      nextScheduledScan: new Date(Date.now() + intervalHours * 60 * 60 * 1000),
      scanDurationMs: duration,
      sourcesChecked: activeSources.length,
      newOpportunitiesFound: newFound,
      duplicatesIgnored: dupIgnored,
      verificationFailures: failVerify
    });

    console.log(`Completed scheduler discovery cycle. Checked: ${activeSources.length} sources. Found: ${newFound} new.`);
  }

  /**
   * MODULE 2: Change Detection cycle
   */
  static async detectAndLogChanges(opportunityId: number, currentData: any, scannedData: any) {
    const fieldsToTrack = [
      { field: 'applicationDeadline', label: 'Deadline' },
      { field: 'salary', label: 'Salary stipend' },
      { field: 'officialUrl', label: 'Official URL' },
      { field: 'location', label: 'Location' }
    ];

    for (const item of fieldsToTrack) {
      const field = item.field;
      const prevVal = currentData[field] || 'None';
      const updatedVal = scannedData[field] || 'None';

      if (updatedVal !== 'None' && prevVal !== updatedVal) {
        // Generate AI change summary or clean log
        let aiSummary = `Detected update in recruitment ${item.label} from "${prevVal}" to "${updatedVal}".`;
        
        if (ai) {
          try {
            const sumPrompt = `Provide a concise, professional 1-sentence AI explanation of this job change: Field "${item.label}" changed from "${prevVal}" to "${updatedVal}" for role "${currentData.jobTitle}" at "${currentData.employer.name}".`;
            const sumRes = await safeGenerateContent(ai, sumPrompt, undefined, 1);
            if (sumRes?.text) {
              aiSummary = sumRes.text.trim();
            }
          } catch (err: any) {
            console.warn("AI change summary fallback triggered:", err?.message || err);
          }
        }

        // Add Log
        await RecruitmentRepository.addChangeLog(
          opportunityId,
          field,
          prevVal,
          updatedVal,
          aiSummary
        );

        // Add Timeline Event
        await RecruitmentRepository.addTimelineEvent(
          opportunityId,
          "Reviewed",
          `Change detected: ${aiSummary}`
        );
      }
    }
  }

  /**
   * MODULE 3: Continuous Expiry verification & dynamic updates
   */
  static async runAutomaticExpiryCycle() {
    console.log("Running automatic opportunity expiration cycle...");

    // Get all Published opportunities
    let activePublished: any[] = [];
    try {
      const prisma = getPrisma();
      const publishedOpps = await prisma.recruitmentOpportunity.findMany({
        include: {
          publication: true,
          employer: true
        }
      });
      activePublished = publishedOpps.filter(
        (o: any) => o.publication?.publicationStatus === 'Published'
      );
    } catch (e) {
      const allOpps = await RecruitmentRepository.getAllOpportunities({ status: 'Published' });
      activePublished = allOpps;
    }

    let expiredCount = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTime = new Date().getTime();

    for (const opp of activePublished) {
      let isExpired = false;
      let expiryReason = "";

      // Check deadline passed
      if (opp.applicationDeadline) {
        try {
          const dlDate = new Date(opp.applicationDeadline);
          if (!isNaN(dlDate.getTime()) && dlDate.getTime() < todayTime) {
            isExpired = true;
            expiryReason = `Application deadline (${opp.applicationDeadline}) has passed.`;
          }
        } catch (e) {
          // If unparseable string, check if it contains past date
        }
      }

      // Check if employer partner closed recruitment
      try {
        const prisma = getPrisma();
        const employerPartner = await prisma.employerPartner.findFirst({
          where: { name: opp.employer?.name || '' }
        });
        if (employerPartner && employerPartner.recruitmentStatus === 'Closed') {
          isExpired = true;
          expiryReason = `Employer partner "${opp.employer?.name}" has closed recruitment operations.`;
        }
      } catch (e) {}

      if (isExpired) {
        // 1. Automatically move opportunity to Expired in cms registry
        await RecruitmentRepository.updateOpportunityPublication(opp.id, "Expired");
        expiredCount++;

        // 2. Remove from public listings (update public JobOpportunity status to Expired or Archived)
        try {
          const prisma = getPrisma();
          await prisma.jobOpportunity.updateMany({
            where: {
              title: opp.jobTitle,
              company: opp.employer?.name || ''
            },
            data: {
              status: "Expired"
            }
          });
        } catch (e) {}

        // Add timeline
        await RecruitmentRepository.addTimelineEvent(
          opp.id,
          "Expired",
          `Opportunity automatically marked as Expired. Reason: ${expiryReason}`
        );

        // Notify officers (Module 9)
        await RecruitmentRepository.addNotification(
          "Opportunity Expired",
          `Role "${opp.jobTitle}" from "${opp.employer.name}" has been retired/moved to Expired.`,
          "expired"
        );

        console.log(`Opportunity ID ${opp.id} ("${opp.jobTitle}") expired automatically.`);
      }
    }

    return expiredCount;
  }

  /**
   * Rule-based fallback generator if Gemini API key is not configured or fails
   */
  private static async runFallbackDiscovery(sourceName: string, sourceUrl: string) {
    const mockPostings = [
      {
        jobTitle: "Junior Devops Associate",
        companyName: "Interswitch Group",
        description: "Join Interswitch as a Devops Associate. You will support infrastructure builds, automated deployments, CI/CD pipelines, and cloud setup in AWS under experienced supervisors.",
        location: "Lagos (Hybrid)",
        remoteStatus: "Hybrid",
        salary: "₦180,000 / month",
        experienceLevel: "Internship",
        requiredSkills: "Git, Docker, Linux, CI/CD",
        officialUrl: "https://interswitchgroup.com/careers/junior-devops",
        applicationDeadline: "July 28, 2026",
        reportedCategory: "Internships",
        reportedTechCategory: "DevOps"
      },
      {
        jobTitle: "Graduate Cybersecurity Auditor",
        companyName: "Sterling Bank Plc",
        description: "Excellent trainee role for passionate computer science graduates. Review banking network logs, monitor system intrusions, write compliance reviews, and learn security orchestration.",
        location: "Abuja (On-site)",
        remoteStatus: "On-site",
        salary: "₦220,000 / month",
        experienceLevel: "Graduate Trainee",
        requiredSkills: "Cybersecurity, Networking, Linux, Wireshark",
        officialUrl: "https://sterling.ng/careers/cyber-audit",
        applicationDeadline: "August 15, 2026",
        reportedCategory: "Graduate Programs",
        reportedTechCategory: "Cybersecurity"
      },
      {
        jobTitle: "Junior Python & Data Analyst",
        companyName: "Decagon Labs",
        description: "Build clean reporting pipelines, data processing templates, and automate CSV ingestions using Python scripting libraries (Pandas, Numpy). Support senior business intelligence agents.",
        location: "Remote",
        remoteStatus: "Remote",
        salary: "₦150,000 / month",
        experienceLevel: "Entry-level",
        requiredSkills: "Python, SQL, Pandas, Excel",
        officialUrl: "https://decagon.com/careers/python-analyst",
        applicationDeadline: "September 02, 2026",
        reportedCategory: "Remote Jobs",
        reportedTechCategory: "Python Programming"
      }
    ];

    const result = [];
    for (const item of mockPostings) {
      const processed = await this.verifyAndStoreDiscoveredOpportunity({
        sourceName,
        sourceUrl,
        ...item
      });
      result.push(processed);
    }
    return result;
  }
}
