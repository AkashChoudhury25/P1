// ─────────────────────────────────────────────────────────────
//  CloudFolio — Cloud Storage & Auth Service
//  Multi-resume support: each user can own many resumes.
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL      = 'https://ahharoibawmeqgyfxkwa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaGFyb2liYXdtZXFneWZ4a3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NTEyNjcsImV4cCI6MjEwMjIyNzI2N30.oNjnT90B5MOFp6QImJexSoYFy6GADUrbol3-13yX_XU';

let supabaseClient = null;
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('[CloudStorage] Supabase SDK not loaded — offline mode.');
}

const DRAFT_KEY     = 'cloudfolio_resume_draft_v2';
const ANALYTICS_KEY = 'cloudfolio_session_analytics_v2';

// ═════════════════════════════════════════════════════════════
//  AUTH
// ═════════════════════════════════════════════════════════════

async function getCurrentUser() {
  if (!supabaseClient) return null;
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user || null;
}

function getCurrentSession() {
  if (!supabaseClient) return Promise.resolve(null);
  return supabaseClient.auth.getSession();
}

function onAuthStateChange(callback) {
  if (!supabaseClient) return () => {};
  const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

async function signUp(email, password) {
  if (!supabaseClient) return { user: null, error: new Error('Supabase not available') };
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  return { user: data?.user || null, error };
}

async function signIn(email, password) {
  if (!supabaseClient) return { user: null, error: new Error('Supabase not available') };
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  return { user: data?.user || null, error };
}

async function signOut() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
}

// ═════════════════════════════════════════════════════════════
//  MULTI-RESUME CLOUD STORAGE
// ═════════════════════════════════════════════════════════════

/**
 * Fetch all resumes for the current user.
 * Returns { resumes: [{ id, name, updated_at }], error: string|null }
 * (error is surfaced, not swallowed, so a schema/RLS problem is visible
 * instead of just looking like "you have zero resumes").
 */
async function getUserResumes() {
  if (!supabaseClient) return { resumes: [], error: null };
  try {
    const { data, error } = await supabaseClient
      .from('resumes')
      .select('id, name, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[CloudStorage] getUserResumes:', error.message);
      return { resumes: [], error: error.message };
    }
    return { resumes: data || [], error: null };
  } catch (err) {
    // Network failure, CORS block, offline, etc. — this is a real exception,
    // not a Postgres error, so it never had an `error.message` to read.
    console.error('[CloudStorage] getUserResumes threw:', err);
    return { resumes: [], error: err?.message || 'Network request failed.' };
  }
}

/**
 * Create a brand-new blank resume with the given name.
 * Returns { id: string|null, error: string|null }.
 */
async function createResume(name) {
  if (!supabaseClient) return { id: null, error: 'Supabase is not configured.' };
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.error('[CloudStorage] createResume: no user');
      return { id: null, error: 'You need to be signed in to create a resume.' };
    }

    const { data, error } = await supabaseClient
      .from('resumes')
      .insert({ user_id: user.id, name: name || 'My Resume', resume_data: {} })
      .select('id')
      .single();

    if (error) {
      console.error('[CloudStorage] createResume failed:', error.message, error.details, error.hint);
      return { id: null, error: error.message };
    }
    return { id: data?.id || null, error: null };
  } catch (err) {
    // Network failure, CORS block, offline, etc.
    console.error('[CloudStorage] createResume threw:', err);
    return { id: null, error: err?.message || 'Network request failed.' };
  }
}

/**
 * Save resume_data for a specific resume row.
 */
