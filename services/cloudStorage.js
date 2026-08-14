// Draft Persistence & Analytics Service Module

// Supabase Credentials provided by user
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

let supabaseClient = null;
// Supabase integration disabled temporarily to resolve network errors.
// if (typeof supabase !== 'undefined') {
//   supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// }

const DRAFT_STORAGE_KEY = 'resume_builder_local_draft_v1';
const ANALYTICS_STORAGE_KEY = 'resume_builder_session_analytics_v1';

/**
 * Retrieves analytics metrics for the current session and fetches database totals if available.
 * Starts from 0 views / 0 downloads.
 */
function getCloudAnalytics() {
  const saved = localStorage.getItem(ANALYTICS_STORAGE_KEY);
  let current = saved ? JSON.parse(saved) : {
    views: 0,
    downloads: 0,
    lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    cloudStatus: 'Initializing Cloud Sync...'
  };

  // Sync with Supabase on start
  if (supabaseClient) {
    supabaseClient
      .from('analytics')
      .select('views, downloads')
      .eq('id', 'global_stats')
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          current.views = data.views || current.views;
          current.downloads = data.downloads || current.downloads;
          current.cloudStatus = 'Connected to Supabase';
          localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(current));
        } else if (error && error.code === 'PGRST116') {
          // If row doesn't exist, create it
          supabaseClient
            .from('analytics')
            .insert([{ id: 'global_stats', views: current.views, downloads: current.downloads }])
            .then(() => {});
        }
      })
      .catch(() => {});
  } else {
    current.cloudStatus = 'Local Session Mode';
  }

  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(current));
  return current;
}

/**
 * Increments session analytics counters locally and posts to Supabase backend
 */
function incrementAnalytics(type = 'views') {
  const current = getCloudAnalytics();
  if (type === 'views') {
    current.views += 1;
  } else if (type === 'downloads') {
    current.downloads += 1;
  }
  current.lastSync = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(current));

  if (supabaseClient) {
    const incrementPayload = type === 'views' 
      ? { views: current.views }
      : { downloads: current.downloads };

    supabaseClient
      .from('analytics')
      .update(incrementPayload)
      .eq('id', 'global_stats')
      .then(({ error }) => {
        if (!error) {
          current.cloudStatus = 'Connected to Supabase';
          localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(current));
        }
      })
      .catch(() => {
        current.cloudStatus = 'Supabase Sync Error';
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(current));
      });
  }

  return current;
}

/**
 * Browser LocalStorage Draft Persistence
 * Retains user resume drafts locally within the browser for seamless offline draft preservation.
 */
function saveResumeDraft(data) {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
    return { success: true, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error('Failed to save local draft:', err);
    return { success: false, error: err.message };
  }
}

function loadResumeDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('Failed to load local draft:', err);
    return null;
  }
}

/**
 * Action Verb Bullet Point Enhancer
 * Rule-based text reframing utility using strong technical action verbs.
 */
const ACTION_VERBS = [
  'Architected and implemented',
  'Streamlined cloud deployment of',
  'Engineered high-performance',
  'Accelerated performance of',
  'Automated end-to-end',
  'Optimized security and reliability of'
];

function enhanceBulletWithActionVerbs(text) {
  if (!text || text.length < 5) return 'Architected and deployed scalable cloud infrastructure.';
  
  let trimmed = text.trim();
  const words = trimmed.split(' ');
  const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
  
  if (words.length <= 4) {
    return `${verb} ${trimmed.toLowerCase()} to enhance system throughput and performance.`;
  }
  
  return `${verb} ${words.slice(1).join(' ')} following cloud best practices.`;
}
