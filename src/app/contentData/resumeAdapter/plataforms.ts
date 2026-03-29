import { PlatformId } from "./types/PlatformIdTypes";

export const platforms: {
  id: PlatformId;
  name: string;
  description: string;
  accent: string;
  border: string;
  bg: string;
  text: string;
  dot: string;
}[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description:
        'Otimizado para perfil e candidaturas na maior rede profissional',
      accent: 'bg-blue-500/10',
      border: 'border-blue-500/40',
      bg: 'bg-blue-600/15',
      text: 'text-blue-300',
      dot: 'bg-blue-400',
    },
    {
      id: 'gupy',
      name: 'Gupy',
      description:
        'Adaptado para processos seletivos na plataforma mais usada no Brasil',
      accent: 'bg-violet-500/10',
      border: 'border-violet-500/40',
      bg: 'bg-violet-600/15',
      text: 'text-violet-300',
      dot: 'bg-violet-400',
    },
    {
      id: 'catho',
      name: 'Catho',
      description:
        'Formatado para maximizar visibilidade no portal de empregos Catho',
      accent: 'bg-emerald-500/10',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-600/15',
      text: 'text-emerald-300',
      dot: 'bg-emerald-400',
    },
  ];