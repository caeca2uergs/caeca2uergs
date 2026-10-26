# 🗺️ Fluxograma Didático – Fundação do CA Eca²
*Como ler: siga as setas de cima para baixo. Cada cor é uma fase. Losangos (◆) são decisões.*

| Cor | Fase |
|-----|------|
| 🟦 Azul | Preparação |
| 🟧 Laranja | Divulgação |
| 🟩 Verde | O dia da assembleia |
| 🟪 Roxo | Pós-assembleia |
| 🟥 Vermelho | Plano B / atenção |

---

## 1. Visão geral – do zero até a primeira diretoria

```mermaid
flowchart TD
    A(["💡 Ideia: criar o CA Eca²"]) --> B["👥 Montar núcleo organizador<br/>3 a 5 pessoas de semestres diferentes"]
    B --> C["🏛️ Informar Coordenação e Direção<br/>pedir espaço e horário"]
    C --> D["📄 Publicar EDITAL<br/>14/10 – 12 dias antes"]
    D --> E["📣 Divulgação<br/>grupos, Instagram, passagem em sala"]
    E --> F["🤝 Conversar com lideranças<br/>e possíveis críticos"]
    F --> G{"◆ Confirmados<br/>suficientes?"}
    G -- "Sim" --> H["🛒 Comprar salchipão<br/>confirmados × 1,3"]
    G -- "Não" --> E2["🔁 Reforçar divulgação<br/>mensagens individuais"]
    E2 --> G
    H --> I(["🎉 26/10 – ASSEMBLEIA"])
    I --> J["✅ Fundação do Eca² aprovada"]
    J --> K["👥 Comissão Pró-CA provisória e aberta"]
    K --> L["📢 Publicar ata, fotos e contas<br/>até 7 dias"]
    L --> M["📝 Minuta do estatuto<br/>+ consulta pública"]
    M --> N["🗳️ Assembleia aprova estatuto<br/>+ comissão eleitoral"]
    N --> O["🗳️ Eleição da 1ª diretoria<br/>chapas abertas, voto secreto"]
    O --> P(["🏆 Eca² consolidado!"])

    classDef prep fill:#dbeafe,stroke:#1d4ed8,color:#0b1b3f
    classDef div fill:#ffedd5,stroke:#ea580c,color:#3b1600
    classDef dia fill:#dcfce7,stroke:#15803d,color:#052e13
    classDef pos fill:#ede9fe,stroke:#6d28d9,color:#1e0b47
    classDef alerta fill:#fee2e2,stroke:#b91c1c,color:#450a0a
    class A,B,C prep
    class D,E,F,G,H div
    class I,J,K dia
    class L,M,N,O,P pos
    class E2 alerta
```

---

## 2. Linha do tempo (calendário)

```mermaid
gantt
    title Linha do tempo do CA Eca²
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section 🟦 Preparação
    Montar núcleo organizador         :a1, 2026-10-09, 3d
    Falar com Coordenação e Direção   :a2, 2026-10-13, 1d

    section 🟧 Divulgação
    Publicar edital                   :milestone, m1, 2026-10-14, 0d
    Passagem em salas e grupos        :b1, 2026-10-14, 10d
    Conversas com lideranças          :b2, 2026-10-14, 10d
    Fechar número e comprar           :b3, 2026-10-23, 3d

    section 🟩 Assembleia
    ASSEMBLEIA + SALCHIPÃO            :crit, milestone, m2, 2026-10-26, 0d

    section 🟪 Pós-assembleia
    Publicar ata, fotos e contas      :c1, 2026-10-27, 7d
    Redigir minuta do estatuto        :c2, 2026-11-02, 18d
    Consulta pública do estatuto      :c3, 2026-11-20, 14d
    Assembleia do estatuto            :milestone, m3, 2026-12-04, 0d
    Processo eleitoral                :c4, 2026-12-05, 50d
```

> ⚠️ As datas pós-assembleia são **indicativas** e devem ser ajustadas ao calendário acadêmico da UERGS (férias de verão).

---

## 3. O dia da assembleia – passo a passo

```mermaid
flowchart LR
    A(["🚪 Chegada"]) --> B["✍️ Assina lista de presença"]
    A --> C["🌭 Pega salchipão<br/>sem condição"]
    B --> D["🎤 Abertura e mesa"]
    C --> D
    D --> E["📋 Aprovação da pauta"]
    E --> F["📊 Apresentação<br/>o que é um CA"]
    F --> G["🗳️ Votação 1<br/>Fundação do Eca²"]
    G --> H["🗳️ Votação 2<br/>Comissão Pró-CA"]
    H --> I["📅 Cronograma"]
    I --> J["💬 Assuntos gerais"]
    J --> K["🖊️ Mesa assina a ata"]
    K --> L(["🎉 Confraternização"])

    classDef dia fill:#dcfce7,stroke:#15803d,color:#052e13
    class A,B,C,D,E,F,G,H,I,J,K,L dia
```

