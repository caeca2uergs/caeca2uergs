-- =====================================================================
--  Eca² – Schema do banco (Supabase / PostgreSQL)
--  Como usar: Supabase → SQL Editor → New query → cole tudo → Run.
--  Seguro para rodar em projeto novo.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PERFIS e ADMINISTRADORES
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Estudante' check (char_length(display_name) between 2 and 100),
  registration text check (char_length(registration) <= 30), -- Matrícula UERGS (privada/somente admin e o próprio)
  whatsapp     text check (char_length(whatsapp) <= 30),     -- Contato WhatsApp (privado)
  semester     text check (char_length(semester) <= 30),     -- Semestre ou ano
  interests    text check (char_length(interests) <= 250),   -- Áreas de interesse (Robótica, CLP, etc.)
  commission_interest boolean default false,                 -- Interesse em colaborar com o CA
  created_at   timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Cria o perfil automaticamente quando alguém faz o primeiro login
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(split_part(new.email, '@', 1), ''), 'Estudante'))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- (OPCIONAL) Restringir cadastro a e-mails institucionais.
-- Descomente e ajuste o domínio se quiser bloquear outros e-mails no servidor.
-- create or replace function public.check_email_domain()
-- returns trigger language plpgsql as $$
-- begin
--   if new.email not ilike '%@uergs.edu.br' then
--     raise exception 'Use seu e-mail institucional da UERGS';
--   end if;
--   return new;
-- end $$;
-- drop trigger if exists check_email_domain on auth.users;
-- create trigger check_email_domain before insert on auth.users
--   for each row execute function public.check_email_domain();

-- ---------------------------------------------------------------------
-- 2. CONFIRMAÇÃO DE PRESENÇA (RSVP) – não exige login
-- ---------------------------------------------------------------------
create table if not exists public.rsvps (
  id         bigint generated always as identity primary key,
  user_id    uuid default auth.uid() references auth.users(id) on delete set null,
  name       text not null check (char_length(name) between 2 and 100),
  semester   text check (char_length(semester) <= 20),
  diet       text check (char_length(diet) <= 40),
  commission text check (commission in ('sim', 'talvez', 'nao')),
  created_at timestamptz not null default now()
);

-- Contagem pública (sem expor nomes)
create or replace function public.rsvp_count()
returns integer language sql stable security definer set search_path = public as $$
  select count(*)::int from public.rsvps;
$$;

