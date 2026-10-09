// All problem randomness goes through rng(), which makeProblem seeds so a missed problem can come back exactly.
let rng = Math.random;
function seeded(seed) { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
const newSeed = () => Math.floor(Math.random() * 2 ** 31);
const rand = (a, b) => a + Math.floor(rng() * (b - a + 1));
const pick = a => a[Math.floor(rng() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
// The child's name, set on the grown-ups page.
const childName = () => (state.childName || '').trim();
const N = () => childName() || 'your child';
// In French lines, a child with no name set is "Pip".
const frName = () => childName() || 'Pip';
const childAge = () => Math.max(2, Math.min(15, +state.childAge || 6));
// Family names for the scenes, set on the grown-ups page. With none set, the scenes use made-up children.
const sibName = () => (state.playmate || '').trim() || 'Léo';
const bigName = () => (state.big || '').trim() || 'Lou';
const farName = () => (state.far || '').trim() || 'Jade';
const fill = (s, digits) => String(s).replace(/\{name\}/g, frName()).replace(/\{age\}/g, digits ? String(childAge()) : numFr(childAge()))
  .replace(/\{([^{}\/]+)\/([^{}]+)\}/g, (_, m, f) => girl() ? f : m).replace(/\{sib\}/g, sibName()).replace(/\{big\}/g, bigName()).replace(/\{far\}/g, farName());
// The playmate's picture is their own profile picture when they have one here.
const sceneWho = sc => sc.who === '{sib}' ? (Object.values(family.kids).find(k => k !== state && (k.childName || '').trim().toLowerCase() === sibName().toLowerCase())?.me || '🙂') : sc.who;
const me = () => state.me || '🧒';
const girl = () => state.me === '👧';
const greet = s => childName() ? `${s}, ${childName()} !` : `${s} !`;

/* ---------- numbers in French ---------- */
const UNITS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };
function numFr(n) {
  if (n < 20) return UNITS[n];
  if (n === 100) return 'cent';
  const t = Math.floor(n / 10), u = n % 10;
  if (t < 7) return u === 0 ? TENS[t] : u === 1 ? `${TENS[t]} et un` : `${TENS[t]}-${UNITS[u]}`;
  if (t === 7) return u === 1 ? 'soixante et onze' : `soixante-${UNITS[10 + u]}`;
  return n === 80 ? 'quatre-vingts' : `quatre-vingt-${UNITS[n - 80]}`;
}
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const NUMBER_SETS = [range(1, 5), range(6, 10), range(11, 16), range(17, 20), range(3, 10).map(t => t * 10), range(21, 69).filter(n => n % 10), range(70, 99).filter(n => n % 10)];
const NUMBER_LEVELS = ['un à cinq', 'six à dix', 'onze à seize', 'dix-sept à vingt', 'trente, quarante… cent', '21 à 69', '70 à 99 (soixante-dix, quatre-vingts)'];

/* ---------- vocabulary: topics split into sets of 6 words, one set per level ---------- */
const SET_SIZE = 6;
const TOPIC = Object.fromEntries(TOPICS.map(t => [t.id, t]));
const ORDER = TOPICS.map(t => t.id);
const GROUPS = [
  { title: 'Premiers mots', note: 'First words', keys: ['conversations', 'bonjour', 'couleurs', 'nombres', 'animaux', 'famille', 'corps', 'formes'] },
  { title: 'Encore des mots', note: 'More words', keys: ['nourriture', 'vetements', 'maison', 'jouets', 'transports', 'nature', 'contes', 'emotions', 'actions'] },
  { title: 'Phrases et saisons', note: 'Sentences and seasons', keys: ['phrases', 'saison', 'mesmots'] },
];
// Articles are kept with each word; bare() strips them (and accents) for matching typed or pasted words.
const bare = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'").replace(/œ/g, 'oe').replace(/æ/g, 'ae').trim()
  .replace(/^(le |la |les |l'|un |une |des |du |the |a |an |some )/, '').replace(/[^a-z0-9' -]/g, '').replace(/\s+/g, ' ').trim();
function parseWords(text) {
  return text.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [fr, en, pic, ...rest] = l.split('|').map(s => s.trim());
    const fem = rest.find(x => x.startsWith('f='))?.slice(2), [q, imp] = rest.filter(x => !x.startsWith('f='));
    return { fr, en, pic, q, imp, fem };
  });
}
const chunk = (a, n) => { const out = []; for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n)); return out; };
const season = () => SEASONS[new Date().getMonth()];
function buildVocab() {
  for (const t of TOPICS) {
    if (t.phrases) { t.sets = []; continue; }
    if (t.convo) {
      // each scene is one level; its items are the child's lines, keyed by their unfilled text
      t.sets = SCENES.map((sc, i) => sc.steps.map((st, j) => ({ fr: st.you || st.ask, en: st.en, pic: st.pic, scene: i, step: j })));
      t.levels = SCENES.map(sc => `${sceneWho(sc)} ${fill(sc.title)}`);
      continue;
    }
    if (t.numbers) {
      t.sets = NUMBER_SETS.map(s => s.map(n => ({ fr: numFr(n), en: String(n), pic: 'n:' + n, n })));
      t.levels = NUMBER_LEVELS;
      continue;
    }
    let items = t.seasonal ? parseWords(season().words) : t.custom ? (state.custom || []).map(c => ({ ...c })) : parseWords(t.words);
    // action words are taught as "il nage" (the infinitive stays as a note); feelings agree for a girl
    if (t.ask === 'fait') items = items.map(w => ({ ...w, inf: w.fr, fr: `il ${w.q}` }));
    if (girl()) items = items.map(w => w.fem ? { ...w, fr: w.fem } : w);
    t.sets = chunk(items, SET_SIZE);
    if (!t.sets.length) t.sets = [[]];
    t.levels = t.sets.map((s, i) => `Set ${i + 1}: ${s.slice(0, 3).map(w => bare(w.fr)).join(', ')}${s.length > 3 ? '…' : ''}`);
  }
}
const levelsOf = k => TOPIC[k].levels || [''];
const maxLevel = k => levelsOf(k).length;
const allItems = k => (TOPIC[k].sets || []).flat();
const wordTopics = () => TOPICS.filter(t => !t.phrases && !t.convo);
function findItem(k, fr) { return allItems(k).find(w => w.fr === fr); }
const topicReady = k => TOPIC[k].phrases || allItems(k).length > 0;

/* ---------- state ---------- */
function defaultState() {
  return {
    levels: Object.fromEntries(ORDER.map(k => [k, 1])),
    on: { conversations: true, couleurs: true, nombres: true, animaux: true },
    childAge: 6, me: '🧒', playmate: '', big: '', far: '',
    rec: {}, stretch: {}, mastered: {}, words: {}, cards: [], cleared: 0, custom: [],
    sessions: [], log: [], done: {}, total: 0, perSession: 10, sayIt: true, speed: 'normal', updatedAt: 0,
  };
}
function normalize(s) {
  s = Object.assign(defaultState(), s || {});
  s.levels = Object.assign(defaultState().levels, s.levels);
  s.on = Object.assign({}, s.on);
  return s;
}

/* ---------- storage: this device first, Supabase sync when a sync code is set ---------- */
const LS_KEY = 'toms-ardoise-v1';
const CODE_KEY = 'toms-ardoise-sync-code';
const CFG = window.ARDOISE_CONFIG || {};
const syncAvailable = !!(CFG.supabaseUrl && CFG.supabaseKey && window.crypto?.subtle);
function loadLocal() { try { const t = localStorage.getItem(LS_KEY); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
function saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(family)); } catch (e) {} }
/* One family, several children: each child has their own progress and settings (the "state" used everywhere).
   Which child is playing is remembered per device; everything else syncs. Removed children leave a tombstone so sync doesn't bring them back. */
