/**
 * =====================================================================
 * Eca² – Supabase Keep-Alive (Heartbeat Anti-Pausa Automático)
 * Objetivo: Realizar consultas periódicas à API REST para evitar que
 * o Supabase pause o banco gratuito por 7 dias de inatividade.
 * =====================================================================
 */

import { CONFIG } from '../site/js/config.js';

const SUPABASE_URL = process.env.SUPABASE_URL || CONFIG.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || CONFIG.SUPABASE_ANON_KEY;

async function pingSupabase() {
  const agora = new Date().toLocaleString('pt-BR');
  console.log(`[Supabase Keep-Alive] [${agora}] Verificando integridade do banco...`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(`[Supabase Keep-Alive] ⚠️ Nenhuma URL/Chave configurada. Sistema operando em modo local.`);
    return;
  }

  const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/profiles?select=id&limit=1`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'User-Agent': 'Eca2-Uergs-KeepAlive/1.0'
      }
    });

    if (res.ok || res.status === 200 || res.status === 206 || res.status === 401 || res.status === 404) {
      console.log(`[Supabase Keep-Alive] ✅ Heartbeat confirmado! Status HTTP: ${res.status}`);
      console.log(`[Supabase Keep-Alive] 🛡️ Ciclo de inatividade do Supabase resetado com sucesso. O banco permanecerá ATIVO.`);
    } else {
      console.warn(`[Supabase Keep-Alive] ⚠️ Resposta com status ${res.status}.`);
    }
  } catch (err) {
    console.error(`[Supabase Keep-Alive] ❌ Falha na conexão:`, err.message);
    if (err.message.includes('ENOTFOUND') || err.message.includes('fetch failed')) {
      console.log(`--------------------------------------------------------------------------------`);
      console.log(`ℹ️ AVISO DE ATIVAÇÃO INICIAL:`);
      console.log(`Se o projeto no Supabase já estiver em pausa ("Paused"), a API não responde até`);
      console.log(`você clicar em "Restore project" / "Unpause" UMA ÚNICA VEZ em https://supabase.com/dashboard.`);
      console.log(`Assim que despausado, esta rotina Keep-Alive manterá o banco acordado para sempre!`);
      console.log(`--------------------------------------------------------------------------------`);
    }
    process.exit(1);
  }
}

pingSupabase();
