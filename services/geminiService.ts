import { GoogleGenAI, Tool } from "@google/genai";
import { DashboardConfig } from "../types";

const SYSTEM_PROMPT = `
You are a world-class Senior Frontend Engineer and UI/UX Designer specializing in Data Visualization.
Your task is to generate a sophisticated, professional, single-file HTML dashboard based on the provided video context.

**DESIGN REQUIREMENTS:**
1. **Aesthetics:**
   - Use a "Professional Corporate/Fintech" look.
   - Background: Light grays (#f8fafc) or clean whites.
   - Typography: Use "Paperlogy" or system sans-serif.
   - Spacing: Comfortable padding, distinct sections.
   - Shadows: Subtle, high-quality shadows (Tailwind 'shadow-sm', 'shadow-md').
2. **Tech Stack:**
   - HTML5.
   - Tailwind CSS (via CDN: <script src="https://cdn.tailwindcss.com"></script>).
   - Chart.js (via CDN: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>).
   - FontAwesome (for icons).
3. **Layout:**
   - **Sidebar:** Fixed left sidebar (dark or light theme) with navigation links that smooth-scroll to sections.
   - **Header:** Title, Source Link (Youtube), Date.
   - **Sections:**
     - **Executive Summary:** High-level insight.
     - **Key Metrics (KPI Cards):** 3-4 cards with big numbers and trend indicators.
     - **Deep Dive/Analysis:** Detailed text with "Highlight Boxes" or "Quote Boxes".
     - **Charts:** At least 2 distinct charts (Bar, Doughnut, or Line) utilizing Chart.js.
     - **Strategic Takeaways:** A concluding section with actionable advice.

**CONTENT GENERATION:**
- Analyze the user-provided "Context/Transcript" OR the Search Results if context is missing.
- Extract factual data, sentiment, and key points.
- **Hallucinate plausible data numbers** for the charts if exact numbers aren't in the text, but ensure they match the *vibe* of the content (e.g., if the video says "growth is slowing", show a flattening line chart).
- The dashboard must be populated with REAL analysis from the context, not "Lorem Ipsum".

**OUTPUT FORMAT:**
- Return ONLY the raw HTML string.
- Do not wrap in markdown code blocks (\`\`\`html).
- The code must be a valid, complete HTML file starting with <!DOCTYPE html>.
- Include internal CSS for custom scrollbars or specific animations if needed.
- Include internal <script> tags to initialize the Chart.js instances.

**INTERACTIVITY:**
- Sidebar links must work (scroll to ID).
- Charts must be responsive.
- Hover effects on cards and buttons.
`;

export const generateDashboard = async (config: DashboardConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-pro-preview"; 

  const hasContext = !!config.context && config.context.trim().length > 0;
  
  // Define language instruction
  const languageInstruction = config.language === 'ko'
    ? "IMPORTANT: The generated dashboard content (headings, analysis, chart labels, buttons) MUST BE WRITTEN IN KOREAN (한국어)."
    : "IMPORTANT: The generated dashboard content MUST BE WRITTEN IN ENGLISH.";

  let userPrompt = '';
  let tools: Tool[] | undefined = undefined;

  if (hasContext) {
    // Scenario 1: User provided context. Use it directly.
    userPrompt = `
    YouTube URL: ${config.youtubeUrl}
    
    ${languageInstruction}

    Video Context/Transcript:
    ${config.context}
    
    Generate the HTML Dashboard now.
    `;
  } else {
    // Scenario 2: No context provided. Use Google Search.
    userPrompt = `
    YouTube URL: ${config.youtubeUrl}
    
    The user has NOT provided a transcript.
    1. Use Google Search to find the video title, summary, key topics, and speaker details for this specific YouTube URL.
    2. If exact video details are unavailable, find the general topic or channel theme inferred from the URL or search results, and generate a plausible dashboard based on that topic.
    3. Generate the HTML Dashboard now based on your findings.

    ${languageInstruction}
    `;
    
    // Enable Google Search tool
    tools = [{ googleSearch: {} }];
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        thinkingConfig: { thinkingBudget: 4096 },
        tools: tools, 
      },
      contents: [
        {
            role: 'user',
            parts: [{ text: userPrompt }]
        }
      ]
    });

    let html = response.text || "";

    // Cleanup: Remove markdown backticks if the model ignores the instruction
    html = html.replace(/^```html/, '').replace(/^```/, '').replace(/```$/, '');

    // Sometimes search grounding returns non-html text first (rare but possible),
    // but the system prompt strongly enforces HTML output. 
    // If the response contains the dashboard but has some conversational text before it, extract the HTML.
    const htmlStart = html.indexOf('<!DOCTYPE html>');
    if (htmlStart > 0) {
      html = html.substring(htmlStart);
    }

    return html;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate dashboard.");
  }
};
