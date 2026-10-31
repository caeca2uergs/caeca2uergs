# Design System — E(CA)² Telemetry & Aerospace Control

## Aesthetic Direction

- **World:** Instrumentação Aeroespacial & Bancada de Controle Industrial Futurista (inspirado em consoles de voo SpaceX Dragon, instrumentos Teenage Engineering e IHMs industriais de nova geração).
- **Anti-References (Recusados):** Clichês de interfaces geradas por IA — fontes batidas (`Inter`, `Space Grotesk`), ícones de emoji soltos na navegação, bordas laterais grossas coloridas (`border-left: 3px/4px`), sombras neon difusas sem offset (`box-shadow: 0 0 15px`), bolinhas pulsantes decorativas e pílulas arco-íris sem função semântica.

## Typography

- **Display / Headings (`--font-head`):** `"Chakra Petch"`, semi-condensada geométrica chanfrada com caráter técnico e futurista. Pesos `600` e `700`, `text-wrap: balance`, tracking `-0.02em`.
- **Body / UI (`--font-body`):** `"Barlow"`, grotesca técnica de herança industrial alemã (DIN), limpa, altamente legível em densidades variadas.
- **Telemetry / Data / Code (`--font-mono`):** `"Share Tech Mono"` / `"JetBrains Mono"`, monoespaçada para códigos de disciplinas (`ENG01`), cargas horárias (`4.015h`), fórmulas e indicadores de barramento, sempre com `font-variant-numeric: tabular-nums`.
- **Floor de Legibilidade:** Nenhum texto funcional ou rótulo de interface abaixo de `12px` (`0.75rem`). Corpo de texto padrão em `16px` (`1rem`).

## Color & Atmospheric Polarity

- **Polarity:** Intentional Dark Mode (Console de Controle de Missão / Bancada de Ensaios em Chassi de Carbono Anodizado).
- **Surface Palette:**
  - `--bg: #06090e` (Carbono Anodizado Profundo)
  - `--bg-2: #0a0f17` (Substrato Técnico)
  - `--surface: #0e1520` (Painel de Chassi Usinado)
  - `--surface-2: #152030` (Baia de Instrumento Elevada)
  - `--border: #223248` (Linha Estrutural de 1px)
  - `--border-strong: #364f70` (Contorno de Chassi Ativo)
- **Text Hierarchy (WCAG AA Compliant):**
  - `--text: #f1f5f9` (Branco Fósforo — contraste > 15:1)
  - `--muted: #9fb3c8` (Cinza-Azulado Técnico — contraste > 6.8:1)
  - `--faint: #849bb3` (Rótulo Secundário — contraste > 4.8:1 em todas as superfícies)
- **Signal Accents:**
  - `--cyan: #38bdf8` (Ciano de Telemetria / Sinal de Controle — contraste > 7.5:1 sobre superfícies escuras; botões primários usam fundo `#38bdf8` com texto gravado em carbono `#040d1a` para contraste > 10:1)
  - `--amber: #fbbf24` (Âmbar de Automação / Alerta Operacional)
  - `--green: #34d399` (Verde Fósforo / Malha Estável)
  - `--red: #f87171` (Coral de Falha / Conflito de Horário)

## Geometry, Borders & Elevation

- **Radii:** Precisão chanfrada/industrial (`--radius: 4px`, `--radius-sm: 2px`). Sem cartões inflados ou pílulas decorativas.
- **Framing:** Molduras completas de `1px solid` com marcadores de canto técnicos (`corner-ticks`) nos chassis principais, substituindo completamente o anti-padrão de `border-left` colorido.
- **Depth:** Elevação declarada por contraste de superfície (`--surface` vs `--surface-2`) e sombras direcionais físicas (`0 12px 28px -8px rgba(0, 0, 0, 0.7)`), sem halos neon difusos.
- **Indicators:** Indicadores de status quadrados de hardware (`6px × 6px`, `border-radius: 1px`), estáticos e precisos, sem animações `pulse` artificiais.