const ACTIVE_KEY = 'toms-ardoise-active';
function normalizeFamily(raw) {
  if (!raw) return { kids: {}, removed: {}, updatedAt: 0 };
  if (raw.levels) return { kids: { k1: normalize(raw) }, removed: {}, updatedAt: raw.updatedAt || 0 }; // an older single-child save
  const kids = {};
  for (const [id, k] of Object.entries(raw.kids || {})) kids[id] = normalize(k);
  return { kids, removed: raw.removed || {}, updatedAt: raw.updatedAt || 0 };
}
function mergeFamily(a, b) {
  const out = { kids: {}, removed: { ...a.removed, ...b.removed }, updatedAt: Math.max(a.updatedAt, b.updatedAt) };
  for (const id of new Set([...Object.keys(a.kids), ...Object.keys(b.kids)])) {
    if (out.removed[id]) continue;
    const x = a.kids[id], y = b.kids[id];
    out.kids[id] = !x ? y : !y ? x : (y.updatedAt || 0) > (x.updatedAt || 0) ? y : x;
  }
  return out;
}
let family = normalizeFamily(loadLocal());
// A fresh install starts with Tom and Persephone set up; both can be renamed or removed on the grown-ups page.
if (!Object.keys(family.kids).length) {
  const family_ = { big: 'Olive', far: 'Poppy' };
  family.kids.k1 = Object.assign(normalize(null), family_, { childName: 'Tom', childAge: 6, me: '👦', playmate: 'Persephone' });
  family.kids.k2 = Object.assign(normalize(null), family_, { childName: 'Persephone', childAge: 3, me: '👧', playmate: 'Tom', perSession: 5 });
}
let activeId = '';
try { activeId = localStorage.getItem(ACTIVE_KEY) || ''; } catch (e) {}
if (!family.kids[activeId]) activeId = Object.keys(family.kids)[0];
let state = family.kids[activeId];
function useKid(id) {
  activeId = family.kids[id] ? id : Object.keys(family.kids)[0];
  try { localStorage.setItem(ACTIVE_KEY, activeId); } catch (e) {}
  state = family.kids[activeId];
  buildVocab();
}
function addKid(name, age) {
  const id = newSeed().toString(36), kid = normalize(null);
  // a new child plays with the child who's already here, and shares the older brothers and sisters
  Object.assign(kid, { childName: name, childAge: age, perSession: age <= 4 ? 5 : 10, playmate: state.childName || '', big: state.big || '', far: state.far || '', updatedAt: Date.now() });
  family.kids[id] = kid;
  useKid(id);
  save();
}
function removeKid(id) {
  if (Object.keys(family.kids).length < 2) return;
  delete family.kids[id];
  family.removed[id] = Date.now();
  if (id === activeId) useKid(Object.keys(family.kids)[0]);
  save();
}
buildVocab();
const sync = { code: '', key: '', status: 'off', lastAt: 0, saving: false, dirty: false, error: '' };
try { sync.code = localStorage.getItem(CODE_KEY) || ''; } catch (e) {}

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const raw = [...bytes].map(b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}`;
}
function cleanCode(c) {
  const raw = String(c).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return raw.length === 12 ? `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}` : '';
}
// Shares the Chalkboard's Supabase table; the different prefix keeps this app's progress in its own row.
async function keyFor(code) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('toms-ardoise:' + code));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function rpc(fn, body) {
  const res = await fetch(`${CFG.supabaseUrl}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    // New-style publishable keys (sb_publishable_…) go only in the apikey header; legacy anon JWTs also go in Authorization.
    headers: Object.assign({ apikey: CFG.supabaseKey, 'Content-Type': 'application/json' }, CFG.supabaseKey.startsWith('sb_') ? {} : { Authorization: `Bearer ${CFG.supabaseKey}` }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${fn} failed (${res.status})`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
async function pushRemote() {
  if (!sync.key) return;
  if (sync.saving) { sync.dirty = true; return; }
  sync.saving = true;
  try { await rpc('chalkboard_save', { p_key: sync.key, p_data: family }); sync.status = 'ok'; sync.lastAt = Date.now(); sync.error = ''; }
  catch (e) { sync.status = 'error'; sync.error = navigator.onLine === false ? 'offline' : String(e.message || e); }
  sync.saving = false;
  if (screen === 'parent') render();
  if (sync.dirty) { sync.dirty = false; pushRemote(); }
}
async function pullRemote() {
  if (!sync.key) return;
  try {
    const remote = await rpc('chalkboard_get', { p_key: sync.key });
    sync.status = 'ok'; sync.lastAt = Date.now(); sync.error = '';
    const theirs = normalizeFamily(remote), merged = mergeFamily(family, theirs);
    const changedHere = JSON.stringify(merged) !== JSON.stringify(family), behindThere = !remote || JSON.stringify(merged.kids) !== JSON.stringify(theirs.kids);
    if (changedHere) { family = merged; useKid(activeId); saveLocal(); }
    if (behindThere) { family.updatedAt = Date.now(); saveLocal(); pushRemote(); }
  } catch (e) { sync.status = 'error'; sync.error = navigator.onLine === false ? 'offline' : String(e.message || e); }
  if (screen === 'home' || screen === 'parent') render();
}
async function startSync(code) {
  sync.code = code;
  try { localStorage.setItem(CODE_KEY, code); } catch (e) {}
  sync.key = await keyFor(code);
  sync.status = 'syncing';
  await pullRemote();
}
function stopSync() {
  sync.code = ''; sync.key = ''; sync.status = 'off';
  try { localStorage.removeItem(CODE_KEY); } catch (e) {}
}
function save() { state.updatedAt = family.updatedAt = Date.now(); family.kids[activeId] = state; saveLocal(); pushRemote(); }
function initSync() {
  if (!syncAvailable) return;
  if (sync.code) startSync(sync.code);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pullRemote(); });
  window.addEventListener('online', () => pullRemote());
}

/* ---------- speech: everything is spoken in French ---------- */
const canSpeak = 'speechSynthesis' in window;
const VOICE_KEY = 'toms-ardoise-voice';
let voices = [];
function loadVoices() {
  try { voices = speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang)); } catch (e) { voices = []; }
  if (screen === 'parent' || screen === 'home') render();
}
function savedVoiceName() { try { return localStorage.getItem(VOICE_KEY) || ''; } catch (e) { return ''; } }
const FR_VOICES = ['Thomas', 'Audrey', 'Aurélie', 'Marie', 'Google français', 'Microsoft Denise', 'Microsoft Henri', 'Microsoft Julie', 'Amélie'];
function chosenVoice() {
  const name = savedVoiceName();
  const exact = name && voices.find(v => v.name === name);
  if (exact) return exact;
  const score = v => (/enhanced|premium|natural/i.test(v.name) ? 0 : 2) + (/fr[-_]FR/i.test(v.lang) ? 0 : 1);
  for (const p of FR_VOICES) {
    const hits = voices.filter(v => v.name.startsWith(p)).sort((a, b) => score(a) - score(b));
    if (hits.length) return hits[0];
  }
  return voices.slice().sort((a, b) => score(a) - score(b))[0] || null;
}
// parts: [[text, pitch], …] spoken one after another. Characters in conversations get their own pitch; the child's lines are a little higher.
const KID_PITCH = 1.2;
function sayAll(parts, slow) {
  if (!canSpeak) return;
  try {
    speechSynthesis.cancel();
    const v = chosenVoice();
    for (const [t, pitch] of parts) {
      if (!t) continue;
      const u = new SpeechSynthesisUtterance(t);
      u.lang = v ? v.lang : 'fr-FR';
      if (v) u.voice = v;
      u.rate = slow ? 0.55 : state.speed === 'slow' ? 0.72 : 0.88;
      u.pitch = pitch || 1;
      speechSynthesis.speak(u);
    }
  } catch (e) {}
}
const say = (t, slow, pitch) => sayAll([[t, pitch]], slow);

/* ---------- pictures ---------- */
function starPath(cx, cy, R, r) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R;
    d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} `;
  }
  return d + 'Z';
}
const SHAPES = {
  rond: '<circle cx="50" cy="50" r="38"/>',
  carre: '<rect x="15" y="15" width="70" height="70" rx="4"/>',
  triangle: '<path d="M50 12 L90 86 L10 86 Z"/>',
  etoile: `<path d="${starPath(50, 53, 44, 18)}"/>`,
  coeur: '<path d="M50 86 C20 64 8 46 14 30 C20 14 42 12 50 30 C58 12 80 14 86 30 C92 46 80 64 50 86 Z"/>',
  rectangle: '<rect x="6" y="28" width="88" height="44" rx="4"/>',
  losange: '<path d="M50 6 L84 50 L50 94 L16 50 Z"/>',
  fleur: [0, 72, 144, 216, 288].map(a => `<circle cx="${(50 + 22 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(50 + 22 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="17"/>`).join('') + '<circle cx="50" cy="50" r="11" class="mid"/>',
  maison: '<path d="M50 10 L90 46 L80 46 L80 88 L20 88 L20 46 L10 46 Z"/>',
};
const shapeSvg = (name, color) => `<svg viewBox="0 0 100 100" class="shape" aria-hidden="true" style="--fill:${color || 'rgba(238,236,227,.12)'}">${SHAPES[name]}</svg>`;
const swatch = hex => `<svg viewBox="0 0 100 100" class="swatch" aria-hidden="true"><path d="M50 8 C74 6 94 26 92 50 C90 76 72 94 48 92 C24 90 6 72 8 48 C10 24 28 10 50 8 Z" fill="${hex}"/></svg>`;
function picHtml(pic) {
  if (!pic) return '<span class="emo">❓</span>';
  if (pic.startsWith('c:')) return swatch(pic.slice(2));
  if (pic.startsWith('s:')) return shapeSvg(pic.slice(2));
  if (pic.startsWith('n:')) return `<span class="numeral">${esc(pic.slice(2))}</span>`;
  return `<span class="emo">${esc(pic)}</span>`;
}

/* ---------- what he knows ---------- */
// words[fr] = { r: right on the first try, m: misses, k: marked known by a grown-up }
const rec = fr => state.words[fr];
const isKnown = fr => { const w = rec(fr); return !!w && (!!w.k || (w.r || 0) - (w.m || 0) >= 2); };
const isSeen = fr => !!rec(fr);
function knownCount() {
  const seen = new Set();
  for (const t of wordTopics()) for (const w of allItems(t.id)) if (isKnown(w.fr)) seen.add(w.fr);
  return seen.size;
}
// Words at or below the current level, plus any known words from later sets.
function eligible(k, L) {
  const sets = TOPIC[k].sets;
  return [...sets.slice(0, L).flat(), ...sets.slice(L).flat().filter(w => isKnown(w.fr))];
}

/* ---------- problem generators ---------- */
const SAY_ASK = { couleurs: "C'est quelle couleur ?", nombres: "C'est quel nombre ?" };
function askFor(k, w) {
  const t = TOPIC[k];
  if (t.ask === 'qui') return `Qui dit « ${w.fr} » ?`;
  if (t.ask === 'fait') return `Qui ${w.q} ?`;
  if (t.numbers) return `Où est le ${w.fr} ?`;
  if (t.article) return `Où est ${/^[aeiouéh]/i.test(w.fr) ? "l'" : 'le '}${w.fr} ?`;
  return `${/^les /.test(w.fr) ? 'Où sont' : 'Où est'} ${w.fr} ?`;
}
const sayAsk = k => TOPIC[k].sayAsk || SAY_ASK[k] || "Qu'est-ce que c'est ?";
function weighted(pool) {
  const wt = w => isKnown(w.fr) ? 1 : isSeen(w.fr) ? 2.5 : 3;
  let total = pool.reduce((t, w) => t + wt(w), 0), x = rng() * total;
  for (const w of pool) { x -= wt(w); if (x <= 0) return w; }
  return pool[pool.length - 1];
}
// gate: once a round has its new words, only words already met (or introduced this round) can be picked
function pickTarget(k, L, kind, avoid, gate) {
  const sets = TOPIC[k].sets;
  let pool = kind === 'stretch' ? (sets[L] || []).filter(w => !isKnown(w.fr))
    : kind === 'easier' ? sets.slice(0, L - 1).flat()
    : eligible(k, L);
  if (!pool.length) pool = eligible(k, L);
  if (gate) { const met = pool.filter(w => isSeen(w.fr) || gate.has(w.fr)); if (met.length) pool = met; }
  const fresh = pool.filter(w => !avoid.has(w.fr));
  return weighted(fresh.length ? fresh : pool);
}
function distractors(k, L, target) {
  const differs = w => w.fr !== target.fr && w.pic !== target.pic;
  if (TOPIC[k].numbers) {
    // nearby numbers make the best distractors: 7 next to 6 and 8, 77 next to 67 and 87
    const near = allItems(k).filter(differs).map(w => { const d = Math.abs(w.n - target.n); return { w, d: (d % 10 === 0 ? d / 4 : d) + rng() * 3 }; });
    near.sort((a, b) => a.d - b.d);
    return shuffle(near.slice(0, 5)).slice(0, 3).map(x => x.w);
  }
  let pool = eligible(k, L).filter(differs);
  // a brand-new word is easiest to learn next to words he already knows
  if (!isSeen(target.fr)) { const known = pool.filter(w => isKnown(w.fr)); if (known.length >= 3) pool = known; }
  if (pool.length < 3) pool = pool.concat(shuffle(allItems(k).filter(differs)));
  if (pool.length < 3) pool = pool.concat(shuffle(wordTopics().filter(t => !t.custom).flatMap(t => allItems(t.id)).filter(differs)));
  const out = [], seen = new Set([target.fr, target.pic]);
  for (const w of shuffle(pool)) { if (out.length < 3 && !seen.has(w.fr) && !seen.has(w.pic)) { out.push(w); seen.add(w.fr); seen.add(w.pic); } }
  return out;
}
// body parts you move rather than touch
const BODY_MOVES = { 'la main': 'lève la main', 'le bras': 'lève les bras', 'la jambe': 'lève la jambe', 'le pied': 'tape du pied', 'le doigt': 'montre ton doigt', 'la langue': 'tire la langue' };
function genWord(k, L, kind, fr, avoid = new Set(), gate) {
  const target = (fr && findItem(k, fr)) || pickTarget(k, L, kind, avoid, gate);
  const p = { wid: target.fr, fr: target.fr, en: target.inf ? `${target.en} (${target.inf})` : target.en, pic: target.pic };
  // "Jacques a dit": hear a command and do it, but only when Jacques says so. Only for words already met.
  if (TOPIC[k].jacques && target.fr !== 'le cerveau' && isSeen(target.fr) && kind !== 'stretch' && kind !== 'check' && rng() < 0.35) {
    const cmd = target.imp || BODY_MOVES[target.fr] || `touche ${{ 'le ': 'ton ', 'la ': 'ta ', "l'": 'ton ', 'les ': 'tes ' }[target.fr.match(/^(le |la |les |l')/)?.[0]] || ''}${target.fr.replace(/^(le |la |les |l')/, '')}`;
    const said = rng() < 0.75;
    return Object.assign(p, { mode: 'jacques', said, fr: `${cmd} !`, prompt: said ? `Jacques a dit : ${cmd} !` : `${cap(cmd)} !`, choices: [] });
  }
  if (state.sayIt && kind !== 'stretch' && kind !== 'check' && isKnown(target.fr) && rng() < 0.4) {
    return Object.assign(p, { mode: 'say', prompt: sayAsk(k), choices: [] });
  }
  const choices = [target, ...distractors(k, L, target)].map(w => ({ html: picHtml(w.pic), fr: w.fr, en: w.en, ok: w === target, sentence: TOPIC[k].ask === 'fait' }));
  return Object.assign(p, { mode: 'listen', prompt: askFor(k, target), choices });
}

