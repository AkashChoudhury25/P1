// Draft Persistence & Analytics Service Module

const DRAFT_STORAGE_KEY = 'resume_builder_local_draft_v1';
const ANALYTICS_STORAGE_KEY = 'resume_builder_session_analytics_v1';

/**
 * Retrieves analytics metrics for the current session and fetches Vercel serverless totals if available.
 * Starts from 0 views / 0 downloads.
 */
function getCloudAnalytics() {
  const saved = localStorage.getItem(ANALYTICS_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  const initialAnalytics = {
    views: 0,
    downloads: 0,
    lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    cloudStatus: 'Vercel Serverless Endpoint Ready'
  };
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(initialAnalytics));
  return initialAnalytics;
}

/**
 * Increments session analytics counters locally and posts to Vercel Serverless Function /api/analytics
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

  // Trigger Vercel Serverless Function endpoint if deployed
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: `increment_${type}` })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.data) {
        // Synchronize with serverless API response
        current.views = data.data.views || current.views;
        current.downloads = data.data.downloads || current.downloads;
        current.cloudStatus = 'Connected to Vercel Serverless API';
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(current));
      }
    })
    .catch(() => {
      // Graceful fallback to client-side session metrics during local development
      current.cloudStatus = 'Local Session Mode';
    });

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
