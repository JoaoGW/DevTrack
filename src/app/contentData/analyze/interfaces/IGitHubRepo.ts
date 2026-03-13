// Tipagens dos itens vindos do Repositório
export interface IGitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string | null;
  topics: string[];
}