**⏱️ Tempo total da assembleia: até 45 minutos.**

---

## 4. Como votar sem dar margem para contestação

```mermaid
flowchart TD
    A["📢 Ler a proposta em voz alta<br/>e mostrar escrita"] --> B["🙋 Abrir inscrições para falas<br/>2 min cada – inclusive contrárias"]
    B --> C{"◆ Alguém se opõe à<br/>votação por aclamação?"}
    C -- "Não" --> D["👏 Aclamação – palmas"]
    D --> E["❓ Perguntar: há votos contrários?<br/>Abstenções?"]
    C -- "Sim" --> F["✋ Votação por contraste<br/>mãos levantadas"]
    F --> G["🔢 Duas pessoas contam<br/>favoráveis, contrários, abstenções"]
    E --> H["📝 Secretário registra<br/>os números na ata"]
    G --> H
    H --> I{"◆ Maioria<br/>favorável?"}
    I -- "Sim" --> J(["✅ APROVADO"])
    I -- "Não" --> K["🤝 Respeitar o resultado<br/>ouvir motivos e marcar nova data"]

    classDef ok fill:#dcfce7,stroke:#15803d,color:#052e13
    classDef alerta fill:#fee2e2,stroke:#b91c1c,color:#450a0a
    classDef neutro fill:#f1f5f9,stroke:#475569,color:#0f172a
    class A,B,D,E,H neutro
    class C,I neutro
    class F,G alerta
    class J ok
    class K alerta
```

> 💡 **Votação contada não é derrota.** Ela deixa o resultado ainda mais forte.

---

## 5. Como lidar com uma crítica

```mermaid
flowchart TD
    A(["🗣️ Alguém faz uma crítica"]) --> B["👂 Escutar até o fim<br/>sem interromper"]
    B --> C["🙏 Agradecer a fala"]
    C --> D{"◆ Qual o tipo<br/>de crítica?"}
    D -- "Pressa / grupinho" --> E["Hoje só fundamos e criamos<br/>comissão ABERTA e PROVISÓRIA"]
    D -- "Nome" --> F["Propor votar o nome<br/>separadamente"]
    D -- "Política partidária" --> G["O Eca² será apartidário<br/>e isso vai no estatuto"]
    D -- "Dinheiro" --> H["Nada obrigatório<br/>contas sempre públicas"]
    D -- "Quero ser presidente" --> I["A eleição vem depois<br/>e é aberta a chapas"]
    E --> J["➕ Convidar a pessoa<br/>para a Comissão Pró-CA"]
    F --> J
    G --> J
    H --> J
    I --> J
    J --> K(["🤝 Crítico vira colaborador"])

    classDef alerta fill:#fee2e2,stroke:#b91c1c,color:#450a0a
    classDef ok fill:#dcfce7,stroke:#15803d,color:#052e13
    classDef neutro fill:#f1f5f9,stroke:#475569,color:#0f172a
    class A alerta
    class B,C,D,E,F,G,H,I neutro
    class J,K ok
```

---

## 6. Depois da assembleia – até a eleição

```mermaid
flowchart TD
    A(["✅ CA fundado"]) --> B["📢 D+3: ata, fotos<br/>e lista da comissão"]
    B --> C["📱 Ativar Instagram, WhatsApp,<br/>YouTube e site"]
    C --> D["💰 D+7: prestação de contas<br/>do salchipão"]
    D --> E["📨 Ofício à Coordenação<br/>e Direção com a ata"]
    E --> F["📝 Comissão redige<br/>minuta do estatuto"]
    F --> G["🌐 Consulta pública<br/>10 a 15 dias – site + formulário"]
    G --> H["🗳️ Assembleia aprova estatuto"]
    H --> I["⚖️ Eleger comissão eleitoral<br/>quem NÃO será candidato"]
    I --> J["📋 Inscrição de chapas"]
    J --> K["🎙️ Debate entre chapas"]
    K --> L["🗳️ Eleição com voto secreto"]
    L --> M["🏆 Posse da 1ª diretoria<br/>fim da Comissão Pró-CA"]
    M --> N{"◆ Precisa de conta bancária<br/>ou contratos?"}
    N -- "Sim" --> O["🏢 Registrar em cartório<br/>e tirar CNPJ"]
    N -- "Não" --> P(["🚀 Seguir com as ações do CA"])
    O --> P

    classDef pos fill:#ede9fe,stroke:#6d28d9,color:#1e0b47
    class A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P pos
```

---

## 📌 Resumo em uma frase
> **Avisar todo mundo antes → fundar com transparência → abrir a porta para todos → eleger com regras claras.**
