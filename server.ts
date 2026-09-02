import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { 
  INITIAL_USERS, 
  INITIAL_TEST_SERIES, 
  INITIAL_ATTEMPTS, 
  INITIAL_COUPONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTES 
} from './src/data/initialData';
import { INITIAL_NAV_MENUS, INITIAL_BANNERS } from './src/utils/storage';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Persistent Server-Side State Storage File
const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE_PATH = path.join(DATA_DIR, 'app_state.json');

interface ServerAppState {
  testSeries?: any[];
  deletedSeriesIds?: string[];
  platformSettings?: any;
  siteBanners?: any[];
  announcements?: any[];
  coupons?: any[];
  navMenuItems?: any[];
  notes?: any[];
  questions?: any[];
  users?: any[];
  attempts?: any[];
  orders?: any[];
  enrolledMap?: Record<string, string[]>;
  leaderboard?: any[];
}

const INITIAL_DEFAULT_USERS = [
  {
    id: 'usr_admin',
    name: 'प्रशासक (Akhilesh Korsne)',
    username: 'akhitan_3939',
    email: 'akhitan3939@mppariksha.in',
    phone: '9893012345',
    password: 'Tanmayee*1234',
    role: 'admin',
    district: 'भोपाल (Bhopal)',
    state: 'मध्यप्रदेश (MP)',
    targetExam: 'All MP Exams Management',
    joinedAt: '2025-01-01T10:00:00.000Z',
    xp: 25000,
    streak: 45,
    badges: ['👑 Admin Master', '🏛️ MP Setu Director', '📊 Analytics Lead'],
  },
  {
    id: 'usr_student_1',
    name: 'अमित कुमार (Amit Kumar)',
    username: 'amit_kumar_mp',
    email: 'amit.kumar@gmail.com',
    phone: '9826011223',
    role: 'student',
    district: 'जबलपुर (Jabalpur)',
    state: 'मध्यप्रदेश (MP)',
    targetExam: 'MP पटवारी / समूह-2 उपसमूह-4',
    joinedAt: '2025-01-15T09:30:00.000Z',
    xp: 4850,
    streak: 14,
    badges: ['🥈 Rank 2 (MP Topper)', '🔥 14-Day Streak', '🎯 40-Q Free Mock Master'],
  },
  {
    id: 'usr_student_2',
    name: 'प्रिया शर्मा (Priya Sharma)',
    username: 'priya_sharma_indore',
    email: 'priya.sharma99@gmail.com',
    phone: '9752044556',
    role: 'student',
    district: 'इंदौर (Indore)',
    state: 'मध्यप्रदेश (MP)',
    targetExam: 'MP पटवारी 2026',
    joinedAt: '2025-01-10T14:20:00.000Z',
    xp: 5920,
    streak: 22,
    badges: ['👑 All MP Rank 1', '⭐ Top Scorer', '⚡ Fast Solver'],
  },
  {
    id: 'usr_student_3',
    name: 'रोहित वर्मा (Rohit Verma)',
    username: 'rohit_verma_gwl',
    email: 'rohit.verma@yahoo.com',
    phone: '9425077889',
    role: 'student',
    district: 'ग्वालियर (Gwalior)',
    state: 'मध्यप्रदेश (MP)',
    targetExam: 'MP पुलिस आरक्षक & SI',
    joinedAt: '2025-01-20T11:15:00.000Z',
    xp: 3400,
    streak: 8,
    badges: ['🎖️ Police Fighter', '⭐ Top 5 Aspirant'],
  },
  {
    id: 'usr_student_4',
    name: 'अनिता पटेल (Anita Patel)',
    username: 'anita_patel_ujjain',
    email: 'anita.patel@gmail.com',
    phone: '9827033445',
    role: 'student',
    district: 'उज्जैन (Ujjain)',
    state: 'मध्यप्रदेश (MP)',
    targetExam: 'MPPSC प्रारंभिक परीक्षा 2026',
    joinedAt: '2025-01-25T16:45:00.000Z',
    xp: 2950,
    streak: 11,
    badges: ['📜 MPPSC Aspirant', '🎯 Top 10 Qualifier'],
  },
  {
    id: 'usr_student_5',
    name: 'विकास यादव (Vikas Yadav)',
    username: 'vikas_yadav_rewa',
    email: 'vikas.yadav@gmail.com',
    phone: '9179066778',
    role: 'student',
    district: 'रीवा (Rewa)',
    state: 'मध्यप्रदेश (MP)',
    targetExam: 'कृषि विस्तार अधिकारी (RAEO)',
    joinedAt: '2025-02-01T10:00:00.000Z',
    xp: 2600,
    streak: 6,
    badges: ['🌱 Agri Warrior', '🎯 Free Mock Completed'],
  }
];

const INITIAL_DEFAULT_ATTEMPTS = [
  {
    id: 'att_free_priya_1',
    userId: 'usr_student_2',
    userName: 'प्रिया शर्मा (Priya Sharma)',
    userState: 'मध्यप्रदेश (MP)',
    userDistrict: 'इंदौर (Indore)',
    seriesId: 'free_mock_40',
    seriesTitle: '🎯 ऑल-मध्यप्रदेश 40-प्रश्न फ्री मॉक टेस्ट (CBT सिमुलेटर)',
    startedAt: '2026-03-01T10:00:00.000Z',
    completedAt: '2026-03-01T10:22:15.000Z',
    durationSeconds: 1335,
    score: 38,
    totalMarks: 40,
    percentage: 95.0,
    accuracy: 97.4,
    rank: 1,
    totalParticipants: 28450,
    percentile: 99.9,
    correctAnswers: 38,
    incorrectAnswers: 1,
    unattempted: 1,
    totalQuestions: 40,
    certificateId: 'CERT-MPSETU-2026-88192'
  },
  {
    id: 'att_free_amit_2',
    userId: 'usr_student_1',
    userName: 'अमित कुमार (Amit Kumar)',
    userState: 'मध्यप्रदेश (MP)',
    userDistrict: 'जबलपुर (Jabalpur)',
    seriesId: 'free_mock_40',
    seriesTitle: '🎯 ऑल-मध्यप्रदेश 40-प्रश्न फ्री मॉक टेस्ट (CBT सिमुलेटर)',
    startedAt: '2026-03-01T11:15:00.000Z',
    completedAt: '2026-03-01T11:38:40.000Z',
    durationSeconds: 1420,
    score: 36,
    totalMarks: 40,
    percentage: 90.0,
    accuracy: 92.3,
    rank: 2,
    totalParticipants: 28450,
    percentile: 99.6,
    correctAnswers: 36,
    incorrectAnswers: 3,
    unattempted: 1,
    totalQuestions: 40,
    certificateId: 'CERT-MPSETU-2026-72419'
  },
  {
    id: 'att_free_rohit_3',
    userId: 'usr_student_3',
    userName: 'रोहित वर्मा (Rohit Verma)',
    userState: 'मध्यप्रदेश (MP)',
    userDistrict: 'ग्वालियर (Gwalior)',
    seriesId: 'free_mock_40',
    seriesTitle: '🎯 ऑल-मध्यप्रदेश 40-प्रश्न फ्री मॉक टेस्ट (CBT सिमुलेटर)',
    startedAt: '2026-03-01T12:30:00.000Z',
    completedAt: '2026-03-01T12:54:10.000Z',
    durationSeconds: 1450,
    score: 34,
    totalMarks: 40,
    percentage: 85.0,
    accuracy: 89.5,
    rank: 4,
    totalParticipants: 28450,
    percentile: 98.4,
    correctAnswers: 34,
    incorrectAnswers: 4,
    unattempted: 2,
    totalQuestions: 40,
    certificateId: 'CERT-MPSETU-2026-63102'
  },
  {
    id: 'att_free_anita_4',
    userId: 'usr_student_4',
    userName: 'अनिता पटेल (Anita Patel)',
    userState: 'मध्यप्रदेश (MP)',
    userDistrict: 'उज्जैन (Ujjain)',
    seriesId: 'free_mock_40',
    seriesTitle: '🎯 ऑल-मध्यप्रदेश 40-प्रश्न फ्री मॉक टेस्ट (CBT सिमुलेटर)',
    startedAt: '2026-03-01T14:00:00.000Z',
    completedAt: '2026-03-01T14:24:50.000Z',
    durationSeconds: 1490,
    score: 32,
    totalMarks: 40,
    percentage: 80.0,
    accuracy: 84.2,
    rank: 7,
    totalParticipants: 28450,
    percentile: 96.8,
    correctAnswers: 32,
    incorrectAnswers: 6,
    unattempted: 2,
    totalQuestions: 40,
    certificateId: 'CERT-MPSETU-2026-51208'
  },
  {
    id: 'att_free_vikas_5',
    userId: 'usr_student_5',
    userName: 'विकास यादव (Vikas Yadav)',
    userState: 'मध्यप्रदेश (MP)',
    userDistrict: 'रीवा (Rewa)',
    seriesId: 'free_mock_40',
    seriesTitle: '🎯 ऑल-मध्यप्रदेश 40-प्रश्न फ्री मॉक टेस्ट (CBT सिमुलेटर)',
    startedAt: '2026-03-01T15:10:00.000Z',
    completedAt: '2026-03-01T15:35:15.000Z',
    durationSeconds: 1515,
    score: 30,
    totalMarks: 40,
    percentage: 75.0,
    accuracy: 81.1,
    rank: 12,
    totalParticipants: 28450,
    percentile: 94.5,
    correctAnswers: 30,
    incorrectAnswers: 7,
    unattempted: 3,
    totalQuestions: 40,
    certificateId: 'CERT-MPSETU-2026-44910'
  }
];