/* Petites phrases: two things change at once (color and shape, number and animal), so he has to understand the whole phrase. */
const PH_SHAPES = [['le cœur', 'm', 'coeur', 'heart'], ['le carré', 'm', 'carre', 'square'], ['le rond', 'm', 'rond', 'circle'], ["l'étoile", 'f', 'etoile', 'star'], ['la fleur', 'f', 'fleur', 'flower'], ['la maison', 'f', 'maison', 'house'], ['le triangle', 'm', 'triangle', 'triangle']];
const PH_COLORS = [['rouge', 'rouge', '#e0473e', 'red'], ['bleu', 'bleue', '#3f7fd9', 'blue'], ['jaune', 'jaune', '#f2d23c', 'yellow'], ['vert', 'verte', '#4caf50', 'green'], ['noir', 'noire', '#111111', 'black'], ['blanc', 'blanche', '#fafafa', 'white'], ['rose', 'rose', '#f28cb4', 'pink'], ['violet', 'violette', '#8e5ccf', 'purple'], ['orange', 'orange', '#f08a24', 'orange'], ['gris', 'grise', '#9a9a9a', 'gray']];
const PH_COUNT = [['chats', '🐱', 'cats'], ['chiens', '🐶', 'dogs'], ['pommes', '🍎', 'apples'], ['poissons', '🐟', 'fish'], ['oiseaux', '🐦', 'birds'], ['étoiles', '⭐', 'stars'], ['fleurs', '🌸', 'flowers'], ['lapins', '🐰', 'rabbits'], ['dragons', '🐉', 'dragons'], ['canards', '🦆', 'ducks'], ['fraises', '🍓', 'strawberries'], ['voitures', '🚗', 'cars']];
const PH_EATERS = [['le lapin', '🐰', 'rabbit'], ["l'ours", '🐻', 'bear'], ['le chat', '🐱', 'cat'], ['le singe', '🐵', 'monkey'], ['le dragon', '🐉', 'dragon'], ['la souris', '🐭', 'mouse'], ['le cochon', '🐷', 'pig'], ['le chien', '🐶', 'dog']];
const PH_FOODS = [['une carotte', '🥕', 'a carrot'], ['une pomme', '🍎', 'an apple'], ['une banane', '🍌', 'a banana'], ['du fromage', '🧀', 'cheese'], ['un gâteau', '🎂', 'a cake'], ['du miel', '🍯', 'honey'], ['une fraise', '🍓', 'a strawberry'], ['du pain', '🍞', 'bread'], ['une glace', '🍦', 'an ice cream']];
const PH_ANIMALS = [['le chat', '🐱', 'cat'], ['la souris', '🐭', 'mouse'], ['le lapin', '🐰', 'rabbit'], ['la grenouille', '🐸', 'frog'], ["l'oiseau", '🐦', 'bird'], ['le chien', '🐶', 'dog']];
const PH_THINGS = [['la boîte', 'de la boîte', '📦', 'box'], ['le chapeau', 'du chapeau', '🎩', 'hat'], ['le panier', 'du panier', '🧺', 'basket']];
const PH_PREPS = [['dans', 'in'], ['sur', 'on'], ['sous', 'under'], ['cote', 'next to']];
const PH_FRAMES = [['Je veux', '!', 'I want to'], ['On va', '!', "We're going to"], ["J'aime", '!', 'I like to'], ['Tu veux', '?', 'Do you want to']];
function twoByTwo(a, b, make) {
  // the right answer plus the three mix-ups: right first part / wrong second, and so on
  return [make(a[0], b[0], true), make(a[0], b[1]), make(a[1], b[0]), make(a[1], b[1])];
}
function genPhrase(L) {
  if (L === 1) {
    const [s1, s2] = shuffle(PH_SHAPES), [c1, c2] = shuffle(PH_COLORS.slice(0, 8));
    const name = (s, c) => `${s[0]} ${s[1] === 'f' ? c[1] : c[0]}`;
    const choices = twoByTwo([s1, s2], [c1, c2], (s, c, ok) => ({ html: shapeSvg(s[2], c[2]), fr: name(s, c), en: `the ${c[3]} ${s[3]}`, ok: !!ok }));
    return { mode: 'listen', fr: name(s1, c1), en: `the ${c1[3]} ${s1[3]}`, prompt: `Où est ${name(s1, c1)} ?`, choices };
  }
  if (L === 2) {
    const [a, b] = shuffle(PH_COUNT), n = rand(2, 6), m = n + pick([-1, 1]);
    const many = (x, k) => `<span class="many">${x[1].repeat(k)}</span>`;
    const choices = twoByTwo([a, b], [n, m], (x, k, ok) => ({ html: many(x, k), fr: `${numFr(k)} ${x[0]}`, en: `${k} ${x[2]}`, ok: !!ok }));
    return { mode: 'listen', fr: `${numFr(n)} ${a[0]}`, en: `${n} ${a[2]}`, prompt: `Montre-moi ${numFr(n)} ${a[0]} !`, choices };
  }
  if (L === 3) {
    const [e1, e2] = shuffle(PH_EATERS), [f1, f2] = shuffle(PH_FOODS);
    const line = (e, f) => `${cap(e[0])} mange ${f[0]}.`;
    const choices = twoByTwo([e1, e2], [f1, f2], (e, f, ok) => ({ html: `<span class="pair"><span class="emo">${e[1]}</span><span class="emo sm">${f[1]}</span></span>`, fr: line(e, f), en: `The ${e[2]} is eating ${f[2]}.`, ok: !!ok, sentence: true }));
    return { mode: 'listen', fr: line(e1, f1), en: `The ${e1[2]} is eating ${f1[2]}.`, prompt: line(e1, f1), lead: 'Montre-moi :', choices };
  }
  if (L >= 5) {
    // the infinitive where children really hear it: after je veux, on va, j'aime, tu veux
    const acts = shuffle(TOPIC.actions.sets.flat()).slice(0, 4), f = pick(PH_FRAMES), line = w => `${f[0]} ${w.inf} ${f[1]}`;
    const choices = acts.map((w, i) => ({ html: picHtml(w.pic), fr: line(w), en: `${f[2]} ${w.en}${f[1]}`, ok: i === 0, sentence: true }));
    return { mode: 'listen', fr: line(acts[0]), en: `${f[2]} ${acts[0].en}${f[1]}`, prompt: line(acts[0]), lead: 'Montre-moi :', choices };
  }
  const a = pick(PH_ANIMALS), o = pick(PH_THINGS), right = pick(PH_PREPS);
  const line = pr => `${cap(a[0])} est ${pr[0] === 'cote' ? 'à côté ' + o[1] : pr[0] + ' ' + o[0]}.`;
  const choices = PH_PREPS.map(pr => ({ html: `<span class="scene ${pr[0]}"><span class="obj">${o[2]}</span><span class="who">${a[1]}</span></span>`, fr: line(pr), en: `The ${a[2]} is ${pr[1]} the ${o[3]}.`, ok: pr === right, sentence: true }));
  return { mode: 'listen', fr: line(right), en: `The ${a[2]} is ${right[1]} the ${o[3]}.`, prompt: line(right), lead: 'Montre-moi :', choices };
}

/* Conversations: the character speaks, the child picks the picture of the right reply (or says it, once known).
   Wrong pictures are replies to other kinds of questions, never another yes/no answer to a yes/no question. */
