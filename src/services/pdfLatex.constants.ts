// Constante LaTeX template - client-safe (sem imports de Node.js)
export const baseSourceCVLatex = String.raw`
\documentclass[a4paper,10pt]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[portuguese,english]{babel}
\usepackage{geometry}
\usepackage{parskip}
\usepackage{hyperref}
\usepackage{titlesec}
\usepackage{lmodern}
\usepackage{microtype}

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
        \item \textbf{Linguagens:}{{HABILIDADES_SEPARADAS_EM_VIRGULA_LINGUAGENS_PROGRAMAÇÃO}}
        \item \textbf{Frameworks:}{{HABILIDADES_SEPARADAS_EM_VIRGULA_FRAMEWORKS}}
        \item \textbf{Ferramentas:}{{HABILIDADES_SEPARADAS_EM_VIRGULA_FERRAMENTAS}}
    \end{itemize}

\section{Experiência}
    \subsection*{\texorpdfstring{
            \textbf{{{EXPERIENCIAS_NOME_EMPRESA}}} \hfill {{EXPERIENCIAS_LOCALIZACAO}}
        }{
            {{EXPERIENCIAS_NOME_EMPRESA}} -- {{EXPERIENCIAS_LOCALIZACAO}}
        }}
    \textit{{{EXPERIENCIAS_CARGO}} \hfill {{EXPERIENCIAS_DATA_INICIO}} - {{EXPERIENCIAS_DATA_FIM}}}
        \begin{itemize} 
            \item {{EXPERIENCIAS_DESCRICAO_RESPONSABILIDADES_ITEM}}
        \end{itemize}

\section{Educação}
    \subsection*{\texorpdfstring{
            \textbf{{{EDUCACAO_NOME_FACULDADE}}}
        }{
            {{EDUCACAO_NOME_FACULDADE}}
        }}
    \textit{{{EDUCACAO_GRAU_FORMACAO}} em {{EDUCACAO_NOME_CURSO}} \hfill {{EDUCACAO_FACULDADE_DATA_INICIO}} - {{EDUCACAO_FACULDADE_DATA_FIM}}}

\section{Certificações}
\begin{itemize}
    {{CERTIFICACOES_BULLETS}}
\end{itemize}

\section{Idiomas}
    \begin{itemize}
        {{IDIOMAS_BULLETS}}
    \end{itemize}

\end{document}
`;