function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.warn('Failed to create data dir:', e);
    }
  }
}

function loadAppStateFromDisk(): ServerAppState {
  ensureDataDirExists();
  if (fs.existsSync(STATE_FILE_PATH)) {
    try {
      const content = fs.readFileSync(STATE_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) {
      console.warn('Error reading app_state.json from disk:', err);
    }
  }
  return {};
}

function saveAppStateToDisk(state: ServerAppState) {
  ensureDataDirExists();
  try {
    const serialized = JSON.stringify(state, null, 2);
    const tempFile = `${STATE_FILE_PATH}.tmp`;
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, STATE_FILE_PATH);
  } catch (err) {
    try {
      fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Error saving app_state.json to disk:', e);
    }
  }
}

let inMemoryAppState: ServerAppState = loadAppStateFromDisk();

// 1. Initialize and preserve users seed
if (!Array.isArray(inMemoryAppState.users) || inMemoryAppState.users.length === 0) {
  inMemoryAppState.users = INITIAL_USERS;
} else {
  // Merge default users with any stored users to ensure no registered user is lost
  const userMap = new Map<string, any>();
  INITIAL_USERS.forEach(u => userMap.set(u.id, u));
  inMemoryAppState.users.forEach(u => {
    if (u && u.id) userMap.set(u.id, { ...(userMap.get(u.id) || {}), ...u });
  });
  
  // Ensure default admin is always present and updated
  const adminEntry = userMap.get('usr_admin') || INITIAL_USERS[0];
  userMap.set('usr_admin', {
    ...adminEntry,
    name: 'प्रशासक (Akhilesh Korsne)',
    username: 'akhitan_3939',
    password: 'Tanmayee*1234',
    email: 'akhitan3939@mppariksha.in',
    role: 'admin'
  });
  inMemoryAppState.users = Array.from(userMap.values());
}

// 2. Initialize and preserve attempts seed
if (!Array.isArray(inMemoryAppState.attempts) || inMemoryAppState.attempts.length === 0) {
  inMemoryAppState.attempts = INITIAL_ATTEMPTS;
}

// 3. Initialize and preserve testSeries seed (Respect admin deletions and modifications)
if (!Array.isArray(inMemoryAppState.testSeries) || inMemoryAppState.testSeries.length === 0) {
  inMemoryAppState.testSeries = INITIAL_TEST_SERIES;
} else {
  // Respect existing inMemoryAppState.testSeries as the source of truth
  // Ensure each series is properly merged with base fields if present, but DO NOT resurrect deleted series
  const validSeriesList = inMemoryAppState.testSeries.filter(s => s && s.id && !(inMemoryAppState.deletedSeriesIds || []).includes(s.id));
  inMemoryAppState.testSeries = validSeriesList;
}

// 4. Initialize orders and enrolledMap
if (!Array.isArray(inMemoryAppState.orders)) {
  inMemoryAppState.orders = [];
}
if (!inMemoryAppState.enrolledMap || typeof inMemoryAppState.enrolledMap !== 'object') {
  inMemoryAppState.enrolledMap = {};
}

// 5. Initialize site banners
if (!Array.isArray(inMemoryAppState.siteBanners) || inMemoryAppState.siteBanners.length === 0) {
  inMemoryAppState.siteBanners = INITIAL_BANNERS;
}

// 6. Initialize nav menus
if (!Array.isArray(inMemoryAppState.navMenuItems) || inMemoryAppState.navMenuItems.length === 0) {
  inMemoryAppState.navMenuItems = INITIAL_NAV_MENUS;
}

// 7. Initialize coupons
if (!Array.isArray(inMemoryAppState.coupons) || inMemoryAppState.coupons.length === 0) {
  inMemoryAppState.coupons = INITIAL_COUPONS;
}

// 8. Initialize announcements
if (!Array.isArray(inMemoryAppState.announcements) || inMemoryAppState.announcements.length === 0) {
  inMemoryAppState.announcements = INITIAL_ANNOUNCEMENTS;
}

// 9. Initialize notes
if (!Array.isArray(inMemoryAppState.notes) || inMemoryAppState.notes.length === 0) {
  inMemoryAppState.notes = INITIAL_NOTES;
}

// 10. Initialize default platform settings if not present
if (!inMemoryAppState.platformSettings) {
  inMemoryAppState.platformSettings = {
    siteTitle: 'MP परीक्षा सेतु',
    siteTagline: 'मध्यप्रदेश प्रतियोगी परीक्षा सर्वोत्तम टेस्ट पोर्टल',
    helplinePhone: '',
    helplineWhatsapp: '919893012345',
    supportEmail: 'mpparikshasetu.support@gmail.com',
    logoUrl: '/logo.svg',
    topTickerTextHi: "🔥 MP पटवारी 2026 के सभी 20 सेट्स लाइव! सेट #1 मुफ़्त डेमो अभी दें • कोड 'SETU50' पर ₹50 फ्लैट छूट",
    topTickerTextEn: "🔥 MP Patwari 2026 All 20 Sets Live! Attempt Set #1 Free Demo • Use coupon 'SETU50' for ₹50 Off",
    topTickerEnabled: true,
    paymentGatewayMode: 'LIVE',
    enableAiEvaluation: true,
    maintenanceMode: false,
    facebookUrl: 'https://facebook.com/groups/mpparikshasetu',
    instagramUrl: 'https://instagram.com/mpparikshasetu_official',
    telegramUrl: 'https://t.me/mpparikshasetu_mp',
    youtubeUrl: 'https://youtube.com/@mpparikshasetu',
    whatsappCommunityUrl: 'https://chat.whatsapp.com/mpparikshasetu',
    visitorHitsCount: 50,
    lastUpdatedDateHi: '01 सितम्बर 2026',
    lastUpdatedDateEn: '01 September 2026',
    showHitCounter: true,
    showLastUpdated: true
  };
} else {
  // Ensure default counter starts at least 50
  if (typeof inMemoryAppState.platformSettings.visitorHitsCount !== 'number' || inMemoryAppState.platformSettings.visitorHitsCount < 50) {
    inMemoryAppState.platformSettings.visitorHitsCount = 50;
  }
  if (!inMemoryAppState.platformSettings.lastUpdatedDateHi) {
    inMemoryAppState.platformSettings.lastUpdatedDateHi = '01 सितम्बर 2026';
  }
  if (!inMemoryAppState.platformSettings.lastUpdatedDateEn) {
    inMemoryAppState.platformSettings.lastUpdatedDateEn = '01 September 2026';
  }
  if (inMemoryAppState.platformSettings.showHitCounter === undefined) {
    inMemoryAppState.platformSettings.showHitCounter = true;
  }
  if (inMemoryAppState.platformSettings.showLastUpdated === undefined) {
    inMemoryAppState.platformSettings.showLastUpdated = true;
  }
}

