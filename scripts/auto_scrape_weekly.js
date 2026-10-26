/**
 * =====================================================================
 * Eca² – Verificador e Executor Semanal do Scraper UERGS
 * Regra: Só executa se o arquivo uergs_eventos_poa.json tiver mais de 7 dias
 * =====================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scrapeUergsEvents } from './scrape_uergs_events.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../site/data/uergs_eventos_poa.json');

const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

async function checkAndRun() {
  const force = process.argv.includes('--force');

  if (fs.existsSync(DATA_FILE) && !force) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data && data.updated_at) {
        const lastDate = new Date(data.updated_at);
        const agora = new Date();
        const diffMs = agora.getTime() - lastDate.getTime();
        const diffDias = Math.floor(diffMs / (24 * 60 * 60 * 1000));

        if (diffMs < SETE_DIAS_MS) {
          const diasRestantes = Math.ceil((SETE_DIAS_MS - diffMs) / (24 * 60 * 60 * 1000));
          console.log(`[Scraper Semanal] ✅ Base de eventos está em dia.`);
          console.log(`[Scraper Semanal] 📅 Última raspagem: ${lastDate.toLocaleString('pt-BR')} (há ${diffDias} dia(s)).`);
          console.log(`[Scraper Semanal] ⏳ Próxima atualização necessária em: ~${diasRestantes} dia(s).`);
          console.log(`[Scraper Semanal] Use "npm run scrape:events" ou passe "--force" se desejar forçar agora.`);
          return;
        }

        console.log(`[Scraper Semanal] ⚠️ Base tem mais de 7 dias (${diffDias} dias). Iniciando raspagem automática...`);
      }
    } catch (err) {
      console.warn(`[Scraper Semanal] Aviso ao ler dados existentes:`, err.message);
    }
  } else if (force) {
    console.log(`[Scraper Semanal] ⚡ Forçando execução imediata...`);
  } else {
    console.log(`[Scraper Semanal] ⚠️ Arquivo de eventos não encontrado. Executando primeira raspagem...`);
  }

  await scrapeUergsEvents();
}

checkAndRun().catch(err => {
  console.error('[Scraper Semanal] Erro na execução:', err);
  process.exit(1);
});
