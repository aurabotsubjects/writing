/* Friday Writing Check — the short-term online drop box.
   Uses the same Firebase Realtime Database as the Daily Warm-Up live quiz (firebase-config.js).
   Only what's needed while a check is open lives online: first names, group, a scrambled PIN check,
   and the students' answers. The teacher's Mac collects everything and then deletes it.
   ?mock=1 swaps in a pretend database (this browser only) for testing without the internet. */
import { initializeApp } from "../firebase-bundle.js";
import { getDatabase, ref, set, update, onValue, get } from "../firebase-bundle.js";

const ROOT = "wcheck/";

function mockDB(){
  const KEY = "wc-mockdb";
  const subs = [];
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch(e){ return {}; } };
  const save = (d) => { localStorage.setItem(KEY, JSON.stringify(d)); subs.forEach(s => s.fire()); };
  const parts = p => p.split("/").filter(Boolean);
  const getAt = (d, p) => parts(p).reduce((o, k) => (o == null ? undefined : o[k]), d);
  const setAt = (d, p, v) => { const ks = parts(p); let o = d; ks.slice(0,-1).forEach(k => { if (typeof o[k] !== "object" || o[k] === null) o[k] = {}; o = o[k]; });
    if (v === null || v === undefined) delete o[ks[ks.length-1]]; else o[ks[ks.length-1]] = JSON.parse(JSON.stringify(v)); };
  window.addEventListener("storage", e => { if (e.key === KEY) subs.forEach(s => s.fire()); });
  return {
    mock: true,
    async get(p){ const v = getAt(load(), p); return v === undefined ? null : v; },
    async set(p, v){ const d = load(); setAt(d, p, v); save(d); },
    async update(p, obj){ const d = load(); Object.keys(obj).forEach(k => setAt(d, p + "/" + k, obj[k])); save(d); },
    onValue(p, cb){ const s = { fire(){ const v = getAt(load(), p); cb(v === undefined ? null : v); } }; subs.push(s); s.fire();
      return () => { const i = subs.indexOf(s); if (i > -1) subs.splice(i, 1); }; }
  };
}

function fireDB(){
  const cfg = window.FIREBASE_CONFIG || {};
  if (!cfg.apiKey || String(cfg.apiKey).includes("PASTE")) throw new Error("no-config");
  const db = getDatabase(initializeApp(cfg, "wcheck"));
  return {
    mock: false,
    async get(p){ const s = await get(ref(db, p)); return s.exists() ? s.val() : null; },
    async set(p, v){ await set(ref(db, p), v === undefined ? null : v); },
    async update(p, obj){ await update(ref(db, p), obj); },
    onValue(p, cb){ return onValue(ref(db, p), s => cb(s.exists() ? s.val() : null)); }
  };
}

export function openDB(){
  const mock = /[?&]mock=1/.test(location.search) || localStorage.getItem("wc-mock") === "1";
  const db = mock ? mockDB() : fireDB();
  db.root = ROOT;
  return db;
}

/* SHA-256 → hex (PIN checks are never stored or sent as plain numbers) */
export async function sha(text){
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
export function countWords(s){ return (String(s || "").trim().match(/[^\s]+/g) || []).length; }