-- ---------------------------------------------------------------------
-- 3. MURAL DE SUGESTÕES + VOTOS
-- ---------------------------------------------------------------------
create table if not exists public.suggestions (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title      text not null check (char_length(title) between 5 and 120),
  body       text not null check (char_length(body) between 5 and 2000),
  category   text not null check (char_length(category) <= 40),
  status     text not null default 'nova' check (status in ('nova', 'analise', 'encaminhada', 'concluida')),
  vote_count integer not null default 0,
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.suggestion_votes (
  suggestion_id bigint not null references public.suggestions(id) on delete cascade,
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  primary key (suggestion_id, user_id)
);

create or replace function public.sync_suggestion_votes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.suggestions set vote_count = vote_count + 1 where id = new.suggestion_id;
  else
    update public.suggestions set vote_count = greatest(vote_count - 1, 0) where id = old.suggestion_id;
  end if;
  return null;
end $$;

drop trigger if exists trg_suggestion_votes on public.suggestion_votes;
create trigger trg_suggestion_votes
  after insert or delete on public.suggestion_votes
  for each row execute function public.sync_suggestion_votes();

-- ---------------------------------------------------------------------
-- 4. ENQUETES
-- ---------------------------------------------------------------------
create table if not exists public.polls (
  id         bigint generated always as identity primary key,
  question   text not null check (char_length(question) between 5 and 200),
  is_open    boolean not null default true,
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id         bigint generated always as identity primary key,
  poll_id    bigint not null references public.polls(id) on delete cascade,
  label      text not null check (char_length(label) between 1 and 120),
  position   smallint not null default 0,
  vote_count integer not null default 0
);

create table if not exists public.poll_votes (
  poll_id   bigint not null references public.polls(id) on delete cascade,
  option_id bigint not null references public.poll_options(id) on delete cascade,
  user_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  primary key (poll_id, user_id)
);

create or replace function public.sync_poll_votes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.poll_options set vote_count = vote_count + 1 where id = new.option_id;
  return null;
end $$;

drop trigger if exists trg_poll_votes on public.poll_votes;
create trigger trg_poll_votes
  after insert on public.poll_votes
  for each row execute function public.sync_poll_votes();

-- ---------------------------------------------------------------------
-- 5. FÓRUM
-- ---------------------------------------------------------------------
create table if not exists public.topics (
  id            bigint generated always as identity primary key,
  user_id       uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title         text not null check (char_length(title) between 5 and 150),
  body          text not null check (char_length(body) between 5 and 5000),
  category      text not null check (char_length(category) <= 40),
  reply_count   integer not null default 0,
  hidden        boolean not null default false,
  created_at    timestamptz not null default now(),
  last_activity timestamptz not null default now()
);

create table if not exists public.replies (
  id         bigint generated always as identity primary key,
  topic_id   bigint not null references public.topics(id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 2 and 3000),
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.sync_replies()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.topics
     set reply_count = reply_count + 1, last_activity = now()
   where id = new.topic_id;
  return null;
end $$;

drop trigger if exists trg_replies on public.replies;
create trigger trg_replies
  after insert on public.replies
  for each row execute function public.sync_replies();

-- ---------------------------------------------------------------------
-- 6. AVISOS e AGENDA (somente admins publicam)
-- ---------------------------------------------------------------------
create table if not exists public.announcements (
  id         bigint generated always as identity primary key,
  title      text not null check (char_length(title) between 3 and 150),
  body       text not null check (char_length(body) <= 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id          bigint generated always as identity primary key,
  title       text not null check (char_length(title) between 3 and 150),
  description text check (char_length(description) <= 2000),
  starts_at   timestamptz not null,
  location    text check (char_length(location) <= 200),
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- 7. SEGURANÇA (Row Level Security)
-- =====================================================================
alter table public.profiles         enable row level security;
alter table public.admins           enable row level security;
alter table public.rsvps            enable row level security;
alter table public.suggestions      enable row level security;
alter table public.suggestion_votes enable row level security;
alter table public.polls            enable row level security;
alter table public.poll_options     enable row level security;
alter table public.poll_votes       enable row level security;
alter table public.topics           enable row level security;
alter table public.replies          enable row level security;
alter table public.announcements    enable row level security;
alter table public.events           enable row level security;

-- Perfis: nome e semestre são públicos; cada um edita o seu
drop policy if exists "profiles_read"   on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_read"   on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- Admins: cada um só vê se é admin (gerenciar pelo painel do Supabase)
drop policy if exists "admins_self" on public.admins;
create policy "admins_self" on public.admins for select using (user_id = auth.uid());

-- RSVP: qualquer um confirma; só admins leem a lista
drop policy if exists "rsvps_insert" on public.rsvps;
drop policy if exists "rsvps_admin"  on public.rsvps;
create policy "rsvps_insert" on public.rsvps for insert with check (user_id is null or user_id = auth.uid());
create policy "rsvps_admin"  on public.rsvps for select using (public.is_admin());

-- Sugestões
drop policy if exists "sug_read"   on public.suggestions;
drop policy if exists "sug_insert" on public.suggestions;
drop policy if exists "sug_admin"  on public.suggestions;
drop policy if exists "sug_delete" on public.suggestions;
create policy "sug_read"   on public.suggestions for select using (not hidden or public.is_admin() or user_id = auth.uid());
create policy "sug_insert" on public.suggestions for insert to authenticated
  with check (user_id = auth.uid() and status = 'nova' and vote_count = 0 and hidden = false);
create policy "sug_admin"  on public.suggestions for update using (public.is_admin());
create policy "sug_delete" on public.suggestions for delete using (user_id = auth.uid() or public.is_admin());

-- Votos em sugestões: cada um vê e gerencia os próprios votos
drop policy if exists "sv_read"   on public.suggestion_votes;
drop policy if exists "sv_insert" on public.suggestion_votes;
drop policy if exists "sv_delete" on public.suggestion_votes;
create policy "sv_read"   on public.suggestion_votes for select using (user_id = auth.uid());
create policy "sv_insert" on public.suggestion_votes for insert to authenticated with check (user_id = auth.uid());
create policy "sv_delete" on public.suggestion_votes for delete using (user_id = auth.uid());

-- Enquetes: leitura pública; criação por admins
drop policy if exists "polls_read"  on public.polls;
drop policy if exists "polls_admin" on public.polls;
create policy "polls_read"  on public.polls for select using (true);
create policy "polls_admin" on public.polls for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "po_read"  on public.poll_options;
drop policy if exists "po_admin" on public.poll_options;
create policy "po_read"  on public.poll_options for select using (true);
create policy "po_admin" on public.poll_options for insert with check (public.is_admin() and vote_count = 0);

-- Votos em enquete: secretos (cada um só vê o próprio); 1 voto por enquete aberta
drop policy if exists "pv_read"   on public.poll_votes;
drop policy if exists "pv_insert" on public.poll_votes;
create policy "pv_read"   on public.poll_votes for select using (user_id = auth.uid());
create policy "pv_insert" on public.poll_votes for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.polls p where p.id = poll_id and p.is_open)
    and exists (select 1 from public.poll_options o where o.id = option_id and o.poll_id = poll_votes.poll_id)
  );

-- Fórum
drop policy if exists "topics_read"   on public.topics;
drop policy if exists "topics_insert" on public.topics;
drop policy if exists "topics_admin"  on public.topics;
drop policy if exists "topics_delete" on public.topics;
create policy "topics_read"   on public.topics for select using (not hidden or public.is_admin() or user_id = auth.uid());
create policy "topics_insert" on public.topics for insert to authenticated
  with check (user_id = auth.uid() and reply_count = 0 and hidden = false);
create policy "topics_admin"  on public.topics for update using (public.is_admin());
create policy "topics_delete" on public.topics for delete using (user_id = auth.uid() or public.is_admin());

drop policy if exists "replies_read"   on public.replies;
drop policy if exists "replies_insert" on public.replies;
drop policy if exists "replies_admin"  on public.replies;
drop policy if exists "replies_delete" on public.replies;
create policy "replies_read"   on public.replies for select using (not hidden or public.is_admin() or user_id = auth.uid());
create policy "replies_insert" on public.replies for insert to authenticated
  with check (user_id = auth.uid() and hidden = false
              and exists (select 1 from public.topics t where t.id = topic_id and not t.hidden));
create policy "replies_admin"  on public.replies for update using (public.is_admin());
create policy "replies_delete" on public.replies for delete using (user_id = auth.uid() or public.is_admin());

-- Avisos e agenda
drop policy if exists "ann_read"  on public.announcements;
drop policy if exists "ann_admin" on public.announcements;
create policy "ann_read"  on public.announcements for select using (true);
create policy "ann_admin" on public.announcements for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "ev_read"  on public.events;
drop policy if exists "ev_admin" on public.events;
create policy "ev_read"  on public.events for select using (true);
create policy "ev_admin" on public.events for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 8. LOJINHA (PRODUTOS & PEDIDOS)
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id          text primary key,
  nome        text not null check (char_length(nome) between 2 and 150),
  categoria   text not null,
  preco       text not null,
  preco_socio text,
  status      text not null default 'disponivel' check (status in ('disponivel', 'prevenda', 'esgotado')),
  icone       text default '🛍️',
  tag         text,
  descricao   text,
  estoque     integer default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.orders (
  id             text primary key,
  user_id        uuid references auth.users(id) on delete set null,
  aluno_nome     text not null,
  aluno_email    text not null,
  aluno_whatsapp text not null,
  produto_id     text references public.products(id) on delete set null,
  produto_nome   text not null,
  total          text not null,
  status         text not null default 'pendente' check (status in ('pendente', 'pago', 'entregue', 'cancelado')),
  variant        text,
  obs            text,
  created_at     timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders   enable row level security;

-- Produtos: leitura pública, edição somente gestor
drop policy if exists "prod_read"  on public.products;
drop policy if exists "prod_admin" on public.products;
create policy "prod_read"  on public.products for select using (true);
create policy "prod_admin" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- Pedidos: o estudante vê o seu, gestor vê todos
drop policy if exists "ord_read"   on public.orders;
drop policy if exists "ord_insert" on public.orders;
drop policy if exists "ord_admin"  on public.orders;
create policy "ord_read"   on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "ord_insert" on public.orders for insert with check (true);
create policy "ord_admin"  on public.orders for update using (public.is_admin());

-- ---------------------------------------------------------------------
-- 9. TRILHA DE AUDITORIA IMUTÁVEL (AUDIT LOGS)
-- ---------------------------------------------------------------------
create table if not exists public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_id      uuid references auth.users(id) on delete set null,
  actor_name    text not null,
  action        text not null,
  target_entity text not null,
  payload_diff  jsonb,
  ip            text,
  created_at    timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

drop policy if exists "audit_read"   on public.audit_logs;
drop policy if exists "audit_insert" on public.audit_logs;
create policy "audit_read"   on public.audit_logs for select using (public.is_admin());
create policy "audit_insert" on public.audit_logs for insert with check (public.is_admin() or auth.uid() is not null);

-- =====================================================================
-- 10. FAQS (DÚVIDAS FREQUENTES DINÂMICAS) & VAGAS DE ESTÁGIO
-- =====================================================================
create table if not exists public.faqs (
  id          bigint generated always as identity primary key,
  pergunta    text not null check (char_length(pergunta) between 5 and 250),
  resposta    text not null check (char_length(resposta) <= 3000),
  categoria   text not null default 'Geral',
  destaque    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.faqs enable row level security;
drop policy if exists "faqs_read"  on public.faqs;
drop policy if exists "faqs_admin" on public.faqs;
create policy "faqs_read"  on public.faqs for select using (true);
create policy "faqs_admin" on public.faqs for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.internships (
  id               bigint generated always as identity primary key,
  titulo           text not null check (char_length(titulo) between 3 and 150),
  empresa          text not null check (char_length(empresa) between 2 and 150),
  local            text not null default 'Porto Alegre / RS',
  tipo             text not null default 'estagio_nao_obrigatorio',
  tipo_label       text not null default 'Estágio Remunerado',
  remuneracao      text,
  carga_horaria    text,
  requisitos       text,
  link_candidatura text,
  contato          text,
  status           text not null default 'ativa',
  destaque         boolean not null default false,
  created_at       timestamptz not null default now()
);

alter table public.internships enable row level security;
drop policy if exists "internships_read"  on public.internships;
drop policy if exists "internships_admin" on public.internships;
create policy "internships_read"  on public.internships for select using (true);
create policy "internships_admin" on public.internships for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- 11. CARGA INICIAL (SEEDS DA ASSEMBLEIA, EVENTOS E LOJINHA)
-- =====================================================================
-- Enquete 1: Fundação do CA
insert into public.polls (question, is_open) 
values ('PROPOSTA 1: Você aprova que o Centro Acadêmico de Engenharia de Controle e Automação (E(CA)²) seja oficialmente fundado na UERGS?', true);

insert into public.poll_options (poll_id, label, position, vote_count)
select p.id, opt.label, opt.pos, 0
from public.polls p
cross join (
  values 
    ('SIM, aprovo por aclamação (A Favor)', 0),
    ('NÃO, sou contrário', 1),
    ('ABSTENÇÃO', 2)
) as opt(label, pos)
where p.question like 'PROPOSTA 1%'
  and not exists (select 1 from public.poll_options po where po.poll_id = p.id);

-- Enquete 2: Comissão Pró-CA
insert into public.polls (question, is_open) 
values ('PROPOSTA 2: Você aprova a aclamação da Comissão Pró-CA como diretoria executiva transitória até as eleições gerais regulamentares?', true);

insert into public.poll_options (poll_id, label, position, vote_count)
select p.id, opt.label, opt.pos, 0
from public.polls p
cross join (
  values 
    ('SIM, aprovo a Comissão Provisória', 0),
    ('NÃO, sou contrário', 1),
    ('ABSTENÇÃO', 2)
) as opt(label, pos)
where p.question like 'PROPOSTA 2%'
  and not exists (select 1 from public.poll_options po where po.poll_id = p.id);

-- Evento Principal: Assembleia Geral e Salchipão
insert into public.events (title, description, starts_at, location)
values (
  'Assembleia Geral de Fundação do E(CA)² + Salchipão',
  'Convocação solene de todos os estudantes de Engenharia de Controle e Automação para fundação formal do Centro Acadêmico e eleição da comissão provisória.',
  '2026-10-26T18:30:00Z',
  'Refeitório / Pátio da UERGS · Rua Washington Luiz, 675'
);

-- Produtos Iniciais da Lojinha
insert into public.products (id, nome, categoria, preco, preco_socio, icone, tag, descricao, status, estoque)
values 
  ('moletom-eca2', 'Moletom Canguru E(CA)²', 'Vestuário', 'R$ 139,00', 'R$ 119,00', '🧥', 'OFICIAL 2026', 'Algodão premium 3 cabos com bordado de alta precisão do microchip de silício no peito e slogan nas costas.', 'disponivel', 30),
  ('copo-termico-eca2', 'Copo Térmico Inox 473ml', 'Acessórios', 'R$ 59,00', 'R$ 49,00', '🥤', 'SUSTENTÁVEL', 'Parede dupla com vácuo térmico. Conserva sua bebida gelada nas 4 horas de aula ou café quente no laboratório.', 'disponivel', 40),
  ('caneca-lab-eca2', 'Caneca de Cerâmica Lab 325ml', 'Acessórios', 'R$ 38,00', 'R$ 32,00', '☕', 'CLÁSSICA', 'Cerâmica fosca resistente a micro-ondas com a fórmula clássica da função de transferência de malha fechada.', 'disponivel', 50)
on conflict (id) do nothing;

-- =====================================================================
-- 12. TORNAR ALGUÉM ADMINISTRADOR (rode após o primeiro login)
-- =====================================================================
-- insert into public.admins (user_id)
--   select id from auth.users where email = 'seu.email@uergs.edu.br';