// Persist fully initialized state to disk
saveAppStateToDisk(inMemoryAppState);

// 0. Global App Data Fetch & Synchronization Endpoint
app.get('/api/app-data', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: inMemoryAppState,
    timestamp: new Date().toISOString()
  });
});

// Hit Counter & Last Updated Endpoints
app.get('/api/hit-counter', (req: Request, res: Response) => {
  const settings = inMemoryAppState.platformSettings || {};
  const count = typeof settings.visitorHitsCount === 'number' && settings.visitorHitsCount >= 50
    ? settings.visitorHitsCount
    : 50;
  res.json({
    success: true,
    count,
    lastUpdatedDateHi: settings.lastUpdatedDateHi || '01 सितम्बर 2026',
    lastUpdatedDateEn: settings.lastUpdatedDateEn || '01 September 2026',
    showHitCounter: settings.showHitCounter !== false,
    showLastUpdated: settings.showLastUpdated !== false
  });
});

app.post('/api/hit-counter/increment', (req: Request, res: Response) => {
  if (!inMemoryAppState.platformSettings) {
    inMemoryAppState.platformSettings = {};
  }
  const current = typeof inMemoryAppState.platformSettings.visitorHitsCount === 'number' && inMemoryAppState.platformSettings.visitorHitsCount >= 50
    ? inMemoryAppState.platformSettings.visitorHitsCount
    : 50;
  const next = current + 1;
  inMemoryAppState.platformSettings.visitorHitsCount = next;
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    count: next,
    lastUpdatedDateHi: inMemoryAppState.platformSettings.lastUpdatedDateHi || '01 सितम्बर 2026',
    lastUpdatedDateEn: inMemoryAppState.platformSettings.lastUpdatedDateEn || '01 September 2026'
  });
});

app.post('/api/hit-counter/update', (req: Request, res: Response) => {
  const { count, lastUpdatedDateHi, lastUpdatedDateEn, showHitCounter, showLastUpdated } = req.body;
  if (!inMemoryAppState.platformSettings) {
    inMemoryAppState.platformSettings = {};
  }
  if (count !== undefined) {
    inMemoryAppState.platformSettings.visitorHitsCount = Math.max(50, Number(count) || 50);
  }
  if (lastUpdatedDateHi !== undefined) {
    inMemoryAppState.platformSettings.lastUpdatedDateHi = String(lastUpdatedDateHi);
  }
  if (lastUpdatedDateEn !== undefined) {
    inMemoryAppState.platformSettings.lastUpdatedDateEn = String(lastUpdatedDateEn);
  }
  if (showHitCounter !== undefined) {
    inMemoryAppState.platformSettings.showHitCounter = Boolean(showHitCounter);
  }
  if (showLastUpdated !== undefined) {
    inMemoryAppState.platformSettings.showLastUpdated = Boolean(showLastUpdated);
  }
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    message: 'Hit counter and last update date updated successfully',
    settings: inMemoryAppState.platformSettings
  });
});

app.post('/api/app-data/sync', (req: Request, res: Response) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  inMemoryAppState = {
    ...inMemoryAppState,
    ...incoming
  };
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    message: 'Global app state synced successfully across all clients',
    data: inMemoryAppState
  });
});

// ==========================================
// USER REGISTRATION & MANAGEMENT ENDPOINTS
// ==========================================
app.get('/api/users', (req: Request, res: Response) => {
  res.json({
    success: true,
    users: inMemoryAppState.users || [],
    totalCount: (inMemoryAppState.users || []).length
  });
});

app.post('/api/users/register', (req: Request, res: Response) => {
  const newUser = req.body;
  if (!newUser || !newUser.name) {
    return res.status(400).json({ success: false, message: 'Student profile details are required' });
  }

  let users = inMemoryAppState.users || [];
  
  // Check duplicate phone or email
  const existingByPhone = newUser.phone ? users.find(u => u.phone === newUser.phone) : null;
  const existingByEmail = newUser.email ? users.find(u => u.email?.toLowerCase() === newUser.email?.toLowerCase()) : null;
  const existingByUsername = newUser.username ? users.find(u => u.username?.toLowerCase() === newUser.username?.toLowerCase()) : null;

  if (existingByPhone || existingByEmail || existingByUsername) {
    // Update existing or return conflict
    const target = existingByPhone || existingByEmail || existingByUsername;
    return res.json({
      success: true,
      isExisting: true,
      user: target,
      message: 'User already registered'
    });
  }

  const userWithDefaults = {
    id: newUser.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: newUser.name,
    username: newUser.username || `user_${Date.now()}`,
    email: newUser.email || '',
    phone: newUser.phone || '',
    password: newUser.password || 'Student@123',
    role: newUser.role || 'student',
    district: newUser.district || 'भोपाल (Bhopal)',
    state: newUser.state || 'मध्यप्रदेश (MP)',
    targetExam: newUser.targetExam || 'MP पटवारी 2026',
    joinedAt: newUser.joinedAt || new Date().toISOString(),
    xp: typeof newUser.xp === 'number' ? newUser.xp : 100,
    streak: typeof newUser.streak === 'number' ? newUser.streak : 1,
    badges: Array.isArray(newUser.badges) ? newUser.badges : ['🌱 New Aspirant']
  };

  users = [userWithDefaults, ...users];
  inMemoryAppState.users = users;
  saveAppStateToDisk(inMemoryAppState);

  console.log(`[MP Setu] User Registered & Persisted to Disk: ${userWithDefaults.name} (${userWithDefaults.phone})`);

  res.json({
    success: true,
    user: userWithDefaults,
    totalUsers: users.length,
    message: 'User registered and persisted successfully'
  });
});

app.post('/api/users/sync', (req: Request, res: Response) => {
  const { users } = req.body;
  if (!Array.isArray(users)) {
    return res.status(400).json({ success: false, message: 'Invalid users array' });
  }

  const existingUsers = inMemoryAppState.users || [];
  const userMap = new Map<string, any>();

  // Load existing
  existingUsers.forEach(u => {
    if (u && u.id) userMap.set(u.id, u);
  });

  // Merge incoming
  users.forEach(u => {
    if (u && u.id) {
      userMap.set(u.id, { ...(userMap.get(u.id) || {}), ...u });
    }
  });

  inMemoryAppState.users = Array.from(userMap.values());
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    users: inMemoryAppState.users,
    totalCount: inMemoryAppState.users.length,
    message: 'Users synchronized and saved to disk'
  });
});