async function saveResume(id, data) {
  if (!supabaseClient || !id) {
    // Fallback: persist to localStorage
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (_) {}
    return { success: false, source: 'local' };
  }

  // Always backup locally too
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (_) {}

  const { error } = await supabaseClient
    .from('resumes')
    .update({ resume_data: data, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) { console.error('[CloudStorage] saveResume:', error.message); return { success: false, error }; }
  return { success: true, source: 'cloud' };
}

/**
 * Load resume_data for a specific resume row.
 * Returns the data object, or null.
 */
async function loadResume(id) {
  if (!supabaseClient || !id) return null;

  const { data, error } = await supabaseClient
    .from('resumes')
    .select('resume_data, name')
    .eq('id', id)
    .single();

  if (error) { console.error('[CloudStorage] loadResume:', error.message); return null; }
  return data ? { resumeData: data.resume_data, name: data.name } : null;
}

/**
 * Delete a specific resume by id.
 * Returns { success: boolean, error: string|null }.
 */
async function deleteResume(id) {
  if (!supabaseClient || !id) return { success: false, error: 'Not signed in to the cloud.' };

  try {
    // .select() on the delete forces Postgres to return the deleted row(s),
    // which is what lets us tell "deleted" apart from "RLS silently matched
    // zero rows" — a delete blocked by policy returns no error AND no rows.
    const { data, error } = await supabaseClient
      .from('resumes')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      console.error('[CloudStorage] deleteResume:', error.message);
      return { success: false, error: error.message };
    }
    if (!data || data.length === 0) {
      console.error('[CloudStorage] deleteResume: no row deleted (likely blocked by a policy)');
      return { success: false, error: "Delete was blocked — you may not have permission to remove this resume." };
    }
    return { success: true, error: null };
  } catch (err) {
    console.error('[CloudStorage] deleteResume threw:', err);
    return { success: false, error: err?.message || 'Network request failed.' };
  }
}

/**
 * Rename a resume.
 */
async function renameResume(id, name) {
  if (!supabaseClient || !id) return false;
  const { error } = await supabaseClient
    .from('resumes')
    .update({ name })
    .eq('id', id);
  return !error;
}

// ── Legacy single-resume helpers (kept for guest/offline fallback) ──

function saveResumeDraft(data) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); return { success: true }; }
  catch (e) { return { success: false }; }
}

function loadResumeDraft() {
  try { const raw = localStorage.getItem(DRAFT_KEY); return raw ? JSON.parse(raw) : null; }
  catch (_) { return null; }
}

// Keep old aliases so nothing else breaks
async function saveResumeToCloud(data) { return saveResumeDraft(data); }
async function loadResumeFromCloud() { return loadResumeDraft(); }

// ═════════════════════════════════════════════════════════════
//  ANALYTICS
// ═════════════════════════════════════════════════════════════

function getCloudAnalytics() {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const base = raw ? JSON.parse(raw) : { views: 0, downloads: 0 };
    base.cloudStatus = supabaseClient ? 'Connected' : 'Local Session Mode';
    return base;
  } catch (_) { return { views: 0, downloads: 0, cloudStatus: 'Local Session Mode' }; }
}

function incrementAnalytics(type = 'views') {
  const current = getCloudAnalytics();
  if (type === 'views')     current.views     += 1;
  if (type === 'downloads') current.downloads += 1;
  current.lastSync = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  try { localStorage.setItem(ANALYTICS_KEY, JSON.stringify(current)); } catch (_) {}
  return current;
}

// ═════════════════════════════════════════════════════════════
//  ACTION VERB ENHANCER
// ═════════════════════════════════════════════════════════════

const ACTION_VERBS = [
  'Architected and implemented', 'Streamlined cloud deployment of',
  'Engineered high-performance', 'Accelerated performance of',
  'Automated end-to-end', 'Optimized security and reliability of'
];

function enhanceBulletWithActionVerbs(text) {
  if (!text || text.length < 5) return 'Architected and deployed scalable cloud infrastructure.';
  const words = text.trim().split(' ');
  const verb  = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
  return words.length <= 4
    ? `${verb} ${text.trim().toLowerCase()} to enhance system throughput.`
    : `${verb} ${words.slice(1).join(' ')} following cloud best practices.`;
}
