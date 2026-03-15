// Tipagem dos resultados vindos da IA
export interface IAnalysisResult {
  repoId: number;
  repoName: string;
  professionalDescription: string;
  stack: string[];
  highlights: string[];
  suggestedTitle: string;
}