const YES_NO = /^(oui|non|d'accord|oh oui)/i;
function genConvo(L, kind, fr, avoid = new Set(), gate) {
  const item = (fr && findItem('conversations', fr)) || pickTarget('conversations', L, kind, avoid, gate);
  const sc = SCENES[item.scene], st = sc.steps[item.step];
  const p = { convo: true, scene: item.scene, step: item.step, wid: item.fr, who: sceneWho(sc), pitch: sc.pitch,
    fr: fill(st.you || st.ask), en: fill(st.en), pic: fill(st.pic, true), them: st.them && fill(st.them), ask: !!st.ask, hint: st.hint, answer: st.answer && fill(st.answer), prompt: st.them ? fill(st.them) : 'À toi !', choices: [] };
  if (st.ask || (state.sayIt && kind !== 'stretch' && kind !== 'check' && isKnown(item.fr) && rng() < 0.4)) return Object.assign(p, { mode: 'say' });
  const pool = SCENES.slice(0, Math.max(L + 2, 4)).flatMap(s => s.steps).filter(x => x.you && x.type !== st.type && x.pic !== st.pic && !(YES_NO.test(st.you) && YES_NO.test(x.you)));
  const seenPics = new Set([st.pic]), wrong = [];
  for (const x of shuffle(pool)) if (wrong.length < 3 && !seenPics.has(x.pic)) { wrong.push(x); seenPics.add(x.pic); }
  p.choices = [st, ...wrong].map(x => ({ html: `<span class="emo reply">${esc(fill(x.pic, true))}</span>`, fr: fill(x.you), en: fill(x.en), ok: x === st, sentence: true }));
  return Object.assign(p, { mode: 'listen' });
}

// kind: 'current' (his level), 'easier' (an earlier set), 'stretch' (a word from the next set), 'again' (spaced review of a miss)
function makeProblem(k, level = state.levels[k], seed = newSeed(), kind = 'current', fr, avoid, gate) {
  level = Math.max(1, Math.min(level, maxLevel(k)));
  rng = seeded(seed);
  try {
    const p = TOPIC[k].phrases ? genPhrase(level) : TOPIC[k].convo ? genConvo(level, kind, fr, avoid, gate) : genWord(k, level, kind, fr, avoid, gate);
    Object.assign(p, { topic: k, level, seed, kind, tries: 0, wrong: [], done: false, revealed: false });
    p.choices = shuffle(p.choices);
    return p;
  } finally { rng = Math.random; }
}

/* ---------- session ---------- */
let confirmKid = null;
let screen = 'home', sess = null, lastChanges = [], confirmWipe = false, wiped = false, confirmTopic = null, importMsg = null;
/* Each round mixes four kinds of problems, just like the Chalkboard:
   - spaced review of missed words, due today (up to 30% of the round)
   - the current set of words (most problems)
   - an earlier set now and then (about 1 in 7), to keep old words fresh
   - a brand-new word from the next set (about 1 in 9) once he is doing well */
const REVIEW_DAYS = [1, 3, 7, 14, 30];
const DAY = 864e5;
const startOfDay = () => new Date().setHours(0, 0, 0, 0);
const UNLOCK_ORDER = ['bonjour', 'couleurs', 'nombres', 'animaux', 'famille', 'nourriture', 'corps', 'formes', 'vetements', 'jouets', 'maison', 'nature', 'transports', 'contes', 'emotions', 'actions', 'phrases'];
function readyToStretch(k) {
  const r = (state.rec[k] || []).slice(-6);
  return r.length >= 4 && r.filter(Boolean).length / r.length >= 0.75;
}
function dueCards() {
  const now = Date.now();
  return state.cards.filter(c => c.due <= now && TOPIC[c.topic] && topicReady(c.topic) && (!c.wid || findItem(c.topic, c.wid))).sort((a, b) => a.due - b.due);
}
function onTopics() { return ORDER.filter(k => state.on[k] && topicReady(k)); }
function buildSession() {
  let on = onTopics();
  if (!on.length) on = ['animaux'];
  const n = state.perSession, plan = [];
  for (const c of dueCards().slice(0, Math.ceil(n * 0.3))) plan.push({ k: c.topic, level: c.level, seed: c.box === 0 ? c.seed : newSeed(), kind: 'again', fr: c.wid, card: c.id });
  let rotation = shuffle(on.filter(k => !state.mastered[k] || Math.random() < 0.5));
  if (!rotation.length) rotation = shuffle(on);
  for (let i = 0; plan.length < n; i++) {
    const k = rotation[i % rotation.length], L = Math.min(state.levels[k], maxLevel(k)), max = maxLevel(k), roll = Math.random();
    // word topics pick the easier or newer word themselves; sentence levels step down or up a level
    const ph = TOPIC[k].phrases ? 1 : 0;
    if (roll < 0.15 && L > 1) plan.push({ k, level: L - ph, kind: 'easier' });
    else if (roll > 0.89 && L < max && readyToStretch(k)) plan.push({ k, level: L + ph, kind: 'stretch' });
    else plan.push({ k, level: L, kind: 'current' });
  }
  // Anything met for the first time is taught before it is asked: an intro card now, the question a little later.
  // About MAX_NEW new things per round (a few more only if the round can't be filled otherwise), and nothing asked more than twice.
  const used = new Set(), counts = new Map(), introduced = new Map(), groups = [];
  const isNew = p => p.wid && !isSeen(p.wid) && !introduced.has(p.wid);
  const fits = (p, strict) => (counts.get(p.fr) || 0) < 2 && !(isNew(p) && introduced.size >= (strict ? MAX_NEW : MAX_NEW + 2));
  for (const it of shuffle(plan)) {
    let gate = introduced.size >= MAX_NEW ? new Set(introduced.keys()) : null;
    let p = makeProblem(it.k, it.level, it.seed ?? newSeed(), it.kind, it.fr, used, gate);
    for (let tries = 0; !fits(p, tries < 6) && tries < 10; tries++) {
      if (tries >= 6) gate = null;
      // a topic with nothing met yet can't give a familiar word, so borrow a topic that has one
      const k = gate && tries >= 2 ? [...introduced.values()][tries % introduced.size] : it.k;
      p = makeProblem(k, k === it.k ? it.level : Math.min(state.levels[k], maxLevel(k)), newSeed(), k === it.k ? it.kind : 'current', k === it.k ? it.fr : undefined, used, gate);
    }
    if (p.wid === it.fr) p.card = it.card;
    if (p.wid) used.add(p.wid);
    counts.set(p.fr, (counts.get(p.fr) || 0) + 1);
    if (isNew(p)) introduced.set(p.wid, p.topic);
    groups.push(p);
  }
  groups.forEach(q => { if (introduced.has(q.wid)) q.introKey = q.wid; });
  return { probs: schedule(groups), i: 0, results: [], cleared: 0, learned: [] };
}
const MAX_NEW = 4;
const makeIntro = p => Object.assign({}, p, { mode: 'intro', kind: 'intro', choices: [], done: true, card: undefined });
// Order a round: introduce new things early, ask each one only two or more slots after its intro, and never ask the same thing twice in a row.
function schedule(probs) {
  const out = [], pending = shuffle(probs), introAt = new Map();
  const last = () => out[out.length - 1];
  const ready = q => !q.introKey || (introAt.has(q.introKey) && out.length - introAt.get(q.introKey) >= 2);
  const nextTo = q => last() && last().fr === q.fr && last().mode !== 'intro';
  while (pending.length) {
    const choices = pending.filter(q => ready(q) && !nextTo(q));
    const fresh = pending.find(q => q.introKey && !introAt.has(q.introKey));
    if (fresh && choices.length < 2) { out.push(makeIntro(fresh)); introAt.set(fresh.introKey, out.length - 1); continue; }
    const q = choices[0] || pending.find(ready) || pending[0];
    out.push(pending.splice(pending.indexOf(q), 1)[0]);
  }
  return out;
}
function startSession() { sess = buildSession(); screen = 'play'; render(); autoSay(); }

/* A whole scene, in order. The first time, it's played through as a model (both sides spoken), then he takes his part. */
function historyFor(i, j) {
  const lines = [];
  for (const st of SCENES[i].steps.slice(0, j)) {
    if (st.ask) lines.push({ who: 'you', text: fill(st.ask) }, { who: 'them', text: fill(st.answer) });
    else lines.push({ who: 'them', text: fill(st.them) }, { who: 'you', text: fill(st.you) });
  }
  return lines;
}
function buildScene(i) {
  const L = state.levels.conversations, items = TOPIC.conversations.sets[i];
  const kind = i + 1 === L ? 'current' : i + 1 < L ? 'easier' : 'stretch';
  const pass = intro => items.map((w, j) => {
    let p = makeProblem('conversations', i + 1, newSeed(), kind, w.fr);
    if (intro) p = makeIntro(p);
    p.history = historyFor(i, j);
    return p;
  });
  return { probs: [...(items.some(w => !isSeen(w.fr)) ? pass(true) : []), ...pass(false)], i: 0, results: [], cleared: 0, learned: [], scene: i };
}
function startScene(i) { sess = buildScene(i); screen = 'play'; render(); autoSay(); }

/* Quick check: a placement round. Two words from each main topic, earliest unknown words first, one try each.
   Right on the first try marks the word known; a miss just notes it was checked, with no review card. */
const CHECK_TOPICS = ['bonjour', 'couleurs', 'nombres', 'animaux', 'famille', 'corps', 'nourriture', 'vetements', 'jouets', 'transports'];
function buildCheck() {
  const probs = [];
  for (const k of shuffle(CHECK_TOPICS)) {
    const sets = TOPIC[k].sets;
    const cands = sets.flatMap((set, i) => set.map(w => ({ w, L: i + 1 }))).filter(x => !isKnown(x.w.fr));
    const fresh = cands.filter(x => !rec(x.w.fr)?.c);
    const pool = (fresh.length >= 2 ? fresh : cands).slice(0, SET_SIZE);
    for (const x of shuffle(pool).slice(0, 2)) probs.push(makeProblem(k, Math.max(2, x.L), newSeed(), 'check', x.w.fr));
  }
  return { probs: shuffle(probs), i: 0, results: [], cleared: 0, learned: [], check: true };
}
function startCheck() { sess = buildCheck(); if (!sess.probs.length) return; screen = 'play'; render(); autoSay(); }
function linesFor(p) {
  if (p.mode === 'intro') return p.convo ? (p.ask ? [[p.fr, KID_PITCH], [p.answer, p.pitch]] : [[p.them, p.pitch], [p.fr, KID_PITCH]]) : [[p.fr]];
  if (p.convo) return p.ask ? [['À toi !']] : [[p.them, p.pitch]];
  return [[p.prompt]];
}
function autoSay() { sayAll(linesFor(sess.probs[sess.i])); }
const PRAISE = ['Bravo !', 'Oui !', 'Super !', 'Très bien !', "C'est ça !"];
function gotIt(p) {
  p.done = true;
  p.praise = p.tries === 0 ? pick(PRAISE) : 'Oui, voilà !';
  if (p.convo) sayAll([[p.praise], [p.fr, KID_PITCH]]);
  else say(p.mode === 'say' || p.choices.find(c => c.ok)?.sentence ? p.praise : `${p.praise} ${p.fr} !`);
  record(p, p.tries === 0);
}
function missed(p) {
  p.tries++;
  if (p.tries >= (p.kind === 'check' ? 1 : 2)) { p.done = true; p.revealed = true; record(p, false); return true; }
  save();
  return false;
}
function answer(idx) {
  const p = sess.probs[sess.i];
  if (p.done || p.wrong.includes(idx)) return;
  const c = p.choices[idx];
  if (c.ok) { gotIt(p); render(); return; }
  p.wrong.push(idx);
  p.lastWrong = c;
  const over = missed(p);
  // naming the picture he tapped teaches that word too
  const named = c.sentence ? `Non : ${c.fr}` : `Ça, c'est ${c.fr}.`;
  say(over ? `${named} Voilà : ${p.fr}.` : `${named} Essaie encore !`);
  render(!p.done);
}
// "Dis-le !": he says the word, hears it, then he (or a grown-up) says whether it matched.
function sayCheck(ok) {
  const p = sess.probs[sess.i];
  if (p.done) return;
  // after his question, the character answers it
  const reply = p.ask ? [[p.answer, p.pitch]] : [];
  if (ok) { p.done = true; p.praise = pick(PRAISE); sayAll([[p.praise], ...reply]); record(p, true); }
  else { p.done = true; p.revealed = true; sayAll([[p.fr, p.convo ? KID_PITCH : 1], ...reply]); record(p, false); }
  render();
}
function record(p, first) {
  sess.results.push(first);
  p.result = first;
  if (p.kind === 'check') {
    const w = state.words[p.wid] = state.words[p.wid] || { r: 0, m: 0 };
    w.c = 1;
    if (first) { w.k = 1; sess.learned.push({ fr: p.wid, pic: p.pic, en: p.en }); }
    save();
    return;
  }
  state.total++;
  state.done[p.topic] = (state.done[p.topic] || 0) + 1;
  if (p.wid) {
    const before = isKnown(p.wid), w = state.words[p.wid] = state.words[p.wid] || { r: 0, m: 0 };
    if (first) w.r = Math.min(20, (w.r || 0) + 1); else { w.m = Math.min(20, (w.m || 0) + 1); w.k = 0; }
    w.t = Date.now();
    if (!before && isKnown(p.wid) && !sess.learned.some(x => x.fr === p.fr)) sess.learned.push({ fr: p.fr, pic: p.pic, en: p.en });
  }
  if (p.kind === 'current') state.rec[p.topic] = [...(state.rec[p.topic] || []), first].slice(-10);
  if (p.kind === 'stretch') state.stretch[p.topic] = [...(state.stretch[p.topic] || []), first].slice(-5);
  if (p.kind === 'again') reviewCard(p.card, first);
  else if (!first) addCard(p);
  save();
}
// A missed word comes back tomorrow, then after 3, 7, 14 and 30 days while he keeps getting it right.
function addCard(p) {
  const due = startOfDay() + DAY * REVIEW_DAYS[0];
  const same = state.cards.find(c => c.topic === p.topic && (p.wid ? c.wid === p.wid : c.level === p.level));
  if (same) { Object.assign(same, { box: 0, seed: p.seed, due, misses: same.misses + 1 }); return; }
  state.cards.push({ id: newSeed().toString(36), topic: p.topic, level: p.level, wid: p.wid, seed: p.seed, box: 0, due, misses: 1, added: Date.now() });
  if (state.cards.length > 80) state.cards.sort((a, b) => a.added - b.added).shift();
}
function reviewCard(id, first) {
  const c = state.cards.find(x => x.id === id);
  if (!c) return;
  if (!first) { Object.assign(c, { box: 0, due: startOfDay() + DAY, misses: c.misses + 1 }); return; }
  c.box++;
  if (c.box >= REVIEW_DAYS.length) { state.cards = state.cards.filter(x => x !== c); state.cleared = (state.cleared || 0) + 1; sess.cleared++; return; }
  c.due = startOfDay() + DAY * REVIEW_DAYS[c.box];
}
function next() {
  const cur = sess.probs[sess.i];
  if (cur.mode === 'intro') { state.words[cur.wid] = state.words[cur.wid] || { r: 0, m: 0 }; save(); }
  if (sess.i < sess.probs.length - 1) { sess.i++; render(); autoSay(); return; }
  const used = [...new Set(sess.probs.map(p => p.topic))];
  if (sess.check) { levelFromKnown(); lastChanges = []; save(); screen = 'done'; render(); say(`Bravo${childName() ? ', ' + childName() : ''} !`); return; }
  lastChanges = adjustLevels(used);
  state.sessions.unshift({ d: new Date().toISOString(), score: sess.results.filter(Boolean).length, n: sess.results.length, skills: used, learned: sess.learned.length });
  state.sessions = state.sessions.slice(0, 40);
  save();
  screen = 'done'; render();
  say(`${document.querySelector('h1')?.textContent || ''}`);
}
// Up: 5 in a row, 7 of the last 8, or 3 new words in a row, all right on the first try; or every word in the set known.
// Down: 4 misses in the last 6. Finishing the top level masters the topic and turns on the next one.
function adjustLevels(used) {
  const changes = [];
  for (const k of used) {
    const r = state.rec[k] || [], st = state.stretch[k] || [], max = maxLevel(k), L = state.levels[k];
    const last8 = r.slice(-8), last6 = r.slice(-6), last5 = r.slice(-5);
    const setKnown = !TOPIC[k].phrases && r.length >= 3 && (TOPIC[k].sets[L - 1] || []).every(w => isKnown(w.fr));
    const up = setKnown || (last8.length >= 8 && last8.filter(Boolean).length >= 7) || (last5.length === 5 && last5.every(Boolean)) || (st.length >= 3 && st.slice(-3).every(Boolean));
    if (up && L < max) { state.levels[k]++; state.rec[k] = []; state.stretch[k] = []; changes.push([k, 'up']); }
    else if (up && !state.mastered[k] && !TOPIC[k].seasonal && !TOPIC[k].custom) {
      state.mastered[k] = Date.now(); changes.push([k, 'mastered']);
      const nk = UNLOCK_ORDER.find(x => !state.on[x] && !state.mastered[x]);
      if (nk) { state.on[nk] = true; changes.push([nk, 'unlocked']); }
    }
    else if (last6.length >= 6 && last6.filter(Boolean).length <= 2 && L > 1) { state.levels[k]--; state.rec[k] = []; state.stretch[k] = []; changes.push([k, 'down']); }
  }
  for (const [k, dir] of changes) state.log.unshift({ d: new Date().toISOString(), k, dir, to: state.levels[k] });
  state.log = state.log.slice(0, 30);
  return changes;
}

/* ---------- bringing in what he already knows (from Studycat or anywhere) ---------- */
// Each topic's level moves past every set he already knows completely, and topics with known words turn on.
function levelFromKnown() {
  for (const t of wordTopics()) {
    if (t.seasonal) continue;
    let full = 0;
    while (full < t.sets.length && t.sets[full].length && t.sets[full].every(w => isKnown(w.fr))) full++;
    if (full) state.levels[t.id] = Math.max(state.levels[t.id], Math.min(full + 1, t.sets.length));
    if (allItems(t.id).some(w => isKnown(w.fr))) state.on[t.id] = true;
  }
}
function markKnown(fr, on) {
  const w = state.words[fr] = state.words[fr] || { r: 0, m: 0 };
  if (on) w.k = 1; else { w.k = 0; w.r = Math.min(w.r || 0, (w.m || 0) + 1); }
}
function importWords(text) {
  const index = new Map(), topicNames = new Map();
  const add = (key, fr) => { if (!key) return; if (!index.has(key)) index.set(key, new Set()); index.get(key).add(fr); };
  for (const t of wordTopics()) {
    topicNames.set(bare(t.fr), t.id); topicNames.set(bare(t.en), t.id);
    for (const w of allItems(t.id)) { add(bare(w.fr), w.fr); add(bare(w.en), w.fr); }
  }
  const matched = new Set(), unmatched = [], topics = new Set();
  for (const raw of text.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean)) {
    const span = raw.match(/^(\d+)\s*(?:-|–|to|à)\s*(\d+)$/);
    if (span) { for (let n = +span[1]; n <= Math.min(100, +span[2]); n++) matched.add(numFr(n)); continue; }
    const hit = index.get(bare(raw));
    if (hit) hit.forEach(fr => matched.add(fr));
    else if (topicNames.has(bare(raw))) topics.add(topicNames.get(bare(raw)));
    else unmatched.push(raw);
  }
  matched.forEach(fr => markKnown(fr, true));
  levelFromKnown();
  return { matched: matched.size, unmatched, topics: [...topics] };
}

