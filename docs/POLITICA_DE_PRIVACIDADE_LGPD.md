# 🛡️ Política de Privacidade & Proteção de Dados Pessoais (LGPD)
## Centro Acadêmico de Engenharia de Controle e Automação – E(CA)²
### Universidade Estadual do Rio Grande do Sul (UERGS) · Unidade Porto Alegre

> **Data de Vigência:** 12 de Outubro de 2026  
> **Base Legal:** Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD) & Lei Federal nº 7.395/1985 (Organização das Entidades Representativas dos Estudantes de 1º e 2º Graus e Universitários)  
> **Status:** Em Vigor e Aplicável a Toda a Plataforma Digital do E(CA)²

---

## 1. Apresentação e Controlador dos Dados

Esta Política de Privacidade estabelece as diretrizes de tratamento, guarda, confidencialidade e segurança dos dados pessoais coletados pela plataforma digital do **Centro Acadêmico de Engenharia de Controle e Automação (E(CA)²)** da UERGS.

* **Controlador dos Dados:** Centro Acadêmico de Engenharia de Controle e Automação – E(CA)² (Diretoria Provisória / Gestão Oficial).
* **Canal Oficial do Encarregado (DPO / Diretoria):** `ca.eca2.uergs@gmail.com`
* **Público-Alvo (Titulares):** Estudantes regularmente matriculados no curso de Engenharia de Controle e Automação da UERGS, corpo docente e visitantes acadêmicos.

---

## 2. Princípios de Governança Aplicados

Em estrita consonância com o Artigo 6º da LGPD, o E(CA)² fundamenta todo o tratamento de dados nos seguintes princípios:

1. **Finalidade e Legítimo Interesse (Inciso I):** Os dados são coletados exclusivamente para a representação política discente, organização de assembleias, eleições da diretoria, comunicação de estágios e eventos acadêmicos sem fins lucrativos.
2. **Necessidade e Minimização (Inciso III):** Coleta estritamente limitada ao mínimo indispensável para a validação da condição de estudante universitário e exercício do voto.
3. **Livre Acesso e Transparência (Incisos IV e VI):** Garantia aos discentes de consulta facilitada e gratuita sobre a forma e a duração do tratamento de seus dados.
4. **Segurança e Prevenção (Incisos VII e VIII):** Adoção de medidas técnicas de blindagem, controle de acesso restrito (RBAC), criptografia e proteção contra acessos não autorizados.
5. **Não Discriminação (Inciso IX):** Impossibilidade absoluta de utilização dos dados para fins discriminatórios, ilícitos ou abusivos.

---

## 3. Dados Pessoais Coletados e Respectivas Finalidades

| Dado Pessoal | Categoria | Finalidade Específica | Base Legal na LGPD |
| :--- | :--- | :--- | :--- |
| **Nome Completo** | Identificação | Comprovação de titularidade discente e emissão de listas oficiais de assembleia. | Art. 7º, V e VI |
| **E-mail Institucional (`@uergs.edu.br`)** | Contato Acadêmico | Autenticação no portal, confirmação de quórum eleitoral e avisos oficiais. | Art. 7º, II e V |
| **Semestre Atual / Curso** | Acadêmico | Identificação de demandas formativas por fase do curso e segmentação de estágios. | Art. 7º, IX |
| **Matrícula UERGS (Opcional)** | Identificação | Dado confidencial, utilizado unicamente para evitar duplicidade de voto. | Art. 7º, V |
| **WhatsApp / Celular (Opcional)** | Contato Direto | Convites para visitas técnicas, eventos integrativos e avisos urgentes. | Art. 7º, I (Consentimento) |
| **Opção de Voto na Urna** | Eleitoral | Totalização dos votos da assembleia. **O voto é 100% secreto e anonimizado.** | Art. 7º, V |

---

## 4. Garantia Inviolável de Sigilo do Voto (Urna Eletrônica)

Nas eleições e assembleias realizadas na plataforma digital:
* O sistema implementa **separação criptográfica** entre a chave de autenticação do estudante e o conteúdo de sua cédula de votação.
* A plataforma registra unicamente que a credencial `estudante-X` já exerceu o voto (para impedir votos múltiplos), sem jamais gravar no banco de dados quem votou em qual proposta ou chapa.
* Os relatórios públicos e atas oficiais de assembleia exibem exclusivamente **totais agregados percentuais e quantitativos**, preservando integralmente o sigilo constitucional do voto discente.

---

## 5. Não Compartilhamento e Ausência de Rastreamento Comercial

* **Sem Comercialização:** O Centro Acadêmico **não vende, não aluga e não compartilha** qualquer dado pessoal com empresas privadas, consultorias, diretórios partidários ou agências de publicidade.
* **Sem Rastreamento Invasivo:** O portal do E(CA)² **não utiliza cookies de rastreamento de terceiros** (Facebook Pixel, Google Remarketing, etc.). Todo o armazenamento local (*LocalStorage*) restringe-se ao funcionamento operacional da sessão do usuário.

---

## 6. Direitos dos Estudantes como Titulares de Dados (Artigo 18 da LGPD)

Qualquer estudante cadastrado pode, a qualquer tempo e de forma simplificada:
1. **Confirmar** a existência de tratamento de seus dados na base do CA.
2. **Acessar** e revisar seus dados diretamente na tela de Perfil ou solicitando relatório.
3. **Corrigir** dados incompletos, inexatos ou desatualizados (semestre, nome, etc.).
4. **Solicitar a Anonimização ou Exclusão Definitiva** de seu registro cadastral da plataforma.
5. **Revogar o Consentimento** previamente concedido para recebimento de informativos e mensagens via WhatsApp.

Para exercer seus direitos, basta enviar uma mensagem a partir de seu e-mail da UERGS para:  
📧 **`ca.eca2.uergs@gmail.com`**

---

## 7. Medidas Técnicas de Segurança da Informação

A plataforma adota práticas de ponta de engenharia de software para proteger os dados armazenados:
* **Controle de Acesso Baseado em Papéis (RBAC):** Privilégios administrativos restritos exclusivamente aos membros homologados da Diretoria do Centro Acadêmico. O Painel ADM permanece oculto para usuários comuns.
* **Políticas de Segurança em Nível de Linha (PostgreSQL RLS):** Bloqueio nativo no banco de dados que impede que qualquer usuário visualize dados de matrícula ou cadastros alheios.
* **Criptografia em Trânsito:** Todo o tráfego de dados na internet é protegido por certificado digital seguro TLS/HTTPS de 256 bits.
* **Trilha de Auditoria (Audit Log):** Registro automatizado de mutações críticas no sistema para fins de governança e prestação de contas.

---

## 8. Atualizações desta Política

Esta Política de Privacidade poderá ser revisada periodicamente pela Diretoria do E(CA)² para adequação a novas normativas da UERGS ou atualizações legislativas federais. Qualquer alteração de relevância será comunicada com destaque no Mural Acadêmico da plataforma.
