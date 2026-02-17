export interface DashboardConfig {
  youtubeUrl: string;
  context?: string; // Transcript or summary (Optional now)
  language: 'en' | 'ko';
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedResult {
  html: string;
  modelUsed: string;
}

export const EXAMPLE_CONTEXT = `
Title: The Future of AI in 2026
Speaker: Tech Visionary
Summary:
1. AI will shift from Chatbots to Agents.
2. Regulation is coming (EU AI Act).
3. Compute costs will drop by 40%.
4. Energy consumption is the new bottleneck.
5. Key strategic advice: Invest in small language models (SLMs).
`;
