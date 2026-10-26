/**
 * =====================================================================
 * Eca² – Scraper Oficial da Agenda de Eventos da UERGS
 * Filtro Estrito: Unidade Porto Alegre / Campus Central (Washington Luiz)
 * =====================================================================
 */

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.uergs.edu.br';
const OUTPUT_FILE = path.resolve(__dirname, '../site/data/uergs_eventos_poa.json');

// Mapeamento de meses em português
const MESES = {
  jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06',
  jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12'
};

function fetchPage(page) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.uergs.edu.br',
      path: `/_service/conteudo/pagedlistfilho?id=50&templatename=pagina.listaevento.cards.extends&ordem=EVENTOSRECENTES&currentPage=${page}&pageSize=50`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Eca2UergsScraper/1.0',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.uergs.edu.br/agenda',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
    };

    https.get(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          resolve(json);
        } catch (e) {
          reject(new Error(`Falha ao decodificar JSON da página ${page}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&agrave;/gi, 'à')
    .replace(/&aacute;/gi, 'á')
    .replace(/&acirc;/gi, 'â')
    .replace(/&atilde;/gi, 'ã')
    .replace(/&eacute;/gi, 'é')
    .replace(/&ecirc;/gi, 'ê')
    .replace(/&iacute;/gi, 'í')
    .replace(/&oacute;/gi, 'ó')
    .replace(/&ocirc;/gi, 'ô')
    .replace(/&otilde;/gi, 'õ')
    .replace(/&uacute;/gi, 'ú')
    .replace(/&ccedil;/gi, 'ç')
    .replace(/&Agrave;/gi, 'À')
    .replace(/&Aacute;/gi, 'Á')
    .replace(/&Eacute;/gi, 'É')
    .replace(/&Iacute;/gi, 'Í')
    .replace(/&Oacute;/gi, 'Ó')
    .replace(/&Uacute;/gi, 'Ú')
    .replace(/&Ccedil;/gi, 'Ç')
    .replace(/&ordm;/gi, 'º')
    .replace(/&ordf;/gi, 'ª')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

function parseCards(html) {
  const cards = [];
  const regex = /<div class="artigo__listapaginas__item">([\s\S]*?)<\/div>\s*<\/div>\s*(?=<div class="col"|$)/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const cardHtml = match[1];

    // Título e link
    const titleM = cardHtml.match(/<h3[^>]*class="[^"]*artigo__listapaginas__item__titulo[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    const link = titleM ? titleM[1] : '';
    const title = titleM ? decodeHtml(titleM[2].replace(/<[^>]+>/g, '')) : '';

    // Imagem oficial
    const imgM = cardHtml.match(/<figure>[\s\S]*?<img[^>]+src="([^"]+)"/i);
    let img = imgM ? imgM[1] : '';
    if (img && img.startsWith('/')) img = BASE_URL + img;

    // Local
    const localM = cardHtml.match(/conteudo-lista__item__info-evento__localnome">([\s\S]*?)<\/span>/i);
    const local = localM ? decodeHtml(localM[1].replace(/<[^>]+>/g, '')) : '';

    // Data com datetime
    const timeM = cardHtml.match(/<time\s+datetime="([^"]*)"[^>]*>([\s\S]*?)<\/time>/i);
    const isoDateTime = timeM ? timeM[1] : '';

    const dataM = cardHtml.match(/conteudo-lista__item__info-evento__data">([\s\S]*?)<\/li>/i);
    const dateText = dataM ? decodeHtml(dataM[1].replace(/<span class="sr-only">[\s\S]*?<\/span>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')) : '';

    // Inscrições
    const inscM = cardHtml.match(/lista-eventos-modular__item__inscricoes">([\s\S]*?)<\/p>/i);
    const inscriptions = inscM ? decodeHtml(inscM[1].replace(/<[^>]+>/g, '')) : '';

    // Categoria
    const catM = cardHtml.match(/<ul class="lista-categoria">([\s\S]*?)<\/ul>/i);
    const category = catM ? decodeHtml(catM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')) : 'Evento Geral';

    if (title && link) {
      cards.push({
        id: 'uergs-' + link.replace(/^\//, '').replace(/\//g, '-'),
        titulo: title,
        link: link.startsWith('/') ? BASE_URL + link : link,
        imagem: img || 'img/hero_estudantes.jpg',
        local: local || 'Porto Alegre - UERGS',
        dataExibicao: dateText,
        isoDateTime: isoDateTime || '',
        inscrições: inscriptions,
        categoria: category,
        origem: 'UERGS Oficial (Campus Porto Alegre / Central)'
      });
    }
  }

  return cards;
}

export async function scrapeUergsEvents(maxPages = 6) {
  console.log(`[Scraper] Conectando à agenda oficial da UERGS (${BASE_URL}/agenda)...`);
  const first = await fetchPage(1);
  const totalPages = Math.min(first.pagecount || 1, maxPages);
  console.log(`[Scraper] Total de páginas disponíveis: ${first.pagecount}. Raspando primeiras ${totalPages} páginas...`);

  let allEvents = parseCards(first.body);

  for (let p = 2; p <= totalPages; p++) {
    try {
      const res = await fetchPage(p);
      const parsed = parseCards(res.body);
      allEvents = allEvents.concat(parsed);
      console.log(`[Scraper] Página ${p}/${totalPages}: +${parsed.length} eventos processados.`);
    } catch (err) {
      console.error(`[Scraper] Aviso ao ler página ${p}:`, err.message);
    }
  }

  console.log(`[Scraper] Total de eventos brutos capturados: ${allEvents.length}`);

  // Filtro Estrito: Porto Alegre / Campus Central / Washington Luiz / Reitoria
  const poaEvents = allEvents.filter(ev => {
    const s = `${ev.local} ${ev.titulo}`.toLowerCase();
    return s.includes('porto alegre') ||
           s.includes('campus central') ||
           s.includes('washington luiz') ||
           s.includes('reitoria') ||
           s.includes('grand prix') ||
           s.includes('cabo de guerra');
  });

  console.log(`[Scraper] Eventos homologados no Campus Porto Alegre: ${poaEvents.length}`);

  const outputData = {
    updated_at: new Date().toISOString(),
    source_url: `${BASE_URL}/agenda`,
    campus_filter: 'Porto Alegre / Campus Central (Washington Luiz)',
    total_scraped_global: allEvents.length,
    total_filtered_poa: poaEvents.length,
    events: poaEvents
  };

  // Garante que o diretório site/data existe
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`[Scraper] Arquivo gerado com sucesso em: ${OUTPUT_FILE}`);

  return outputData;
}

// Execução direta via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  scrapeUergsEvents().catch(err => {
    console.error('[Scraper] Erro fatal:', err);
    process.exit(1);
  });
}