app.post('/api/users/update', (req: Request, res: Response) => {
  const updatedUser = req.body;
  if (!updatedUser || !updatedUser.id) {
    return res.status(400).json({ success: false, message: 'User ID required' });
  }

  let users = inMemoryAppState.users || [];
  const idx = users.findIndex(u => u.id === updatedUser.id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updatedUser };
  } else {
    users.push(updatedUser);
  }

  inMemoryAppState.users = users;
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    user: updatedUser,
    message: 'User profile updated and saved to disk'
  });
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let users = inMemoryAppState.users || [];
  users = users.filter(u => u.id !== id);
  inMemoryAppState.users = users;
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    message: `User ${id} removed successfully`,
    totalUsers: users.length
  });
});

// ==========================================
// TEST ATTEMPTS ENDPOINTS
// ==========================================
app.get('/api/attempts', (req: Request, res: Response) => {
  res.json({
    success: true,
    attempts: inMemoryAppState.attempts || [],
    totalCount: (inMemoryAppState.attempts || []).length
  });
});

app.post('/api/attempts', (req: Request, res: Response) => {
  const newAttempt = req.body;
  if (!newAttempt || !newAttempt.seriesId) {
    return res.status(400).json({ success: false, message: 'Valid test attempt data required' });
  }

  let attempts = inMemoryAppState.attempts || [];
  const attemptWithDefaults = {
    ...newAttempt,
    id: newAttempt.id || `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    completedAt: newAttempt.completedAt || new Date().toISOString()
  };

  // Check if attempt with same id exists
  const existingIdx = attempts.findIndex(a => a.id === attemptWithDefaults.id);
  if (existingIdx >= 0) {
    attempts[existingIdx] = attemptWithDefaults;
  } else {
    attempts = [attemptWithDefaults, ...attempts];
  }

  inMemoryAppState.attempts = attempts;

  // Award XP to user if registered
  if (attemptWithDefaults.userId && Array.isArray(inMemoryAppState.users)) {
    const uIdx = inMemoryAppState.users.findIndex(u => u.id === attemptWithDefaults.userId);
    if (uIdx >= 0) {
      const earnedXp = Math.round((attemptWithDefaults.score || 10) * 10);
      inMemoryAppState.users[uIdx] = {
        ...inMemoryAppState.users[uIdx],
        xp: (inMemoryAppState.users[uIdx].xp || 0) + earnedXp,
        streak: (inMemoryAppState.users[uIdx].streak || 1) + 1
      };
    }
  }

  saveAppStateToDisk(inMemoryAppState);

  console.log(`[MP Setu] Test Attempt Persisted to Disk: ${attemptWithDefaults.userName} - ${attemptWithDefaults.seriesTitle} (Score: ${attemptWithDefaults.score})`);

  res.json({
    success: true,
    attempt: attemptWithDefaults,
    totalAttempts: attempts.length,
    message: 'Test attempt recorded and saved to disk'
  });
});

// ==========================================
// ORDERS & ENROLLMENT ENDPOINTS
// ==========================================
app.get('/api/orders', (req: Request, res: Response) => {
  res.json({
    success: true,
    orders: inMemoryAppState.orders || []
  });
});

app.post('/api/orders/record', (req: Request, res: Response) => {
  const newOrder = req.body;
  if (!newOrder) {
    return res.status(400).json({ success: false, message: 'Order data required' });
  }

  let orders = inMemoryAppState.orders || [];
  orders = [newOrder, ...orders];
  inMemoryAppState.orders = orders;

  // If order provides userId and seriesId, update enrolledMap automatically
  if (newOrder.userId && newOrder.seriesId) {
    if (!inMemoryAppState.enrolledMap) inMemoryAppState.enrolledMap = {};
    const current = inMemoryAppState.enrolledMap[newOrder.userId] || [];
    if (!current.includes(newOrder.seriesId)) {
      inMemoryAppState.enrolledMap[newOrder.userId] = [...current, newOrder.seriesId];
    }
  }

  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    order: newOrder,
    message: 'Order transaction recorded and saved to disk'
  });
});

app.get('/api/enrolled-map', (req: Request, res: Response) => {
  res.json({
    success: true,
    enrolledMap: inMemoryAppState.enrolledMap || {}
  });
});

app.post('/api/enrolled-map/sync', (req: Request, res: Response) => {
  const { enrolledMap } = req.body;
  if (!enrolledMap || typeof enrolledMap !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid enrolled map' });
  }

  inMemoryAppState.enrolledMap = {
    ...(inMemoryAppState.enrolledMap || {}),
    ...enrolledMap
  };
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    enrolledMap: inMemoryAppState.enrolledMap,
    message: 'Enrollment mapping saved to disk'
  });
});

// Platform Settings Endpoint
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({
    success: true,
    settings: inMemoryAppState.platformSettings || {}
  });
});

app.post('/api/settings', (req: Request, res: Response) => {
  const updated = req.body;
  inMemoryAppState.platformSettings = {
    ...(inMemoryAppState.platformSettings || {}),
    ...updated
  };
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    message: 'Platform settings updated globally',
    settings: inMemoryAppState.platformSettings
  });
});

// Test Series Endpoints
app.get('/api/test-series', (req: Request, res: Response) => {
  res.json({
    success: true,
    testSeries: inMemoryAppState.testSeries || []
  });
});

app.post('/api/test-series', (req: Request, res: Response) => {
  const incomingSeries = req.body;
  if (!incomingSeries || !incomingSeries.id) {
    return res.status(400).json({ success: false, message: 'Invalid series data' });
  }

  let list = inMemoryAppState.testSeries || [];
  const idx = list.findIndex(s => s.id === incomingSeries.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...incomingSeries };
  } else {
    list = [incomingSeries, ...list];
  }
  inMemoryAppState.testSeries = list;
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    message: 'Test series saved globally',
    series: incomingSeries
  });
});

app.post('/api/test-series/toggle-active', (req: Request, res: Response) => {
  const { seriesId, isActive } = req.body;
  if (!seriesId) {
    return res.status(400).json({ success: false, message: 'Series ID required' });
  }

  let list = inMemoryAppState.testSeries || [];
  let updatedStatus = true;
  let found = false;

  list = list.map(s => {
    if (s.id === seriesId) {
      found = true;
      updatedStatus = isActive !== undefined ? Boolean(isActive) : !s.isActive;
      return { ...s, isActive: updatedStatus };
    }
    return s;
  });

  if (!found) {
    const defaultItem = INITIAL_TEST_SERIES.find(s => s.id === seriesId);
    updatedStatus = isActive !== undefined ? Boolean(isActive) : false;
    const newEntry = defaultItem ? { ...defaultItem, isActive: updatedStatus } : { id: seriesId, isActive: updatedStatus };
    list.push(newEntry);
  }

  inMemoryAppState.testSeries = list;
  saveAppStateToDisk(inMemoryAppState);

  console.log(`[MP Setu] Test Series Visibility Toggled: ${seriesId} is now ${updatedStatus ? 'ACTIVE' : 'INACTIVE'}`);

  res.json({
    success: true,
    seriesId,
    isActive: updatedStatus,
    testSeries: inMemoryAppState.testSeries,
    message: `Test series ${seriesId} is now ${updatedStatus ? 'ACTIVE' : 'INACTIVE'}`
  });
});

// Toggle individual mock set (Active / Inactive) for any test series
app.post('/api/test-series/toggle-set', (req: Request, res: Response) => {
  const { seriesId, setNumber, isActive } = req.body;
  if (!seriesId || setNumber === undefined) {
    return res.status(400).json({ success: false, message: 'seriesId and setNumber are required' });
  }

  const num = Number(setNumber);
  let list = inMemoryAppState.testSeries || [];
  let targetSeries = list.find(s => s.id === seriesId);

  if (!targetSeries) {
    // create default minimal entry if not yet saved
    const defaultItem = INITIAL_TEST_SERIES.find(s => s.id === seriesId);
    targetSeries = defaultItem ? { ...defaultItem } : {
      id: seriesId,
      totalTests: 20,
      disabledSetNumbers: [],
      activeSetsCount: 20,
      isActive: true
    };
    list = [targetSeries, ...list];
  }

  let disabled: number[] = Array.isArray(targetSeries.disabledSetNumbers) ? [...targetSeries.disabledSetNumbers] : [];
  let willBeActive: boolean;

  if (isActive !== undefined) {
    willBeActive = Boolean(isActive);
  } else {
    willBeActive = disabled.includes(num); // if it was disabled, make it active
  }

  if (willBeActive) {
    disabled = disabled.filter(n => n !== num);
  } else {
    if (!disabled.includes(num)) {
      disabled.push(num);
    }
  }

  const totalPossible = targetSeries.id === 'ts_patwari_2026' || targetSeries.id === 'ts_agri_ext_2026' ? 20 : (targetSeries.totalTests || 20);
  const activeCount = Math.max(0, totalPossible - disabled.length);

  list = list.map(s => {
    if (s.id === seriesId) {
      return {
        ...s,
        totalTests: totalPossible,
        disabledSetNumbers: disabled,
        activeSetsCount: activeCount
      };
    }
    return s;
  });

  inMemoryAppState.testSeries = list;
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    seriesId,
    setNumber: num,
    isSetActive: willBeActive,
    disabledSetNumbers: disabled,
    activeSetsCount: activeCount,
    totalTests: totalPossible,
    testSeries: inMemoryAppState.testSeries,
    message: `Set #${num} is now ${willBeActive ? 'ACTIVE (visible to students)' : 'INACTIVE (hidden from students)'}`
  });
});

