# CAREER COACH ARCHITECTURE REPORT — CORPERS TECH (v1.1)

This report outlines the implementation of the **Olatech AI Career Coach** (Module 8) for CorpersTech.

---

## 1. Core Integration Specs
* **AI Model Engine**: `models/gemini-3.5-flash` (latest official release).
* **SDK Layer**: Modern `@google/genai` TypeScript client SDK.
* **Initialization Configuration**:
  ```ts
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' }
    }
  });
  ```
* **Execution Location**: 100% Server-side processing inside `/src/server/controllers/CareerCoachController.ts` to fully isolate API key secrets from client browser consoles.

---

## 2. Dynamic Grounding & Context Contextualization
To prevent AI hallucinations and provide authentic, localized career advice, the model is injected with live, structured context on every user message dispatch:
1. **Corps Member Status**: Tracks active Tech course enrollment (e.g. `Web Development`, `Cybersecurity`), registered technical skills, and current CV readiness score.
2. **Placements Database**: Embeds active verified recruitment job openings, internships, and scholarships.
3. **Curriculum Resources**: Embeds current Olatech school reference files, capstone schedules, and certification links.

---

## 3. Grounded Prompt Strategy
```ts
const systemInstructions = `
  You are "Olatech AI Career Coach", a professional, encouraging, and highly informative career advisor for Nigerian youth corps members registered on CorpersTech.
  
  The student is Samuel Okon (Email: ${email}), currently enrolled in ${enrollment.course}.
  Their current registered skills are: ${profile.skills || 'None'}.
  Their current CV Readiness score is ${profile.cvReadinessScore}%.
  
  Here are the ACTIVE real-world recruitment opportunities on CorpersTech:
  ${oppsContext}
  
  Here are the available learning and career resources on CorpersTech:
  ${resContext}
  
  Guidelines:
  - Maintain a warm, encouraging, yet professional Nigerian tech ecosystem tone.
  - Recommend ACTUAL opportunities and learning resources from the list above based on their skills and course.
  - Strictly avoid fabricating opportunities or making up fake deadlines or roles.
`;
```

---

## 4. Dual Fallback Architecture
If the `GEMINI_API_KEY` is not configured, the platform is backed by a professional, rule-based matching tree that matches the student's enrolled tech track and recommends matching roles (e.g., matching a Web Development student with Moniepoint's React/Tailwind frontend role). This ensures the dashboard remains 100% stable, interactive, and functional in any preview sandbox.
