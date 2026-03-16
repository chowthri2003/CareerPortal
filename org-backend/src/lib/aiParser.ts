import { extractText } from "unpdf";
import { geminiModel } from "../config/gemini.config.js";

export const parseResumeFromBuffer = async (buffer: Buffer) => {
  const uint8Array = new Uint8Array(buffer);
  const { text: pages } = await extractText(uint8Array, { mergePages: true });

  const rawText = (Array.isArray(pages) ? pages.join("\n") : String(pages)).trim();

  if (!rawText || rawText.length < 50) {
    throw new Error(
      "Could not extract readable text from this PDF. Please ensure it is not a scanned image."
    );
  }


  const prompt = `You are an expert resume parser. Extract structured information from the resume text below and return ONLY a valid JSON object matching this schema.

RULES:
- Missing fields → empty string "" for strings, empty array [] for arrays.
- Dates → YYYY-MM-DD.
- currentlyWorking → true if resume says Present/Current.
- skills → comma-separated string.
- totalExperience → "3 Years", "5 Years 6 Months".
- noticePeriod → days as string, default "30".

JSON Schema:
{
  "firstName": "",
  "middleName": "",
  "lastName": "",
  "email": "",
  "mobilePhone": "",
  "dateOfBirth": "",
  "gender": "",
  "totalExperience": "",
  "noticePeriod": "",
  "currentSalary": "",
  "skills": "",
  "experienceDetails": [
    {
      "companyName": "",
      "jobTitle": "",
      "currentlyWorking": false,
      "dateOfJoining": "",
      "dateOfRelieving": "",
      "description": ""
    }
  ],
  "educationDetails": [
    {
      "course": "",
      "branch": "",
      "university": "",
      "startOfCourse": "",
      "endOfCourse": ""
    }
  ]
}

Resume text:
${rawText.slice(0, 12000)}`;

  const result = await geminiModel.generateContent(prompt);
  const rawJson = result.response.text();

  try {
    const cleaned = rawJson
      .replace(/^```(?:json)?/im, "")
      .replace(/```$/m, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    console.error("Gemini returned invalid JSON:", rawJson);
    throw new Error("AI returned invalid JSON format.");
  }
};