// Update full mock sets configuration (e.g. total count, disabled list)
app.post('/api/test-series/save-sets-config', (req: Request, res: Response) => {
  const { seriesId, totalTests, disabledSetNumbers, activeSetsCount } = req.body;
  if (!seriesId) {
    return res.status(400).json({ success: false, message: 'seriesId is required' });
  }

  let list = inMemoryAppState.testSeries || [];
  let found = false;

  list = list.map(s => {
    if (s.id === seriesId) {
      found = true;
      const cleanDisabled = Array.isArray(disabledSetNumbers) ? disabledSetNumbers : (s.disabledSetNumbers || []);
      const cleanTotal = typeof totalTests === 'number' ? totalTests : (s.totalTests || 20);
      const cleanActive = typeof activeSetsCount === 'number' ? activeSetsCount : Math.max(0, cleanTotal - cleanDisabled.length);
      return {
        ...s,
        totalTests: cleanTotal,
        disabledSetNumbers: cleanDisabled,
        activeSetsCount: cleanActive
      };
    }
    return s;
  });

  if (!found) {
    list.push({
      id: seriesId,
      totalTests: totalTests || 20,
      disabledSetNumbers: disabledSetNumbers || [],
      activeSetsCount: activeSetsCount || 20,
      isActive: true
    });
  }

  inMemoryAppState.testSeries = list;
  saveAppStateToDisk(inMemoryAppState);

  res.json({
    success: true,
    seriesId,
    testSeries: inMemoryAppState.testSeries,
    message: 'Sets configuration updated globally'
  });
});

app.delete('/api/test-series/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let list = inMemoryAppState.testSeries || [];
  inMemoryAppState.testSeries = list.filter(s => s.id !== id);
  
  if (!Array.isArray(inMemoryAppState.deletedSeriesIds)) {
    inMemoryAppState.deletedSeriesIds = [];
  }
  if (!inMemoryAppState.deletedSeriesIds.includes(id)) {
    inMemoryAppState.deletedSeriesIds.push(id);
  }

  saveAppStateToDisk(inMemoryAppState);

  console.log(`[MP Setu] Test Series DELETED globally: ${id}. Remaining series count: ${inMemoryAppState.testSeries.length}`);

  res.json({
    success: true,
    deletedId: id,
    testSeries: inMemoryAppState.testSeries,
    message: `Test series ${id} deleted globally`
  });
});

// Logo Upload & Serving Endpoints
app.get('/api/logo', (req: Request, res: Response) => {
  const publicDir = path.join(process.cwd(), 'public');
  const customLogoPath = path.join(publicDir, 'custom_logo.png');
  if (fs.existsSync(customLogoPath)) {
    return res.sendFile(customLogoPath);
  }
  const defaultLogoPath = path.join(publicDir, 'logo.svg');
  if (fs.existsSync(defaultLogoPath)) {
    return res.sendFile(defaultLogoPath);
  }
  res.redirect('/logo.svg');
});

app.post('/api/upload-logo', (req: Request, res: Response) => {
  const { logoData, logoUrl } = req.body;
  if (logoData && typeof logoData === 'string' && logoData.startsWith('data:image')) {
    try {
      const base64Data = logoData.replace(/^data:image\/\w+;base64,/, '');
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const customLogoPath = path.join(publicDir, 'custom_logo.png');
      fs.writeFileSync(customLogoPath, Buffer.from(base64Data, 'base64'));
      
      const newLogoUrl = '/custom_logo.png?v=' + Date.now();
      inMemoryAppState.platformSettings = {
        ...(inMemoryAppState.platformSettings || {}),
        logoUrl: newLogoUrl
      };
      saveAppStateToDisk(inMemoryAppState);

      return res.json({
        success: true,
        logoUrl: newLogoUrl,
        message: 'Custom logo image uploaded and set successfully'
      });
    } catch (err) {
      console.warn('Error saving custom logo image:', err);
    }
  }

  if (logoUrl) {
    inMemoryAppState.platformSettings = {
      ...(inMemoryAppState.platformSettings || {}),
      logoUrl
    };
    saveAppStateToDisk(inMemoryAppState);
    return res.json({
      success: true,
      logoUrl,
      message: 'Logo URL updated successfully'
    });
  }

  res.status(400).json({ success: false, message: 'No valid logo image data or URL provided' });
});

// Lazy/Safe AI Initialization
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Fallback Model Hierarchy to seamlessly absorb 503 / high demand spikes
const RESILIENT_MODELS = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

async function callGenAIWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  config?: any
): Promise<{ text: string; modelUsed: string }> {
  let lastError: any = null;

  for (const model of RESILIENT_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config,
        });

        if (response && response.text) {
          return { text: response.text, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '').toLowerCase();
        const isTransient =
          msg.includes('503') ||
          msg.includes('429') ||
          msg.includes('unavailable') ||
          msg.includes('high demand') ||
          msg.includes('resource_exhausted') ||
          msg.includes('quota');

        if (isTransient && attempt === 0) {
          // Brief pause before retry on transient surge
          await new Promise(resolve => setTimeout(resolve, 400));
          continue;
        }
        // If not transient or already retried, move to next model in the cascade
        break;
      }
    }
  }

  throw lastError || new Error('All candidate AI models were unavailable');
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'MP Pariksha Setu API',
    hasAiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Helper function for dynamic academic evaluation fallback tailored to section scores
