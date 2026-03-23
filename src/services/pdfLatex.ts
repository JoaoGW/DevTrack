import pdflatex from 'node-pdflatex'

export const baseSourceCVLatex = String.raw`
\documentclass[a4paper,10pt]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[portuguese]{babel}
\usepackage{geometry}
\usepackage{parskip}
\usepackage{hyperref}
\usepackage{titlesec}
% \usepackage{xurl}

\geometry{top=1.0cm, bottom=1.0cm, left=1.0cm, right=1.0cm}
\pagestyle{empty}
\hypersetup{
    pdftitle={{NOME_ARQUIVO}},
    pdfauthor={{NOME}},
    colorlinks=true,
    linkcolor=black,
    urlcolor=black,
    citecolor=black,
    bookmarksdepth=1 
}

\setcounter{secnumdepth}{0}

\titleformat{\section}
{\Large\bfseries}
{}
{0em}
{}
[\titlerule\vspace{0.5ex}]

\begin{document}

\begin{center}
    {\LARGE \textbf{{NOME}}} 
    \\ [0.1cm]
    {\large \textbf{{TITULO}}}
    \\ [0.2cm]
    Localização: {{LOCALIZACAO}}
    {\textbullet}
    Telefone: {{TELEFONE}}
    {\textbullet}
    Email: \href{mailto:{{EMAIL}}}{{EMAIL}}
    \\ [0.1cm]
    Portfólio: \href{{{PORTFOLIO}}}{{{PORTFOLIO}}} 
    {\textbullet}
    \href{{{LINKEDIN}}}{{{LINKEDIN}}} 
    {\textbullet}
    \href{{{GITHUB}}}{{{GITHUB}}}
\end{center}

\section{Perfil Profissional}
  {{PERFIL}}

\section{Habilidades}
    \begin{itemize}
        {{HABILIDADES_BULLETS}}
    \end{itemize}

\section{Experiência}
    {{EXPERIENCIAS_BLOCK}}

\section{Educação}
    {{EDUCACAO_BLOCK}}

\section{Certificações}
\begin{itemize}
    {{CERTIFICACOES_BULLETS}}
\end{itemize}

\section{Idiomas}
    \begin{itemize}
        {{IDIOMAS_BULLETS}}
    \end{itemize}

\end{document}
`

export async function compileTex(source: string): Promise<Buffer> {
    return pdflatex(source)
}