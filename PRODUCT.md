# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudantes de graduação em Engenharia de Controle e Automação da UERGS (Unidade Porto Alegre), calouros, veteranos em transição curricular (PPC 2019 para PPC 2024), diretoria do Centro Acadêmico E(CA)² e docentes/NDE do curso.

## Product Purpose

Centralizar a instrumentação acadêmica e a representação discente do curso de Engenharia de Controle e Automação da UERGS em uma plataforma web rápida e autônoma. Permite planejar matrículas sem conflito de horário, visualizar cadeias de pré-requisitos em grafo interativo, simular migração entre PPCs (2019 e 2024), contabilizar horas complementares e de extensão, acessar documentos oficiais e participar da vida comunitária do curso.

## Positioning

Diferente de portais institucionais genéricos ou páginas estáticas de centros acadêmicos, o portal E(CA)² opera como uma bancada de engenharia e telemetria acadêmica construída sob medida para a matriz real de 4.015h da UERGS (Resolução CONEPE nº 043/2024), cruzando o histórico individual do aluno com a oferta semestral de disciplinas e as regras de transição curricular.

## Operating Context

Utilizado em desktops de laboratório, notebooks pessoais e smartphones pelos estudantes durante períodos de rematrícula semestral, consulta de salas/horários, preparação para estágio obrigatório/TCC, assembleias estudantis e eventos acadêmicos no Campus Central de Porto Alegre (Rua Washington Luiz, 675).

## Capabilities and Constraints

- Aplicação web SPA em JavaScript modular (ESM) sem dependências pesadas de build, com suporte offline via Service Worker (PWA) e armazenamento híbrido (Supabase + fallback local).
- Simulador de Matrícula com detecção de choque de horários, exportação `.ics` e otimizador de destrancamento de cadeiras.
- Grafo interativo de dependências curriculares (PPC 2019 e PPC 2024) com inspetor de ementas, carga horária de laboratório e bibliografia.
- Simulador de migração curricular (PPC 2019 ➔ PPC 2024), calculadora de conceitos UERGS (A–E) e rastreador de Atividades Complementares (80h) e Extensão (410h).
- Conformidade com diretrizes institucionais da UERGS e Estatuto do Centro Acadêmico E(CA)².

## Brand Commitments

- Nome oficial: **E(CA)² · Centro Acadêmico de Engenharia de Controle e Automação – UERGS**.
- Lema técnico: *"Sem feedback não há controle."*
- Estética futurista de instrumentação aeroespacial e controle industrial (precisão técnica, alto contraste, zero clichês visuais de IA generativa).

## Evidence on Hand

- Projeto Pedagógico do Curso (PPC 2024 – Resolução CONEPE nº 043/2024 e PPC 2019 – Resolução CONEPE nº 025/2019).
- Estatuto oficial do E(CA)², atas de fundação e editais eleitorais.
- Acervo fotográfico real dos estudantes, eventos e produtos oficiais em `site/img/`.

## Product Principles

1. **Precisão de Instrumento:** Cada tela funciona como um instrumento de engenharia confiável — dados tabulares claros, estados explícitos e resposta instantânea (`< 1ms` entre submenus).
2. **Transparência Institucional:** Todas as regras acadêmicas, prestações de contas e documentos referenciam normas reais da UERGS.
3. **Identidade Futurista Autêntica:** A estética nasce da engenharia de controle, telemetria aeroespacial e hardware industrial, rejeitando ornamentos artificiais de templates gerados por IA.