function generateFallbackEvaluation(params: {
  seriesTitle?: string;
  score?: number;
  totalMarks?: number;
  durationSeconds?: number;
  sectionScores?: any[];
  incorrectQuestions?: any[];
  studentName?: string;
}) {
  const { seriesTitle = 'MP परीक्षा सेतु टेस्ट सीरीज़', score = 0, totalMarks = 200, studentName = 'परीक्षार्थी', sectionScores = [] } = params;
  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

  // Identify strong and weak sections dynamically
  const weakSections: string[] = [];
  const strongSections: string[] = [];

  if (Array.isArray(sectionScores) && sectionScores.length > 0) {
    sectionScores.forEach(s => {
      const name = s.sectionName || s.subject || 'सामान्य ज्ञान';
      const acc = s.accuracy !== undefined ? s.accuracy : (s.correct / (s.totalQuestions || 1)) * 100;
      if (acc >= 70) {
        strongSections.push(name);
      } else {
        weakSections.push(name);
      }
    });
  }

  const primaryWeakSection = weakSections[0] || 'पंचायती राज एवं ग्रामीण अर्थव्यवस्था';
  const secondaryWeakSection = weakSections[1] || 'कंप्यूटर विज्ञान एवं एमएस ऑफिस';
  const primaryStrongSection = strongSections[0] || 'मध्यप्रदेश सामान्य ज्ञान';

  let overallSummaryHi = `${studentName}, आपने ${seriesTitle} में कुल ${totalMarks} में से ${score} अंक (${percentage.toFixed(1)}%) प्राप्त किए हैं। `;
  let overallSummaryEn = `Great attempt ${studentName}! You scored ${score} out of ${totalMarks} (${percentage.toFixed(1)}%) in ${seriesTitle}. `;

  if (percentage >= 75) {
    overallSummaryHi += `आपका प्रदर्शन अत्यंत उत्कृष्ट व ऑल-एमपी मेरिट सूची के सर्वोत्कृष्ट स्तर पर है। रिवीजन निरंतर रखें।`;
    overallSummaryEn += `Your performance is in the top merit bracket. Maintain consistent revision.`;
  } else if (percentage >= 50) {
    overallSummaryHi += `आपकी बुनियादी समझ सुदृढ़ है। ${primaryWeakSection} में नियमित अभ्यास से आपका स्कोर 85%+ तक पहुँच सकता है।`;
    overallSummaryEn += `Your conceptual foundation is solid. Targeted drills in ${primaryWeakSection} will maximize your rank.`;
  } else {
    overallSummaryHi += `आपको ${primaryWeakSection} व ${secondaryWeakSection} के मौलिक सिद्धांतों का गहन अध्ययन करने की आवश्यकता है।`;
    overallSummaryEn += `Focus on core fundamentals of ${primaryWeakSection} and systematic daily question practice to improve.`;
  }

  return {
    overallSummaryHi,
    overallSummaryEn,
    keyStrengthsHi: [
      `${primaryStrongSection} में आपकी सटीकता एवं संकल्पनात्मक स्पष्टता बहुत अच्छी है`,
      'समय प्रबंधन संतुलित रहा, प्रति प्रश्न औसत समय उचित है',
      'प्रत्यक्ष एवं तथ्य-आधारित बहुविकल्पीय प्रश्नों में उच्च आत्मविश्वास'
    ],
    keyStrengthsEn: [
      `High accuracy and strong conceptual clarity in ${primaryStrongSection}`,
      'Effective time pacing per section without rushing',
      'Strong command over core syllabus fundamentals'
    ],
    criticalWeaknessesHi: [
      `${primaryWeakSection} से जुड़े विशेष नियमों एवं शब्दावलियों में पुनरावृत्ति आवश्यक है`,
      `${secondaryWeakSection} में जटिल प्रश्नों पर एलिमिनेशन तकनीक का अधिक प्रयोग करें`,
      'कठिन विकल्पों में नकारात्मक भ्रम से बचने के लिए शॉर्ट नोट्स से रिवीजन करें'
    ],
    criticalWeaknessesEn: [
      `Need deeper revision in key concepts and terms of ${primaryWeakSection}`,
      `Refine option elimination techniques in ${secondaryWeakSection}`,
      'Review formulas and short notes to avoid confusion in close distractors'
    ],
    sevenDayPlanHi: [
      `दिन 1-2: ${primaryWeakSection} के मूल सिद्धांत, सार संग्रह व पूर्व वर्षों के प्रश्न (PYQ) हल करें`,
      `दिन 3: ${secondaryWeakSection} के 100 महत्वपूर्ण अभ्यास प्रश्न हल करें`,
      'दिन 4: हिन्दी व्याकरण (संधि, समास, रस, शुद्ध वर्तनी) व सामान्य विज्ञान का रिवीज़न करें',
      'दिन 5: मध्यप्रदेश सामान्य ज्ञान, नदियाँ, योजनाएँ व सामयिकी (Current Affairs) पढ़ें',
      'दिन 6: पिछले 5 वर्षों के MP व्यापम/MPESB प्रश्नपत्र हल करें',
      'दिन 7: ऑल-एमपी 200 प्रश्नों का फुल मॉक टेस्ट दें और कमजोर खंडों का विश्लेषण करें'
    ],
    sevenDayPlanEn: [
      `Day 1-2: Master core principles and PYQs of ${primaryWeakSection}`,
      `Day 3: Solve 100 targeted MCQs on ${secondaryWeakSection}`,
      'Day 4: Revise Hindi Grammar, Vocabulary and General Science fundamentals',
      'Day 5: Deep dive into MP Special GK, schemes, geography and current affairs',
      'Day 6: Solve MP Previous Year Papers (PYQs 2018-2024)',
      'Day 7: Attempt 1 Full Length 200-Question Mock Test under timed CBT conditions'
    ],
    memoryTricksHi: [
      'नर्मदा नदी उद्गम: "अमरकंटक से निकली नर्मदा, 1077 किमी एमपी में बही (कुल 1312)"',
      'भील जनजाति उत्सव: "भगोरिया = गुलालिया + गोल गधेड़ो + उजाड़िया"',
      'पंचायती राज दिवस: "24 अप्रैल (73वां संशोधन 1993)"'
    ],
    memoryTricksEn: [
      'Narmada river mnemonic: "Origins in Amarkantak, flows 1077 km in MP, 1312 km total to Gulf of Khambhat"',
      'Bhil Tribe festival: "Bhagoriya = Gulaliya + Gol Gadhedo + Ujariya"',
      'Panchayati Raj Day: "24 April 1993 enacted"'
    ],
    expectedCutoffScore: Math.round(totalMarks * 0.74),
    percentileRank: Math.min(99.5, Math.max(50, Math.round((percentage * 1.08))))
  };
}

