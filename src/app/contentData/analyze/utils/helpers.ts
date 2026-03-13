import { LANGUAGE_COLORS } from "../languageColors";

// Captura das cores das badges de Linguagens de Programação por repositório
export function getLangColor(lang: string | null) {
  if (!lang) return LANGUAGE_COLORS.default;
  return LANGUAGE_COLORS[lang] ?? LANGUAGE_COLORS.default;
}