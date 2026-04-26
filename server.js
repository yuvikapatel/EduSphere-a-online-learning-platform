
/**
 * EduSphere — Express Server (Full)
 * Run:  node server.js
 * Visit: http://localhost:3000
 */

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── In-memory stores (replace with DB in production) ────────────
let users    = [];
let sessions = [];

// ── Middleware ───────────────────────────────────────────────────
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});

// ── Log requests ─────────────────────────────────────────────────
app.use((req, res, next) => {
  const ts = new Date().toLocaleTimeString();
  console.log(`  [${ts}] ${req.method} ${req.url}`);
  next();
});

// ── Static pages ─────────────────────────────────────────────────
const pages = ['index','curriculum','classroom','tools','collaborate','resources','quiz','enroll'];
pages.forEach(p => {
  app.get(`/${p === 'index' ? '' : p}`, (req, res) =>
    res.sendFile(path.join(__dirname, p === 'index' ? 'index.html' : `${p}.html`))
  );
});

// ── API: Auth ─────────────────────────────────────────────────────

// Sign Up / Enroll
app.post('/api/enroll', (req, res) => {
  const { firstName, lastName, email, password, phone, country, level, goals } = req.body;
  if (!firstName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields: firstName, email, password' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }
  const user = {
    id: Date.now(),
    firstName, lastName, email,
    // NOTE: In production, hash the password with bcrypt!
    password,
    phone: phone || '', country: country || '', level: level || '', goals: goals || [],
    enrolled: new Date().toISOString(),
    progress: {}
  };
  users.push(user);
  console.log(`  ✓ New enrollment: ${firstName} ${lastName} <${email}>`);
  const { password: _, ...safeUser } = user;
  res.json({ success: true, message: `Welcome, ${firstName}!`, user: safeUser });
});

// Sign In
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// Get all users (admin)
app.get('/api/users', (req, res) => {
  const safe = users.map(({ password: _, ...u }) => u);
  res.json({ count: safe.length, users: safe });
});

// ── API: Curriculum ───────────────────────────────────────────────
app.get('/api/units', (req, res) => {
  res.json({
    units: [
      { id: 1, name: 'HTML5 & CSS3 Foundations',        lessons: 8,  hours: 12, badge: 'HTML5 · CSS3' },
      { id: 2, name: 'JavaScript Fundamentals',          lessons: 10, hours: 16, badge: 'JavaScript' },
      { id: 3, name: 'Advanced JS & Async Programming',  lessons: 9,  hours: 18, badge: 'Advanced JS' },
      { id: 4, name: 'TypeScript Fundamentals',          lessons: 8,  hours: 16, badge: 'TypeScript' },
      { id: 5, name: 'Full-Stack Development',           lessons: 10, hours: 20, badge: 'Node.js' },
      { id: 6, name: 'Tooling, Testing & Deployment',    lessons: 8,  hours: 14, badge: 'DevOps' },
    ]
  });
});

// ── API: Quiz ─────────────────────────────────────────────────────
app.get('/api/quiz/:unitId', (req, res) => {
  const id = parseInt(req.params.unitId, 10);
  const allQ = {
    1: [
      { q: 'What does HTML stand for?', options: ['HyperText Markup Language','HighText Machine Language','HyperLink Text Markup Language','None'], correct: 0 },
      { q: 'Which element is used for main page content?', options: ['<content>','<body>','<main>','<section>'], correct: 2 },
      { q: 'Which CSS property sets inner spacing?', options: ['margin','spacing','padding','border-spacing'], correct: 2 },
      { q: 'Which value enables Flexbox?', options: ['display: block','display: inline-flex','display: flex','Both B and C'], correct: 3 },
      { q: 'CSS Grid property for column sizes?', options: ['grid-columns','column-template','grid-template-columns','columns'], correct: 2 },
    ],
    2: [
      { q: 'Block-scoped variable that can be reassigned?', options: ['var','let','const','def'], correct: 1 },
      { q: 'typeof null returns?', options: ['null','undefined','object','string'], correct: 2 },
      { q: 'Which method returns a new transformed array?', options: ['forEach','filter','map','reduce'], correct: 2 },
      { q: 'JSON string to object?', options: ['JSON.stringify()','JSON.parse()','JSON.convert()','Object.fromJSON()'], correct: 1 },
      { q: '=== checks?', options: ['Value only','Type only','Value AND type','Reference'], correct: 2 },
    ],
    3: [
      { q: 'Output: console.log("A"); setTimeout(()=>console.log("B"),0); Promise.resolve().then(()=>console.log("C")); console.log("D");', options: ['A B C D','A D B C','A D C B','A C D B'], correct: 2 },
      { q: 'Promise.all() when one rejects?', options: ['Returns resolved ones','Ignores rejection','Immediately rejects','Waits for all'], correct: 2 },
      { q: 'Arrow function "this" is?', options: ['Function itself','Global object','Inherited from enclosing scope','undefined'], correct: 2 },
      { q: '"yield" does what?', options: ['Throws error','Pauses generator and returns value','Ends function','Imports module'], correct: 1 },
      { q: 'Best error handling with async/await?', options: ['async try/catch','promise.catch() only','.then().catch()','try/catch block'], correct: 3 },
    ],
  };
  res.json({ questions: allQ[id] || [] });
});

// Save quiz score
app.post('/api/quiz/score', (req, res) => {
  const { userId, unitId, score, total } = req.body;
  const user = users.find(u => u.id === userId);
  if (user) {
    user.progress[`unit${unitId}`] = { score, total, pct: Math.round(score/total*100), date: new Date().toISOString() };
  }
  res.json({ success: true });
});

// ── API: Live Session ─────────────────────────────────────────────
app.get('/api/session/status', (req, res) => {
  res.json({
    active: true,
    instructor: 'Prof. Sharma',
    topic: 'CSS Grid & Flexbox — Hands-On',
    unit: 1,
    studentsOnline: Math.floor(Math.random() * 8) + 10,
    duration: `${Math.floor(Math.random()*30)+30} min`,
    startedAt: new Date(Date.now() - 42*60*1000).toISOString()
  });
});

// ── Catch-all → index.html ────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   🎓  EduSphere Virtual Classroom    ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log(`  ║   Server : http://localhost:${PORT}       ║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('\n  Pages:');
  console.log(`  ○  http://localhost:${PORT}/            Home`);
  console.log(`  ○  http://localhost:${PORT}/curriculum  Curriculum`);
  console.log(`  ○  http://localhost:${PORT}/classroom   Live Classroom`);
  console.log(`  ○  http://localhost:${PORT}/tools       Dev Tools`);
  console.log(`  ○  http://localhost:${PORT}/collaborate Collaborate`);
  console.log(`  ○  http://localhost:${PORT}/resources   Resources`);
  console.log(`  ○  http://localhost:${PORT}/quiz        Quiz`);
  console.log(`  ○  http://localhost:${PORT}/enroll      Enroll`);
  console.log('\n  API Endpoints:');
  console.log('  POST /api/enroll          Enroll a student');
  console.log('  POST /api/signin          Sign in');
  console.log('  GET  /api/users           All users (admin)');
  console.log('  GET  /api/units           Curriculum units');
  console.log('  GET  /api/quiz/:unitId    Quiz questions');
  console.log('  POST /api/quiz/score      Save quiz score');
  console.log('  GET  /api/session/status  Live session info');
  console.log('\n');
});

module.exports = app;