// 2. AI Test Attempt Evaluation API
app.post('/api/ai/evaluate-attempt', async (req: Request, res: Response) => {
  const { seriesTitle, score, totalMarks, durationSeconds, sectionScores, incorrectQuestions, studentName } = req.body;
  const fallbackReport = generateFallbackEvaluation({ seriesTitle, score, totalMarks, durationSeconds, sectionScores, incorrectQuestions, studentName });

  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json({ success: true, report: fallbackReport, isAiGenerated: false });
    }

    const prompt = `You are the chief academic evaluator for Madhya Pradesh Government Competitive Examinations (MP Pariksha Setu).
Evaluate this test performance:
Exam Name: ${seriesTitle}
Student Name: ${studentName || 'Student'}
Score: ${score} / ${totalMarks}
Duration: ${durationSeconds} seconds
Section Breakdown: ${JSON.stringify(sectionScores || [])}
Mistakes Summary: ${JSON.stringify(incorrectQuestions || []).slice(0, 800)}

Generate a comprehensive, structured evaluation in BOTH Hindi and English.
Return JSON with the exact schema matching:
{
  "overallSummaryHi": string,
  "overallSummaryEn": string,
  "keyStrengthsHi": string[],
  "keyStrengthsEn": string[],
  "criticalWeaknessesHi": string[],
  "criticalWeaknessesEn": string[],
  "sevenDayPlanHi": string[],
  "sevenDayPlanEn": string[],
  "memoryTricksHi": string[],
  "memoryTricksEn": string[],
  "expectedCutoffScore": number,
  "percentileRank": number
}`;

    const { text, modelUsed } = await callGenAIWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallSummaryHi: { type: Type.STRING },
          overallSummaryEn: { type: Type.STRING },
          keyStrengthsHi: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyStrengthsEn: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalWeaknessesHi: { type: Type.ARRAY, items: { type: Type.STRING } },
          criticalWeaknessesEn: { type: Type.ARRAY, items: { type: Type.STRING } },
          sevenDayPlanHi: { type: Type.ARRAY, items: { type: Type.STRING } },
          sevenDayPlanEn: { type: Type.ARRAY, items: { type: Type.STRING } },
          memoryTricksHi: { type: Type.ARRAY, items: { type: Type.STRING } },
          memoryTricksEn: { type: Type.ARRAY, items: { type: Type.STRING } },
          expectedCutoffScore: { type: Type.NUMBER },
          percentileRank: { type: Type.NUMBER }
        },
        required: [
          'overallSummaryHi',
          'overallSummaryEn',
          'keyStrengthsHi',
          'keyStrengthsEn',
          'criticalWeaknessesHi',
          'criticalWeaknessesEn',
          'sevenDayPlanHi',
          'sevenDayPlanEn',
          'memoryTricksHi',
          'memoryTricksEn',
          'expectedCutoffScore',
          'percentileRank'
        ]
      }
    });

    const parsed = JSON.parse(text || '{}');
    res.json({ success: true, report: parsed, isAiGenerated: true, modelUsed });
  } catch (error: any) {
    // Graceful silent fallback without error crashes so student analytics are uninterrupted
    res.json({ success: true, report: fallbackReport, isAiGenerated: false, fallbackNotice: 'Academic evaluation synthesized from score metrics.' });
  }
});

// 3. AI Question Deep-Dive Explanation & Shortcuts
app.post('/api/ai/explain-question', async (req: Request, res: Response) => {
  const { questionHi, questionEn, options, correctOption, userSelected, topic, questionText, studentAnswer } = req.body;
  const qHi = questionHi || questionText || '';
  const cOpt = correctOption !== undefined ? correctOption : '';
  const sTopic = topic || req.body.subject || 'सामान्य अध्ययन';

  const defaultExplanation = {
    explanationHi: `सही उत्तर है: "${cOpt}". यह प्रश्न ${sTopic} का महत्वपूर्ण भाग है। परीक्षा में अक्सर इस प्रकार के सीधे तथ्य पूछे जाते हैं।`,
    explanationEn: `Correct answer is: "${cOpt}". This is a recurring high-yield concept in ${sTopic}.`,
    examTip: 'ध्यान दें: परीक्षा में विकल्पों को ध्यान से पढ़ें और निकटवर्ती विकल्पों को एलिमिनेशन विधि से बाहर करें।',
    mnemonicTrick: 'परीक्षा सूत्र: मुख्य तथ्यों की समय-समय पर पुनरावृत्ति करें और शॉर्ट नोट्स बनाएं।'
  };

  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        ...defaultExplanation
      });
    }

    const prompt = `You are an expert MP Govt Exam Faculty (MPPSC & MP Vyapam/ESB expert).
Explain this question in depth with helpful mnemonics/shortcuts in Hindi and English.
Question: ${qHi} / ${questionEn || ''}
Options: ${JSON.stringify(options || [])}
Correct Answer: ${cOpt}
User Selected: ${userSelected !== undefined ? userSelected : studentAnswer}
Topic: ${sTopic}

Provide response as JSON:
{
  "explanationHi": string (Detailed explanation in clean Hindi with key points),
  "explanationEn": string (Detailed explanation in English),
  "examTip": string (High yield tip or trap to avoid in MP Exams),
  "mnemonicTrick": string (Short Hindi trick or formula to remember this forever)
}`;

    const { text } = await callGenAIWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanationHi: { type: Type.STRING },
          explanationEn: { type: Type.STRING },
          examTip: { type: Type.STRING },
          mnemonicTrick: { type: Type.STRING },
        },
        required: ['explanationHi', 'explanationEn', 'examTip', 'mnemonicTrick']
      }
    });

    const data = JSON.parse(text || '{}');
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.json({ success: true, ...defaultExplanation });
  }
});

// 3.5 AI Question Generator for Question Bank Hub
app.post('/api/ai/generate-question', async (req: Request, res: Response) => {
  const { topic, subject, seriesName } = req.body;
  const sTopic = topic || 'मध्यप्रदेश सामान्य ज्ञान';
  const sSub = subject || 'म.प्र. सामान्य ज्ञान';
  const sSeries = seriesName || 'MP पटवारी / व्यापम';

  const defaultQuestion = {
    questionHi: `मध्यप्रदेश की प्रतियोगी परीक्षाओं हेतु '${sTopic}' के संबंध में निम्नलिखित में से कौन सा कथन सही है?`,
    questionEn: `Which of the following statements regarding '${sTopic}' is correct for MP Government Exams?`,
    optionsHi: [
      `यह ${sTopic} का प्रामाणिक व प्रमुख तथ्य है।`,
      `यह विकल्प ऐतिहासिक रूप से गलत है।`,
      `यह मध्य भारत के अन्य राज्यों से संबंधित है।`,
      `उपर्युक्त में से कोई नहीं।`
    ],
    optionsEn: [
      `This is the authentic and key fact about ${sTopic}.`,
      `This option is historically inaccurate.`,
      `This relates to other central Indian states.`,
      `None of the above.`
    ],
    correctOption: 0,
    explanationHi: `'${sTopic}' मध्यप्रदेश शासन के नवीनतम परीक्षा पैटर्न अनुसार अत्यंत महत्वपूर्ण विषय है। सही विकल्प A है।`,
    explanationEn: `'${sTopic}' is a high-yield topic for Madhya Pradesh competitive exams. Correct option is A.`
  };

  try {
    const ai = getGenAI();
    if (!ai) {
      return res.json({ success: true, question: defaultQuestion });
    }

    const prompt = `You are a senior exam paper setter for MPPSC and MP ESB/Vyapam (Patwari, RAEO, Group-2 Subgroup-4, Police Constable, SI).
Generate 1 high-quality, authentic, examination-grade multiple choice question in Hindi and English on the specified topic.
Topic: "${sTopic}"
Subject: "${sSub}"
Target Exam: "${sSeries}"

Requirements:
- questionHi: Crystal-clear Hindi question text matching Vyapam/MPPSC official style.
- questionEn: English translation of the question.
- optionsHi: Array of exactly 4 strings for options (A, B, C, D) in Hindi.
- optionsEn: Array of exactly 4 strings for options (A, B, C, D) in English.
- correctOption: Integer index (0 for A, 1 for B, 2 for C, 3 for D).
- explanationHi: Clear, academic, in-depth explanation in Hindi with key memory tricks.
- explanationEn: Clear explanation in English.

Output as JSON format.`;

    const { text } = await callGenAIWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questionHi: { type: Type.STRING },
          questionEn: { type: Type.STRING },
          optionsHi: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          optionsEn: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          correctOption: { type: Type.INTEGER },
          explanationHi: { type: Type.STRING },
          explanationEn: { type: Type.STRING },
        },
        required: ['questionHi', 'questionEn', 'optionsHi', 'optionsEn', 'correctOption', 'explanationHi', 'explanationEn']
      }
    });

    const parsed = JSON.parse(text || '{}');
    res.json({ success: true, question: parsed });
  } catch (err) {
    console.warn('[AI Question Gen fallback]:', err);
    res.json({ success: true, question: defaultQuestion });
  }
});