/* ---------- rendering ---------- */
const KIND_LABEL = { intro: ' · <b class="tag stretch">Nouveau</b>', check: ' · <b class="tag easier">Quick check</b>', again: ' · <b class="tag again">Encore une fois</b>', easier: ' · <b class="tag easier">Révision</b>', stretch: ' · <b class="tag stretch">★ Nouveau</b>' };
const app = document.getElementById('app');
const speakerIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19.5 5.5a9 9 0 0 1 0 13"/></svg>';
function tallySvg(filled) {
  const xs = [8, 16, 24, 32];
  const lines = xs.map((x, i) => `<line x1="${x}" y1="5" x2="${x}" y2="35" class="${i < filled ? '' : 'empty'}"/>`).join('');
  return `<svg viewBox="0 0 46 40" aria-hidden="true">${lines}<line x1="2" y1="31" x2="40" y2="9" class="slash ${filled >= 5 ? '' : 'empty'}"/></svg>`;
}
function starSvg(on) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="${on ? 'var(--yellow)' : 'none'}" stroke="${on ? 'var(--yellow)' : 'var(--chalk-dim)'}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}
function fmtDate(iso) { try { return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); } catch (e) { return ''; } }
function nameForm(label, button) {
  return `<form class="name-form" id="name-form">
    <label for="child-name">${label}</label>
    <div class="row-btns"><input id="child-name" class="pick name-input" maxlength="24" placeholder="First name" autocomplete="off" value="${esc(childName())}"><button class="ghost" type="submit">${button}</button></div>
  </form>`;
}
function levelPct(k) {
  if (state.mastered[k]) return 1;
  const r = state.rec[k] || [];
  let streak = 0;
  for (let i = r.length - 1; i >= 0 && r[i]; i--) streak++;
  const set = TOPIC[k].sets?.[state.levels[k] - 1] || [];
  const knownShare = set.length ? set.filter(w => isKnown(w.fr)).length / set.length : 0;
  return Math.min(0.95, Math.max(streak / 5, r.slice(-8).filter(Boolean).length / 7, knownShare));
}
function levelBar(k) {
  const max = maxLevel(k), L = Math.min(state.levels[k], max), pct = levelPct(k);
  const segs = Array.from({ length: max }, (_, i) => {
    const fill = state.mastered[k] || i < L - 1 ? 1 : i === L - 1 ? pct : 0;
    return `<span class="seg-bar"><i style="width:${Math.round(fill * 100)}%"></i></span>`;
  }).join('');
  return `<span class="lvlbar ${state.mastered[k] ? 'done' : ''}" role="img" aria-label="Level ${L} of ${max}${state.mastered[k] ? ', mastered' : ''}">${segs}</span>`;
}
const topicName = k => k === 'saison' ? season().name : TOPIC[k].fr;

function renderHome() {
  const known = knownCount(), shown = Math.min(known, 100);
  let tally = '';
  for (let g = 0; g < Math.max(1, Math.ceil(shown / 5)); g++) tally += tallySvg(Math.max(0, Math.min(5, shown - g * 5)));
  const today = new Date().toDateString();
  const todayCount = state.sessions.filter(s => new Date(s.d).toDateString() === today).reduce((t, s) => t + s.n, 0);
  const noVoice = canSpeak && !voices.length;
  return `
  <header class="top"><h1>${esc(greet('Bonjour'))}</h1><button class="link" data-act="parent">For grown-ups</button></header>
  ${Object.keys(family.kids).length > 1 ? `<div class="kids" role="group" aria-label="Qui joue ?">${Object.entries(family.kids).map(([id, k]) => `<button class="kid" data-act="kid" data-id="${id}" aria-pressed="${id === activeId}"><span class="emo">${k.me || '🧒'}</span>${esc(k.childName || '?')}</button>`).join('')}</div>` : ''}
  ${childName() ? '' : nameForm("Who's learning French?", 'Start')}
  ${noVoice ? '<p class="note danger-text">No French voice found on this device yet. See the grown-ups page.</p>' : ''}
  <section>
    <div class="goal-head"><h2>Les mots que je connais</h2><span class="count">${known}</span></div>
    <div class="tally" role="img" aria-label="${known} French words known">${tally}</div>
  </section>
  <section>
    <h2>On discute !</h2>
    <p class="note">Play a whole conversation. ${esc(childName() || 'Your child')} answers the character, and sometimes asks the questions.</p>
    <div class="scenes">${SCENES.slice(0, Math.min(SCENES.length, state.levels.conversations + 1)).map((sc, i) => `<button class="scene-btn" data-act="scene" data-i="${i}"><span class="emo">${sceneWho(sc)}</span>${esc(fill(sc.title))}${i + 1 > state.levels.conversations ? ' <small>★ nouveau</small>' : ''}</button>`).join('')}</div>
  </section>
  <section>
    <h2>On apprend quoi ?</h2>
    ${GROUPS.map(g => {
      const keys = g.keys.filter(k => k !== 'mesmots' || allItems(k).length);
      return `<div class="group"><h3>${g.title} <small>${g.note}</small></h3>
      <div class="chips">${keys.map(k => `<button class="chip" data-act="chip" data-k="${k}" aria-pressed="${!!state.on[k]}"><strong>${esc(topicName(k))}</strong><small>${esc(TOPIC[k].en)} · level ${Math.min(state.levels[k], maxLevel(k))}</small>${levelBar(k)}</button>`).join('')}</div></div>`;
    }).join('')}
  </section>
  ${!state.total && !knownCount() ? `<p class="note">First time? A grown-up can start with a <button class="link inline-link" data-act="check">quick check</button> to find the words ${esc(childName() || 'your child')} already knows.</p>` : ''}
  <button class="start" data-act="start">On y va ! <small>${state.perSession} questions</small></button>
  <p class="meta">${todayCount ? `${todayCount} questions so far today. ` : ''}${state.total} questions answered since the start.</p>`;
}

