import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const rootDir = process.cwd();
const fundacaoDir = path.join(rootDir, 'docs', 'fundacao');
const pdfDir = path.join(rootDir, 'site', 'pdf');

if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

// Localiza Edge
let edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
if (!fs.existsSync(edgePath)) {
  edgePath = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
}

console.log(`Usando navegador para geração de PDF: ${edgePath}`);

// Template CSS Elegante para Impressão A4
const printStyles = `
  @page {
    size: A4;
    margin: 18mm 15mm 18mm 15mm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1a202c;
    line-height: 1.55;
    font-size: 11pt;
    margin: 0;
    padding: 0;
  }
  h1, h2, h3, h4 {
    color: #0f172a;
    font-weight: 700;
    line-height: 1.2;
    margin-top: 1.4em;
    margin-bottom: 0.5em;
  }
  h1 { font-size: 20pt; border-bottom: 2px solid #0284c7; padding-bottom: 6px; }
  h2 { font-size: 15pt; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  h3 { font-size: 12.5pt; color: #0369a1; }
  p, ul, ol { margin-top: 0; margin-bottom: 0.85em; }
  blockquote {
    margin: 1em 0;
    padding: 0.5em 1em;
    background: #f1f5f9;
    border-left: 4px solid #0284c7;
    color: #334155;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2em 0;
    font-size: 9.5pt;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 6px 9px;
    text-align: left;
  }
  th {
    background-color: #f8fafc;
    font-weight: 600;
  }
  tr:nth-child(even) { background-color: #f8fafc; }
  hr {
    border: 0;
    height: 1px;
    background: #cbd5e1;
    margin: 1.5em 0;
  }
  code {
    background: #f1f5f9;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: Consolas, monospace;
    font-size: 0.9em;
  }
  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 10px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 9pt;
  }
  pre code { background: none; color: inherit; padding: 0; }
  .page-break { page-break-after: always; break-after: page; }
`;

// Converte Markdown para PDF utilizando Pandoc (MD -> HTML) e Edge (HTML -> PDF)
function convertMdToPdf(mdFilename, pdfFilename) {
  const mdPath = path.join(fundacaoDir, mdFilename);
  if (!fs.existsSync(mdPath)) {
    console.error(`Arquivo não encontrado: ${mdPath}`);
    return;
  }

  const tempHtmlPath = path.join(pdfDir, `temp_${path.basename(mdFilename, '.md')}.html`);
  const outPdfPath = path.join(pdfDir, pdfFilename);

  console.log(`Gerando: ${pdfFilename}...`);

  // 1. Usa Pandoc para criar HTML estruturado a partir do Markdown
  const pandocCmd = `pandoc "${mdPath}" -f markdown -t html5 -s --metadata title="${path.basename(mdFilename, '.md')}" -o "${tempHtmlPath}"`;
  execSync(pandocCmd, { stdio: 'pipe' });

  // 2. Injeta estilização de impressão A4 no HTML
  let htmlContent = fs.readFileSync(tempHtmlPath, 'utf-8');
  htmlContent = htmlContent.replace('</head>', `<style>${printStyles}</style></head>`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

  // 3. Usa Edge Headless para imprimir em PDF
  const edgeCmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outPdfPath}" --print-to-pdf-no-header "${tempHtmlPath}"`;
  execSync(edgeCmd, { stdio: 'pipe' });

  // Remove arquivo HTML temporário
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  console.log(`✓ Criado: site/pdf/${pdfFilename}`);
}

// Converte lista de presença HTML direta para PDF
function convertHtmlToPdf(htmlFilename, pdfFilename) {
  const htmlPath = path.join(fundacaoDir, htmlFilename);
  const outPdfPath = path.join(pdfDir, pdfFilename);
  console.log(`Gerando: ${pdfFilename}...`);
  const edgeCmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outPdfPath}" --print-to-pdf-no-header "${htmlPath}"`;
  execSync(edgeCmd, { stdio: 'pipe' });
  console.log(`✓ Criado: site/pdf/${pdfFilename}`);
}

// Execução
try {
  convertMdToPdf('01_Estrategia_Fundacao_Eca2.md', '01_Estrategia_Fundacao_Eca2.pdf');
  convertMdToPdf('02_Edital_de_Convocacao.md', '02_Edital_de_Convocacao.pdf');
  convertMdToPdf('03_Roteiro_da_Assembleia.md', '03_Roteiro_da_Assembleia.pdf');
  convertMdToPdf('04_Ata_de_Fundacao.md', '04_Ata_de_Fundacao.pdf');
  convertHtmlToPdf('05_Lista_de_Presenca.html', '05_Lista_de_Presenca.pdf');
  convertMdToPdf('07_Mensagens_Divulgacao.md', '07_Mensagens_Divulgacao.pdf');
  convertMdToPdf('09_Fluxograma.md', '09_Fluxograma.pdf');
  convertMdToPdf('10_Estrategia_Atracao_Redes_Sociais.md', '10_Estrategia_Atracao_Redes_Sociais.pdf');

  console.log('\n🎉 Todos os documentos foram transformados em PDF com sucesso na pasta site/pdf !');
} catch (error) {
  console.error('Erro na conversão para PDF:', error.message);
  process.exit(1);
}