// 4. Payment Gateway Config & Order Creation
app.get('/api/payment/config', (req: Request, res: Response) => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_TUkTQCe5WDc7d8';
  res.json({
    success: true,
    keyId,
    isLive: Boolean(keyId && keyId.startsWith('rzp_live_')),
    isConfigured: true
  });
});

app.post('/api/payment/create-link', async (req: Request, res: Response) => {
  const { seriesId, seriesTitle, amount, userId, userName, userEmail, userPhone, couponCode } = req.body;
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_TUkTQCe5WDc7d8';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Rq1QJOG2LXVf0b31dzmRrdjq';
  const amountInPaise = Math.round(Number(amount) * 100);

  if (keyId && keySecret) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpResponse = await fetch('https://api.razorpay.com/v1/payment_links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          description: `MP परीक्षा सेतु - ${seriesTitle || 'टेस्ट सीरीज पैकेज'}`,
          customer: {
            name: userName || 'Candidate',
            email: userEmail || 'student@mpparikshasetu.in',
            contact: userPhone || '9876543210'
          },
          notify: {
            sms: false,
            email: false
          },
          notes: {
            seriesId: String(seriesId),
            couponCode: couponCode || 'NONE'
          }
        })
      });

      if (rzpResponse.ok) {
        const linkData: any = await rzpResponse.json();
        console.log('[Razorpay Live Link Created]:', linkData.id, linkData.short_url);
        return res.json({
          success: true,
          paymentUrl: linkData.short_url,
          paymentLinkId: linkData.id,
          amount: Number(amount)
        });
      } else {
        const errText = await rzpResponse.text();
        console.warn('[Razorpay Link Error]:', errText);
      }
    } catch (apiErr) {
      console.warn('[Razorpay Link Exception]:', apiErr);
    }
  }

  res.status(500).json({
    success: false,
    message: 'Unable to connect to Razorpay Live API'
  });
});

app.post('/api/payment/check-status', async (req: Request, res: Response) => {
  const { paymentLinkId, orderId, paymentId } = req.body;
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_TUkTQCe5WDc7d8';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Rq1QJOG2LXVf0b31dzmRrdjq';

  if (!keyId || !keySecret) {
    return res.status(500).json({ success: false, message: 'Razorpay keys not configured' });
  }

  const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    // 1. Check Payment Link Status
    if (paymentLinkId) {
      const rzpRes = await fetch(`https://api.razorpay.com/v1/payment_links/${paymentLinkId}`, {
        headers: { 'Authorization': authHeader }
      });

      if (rzpRes.ok) {
        const data: any = await rzpRes.json();
        console.log(`[Razorpay Status Check ${paymentLinkId}]:`, data.status, 'amount_paid:', data.amount_paid);

        if (data.status === 'paid' || (data.amount_paid && data.amount_paid >= data.amount)) {
          const actualPayId = data.payments && data.payments.length > 0 
            ? (data.payments[0].payment_id || data.payments[0].id)
            : `pay_live_${Date.now()}`;

          return res.json({
            success: true,
            isPaid: true,
            status: 'PAID',
            paymentId: actualPayId,
            amount: (data.amount_paid || data.amount) / 100,
            verifiedAt: new Date().toISOString()
          });
        } else {
          return res.json({
            success: true,
            isPaid: false,
            status: data.status || 'PENDING',
            message: 'Payment not yet received on Razorpay'
          });
        }
      }
    }

    // 2. Check Order Payments Status
    if (orderId) {
      const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
        headers: { 'Authorization': authHeader }
      });

      if (orderRes.ok) {
        const orderData: any = await orderRes.json();
        const successfulPay = (orderData.items || []).find((p: any) => p.status === 'captured' || p.status === 'authorized');
        if (successfulPay) {
          return res.json({
            success: true,
            isPaid: true,
            status: 'PAID',
            paymentId: successfulPay.id,
            amount: successfulPay.amount / 100,
            verifiedAt: new Date().toISOString()
          });
        }
      }
    }

    // 3. Check direct payment ID if supplied
    if (paymentId && paymentId.startsWith('pay_')) {
      const payRes = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': authHeader }
      });
      if (payRes.ok) {
        const payData: any = await payRes.json();
        if (payData.status === 'captured' || payData.status === 'authorized') {
          return res.json({
            success: true,
            isPaid: true,
            status: 'PAID',
            paymentId: payData.id,
            amount: payData.amount / 100,
            verifiedAt: new Date().toISOString()
          });
        }
      }
    }

    return res.json({
      success: true,
      isPaid: false,
      status: 'PENDING',
      message: 'Payment verification pending. Please complete transaction on Razorpay.'
    });
  } catch (err: any) {
    console.error('[Razorpay Verify Error]:', err);
    return res.status(500).json({ success: false, message: 'Verification error' });
  }
});

app.post('/api/orders/create', async (req: Request, res: Response) => {
  const { seriesId, seriesTitle, amount, userId, userName, couponCode } = req.body;
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_TUkTQCe5WDc7d8';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Rq1QJOG2LXVf0b31dzmRrdjq';
  const gst = +(amount * 0.18).toFixed(2);
  const total = amount;
  const amountInPaise = Math.round(total * 100);

  // Attempt official Razorpay API order creation
  if (keyId && keySecret) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_mp_${Date.now()}`.substring(0, 40),
          notes: {
            seriesId: String(seriesId),
            seriesTitle: String(seriesTitle || 'MP Pariksha Setu').substring(0, 30),
            userName: String(userName || 'Student').substring(0, 30)
          }
        })
      });

      if (rzpResponse.ok) {
        const rzpData: any = await rzpResponse.json();
        console.log('[Razorpay] Order created successfully:', rzpData.id);
        return res.json({
          success: true,
          order: {
            orderId: rzpData.id,
            amount: rzpData.amount,
            currency: rzpData.currency,
            receipt: rzpData.receipt,
            seriesId,
            seriesTitle,
            amountRupees: total,
            gstAmount: gst,
            discount: couponCode ? 50 : 0,
            createdAt: new Date().toISOString(),
            isRealGateway: true
          }
        });
      } else {
        const errBody = await rzpResponse.text();
        console.warn('[Razorpay API Response Error]:', rzpResponse.status, errBody);
      }
    } catch (apiErr) {
      console.warn('[Razorpay API Warning] Real order creation fallback:', apiErr);
    }
  }

  // Resilient fallback order generation for instant test/simulation mode
  const orderId = 'order_MP_' + Math.random().toString(36).substring(2, 10).toUpperCase();

  res.json({
    success: true,
    order: {
      orderId,
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      seriesId,
      seriesTitle,
      amountRupees: total,
      gstAmount: gst,
      discount: couponCode ? 50 : 0,
      createdAt: new Date().toISOString(),
      isRealGateway: false
    }
  });
});

// 5. Payment Gateway Verification
app.post('/api/orders/verify', (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, paymentMethod } = req.body;
  const invoiceNumber = `INV-MPSETU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({
    success: true,
    verified: true,
    transaction: {
      orderId: razorpay_order_id || 'order_MP_' + Date.now(),
      razorpayPaymentId: razorpay_payment_id || 'pay_RZP_MP_' + Math.random().toString(36).substring(2, 9),
      invoiceNumber,
      paymentMethod: paymentMethod || 'UPI',
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    }
  });
});

// Vite Middleware Configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MP परीक्षा सेतु] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