function bubble(side, avatar, text, pitch, past) {
  return `<div class="bubble ${side}${past ? ' past' : ''}"><span class="av">${avatar}</span><button class="text" data-act="line" data-t="${esc(text)}" data-p="${pitch}">${esc(text)}</button></div>`;
}
function convoBody(p) {
  const them = (t, past) => bubble('them', p.who, t, p.pitch, past), you = (t, past) => bubble('you', me(), t, KID_PITCH, past);
  const hist = (p.history || []).map(b => b.who === 'them' ? them(b.text, true) : you(b.text, true)).join('');
  const intent = `<span class="intent">${picHtml(p.pic)}</span>`;
  let cur;
  if (p.mode === 'intro') cur = p.ask ? `<div class="intro-pic">${intent}</div>${you(p.fr)}${them(p.answer)}` : `${them(p.them)}<div class="intro-pic">${intent}</div>${you(p.fr)}`;
  else if (p.ask) cur = `<div class="bubble you hint"><span class="av">${me()}</span><div class="text"><strong>À toi !</strong> ${intent}<small>${esc(fill(p.hint))}</small></div></div>${p.done ? you(p.fr) + them(p.answer) : ''}`;
  else cur = them(p.them) + (p.done ? you(p.fr) : '');
  return `<div class="convo">${hist}${cur}</div>`;
}
function renderPlay() {
  const p = sess.probs[sess.i];
  const ticks = sess.probs.map((q, j) => `<span class="${q.mode === 'intro' ? (j <= sess.i ? 'intro' : 'intro-later') : q.result === true ? 'done' : q.result === false ? 'miss' : j === sess.i ? 'now' : ''}"></span>`).join('');
  const word = `<span class="word">${esc(p.fr)}</span><span class="how">${esc(p.en)}</span>`;
  let fb = '';
  if (p.mode === 'intro') fb = '';
  else if (p.done && !p.revealed) fb = `<span class="big good">${esc(p.praise)}</span>${word}`;
  else if (p.revealed && p.mode === 'jacques') fb = `<span class="big try">${p.said ? 'Jacques a dit !' : "Jacques n'a rien dit !"}</span>${word}`;
  else if (p.revealed) fb = `<span class="big try">${p.mode === 'say' ? 'Pas encore. Écoute bien :' : 'Voilà :'}</span>${word}`;
  else if (p.tries && p.lastWrong) fb = `<span class="big try">${p.lastWrong.sentence ? 'Non : ' : "Ça, c'est "}${esc(p.lastWrong.fr)}${p.lastWrong.sentence ? '' : '.'}</span><span class="how">${esc(p.lastWrong.en)} · Essaie encore !</span>`;
  const last = sess.i === sess.probs.length - 1;
  let body, controls;
  if (p.mode === 'jacques') {
    body = `<div class="jacques"><span class="emo">🗣️</span><div class="prompt">${esc(p.prompt)}</div></div>`;
    controls = p.done ? `<div class="bigpic">${picHtml(p.pic)}</div>` : `<div class="row-btns center"><button class="start" data-act="jq" data-v="1">✓ Je l'ai fait !</button><button class="ghost" data-act="jq" data-v="0">✋ Je n'ai pas bougé</button></div><p class="note center">Do it only if Jacques says so!</p>`;
  } else if (p.mode === 'intro') {
    body = p.convo ? `<div class="prompt"><span class="tag stretch">Écoute !</span></div>${convoBody(p)}`
      : `<div class="prompt"><span class="tag stretch">Nouveau mot !</span></div><button class="intro-btn" data-act="intro-again" aria-label="Hear it again">${picHtml(p.pic)}</button><div class="feedback">${word}</div>`;
    controls = `<p class="note center">${p.convo ? 'Listen to both sides. Tap a bubble to hear it again, and say it together.' : 'Tap the picture to hear it again, and say it together.'}</p>`;
  } else if (p.mode === 'say') {
    body = p.convo ? `${convoBody(p)}${p.ask ? '' : '<div class="prompt"><span class="dim">Réponds ! Dis-le !</span></div>'}`
      : `<div class="bigpic">${picHtml(p.pic)}</div><div class="prompt">${esc(p.prompt)} <span class="dim">Dis-le !</span></div>`;
    controls = p.done ? '' : !p.heard
      ? `<div class="row-btns center"><button class="start" data-act="hear">${speakerIcon} Écoute</button></div><p class="note center">Say it out loud first, then listen.</p>`
      : `<div class="row-btns center"><button class="start" data-act="said-yes">✓ Je l'ai dit !</button><button class="ghost" data-act="said-no">Pas encore</button></div>
         <div class="feedback">${word}</div>`;
  } else {
    const correctIdx = p.choices.findIndex(c => c.ok);
    body = p.convo ? convoBody(p) : `<div class="prompt">${p.lead ? `<span class="dim">${esc(p.lead)}</span> ` : ''}${esc(p.prompt)}</div>`;
    controls = `<div class="choices pics ${p.choices.length > 4 ? 'many-choices' : ''}">${p.choices.map((c, j) => {
      const cls = p.wrong.includes(j) ? 'no' : (p.done && j === correctIdx ? 'ok' : '');
      return `<button class="choice pic ${cls}" data-act="pick" data-i="${j}" ${p.done || p.wrong.includes(j) ? 'disabled' : ''} aria-label="Picture ${j + 1}"><span class="key">${j + 1}</span>${c.html}</button>`;
    }).join('')}</div>`;
  }
  return `
  <div class="play-top">
    <div class="ticks" aria-label="Question ${sess.i + 1} of ${sess.probs.length}">${ticks}</div>
    <span class="skill-label">${esc(topicName(p.topic))} · level ${p.level}${KIND_LABEL[p.kind] || ''}</span>
    ${canSpeak ? `<span class="row-btns"><button class="say" data-act="say" aria-label="Say it again">${speakerIcon}</button><button class="say slow" data-act="slow" aria-label="Say it slowly">🐢</button></span>` : ''}
  </div>
  <div class="problem" id="problem">${body}</div>
  ${controls}
  ${p.mode === 'say' && !p.done ? '' : `<div class="feedback">${fb}</div>`}
  ${p.done ? `<div class="next-row"><button class="start" data-act="next" id="next">${last ? 'Mes étoiles' : 'Suivant'}</button></div>` : ''}
  <button class="link" data-act="home" style="align-self:flex-start">Stop and go home</button>`;
}

function handsOn() {
  const counts = {};
  sess.probs.forEach(p => { counts[p.topic] = (counts[p.topic] || 0) + 1; });
  const idea = k => k === 'saison' ? season().hands : (HANDS[k] || '').replace('{name}', N());
  const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).filter(idea).slice(0, 2);
  if (!top.length) return '';
  return `<section class="hands"><h2>Loin de l'écran</h2><p class="note">Off the screen, something to try today:</p><ul>${top.map(k => `<li><strong>${esc(topicName(k))}:</strong> ${esc(idea(k))}</li>`).join('')}</ul></section>`;
}

function roundNews() {
  const mastered = lastChanges.filter(c => c[1] === 'mastered'), unlocked = lastChanges.filter(c => c[1] === 'unlocked');
  const again = sess.probs.filter(p => p.kind === 'again'), againRight = again.filter(p => sess.results[sess.probs.indexOf(p)]).length;
  const lines = [];
  if (unlocked.length) lines.push(...unlocked.map(([k]) => `<li class="big-news">Nouveau ! <strong>${esc(topicName(k))}</strong> (${esc(TOPIC[k].en)}) is turned on.</li>`));
  if (mastered.length) lines.push(...mastered.map(([k]) => `<li>${esc(topicName(k))}: every set learned. It will still come back now and then.</li>`));
  if (again.length) lines.push(`<li>Words from earlier days: ${againRight} of ${again.length} right${sess.cleared ? `, and ${sess.cleared} ${sess.cleared === 1 ? 'is' : 'are'} learned for good` : ''}.</li>`);
  const learned = sess.learned.length ? `<section><h2>Nouveaux mots</h2><div class="learned">${sess.learned.map(w => `<button class="learned-word" data-act="speak" data-t="${esc(w.fr)}">${picHtml(w.pic)}<span>${esc(w.fr)}</span></button>`).join('')}</div></section>` : '';
  return learned + (lines.length ? `<section><h2>Cette fois</h2><ul class="ups">${lines.join('')}</ul></section>` : '');
}

let lastCheer = '';
function pickCheer(tier) {
  const pool = CHEERS[tier];
  let c;
  do { c = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && c[0] + c[1] === lastCheer);
  lastCheer = c[0] + c[1];
  return { tier, head: c[0], line: c[1] };
}
function renderCheckDone() {
  const known = sess.learned, missed = sess.probs.filter((p, i) => !sess.results[i]);
  const chips = (list, on) => `<div class="wordchips">${list.map(w => `<button class="wchip" data-act="speak" data-t="${esc(w.fr)}" aria-pressed="${on}"><span class="wpic">${picHtml(w.pic)}</span>${esc(w.fr)} <small>${esc(w.en)}</small></button>`).join('')}</div>`;
  return `
  <div class="done-text">
    <h1>${esc(greet('Bravo'))}</h1>
    <p class="cheer">Quick check done: ${known.length} of ${sess.results.length} words known.</p>
    <div class="stars">${sess.results.map(starSvg).join('')}</div>
  </div>
  ${known.length ? `<section><h2>Already knows</h2>${chips(known, true)}<p class="note">These are marked known. They skip ahead and come back as “Dis-le !” speaking practice.</p></section>` : ''}
  ${missed.length ? `<section><h2>Not yet</h2>${chips(missed, false)}<p class="note">No harm done: these will be taught in normal rounds. Tap any word to hear it.</p></section>` : ''}
  <p class="note">Each check asks different words, so another one or two builds a fuller picture. Levels update on their own.</p>
  <div class="row-btns"><button class="start" data-act="check">Check more words</button><button class="ghost" data-act="home">Home</button></div>`;
}
function renderDone() {
  if (sess.check) return renderCheckDone();
  const score = sess.results.filter(Boolean).length, n = sess.results.length;
  const pct = n ? score / n : 0, tier = pct >= 0.9 ? 0 : pct >= 0.7 ? 1 : pct >= 0.4 ? 2 : 3;
  if (!sess.cheer || sess.cheer.tier !== tier) sess.cheer = pickCheer(tier);
  const ups = lastChanges.filter(c => c[1] === 'up');
  return `
  <div class="done-text">
    <h1>${esc(greet(sess.cheer.head))}</h1>
    <p class="cheer">${esc(sess.cheer.line)}</p>
    <p class="meta">${score} of ${n} right on the first try.</p>
    <div class="stars">${sess.results.map(starSvg).join('')}</div>
  </div>
  ${roundNews()}
  ${ups.length ? `<section><h2>Niveau suivant</h2><ul class="ups">${ups.map(([k]) => `<li>${esc(topicName(k))}: now level ${state.levels[k]}, ${esc(levelsOf(k)[state.levels[k] - 1])}</li>`).join('')}</ul></section>` : ''}
  ${handsOn()}
  <div class="row-btns">${sess.scene != null ? `<button class="start" data-act="scene" data-i="${sess.scene}">Rejouer la scène</button><button class="ghost" data-act="start">Une partie</button>` : '<button class="start" data-act="start">Encore !</button>'}<button class="ghost" data-act="home">Accueil</button></div>`;
}

