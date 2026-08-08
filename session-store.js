window.ProfessionalSessionStore = (() => {
  const STORAGE_KEY = 'professionalGraph.sessions.v1';
  const ACTIVE_KEY = 'professionalGraph.activeSessionId.v1';
  const LATEST_KEY = 'professionalGraph.latestCompletedSessionId.v1';
  const SHARE_PARAM = 'pgsession';
  const SCHEMA_VERSION = 1;

  const nowIso = () => new Date().toISOString();
  const uid = () => (crypto?.randomUUID?.() || `s-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const clone = value => JSON.parse(JSON.stringify(value));

  function readAll() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeAll(sessions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  function defaultName(sessions) {
    return `Session ${sessions.length + 1}`;
  }

  function createSession(name) {
    const sessions = readAll();
    const stamp = nowIso();
    const session = {
      schemaVersion: SCHEMA_VERSION,
      id: uid(),
      name: name || defaultName(sessions),
      createdAt: stamp,
      updatedAt: stamp,
      completedAt: null,
      answers: {},
      currentQuestionId: null
    };
    sessions.push(session);
    writeAll(sessions);
    localStorage.setItem(ACTIVE_KEY, session.id);
    return clone(session);
  }

  function listSessions() {
    return readAll().sort((a,b) => String(b.updatedAt).localeCompare(String(a.updatedAt))).map(clone);
  }

  function getSession(id) {
    return clone(readAll().find(s => s.id === id) || null);
  }

  function saveSession(session) {
    const sessions = readAll();
    const index = sessions.findIndex(s => s.id === session.id);
    const next = { ...session, schemaVersion: SCHEMA_VERSION, updatedAt: nowIso() };
    if (index >= 0) sessions[index] = next;
    else sessions.push(next);
    writeAll(sessions);
    return clone(next);
  }

  function setActive(id) {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  }

  function getActive() {
    const sessions = readAll();
    const activeId = localStorage.getItem(ACTIVE_KEY);
    let session = sessions.find(s => s.id === activeId);
    if (!session) {
      const latestId = localStorage.getItem(LATEST_KEY);
      session = sessions.find(s => s.id === latestId) || sessions.at(-1);
    }
    if (!session) return createSession();
    setActive(session.id);
    return clone(session);
  }

  function complete(session) {
    if (!session.completedAt) session.completedAt = nowIso();
    const saved = saveSession(session);
    localStorage.setItem(LATEST_KEY, saved.id);
    setActive(saved.id);
    return saved;
  }

  function rename(id, name) {
    const session = getSession(id);
    if (!session) return null;
    session.name = String(name || '').trim() || session.name;
    return saveSession(session);
  }

  function remove(id) {
    const sessions = readAll().filter(s => s.id !== id);
    writeAll(sessions);
    if (localStorage.getItem(ACTIVE_KEY) === id) localStorage.removeItem(ACTIVE_KEY);
    if (localStorage.getItem(LATEST_KEY) === id) localStorage.removeItem(LATEST_KEY);
  }

  function base64UrlEncode(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }

  function base64UrlDecode(value) {
    const padded = value.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4 - value.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function exportState(session) {
    return {
      schemaVersion: SCHEMA_VERSION,
      name: session.name,
      createdAt: session.createdAt,
      completedAt: session.completedAt,
      answers: session.answers || {},
      currentQuestionId: session.currentQuestionId || null
    };
  }

  function shareUrl(session) {
    const url = new URL(location.href);
    url.searchParams.set(SHARE_PARAM, base64UrlEncode(JSON.stringify(exportState(session))));
    url.hash = '';
    return url.toString();
  }

  function importFromUrl() {
    const url = new URL(location.href);
    const encoded = url.searchParams.get(SHARE_PARAM);
    if (!encoded) return null;
    try {
      const data = JSON.parse(base64UrlDecode(encoded));
      if (!data || typeof data !== 'object' || typeof data.answers !== 'object') throw new Error('Invalid session');
      const sessions = readAll();
      const stamp = nowIso();
      const session = {
        schemaVersion: SCHEMA_VERSION,
        id: uid(),
        name: `${String(data.name || defaultName(sessions))} (shared)`,
        createdAt: data.createdAt || stamp,
        updatedAt: stamp,
        completedAt: data.completedAt || null,
        answers: data.answers,
        currentQuestionId: data.currentQuestionId || null
      };
      sessions.push(session);
      writeAll(sessions);
      setActive(session.id);
      if (session.completedAt) localStorage.setItem(LATEST_KEY, session.id);
      url.searchParams.delete(SHARE_PARAM);
      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      return clone(session);
    } catch (error) {
      console.warn('Could not import shared session', error);
      url.searchParams.delete(SHARE_PARAM);
      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      return null;
    }
  }

  return { createSession, listSessions, getSession, getActive, saveSession, setActive, complete, rename, remove, shareUrl, importFromUrl };
})();