function renderParent() {
  const lv = ORDER.filter(k => k !== 'mesmots' || allItems(k).length).map(k => {
    const max = maxLevel(k), L = Math.min(state.levels[k], max), r = state.rec[k] || [];
    return `<div class="lvl"><div><strong>${esc(topicName(k))}</strong> <small class="inline">${esc(TOPIC[k].en)}</small><small>${state.mastered[k] ? '<b class="tag stretch">Mastered</b> ' : ''}${esc(levelsOf(k)[L - 1] || '')}${r.length ? ` · ${r.filter(Boolean).length} of last ${r.length} right first try` : ''}</small>
      ${confirmTopic === k ? `<span class="row-btns topic-reset"><button class="link danger-text" data-act="topic-reset-yes" data-k="${k}">Yes, reset ${esc(TOPIC[k].en)}</button><button class="link" data-act="topic-reset-no">Cancel</button></span>` : `<button class="link small-link" data-act="topic-reset" data-k="${k}">Reset</button>`}</div>
      <div class="stepper"><button data-act="lvl" data-k="${k}" data-d="-1" aria-label="Lower ${esc(TOPIC[k].en)} level" ${L <= 1 ? 'disabled' : ''}>−</button><span>${L}/${max}</span><button data-act="lvl" data-k="${k}" data-d="1" aria-label="Raise ${esc(TOPIC[k].en)} level" ${L >= max ? 'disabled' : ''}>+</button></div></div>`;
  }).join('');
  const voiceNote = !canSpeak ? '<p class="note danger-text">This browser cannot speak. Try Safari on an iPad or iPhone.</p>'
    : `<div class="row-btns"><label for="voice">French voice</label>
      <select id="voice" class="pick">${['', ...voices.map(v => v.name)].map(nm => `<option value="${esc(nm)}" ${nm === savedVoiceName() ? 'selected' : ''}>${nm ? esc(nm + ' (' + (voices.find(v => v.name === nm)?.lang || '') + ')') : `Automatic${chosenVoice() ? ` (${esc(chosenVoice().name)})` : ''}`}</option>`).join('')}</select>
      <button class="ghost" data-act="try-voice">Try it</button></div>
    <p class="note">${voices.length ? '' : '<strong class="danger-text">No French voice is installed on this device yet.</strong> '}On an iPad or iPhone: Settings → Accessibility → Spoken Content → Voices → French. Download an “Enhanced” or “Premium” voice (Thomas, Audrey and Aurélie speak French from France; Amélie is from Québec), then pick it here. The choice is remembered on each device.</p>`;
  return `
  <header class="top"><h1>For grown-ups${Object.keys(family.kids).length > 1 && childName() ? ` · ${esc(childName())}` : ''}</h1><button class="ghost" data-act="home">${childName() ? `Back to ${esc(childName())}` : 'Back'}</button></header>
  ${renderKids()}
  <section>
    <h2>What ${esc(childName() || 'your child')} already knows</h2>
    <p class="note">Paste or type words from Studycat (or anywhere), separated by commas or new lines. French or English both work, with or without “le/la”. Number ranges like “1-10” work too. Known words skip ahead in their topic and come back as “Dis-le !” speaking practice.</p>
    <textarea id="import-text" class="pick import-box" rows="4" placeholder="chat, chien, rouge, bleu, 1-10, bonjour, apple, banana…"></textarea>
    <div class="row-btns"><button class="ghost" data-act="import">Mark these as known</button></div>
    ${importMsg ? `<p class="note">${importMsg}</p>` : ''}
    <p class="note"><strong>Or let the app find out:</strong> a quick check asks 20 words across the main topics, one try each, no hints. Every word answered right is marked known.</p>
    <div class="row-btns"><button class="ghost" data-act="check">Start a quick check</button></div>
    ${renderKnownLists()}
  </section>
  <section>
    <h2>Levels</h2>
    <p class="note">Each level adds a set of about 6 words. A topic moves up when every word in the set is known, or after 5 in a row or 7 of the last 8 right on the first try. It moves back down after 4 misses in 6. Finishing every set turns on the next topic.</p>
    <div class="levels">${lv}</div>
  </section>
  ${renderCustom()}
  <section>
    <h2>Settings</h2>
    ${nameForm("Child's name", 'Save')}
    <div class="row-btns"><span>Picture</span><div class="seg">${['👦', '👧', '🧒'].map(e => `<button data-act="me" data-v="${e}" aria-pressed="${me() === e}">${e}</button>`).join('')}</div></div>
    <form class="name-form" id="family-form">
      <label for="f-sib">Brother or sister to play with (for “On joue ?”)</label>
      <input id="f-sib" class="pick name-input" maxlength="24" placeholder="Name" autocomplete="off" value="${esc(state.playmate || '')}">
      <label for="f-big">Older brother or sister at home</label>
      <input id="f-big" class="pick name-input" maxlength="24" placeholder="Name" autocomplete="off" value="${esc(state.big || '')}">
      <label for="f-far">Older brother or sister who lives away (for the video call)</label>
      <input id="f-far" class="pick name-input" maxlength="24" placeholder="Name" autocomplete="off" value="${esc(state.far || '')}">
      <div class="row-btns"><button class="ghost" type="submit">Save names</button></div>
      <p class="note">Left empty, the scenes use made-up children.</p>
    </form>
    <div class="row-btns"><span>Age, for “J'ai ${esc(numFr(childAge()))} ans”</span><div class="stepper"><button data-act="age" data-d="-1" aria-label="Younger">−</button><span>${childAge()}</span><button data-act="age" data-d="1" aria-label="Older">+</button></div></div>
    <div class="row-btns"><span>Questions per round</span><div class="seg">${[5, 10, 15].map(n => `<button data-act="per" data-n="${n}" aria-pressed="${state.perSession === n}">${n}</button>`).join('')}</div></div>
    <div class="row-btns"><span>“Dis-le !” speaking turns</span><div class="seg"><button data-act="sayit" data-v="1" aria-pressed="${state.sayIt}">On</button><button data-act="sayit" data-v="0" aria-pressed="${!state.sayIt}">Off</button></div></div>
    <p class="note">For words already known, about 2 in 5 questions show a picture to name out loud. ${esc(childName() || 'Your child')} says it, taps to hear it, then taps whether it matched. You are the best judge of the accent!</p>
    <div class="row-btns"><span>Speaking speed</span><div class="seg"><button data-act="speed" data-v="normal" aria-pressed="${state.speed !== 'slow'}">Normal</button><button data-act="speed" data-v="slow" aria-pressed="${state.speed === 'slow'}">Slower</button></div><span class="note">The 🐢 button always says it very slowly.</span></div>
    ${voiceNote}
  </section>
  ${renderReview()}
  <section>
    <h2>Word sheet</h2>
    <p class="note">Print a page of pictures with their French words in outline letters, for coloring and tracing. Uses the topics turned on at home.</p>
    <div class="row-btns"><button class="ghost" data-act="print">Print a word sheet</button></div>
  </section>
  <section>
    <h2>Tricky words</h2>
    ${renderTricky()}
  </section>
  <section>
    <h2>Recent rounds</h2>
    ${state.sessions.length ? `<ul class="list">${state.sessions.slice(0, 8).map(s => `<li><span>${fmtDate(s.d)} · ${s.skills.map(k => TOPIC[k] ? TOPIC[k].en : k).join(', ')}${s.learned ? ` · ${s.learned} new` : ''}</span><span>${s.score}/${s.n}</span></li>`).join('')}</ul>` : '<p class="note">No rounds yet.</p>'}
    ${state.log.length ? `<p class="note">Level changes: ${state.log.slice(0, 5).map(l => `${TOPIC[l.k] ? TOPIC[l.k].en : l.k} ${{ up: '↑', down: '↓', mastered: '✓', unlocked: 'unlocked' }[l.dir] || ''}${l.dir === 'up' || l.dir === 'down' ? ' ' + l.to : ''} (${fmtDate(l.d)})`).join(' · ')}</p>` : ''}
  </section>
  <section>
    <h2>Start over</h2>
    <p class="note">Clears levels, known words, the review list and recent rounds. Keeps the name, settings, your own words and sync. ${syncAvailable && sync.code ? 'Synced devices will start over too.' : ''}</p>
    <div class="row-btns">
      ${confirmWipe ? `<button class="ghost danger" data-act="wipe-yes">Yes, erase all progress</button><button class="link" data-act="wipe-no">Cancel</button>` : `<button class="ghost danger" data-act="wipe">Reset all progress</button>`}
    </div>
    ${wiped ? '<p class="note">Progress cleared. Everything starts fresh.</p>' : ''}
  </section>
  ${renderSync()}`;
}

function renderKids() {
  const kids = Object.entries(family.kids);
  return `<section>
    <h2>Children</h2>
    <p class="note">Each child has their own levels, words and settings. Pick who's playing on the home screen.</p>
    <ul class="list">${kids.map(([id, k]) => `<li><span>${k.me || '🧒'} ${esc(k.childName || 'No name yet')}${id === activeId ? ' · <strong>playing now</strong>' : ''}</span><span>${id === activeId ? '' : `<button class="link small-link" data-act="kid" data-id="${id}">Switch</button> `}${kids.length > 1 ? (confirmKid === id ? `<button class="link small-link danger-text" data-act="kid-del-yes" data-id="${id}">Yes, remove</button> <button class="link small-link" data-act="kid-del-no">Cancel</button>` : `<button class="link small-link" data-act="kid-del" data-id="${id}">Remove</button>`) : ''}</span></li>`).join('')}</ul>
    <form class="custom-form" id="kid-form">
      <input id="k-name" class="pick" maxlength="24" placeholder="Name" autocomplete="off" aria-label="Child's name" required>
      <input id="k-age" class="pick emoji-input" type="number" min="2" max="15" value="3" aria-label="Age" required>
      <button class="ghost" type="submit">Add a child</button>
    </form>
  </section>`;
}

// One fold per topic with every word as a chip: tap to hear it and to mark it known or not.
function renderKnownLists() {
  return `<div class="known-lists">${wordTopics().filter(t => allItems(t.id).length).map(t => {
    const items = allItems(t.id), known = items.filter(w => isKnown(w.fr)).length;
    return `<details><summary><strong>${esc(topicName(t.id))}</strong> <span class="note">${esc(t.en)} · ${known} of ${items.length} known</span></summary>
      <div class="wordchips">${items.map(w => `<button class="wchip" data-act="known" data-fr="${esc(w.fr)}" aria-pressed="${isKnown(w.fr)}">${t.numbers ? '' : `<span class="wpic">${picHtml(w.pic)}</span>`}${esc(w.fr)}</button>`).join('')}</div>
      <div class="row-btns"><button class="link small-link" data-act="known-all" data-k="${t.id}">Mark all known</button><button class="link small-link" data-act="known-none" data-k="${t.id}">Clear</button></div>
    </details>`;
  }).join('')}</div>`;
}

function renderCustom() {
  const list = state.custom || [];
  return `<section>
    <h2>Mes mots: your own words</h2>
    <p class="note">Add words you use at home. Write the article (“le chat”, “la tartine”) and pick an emoji for the picture. They get their own topic once there are some.</p>
    <form class="custom-form" id="custom-form">
      <input id="c-fr" class="pick" maxlength="40" placeholder="la tartine" autocomplete="off" aria-label="French word" required>
      <input id="c-en" class="pick" maxlength="40" placeholder="toast" autocomplete="off" aria-label="English meaning" required>
      <input id="c-pic" class="pick emoji-input" maxlength="12" placeholder="🍞" autocomplete="off" aria-label="Emoji picture" required>
      <button class="ghost" type="submit">Add</button>
    </form>
    ${list.length ? `<div class="wordchips">${list.map((w, i) => `<span class="wchip"><span class="wpic">${picHtml(w.pic)}</span>${esc(w.fr)} <small>${esc(w.en)}</small><button class="link small-link" data-act="custom-del" data-i="${i}" aria-label="Remove ${esc(w.fr)}">✕</button></span>`).join('')}</div>` : ''}
  </section>`;
}

function renderTricky() {
  const items = new Map();
  for (const t of wordTopics()) for (const w of allItems(t.id)) items.set(w.fr, w);
  const tricky = Object.entries(state.words).filter(([fr, w]) => (w.m || 0) > 0 && items.has(fr)).sort((a, b) => (b[1].m - b[1].r) - (a[1].m - a[1].r)).slice(0, 10);
  if (!tricky.length) return '<p class="note">Words missed more than once will show up here, so you can use them at home.</p>';
  return `<div class="wordchips">${tricky.map(([fr, w]) => `<button class="wchip" data-act="speak" data-t="${esc(fr)}"><span class="wpic">${picHtml(items.get(fr).pic)}</span>${esc(fr)} <small>${esc(items.get(fr).en)} · missed ${w.m}×</small></button>`).join('')}</div>`;
}

function renderReview() {
  const cards = state.cards.slice().sort((a, b) => a.due - b.due);
  const when = d => { const days = Math.round((d - startOfDay()) / DAY); return days <= 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`; };
  return `<section>
    <h2>Coming back for review</h2>
    <p class="note">A missed word comes back tomorrow, then after 3, 7, 14 and 30 days while it keeps getting answered right. ${state.cleared ? `${state.cleared} learned for good so far.` : ''}</p>
    ${cards.length ? `<ul class="list">${cards.slice(0, 12).map(c => `<li><span>${esc(c.wid ? fill(c.wid) : (TOPIC[c.topic] ? `${TOPIC[c.topic].fr}: ${levelsOf(c.topic)[c.level - 1] || ''}` : c.topic))}</span><span>${when(c.due)} · step ${c.box + 1} of ${REVIEW_DAYS.length}</span></li>`).join('')}</ul>${cards.length > 12 ? `<p class="note">and ${cards.length - 12} more</p>` : ''}` : '<p class="note">Nothing to review yet.</p>'}
  </section>`;
}

function renderSync() {
  if (!syncAvailable) return '<p class="note">Progress is saved on this device.</p>';
  if (!sync.code) return `
  <section>
    <h2>Sync between devices</h2>
    <p class="note">Progress is saved on this device. Turn on sync to share it with another iPad, phone or laptop. You get a private code to type in on the other device. (This is separate from the Chalkboard's code.)</p>
    <div class="row-btns"><button class="ghost" data-act="sync-new">Turn on sync</button></div>
    <div class="row-btns">
      <label for="join-code">Already have a code?</label>
      <input id="join-code" class="pick code-input" placeholder="ABCD-EFGH-JKMN" autocomplete="off" autocapitalize="characters" spellcheck="false">
      <button class="ghost" data-act="sync-join">Join</button>
    </div>
    ${sync.error === 'bad-code' ? '<p class="note danger-text">That code should be 12 letters and numbers, like ABCD-EFGH-JKMN.</p>' : ''}
  </section>`;
  const when = sync.lastAt ? new Date(sync.lastAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';
  const status = sync.status === 'ok' ? `Synced${when ? ' at ' + when : ''}.`
    : sync.status === 'syncing' ? 'Syncing…'
    : sync.error === 'offline' ? 'Offline. Progress is safe on this device and will sync when you are back online.'
    : `Could not sync (${esc(sync.error)}). Progress is safe on this device.`;
  return `
  <section>
    <h2>Sync between devices</h2>
    <p class="note">Type this code into the grown-ups page on another device to share progress. Keep it private.</p>
    <div class="row-btns"><strong class="sync-code" id="sync-code">${esc(sync.code)}</strong><button class="ghost" data-act="sync-copy">Copy</button></div>
    <p class="note">${status}</p>
    <div class="row-btns"><button class="ghost" data-act="sync-now">Sync now</button><button class="link" data-act="sync-off">Stop syncing on this device</button></div>
  </section>`;
}

/* word sheet: pictures with outlined French words to color and trace */
function printSheet() {
  const pool = [];
  for (const k of onTopics()) if (!TOPIC[k].phrases && !TOPIC[k].numbers && !TOPIC[k].convo) pool.push(...eligible(k, state.levels[k]).filter(w => !w.pic.startsWith('n:')));
  const seen = new Set(), words = shuffle(pool).filter(w => !seen.has(w.fr) && seen.add(w.fr)).slice(0, 12);
  document.getElementById('print').innerHTML = `
    <header class="pp-head"><h1>${childName() ? `Les mots de ${esc(childName())}` : 'Mes mots'}</h1><span>${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span></header>
    <div class="sheet">${words.map(w => `<div class="sheet-card">${picHtml(w.pic)}<div class="trace">${esc(w.fr)}</div><div class="sheet-en">${esc(w.en)}</div></div>`).join('')}</div>`;
  window.print();
}

function render(shake) {
  app.innerHTML = screen === 'play' ? renderPlay() : screen === 'done' ? renderDone() : screen === 'parent' ? renderParent() : renderHome();
  if (shake) { const el = document.querySelector('.choices'); el && el.classList.add('shake'); }
  if (screen === 'play' && sess.probs[sess.i].done) document.getElementById('next')?.focus();
}
// keep open folds open across re-renders on the grown-ups page
function renderKeepingFolds() {
  const open = [...document.querySelectorAll('.known-lists details')].map(d => d.open);
  render();
  document.querySelectorAll('.known-lists details').forEach((d, i) => { if (open[i]) d.open = true; });
}

app.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'start') startSession();
  else if (act === 'check') startCheck();
  else if (act === 'pick') answer(+b.dataset.i);
  else if (act === 'next') next();
  else if (act === 'say' || act === 'slow') { const p = sess.probs[sess.i]; if (p.mode === 'say' && (p.heard || p.done)) say(p.fr, act === 'slow', p.convo ? KID_PITCH : 1); else sayAll(linesFor(p), act === 'slow'); }
  else if (act === 'hear') { const p = sess.probs[sess.i]; p.heard = true; say(p.fr, false, p.convo ? KID_PITCH : 1); render(); }
  else if (act === 'line') say(b.dataset.t, false, +b.dataset.p || 1);
  else if (act === 'intro-again') say(sess.probs[sess.i].fr);
  else if (act === 'scene') startScene(+b.dataset.i);
  else if (act === 'kid') { useKid(b.dataset.id); confirmKid = null; sess = null; render(); }
  else if (act === 'kid-del') { confirmKid = b.dataset.id; render(); }
  else if (act === 'kid-del-no') { confirmKid = null; render(); }
  else if (act === 'kid-del-yes') { removeKid(b.dataset.id); confirmKid = null; render(); }
  else if (act === 'me') { state.me = b.dataset.v; buildVocab(); save(); render(); }
  else if (act === 'age') { state.childAge = Math.max(2, Math.min(15, childAge() + +b.dataset.d)); save(); render(); }
  else if (act === 'said-yes') sayCheck(true);
  else if (act === 'said-no') sayCheck(false);
  else if (act === 'jq') {
    const p = sess.probs[sess.i];
    if (p.done) return;
    const ok = (b.dataset.v === '1') === p.said;
    p.done = true; p.revealed = !ok; p.praise = pick(PRAISE);
    say(ok ? p.praise : p.said ? `Jacques a dit : ${p.fr}` : "Jacques n'a rien dit !");
    record(p, ok); render();
  }
  else if (act === 'speak') say(b.dataset.t);
  else if (act === 'home') { screen = 'home'; confirmWipe = false; wiped = false; confirmTopic = null; importMsg = null; render(); }
  else if (act === 'parent') { screen = 'parent'; render(); }
  else if (act === 'chip') { state.on[b.dataset.k] = !state.on[b.dataset.k]; save(); render(); }
  else if (act === 'lvl') { const k = b.dataset.k; state.levels[k] = Math.max(1, Math.min(maxLevel(k), state.levels[k] + +b.dataset.d)); state.rec[k] = []; save(); render(); }
  else if (act === 'per') { state.perSession = +b.dataset.n; save(); render(); }
  else if (act === 'sayit') { state.sayIt = b.dataset.v === '1'; save(); render(); }
  else if (act === 'speed') { state.speed = b.dataset.v; save(); render(); say('Bonjour ! On apprend le français ?'); }
  else if (act === 'try-voice') say('Bonjour ! Où est le chat ? Bravo !');
  else if (act === 'print') printSheet();
  else if (act === 'import') {
    const r = importWords(document.getElementById('import-text')?.value || '');
    importMsg = `${r.matched ? `Marked ${r.matched} word${r.matched === 1 ? '' : 's'} as known.` : 'No words matched.'}`
      + (r.topics.length ? ` Topic names found (${r.topics.map(k => esc(TOPIC[k].en)).join(', ')}): open those below and tap “Mark all known”, or the words you know.` : '')
      + (r.unmatched.length ? ` Not in the word lists yet: ${r.unmatched.slice(0, 20).map(esc).join(', ')}${r.unmatched.length > 20 ? '…' : ''}. You can add them under “Mes mots”.` : '');
    save(); render();
  }
  else if (act === 'known') { const fr = b.dataset.fr; markKnown(fr, !isKnown(fr)); levelFromKnown(); say(fr); save(); renderKeepingFolds(); }
  else if (act === 'known-all' || act === 'known-none') { allItems(b.dataset.k).forEach(w => markKnown(w.fr, act === 'known-all')); levelFromKnown(); save(); renderKeepingFolds(); }
  else if (act === 'custom-del') { state.custom.splice(+b.dataset.i, 1); buildVocab(); state.levels.mesmots = Math.min(state.levels.mesmots, maxLevel('mesmots')); save(); render(); }
  else if (act === 'sync-new') { startSync(newCode()); render(); }
  else if (act === 'sync-join') {
    const code = cleanCode(document.getElementById('join-code')?.value || '');
    if (!code) { sync.error = 'bad-code'; render(); return; }
    sync.error = ''; startSync(code); render();
  }
  else if (act === 'sync-now') { sync.status = 'syncing'; render(); pullRemote(); }
  else if (act === 'sync-off') { stopSync(); render(); }
  else if (act === 'sync-copy') {
    navigator.clipboard?.writeText(sync.code).then(() => { b.textContent = 'Copied'; }, () => {
      const r = document.createRange(); r.selectNodeContents(document.getElementById('sync-code'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    });
  }
  else if (act === 'topic-reset') { confirmTopic = b.dataset.k; render(); }
  else if (act === 'topic-reset-no') { confirmTopic = null; render(); }
  else if (act === 'topic-reset-yes') { resetTopic(b.dataset.k); confirmTopic = null; save(); render(); }
  else if (act === 'wipe') { confirmWipe = true; wiped = false; render(); }
  else if (act === 'wipe-no') { confirmWipe = false; render(); }
  else if (act === 'wipe-yes') {
    const keep = { childName: state.childName, childAge: state.childAge, me: state.me, playmate: state.playmate, big: state.big, far: state.far, perSession: state.perSession, sayIt: state.sayIt, speed: state.speed, custom: state.custom };
    state = Object.assign(defaultState(), keep);
    buildVocab();
    confirmWipe = false; wiped = true; sess = null; lastChanges = [];
    save(); render();
  }
});
// Clears one topic's progress, including which of its words are known.
function resetTopic(k) {
  state.levels[k] = 1;
  delete state.rec[k]; delete state.stretch[k]; delete state.mastered[k];
  state.done[k] = 0;
  state.cards = state.cards.filter(c => c.topic !== k);
  for (const w of allItems(k)) delete state.words[w.fr];
}
app.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id === 'custom-form') {
    const fr = document.getElementById('c-fr').value.trim(), en = document.getElementById('c-en').value.trim(), pic = document.getElementById('c-pic').value.trim();
    if (!fr || !en || !pic) return;
    state.custom = [...(state.custom || []).filter(w => w.fr !== fr), { fr, en, pic }];
    state.on.mesmots = true;
    buildVocab(); save(); render(); say(fr);
    return;
  }
  if (e.target.id === 'family-form') {
    state.playmate = document.getElementById('f-sib').value.trim().slice(0, 24);
    state.big = document.getElementById('f-big').value.trim().slice(0, 24);
    state.far = document.getElementById('f-far').value.trim().slice(0, 24);
    buildVocab(); save(); render();
    return;
  }
  if (e.target.id === 'kid-form') {
    const name = document.getElementById('k-name').value.trim().slice(0, 24), age = +document.getElementById('k-age').value || 3;
    if (!name) return;
    addKid(name, Math.max(2, Math.min(15, age)));
    render();
    return;
  }
  if (e.target.id !== 'name-form') return;
  state.childName = (document.getElementById('child-name')?.value || '').trim().slice(0, 24);
  buildVocab(); save(); render();
});
app.addEventListener('change', e => {
  if (e.target.id !== 'voice') return;
  try { if (e.target.value) localStorage.setItem(VOICE_KEY, e.target.value); else localStorage.removeItem(VOICE_KEY); } catch (err) {}
  render();
  say('Bonjour ! Comment ça va ?');
});
document.addEventListener('keydown', e => {
  if (screen !== 'play') return;
  const p = sess.probs[sess.i];
  if (p.done) { if (e.key === 'Enter' && document.activeElement?.id !== 'next') next(); return; }
  if (p.mode === 'listen' && ['1', '2', '3', '4'].includes(e.key) && +e.key <= p.choices.length) answer(+e.key - 1);
});
render();
initSync();
if (canSpeak) { loadVoices(); try { speechSynthesis.addEventListener('voiceschanged', loadVoices); } catch (e) {} }
