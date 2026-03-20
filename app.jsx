/**
 * QuizAI — World-class AI-Powered Quiz Platform
 * Converts any uploaded file into an interactive quiz using Claude AI
 * 
 * Features:
 * - Upload PDF, DOCX, TXT, images — any document
 * - Claude AI extracts content + generates MCQs with explanations
 * - Timer-based quiz, adaptive difficulty
 * - Hindi/English toggle
 * - Dark/Light mode
 * - Score analytics, bookmarks, review mode
 * - Voice reading (TTS)
 * - Topic-wise generation
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    appName: "QuizAI",
    tagline: "Transform any document into a powerful quiz",
    uploadTitle: "Drop your file here",
    uploadSub: "PDF, DOCX, TXT, Images — any document up to 20MB",
    uploadBtn: "Browse Files",
    settingsTitle: "Quiz Settings",
    numQuestions: "Number of Questions",
    difficulty: "Difficulty Level",
    language: "Quiz Language",
    timerLabel: "Timer per Question",
    topicLabel: "Focus Topic (optional)",
    topicPlaceholder: "e.g. Photosynthesis, World War II, Data Structures…",
    generateBtn: "Generate Quiz with AI",
    generatingBtn: "Generating…",
    noTimer: "No Timer",
    secs30: "30 seconds",
    secs60: "1 minute",
    secs90: "90 seconds",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    mixed: "Mixed",
    questionOf: "Question",
    of: "of",
    skipBtn: "Skip",
    prevBtn: "← Prev",
    nextBtn: "Next →",
    submitBtn: "Submit Quiz",
    bookmarkBtn: "Bookmark",
    bookmarked: "Bookmarked ✓",
    listenBtn: "🔊 Listen",
    explanation: "Explanation",
    correctAnswer: "Correct Answer",
    yourAnswer: "Your Answer",
    quizComplete: "Quiz Complete!",
    score: "Your Score",
    correct: "Correct",
    wrong: "Wrong",
    skipped: "Skipped",
    timeTaken: "Time Taken",
    reviewBtn: "Review Answers",
    retryBtn: "Try Again",
    newQuizBtn: "New Quiz",
    excellentMsg: "Outstanding! You're a master! 🏆",
    goodMsg: "Great work! Keep it up! 🌟",
    okMsg: "Good effort! Practice more 💪",
    lowMsg: "Keep studying! You'll get there 📚",
    reviewTitle: "Answer Review",
    allFilter: "All",
    correctFilter: "Correct",
    wrongFilter: "Wrong",
    skippedFilter: "Skipped",
    processingTitle: "AI is reading your document…",
    processingStep1: "Extracting text content…",
    processingStep2: "Analyzing key concepts…",
    processingStep3: "Generating smart questions…",
    processingStep4: "Adding AI explanations…",
    processingStep5: "Finalizing your quiz…",
    errorTitle: "Something went wrong",
    errorRetry: "Try Again",
    fileSelected: "File selected",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    adaptiveDiff: "Adaptive Difficulty",
    shuffleQ: "Shuffle Questions",
    shuffleOpts: "Shuffle Options",
    showAfter: "Show Answer After Each",
    topicWise: "Topic-wise Generation",
    progress: "Progress",
    accuracy: "Accuracy",
    grade: "Grade",
  },
  hi: {
    appName: "QuizAI",
    tagline: "किसी भी दस्तावेज़ को शक्तिशाली क्विज़ में बदलें",
    uploadTitle: "यहाँ फ़ाइल छोड़ें",
    uploadSub: "PDF, DOCX, TXT, Images — कोई भी दस्तावेज़ (20MB तक)",
    uploadBtn: "फ़ाइल चुनें",
    settingsTitle: "क्विज़ सेटिंग्स",
    numQuestions: "प्रश्नों की संख्या",
    difficulty: "कठिनाई स्तर",
    language: "क्विज़ भाषा",
    timerLabel: "प्रति प्रश्न समय",
    topicLabel: "विषय (वैकल्पिक)",
    topicPlaceholder: "जैसे: प्रकाश संश्लेषण, विश्व युद्ध II…",
    generateBtn: "AI से क्विज़ बनाएं",
    generatingBtn: "बन रहा है…",
    noTimer: "कोई टाइमर नहीं",
    secs30: "30 सेकंड",
    secs60: "1 मिनट",
    secs90: "90 सेकंड",
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",
    mixed: "मिश्रित",
    questionOf: "प्रश्न",
    of: "में से",
    skipBtn: "छोड़ें",
    prevBtn: "← पिछला",
    nextBtn: "अगला →",
    submitBtn: "क्विज़ जमा करें",
    bookmarkBtn: "बुकमार्क",
    bookmarked: "बुकमार्क ✓",
    listenBtn: "🔊 सुनें",
    explanation: "व्याख्या",
    correctAnswer: "सही उत्तर",
    yourAnswer: "आपका उत्तर",
    quizComplete: "क्विज़ पूरा!",
    score: "आपका स्कोर",
    correct: "सही",
    wrong: "गलत",
    skipped: "छोड़ा",
    timeTaken: "समय लिया",
    reviewBtn: "उत्तर देखें",
    retryBtn: "फिर कोशिश करें",
    newQuizBtn: "नई क्विज़",
    excellentMsg: "शानदार! आप माहिर हैं! 🏆",
    goodMsg: "बहुत अच्छा! जारी रखें! 🌟",
    okMsg: "अच्छी कोशिश! और अभ्यास करें 💪",
    lowMsg: "पढ़ते रहें! आप कर सकते हैं 📚",
    reviewTitle: "उत्तर समीक्षा",
    allFilter: "सभी",
    correctFilter: "सही",
    wrongFilter: "गलत",
    skippedFilter: "छोड़े",
    processingTitle: "AI आपका दस्तावेज़ पढ़ रहा है…",
    processingStep1: "टेक्स्ट निकाल रहा है…",
    processingStep2: "मुख्य विषयों का विश्लेषण…",
    processingStep3: "स्मार्ट प्रश्न बना रहा है…",
    processingStep4: "AI व्याख्या जोड़ रहा है…",
    processingStep5: "आपकी क्विज़ तैयार हो रही है…",
    errorTitle: "कुछ गलत हुआ",
    errorRetry: "फिर कोशिश करें",
    fileSelected: "फ़ाइल चुनी",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    adaptiveDiff: "अनुकूली कठिनाई",
    shuffleQ: "प्रश्न मिलाएं",
    shuffleOpts: "विकल्प मिलाएं",
    showAfter: "हर प्रश्न के बाद दिखाएं",
    topicWise: "विषयवार प्रश्न",
    progress: "प्रगति",
    accuracy: "सटीकता",
    grade: "ग्रेड",
  }
};

const DIFFICULTY_COLORS = {
  easy: "#10B981",
  medium: "#F59E0B",
  hard: "#F43F5E",
  mixed: "#8B5CF6"
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGrade(pct) {
  if (pct >= 90) return { label: "A+", color: "#10B981" };
  if (pct >= 80) return { label: "A",  color: "#10B981" };
  if (pct >= 70) return { label: "B+", color: "#6366F1" };
  if (pct >= 60) return { label: "B",  color: "#6366F1" };
  if (pct >= 50) return { label: "C",  color: "#F59E0B" };
  return { label: "D", color: "#F43F5E" };
}

// ─── AI API CALL ──────────────────────────────────────────────────────────────

async function generateQuizFromText(text, settings) {
  const { numQ, difficulty, lang, topic, shuffleOpts: doShuffleOpts } = settings;

  const langInstruction = lang === "hi"
    ? "Generate all questions, options, and explanations in Hindi (Devanagari script)."
    : "Generate all questions, options, and explanations in English.";

  const topicInstruction = topic?.trim()
    ? `Focus specifically on the topic: "${topic}".`
    : "Cover the most important concepts from the document.";

  const diffMap = {
    easy: "simple recall and basic comprehension",
    medium: "application and understanding",
    hard: "analysis, synthesis, and evaluation",
    mixed: "a mix of easy (30%), medium (50%), and hard (20%) questions"
  };

  const prompt = `You are an expert educator and quiz designer. I will give you content from a document, and you must generate a high-quality quiz.

${langInstruction}
${topicInstruction}

DOCUMENT CONTENT:
"""
${text.slice(0, 12000)}
"""

Generate exactly ${numQ} multiple-choice questions at ${diffMap[difficulty] || "mixed"} difficulty.

STRICT OUTPUT FORMAT — return ONLY valid JSON, no markdown, no extra text:
{
  "title": "short descriptive quiz title",
  "questions": [
    {
      "id": 1,
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correct": 0,
      "explanation": "detailed explanation of why this answer is correct and others are wrong",
      "difficulty": "easy|medium|hard",
      "topic": "sub-topic name"
    }
  ]
}

Rules:
- "correct" is the 0-based index of the correct option in "options" array
- Each question must have exactly 4 options
- Explanations must be detailed (2-4 sentences), educational, and reference the source material
- Questions should be exam-level quality, not trivial
- No duplicate questions
- options must be plausible (no obviously wrong distractors)
- Return ONLY the JSON object, nothing else`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const raw = data.content?.map(c => c.text || "").join("") || "";

  // Extract JSON — strip any markdown fences
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response — could not parse JSON");

  const parsed = JSON.parse(jsonMatch[0]);

  // Optionally shuffle options
  if (doShuffleOpts) {
    parsed.questions = parsed.questions.map(q => {
      const correctText = q.options[q.correct];
      const shuffled = shuffle(q.options);
      return { ...q, options: shuffled, correct: shuffled.indexOf(correctText) };
    });
  }

  return parsed;
}

// ─── FILE READER ──────────────────────────────────────────────────────────────

async function extractTextFromFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  // Plain text
  if (["txt", "md", "csv", "json"].includes(ext)) {
    return await file.text();
  }

  // Images + PDFs — send as base64 to Claude vision
  if (["pdf", "jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) {
    return await extractViaVision(file);
  }

  // DOCX / DOC — read raw bytes and extract readable text
  if (["docx", "doc"].includes(ext)) {
    return await extractDocxText(file);
  }

  // Fallback — try plain text
  try { return await file.text(); }
  catch { throw new Error(`Unsupported file type: .${ext}`); }
}

async function extractViaVision(file) {
  const base64 = await fileToBase64(file);
  const isPdf  = file.name.toLowerCase().endsWith(".pdf");
  const mediaType = isPdf ? "application/pdf" : file.type || "image/jpeg";

  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [{
      role: "user",
      content: [
        {
          type: isPdf ? "document" : "image",
          source: { type: "base64", media_type: mediaType, data: base64 }
        },
        {
          type: "text",
          text: "Extract ALL text content from this document. Return only the raw text content, preserving structure where meaningful. Do not summarize — return everything."
        }
      ]
    }]
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error("Vision extraction failed");
  const data = await res.json();
  return data.content?.map(c => c.text || "").join("") || "";
}

async function extractDocxText(file) {
  // Read the DOCX zip and extract XML text content
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  // Convert to string and look for readable text between XML tags
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const content = decoder.decode(bytes);
  // Extract text between XML tags (basic DOCX parser)
  const textParts = [];
  const tagRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    textParts.push(match[1]);
  }
  const text = textParts.join(" ").replace(/\s+/g, " ").trim();
  if (text.length > 100) return text;
  // Fallback to vision if text extraction fails
  return extractViaVision(file);
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload  = () => res(reader.result.split(",")[1]);
    reader.onerror = () => rej(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

// ─── VOICE TTS ───────────────────────────────────────────────────────────────

function speakText(text, lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "hi" ? "hi-IN" : "en-US";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme]       = useState("dark");
  const [uiLang, setUiLang]     = useState("en");
  const [phase, setPhase]       = useState("upload"); // upload | processing | quiz | results
  const [file, setFile]         = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError]       = useState(null);
  const [processingStep, setProcessingStep] = useState(0);

  // Settings
  const [settings, setSettings] = useState({
    numQ: 10,
    difficulty: "mixed",
    lang: "en",
    topic: "",
    timerSecs: 0,
    shuffleQ: false,
    shuffleOpts: true,
    showAfter: true,
    adaptiveDiff: false,
  });

  // Quiz state
  const [quiz, setQuiz]           = useState(null); // { title, questions }
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]     = useState([]); // { selected, correct, skipped }
  const [showExpl, setShowExpl]   = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [timeLeft, setTimeLeft]   = useState(0);
  const [reviewFilter, setReviewFilter] = useState("all");
  const timerRef = useRef(null);
  const fileRef  = useRef(null);

  const t = TRANSLATIONS[uiLang];
  const isDark = theme === "dark";

  // ── THEME VARS ──
  const css = isDark ? {
    bg:       "#07080F",
    bgCard:   "#0F1120",
    bgCard2:  "#161830",
    bgInput:  "#0C0D1E",
    border:   "rgba(99,102,241,0.18)",
    border2:  "rgba(99,102,241,0.10)",
    ink1:     "#F0F1FF",
    ink2:     "#9899CC",
    ink3:     "#4A4B80",
    shadow:   "0 8px 40px rgba(0,0,0,0.5)",
    glow:     "0 0 40px rgba(99,102,241,0.2)",
    navBg:    "rgba(7,8,15,0.85)",
  } : {
    bg:       "#F5F6FF",
    bgCard:   "#FFFFFF",
    bgCard2:  "#F0F1FF",
    bgInput:  "#FFFFFF",
    border:   "rgba(99,102,241,0.14)",
    border2:  "rgba(99,102,241,0.08)",
    ink1:     "#0B0C2A",
    ink2:     "#3D3E7A",
    ink3:     "#9090C0",
    shadow:   "0 4px 24px rgba(99,102,241,0.10)",
    glow:     "0 0 40px rgba(99,102,241,0.08)",
    navBg:    "rgba(245,246,255,0.92)",
  };

  // ── TIMER ──
  useEffect(() => {
    if (phase !== "quiz" || !settings.timerSecs || showExpl) return;
    setTimeLeft(settings.timerSecs);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSkip();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIdx, phase, showExpl]);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ── FILE HANDLING ──
  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File too large. Max 20MB."); return; }
    setFile(f);
    setError(null);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── GENERATE QUIZ ──
  const handleGenerate = async () => {
    if (!file) return;
    setPhase("processing");
    setError(null);

    const steps = [
      t.processingStep1, t.processingStep2, t.processingStep3,
      t.processingStep4, t.processingStep5
    ];
    let stepIdx = 0;
    const stepTimer = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, steps.length - 1);
      setProcessingStep(stepIdx);
    }, 900);

    try {
      // 1. Extract text
      const text = await extractTextFromFile(file);
      if (!text || text.length < 50) throw new Error("Could not extract enough text from the file.");

      // 2. Generate quiz with AI
      const quizData = await generateQuizFromText(text, {
        ...settings,
        numQ: settings.numQ,
      });

      clearInterval(stepTimer);
      if (!quizData.questions?.length) throw new Error("AI did not return valid questions.");

      // Optionally shuffle questions
      const qs = settings.shuffleQ ? shuffle(quizData.questions) : quizData.questions;
      setQuiz({ ...quizData, questions: qs });
      setAnswers(qs.map(() => ({ selected: null, correct: false, skipped: false, timeSpent: 0 })));
      setCurrentIdx(0);
      setShowExpl(false);
      setPhase("quiz");
    } catch (err) {
      clearInterval(stepTimer);
      setError(err.message || "Generation failed. Please try again.");
      setPhase("upload");
    }
  };

  // ── QUIZ ACTIONS ──
  const handleSelect = (optIdx) => {
    if (showExpl && settings.showAfter) return;
    stopTimer();
    const q     = quiz.questions[currentIdx];
    const correct = optIdx === q.correct;
    setAnswers(prev => {
      const next = [...prev];
      next[currentIdx] = { ...next[currentIdx], selected: optIdx, correct, skipped: false };
      return next;
    });
    if (settings.showAfter) setShowExpl(true);
  };

  const handleSkip = () => {
    stopTimer();
    setAnswers(prev => {
      const next = [...prev];
      if (next[currentIdx].selected === null) next[currentIdx] = { ...next[currentIdx], skipped: true };
      return next;
    });
    goNext();
  };

  const goNext = () => {
    setShowExpl(false);
    if (currentIdx < quiz.questions.length - 1) setCurrentIdx(i => i + 1);
    else setPhase("results");
  };

  const goPrev = () => {
    stopTimer();
    setShowExpl(!!answers[currentIdx - 1]?.selected !== null && settings.showAfter);
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  const handleSubmit = () => { stopTimer(); setPhase("results"); };

  const toggleBookmark = (idx) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  // ── RESULTS CALCS ──
  const numCorrect = answers.filter(a => a.correct).length;
  const numWrong   = answers.filter(a => !a.correct && !a.skipped && a.selected !== null).length;
  const numSkipped = answers.filter(a => a.skipped || a.selected === null).length;
  const total      = quiz?.questions?.length || 0;
  const pct        = total ? Math.round((numCorrect / total) * 100) : 0;
  const grade      = getGrade(pct);

  const getResultMsg = () => {
    if (pct >= 80) return t.excellentMsg;
    if (pct >= 60) return t.goodMsg;
    if (pct >= 40) return t.okMsg;
    return t.lowMsg;
  };

  const filteredReview = quiz?.questions.filter((_, i) => {
    const a = answers[i];
    if (reviewFilter === "correct") return a?.correct;
    if (reviewFilter === "wrong")   return !a?.correct && !a?.skipped && a?.selected !== null;
    if (reviewFilter === "skipped") return a?.skipped || a?.selected === null;
    return true;
  }) ?? [];

  const getReviewIndex = (q) => quiz?.questions.indexOf(q);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh",
      background: css.bg,
      color: css.ink1,
      fontFamily: "'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif",
      transition: "background 0.4s, color 0.4s",
    }}>
      {/* Global styles via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #6366F1; border-radius: 5px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes timerWarn { 0%,100%{color:inherit} 50%{color:#F43F5E} }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-in { animation: fadeIn 0.4s ease both; }
        .scale-in { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .pulse-anim { animation: pulse 1.5s ease infinite; }
        button { cursor: pointer; }
        input, select, textarea { font-family: inherit; }
        .option-btn:hover { transform: translateX(4px); }
        .option-btn { transition: all 0.18s cubic-bezier(0.16,1,0.3,1) !important; }
        .hover-lift:hover { transform: translateY(-2px) !important; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-full { width: 100% !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: 60, display: "flex", alignItems: "center",
        padding: "0 clamp(16px,4vw,32px)",
        background: css.navBg,
        backdropFilter: "blur(24px)",
        borderBottom: `1px solid ${css.border2}`,
        gap: 12,
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:9, flex:1 }}>
          <div style={{
            width:34, height:34, borderRadius:10,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, boxShadow:"0 4px 14px rgba(99,102,241,0.4)",
          }}>🧠</div>
          <span style={{ fontSize:"1.1rem", fontWeight:800, letterSpacing:"-0.03em" }}>
            QuizAI
          </span>
          {quiz && phase !== "upload" && (
            <span style={{
              fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.06em",
              textTransform:"uppercase", color:"#818CF8",
              background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.22)",
              padding:"3px 10px", borderRadius:99, marginLeft:8
            }}>{quiz.title}</span>
          )}
        </div>

        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {/* Lang toggle */}
          <button
            onClick={() => setUiLang(l => l === "en" ? "hi" : "en")}
            style={{
              padding:"6px 14px", borderRadius:99, fontSize:"0.78rem", fontWeight:700,
              background: "rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.22)",
              color:"#818CF8", letterSpacing:"0.04em",
            }}
          >
            {uiLang === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            style={{
              width:36, height:36, borderRadius:9,
              border:`1px solid ${css.border}`,
              background: css.bgCard,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, color: css.ink2,
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main style={{ paddingTop:60, minHeight:"100vh" }}>

        {/* ══════════════════════════════════════════════════════════
            PHASE: UPLOAD
        ══════════════════════════════════════════════════════════ */}
        {phase === "upload" && (
          <div style={{ maxWidth:820, margin:"0 auto", padding:"clamp(32px,6vw,64px) clamp(16px,4vw,32px)" }}>

            {/* Hero */}
            <div className="fade-up" style={{ textAlign:"center", marginBottom:48 }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:7,
                fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
                color:"#818CF8", background:"rgba(99,102,241,0.10)", border:"1px solid rgba(99,102,241,0.22)",
                padding:"5px 14px", borderRadius:99, marginBottom:18
              }}>✨ AI-Powered Quiz Generator</div>
              <h1 style={{
                fontSize:"clamp(1.8rem, 5vw, 3.2rem)", fontWeight:800,
                letterSpacing:"-0.03em", lineHeight:1.15, marginBottom:14,
              }}>
                Transform any document into
                <br />
                <span style={{
                  background:"linear-gradient(125deg, #818CF8 0%, #F43F5E 50%, #F59E0B 100%)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                }}>
                  a powerful quiz
                </span>
              </h1>
              <p style={{ fontSize:"1rem", color:css.ink2, maxWidth:480, margin:"0 auto" }}>
                {t.tagline}
              </p>
            </div>

            {/* Upload zone */}
            <div
              className="fade-up"
              style={{ animationDelay:"0.1s" }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef} type="file" style={{ display:"none" }}
                accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp,.gif,.csv"
                onChange={e => handleFile(e.target.files[0])}
              />
              <div style={{
                border: `2px dashed ${dragOver ? "#6366F1" : file ? "#10B981" : css.border}`,
                borderRadius:20, padding:"clamp(32px,5vw,52px) 24px",
                textAlign:"center", cursor:"pointer",
                background: dragOver ? "rgba(99,102,241,0.06)" : file ? "rgba(16,185,129,0.05)" : css.bgCard,
                transition:"all 0.25s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: file ? "0 0 0 1px rgba(16,185,129,0.3)" : css.shadow,
              }}>
                <div style={{ fontSize:48, marginBottom:12 }}>
                  {file ? "✅" : dragOver ? "📂" : "📄"}
                </div>
                <h3 style={{ fontSize:"1.15rem", fontWeight:800, letterSpacing:"-0.02em", marginBottom:7 }}>
                  {file ? `${t.fileSelected}: ${file.name}` : t.uploadTitle}
                </h3>
                <p style={{ fontSize:"0.82rem", color:css.ink3, marginBottom:18 }}>
                  {file
                    ? `${(file.size / 1024 / 1024).toFixed(2)} MB — ${file.type || "document"}`
                    : t.uploadSub}
                </p>
                <button
                  onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                  style={{
                    padding:"9px 22px", borderRadius:99, fontSize:"0.82rem", fontWeight:700,
                    background: file ? "rgba(16,185,129,0.12)" : "rgba(99,102,241,0.12)",
                    border: `1px solid ${file ? "rgba(16,185,129,0.3)" : "rgba(99,102,241,0.25)"}`,
                    color: file ? "#10B981" : "#818CF8",
                  }}
                >
                  {file ? "Change File" : t.uploadBtn}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="fade-in" style={{
                marginTop:14, padding:"12px 16px", borderRadius:12,
                background:"rgba(244,63,94,0.10)", border:"1px solid rgba(244,63,94,0.25)",
                color:"#F43F5E", fontSize:"0.875rem", fontWeight:600,
              }}>⚠️ {error}</div>
            )}

            {/* Settings */}
            <div className="fade-up" style={{ animationDelay:"0.2s", marginTop:28 }}>
              <div style={{
                background:css.bgCard, border:`1px solid ${css.border}`,
                borderRadius:20, padding:"clamp(20px,3vw,32px)",
                boxShadow:css.shadow,
              }}>
                <h2 style={{ fontSize:"0.95rem", fontWeight:800, letterSpacing:"-0.01em", marginBottom:22 }}>
                  ⚙️ {t.settingsTitle}
                </h2>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:20 }}>
                  {/* Num questions */}
                  <SettingGroup label={t.numQuestions} css={css}>
                    <select
                      value={settings.numQ}
                      onChange={e => setSettings(s => ({ ...s, numQ: +e.target.value }))}
                      style={selectStyle(css)}
                    >
                      {[5,8,10,15,20,25].map(n => (
                        <option key={n} value={n}>{n} Questions</option>
                      ))}
                    </select>
                  </SettingGroup>

                  {/* Difficulty */}
                  <SettingGroup label={t.difficulty} css={css}>
                    <select
                      value={settings.difficulty}
                      onChange={e => setSettings(s => ({ ...s, difficulty: e.target.value }))}
                      style={selectStyle(css)}
                    >
                      <option value="mixed">{t.mixed}</option>
                      <option value="easy">{t.easy}</option>
                      <option value="medium">{t.medium}</option>
                      <option value="hard">{t.hard}</option>
                    </select>
                  </SettingGroup>

                  {/* Quiz language */}
                  <SettingGroup label={t.language} css={css}>
                    <select
                      value={settings.lang}
                      onChange={e => setSettings(s => ({ ...s, lang: e.target.value }))}
                      style={selectStyle(css)}
                    >
                      <option value="en">English 🇬🇧</option>
                      <option value="hi">हिंदी 🇮🇳</option>
                    </select>
                  </SettingGroup>

                  {/* Timer */}
                  <SettingGroup label={t.timerLabel} css={css}>
                    <select
                      value={settings.timerSecs}
                      onChange={e => setSettings(s => ({ ...s, timerSecs: +e.target.value }))}
                      style={selectStyle(css)}
                    >
                      <option value={0}>{t.noTimer}</option>
                      <option value={30}>{t.secs30}</option>
                      <option value={60}>{t.secs60}</option>
                      <option value={90}>{t.secs90}</option>
                    </select>
                  </SettingGroup>
                </div>

                {/* Topic input */}
                <SettingGroup label={t.topicLabel} css={css} style={{ marginBottom:20 }}>
                  <input
                    type="text"
                    value={settings.topic}
                    onChange={e => setSettings(s => ({ ...s, topic: e.target.value }))}
                    placeholder={t.topicPlaceholder}
                    style={{
                      ...selectStyle(css),
                      width:"100%",
                    }}
                  />
                </SettingGroup>

                {/* Toggles */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:24 }}>
                  {[
                    { key:"shuffleQ",    label:t.shuffleQ },
                    { key:"shuffleOpts", label:t.shuffleOpts },
                    { key:"showAfter",   label:t.showAfter },
                  ].map(({ key, label }) => (
                    <ToggleChip
                      key={key}
                      label={label}
                      value={settings[key]}
                      onChange={v => setSettings(s => ({ ...s, [key]: v }))}
                      css={css}
                    />
                  ))}
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={!file}
                  className="hover-lift"
                  style={{
                    width:"100%", padding:"15px 24px", borderRadius:99,
                    fontSize:"1rem", fontWeight:800, letterSpacing:"-0.01em",
                    background: file
                      ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
                      : css.bgCard2,
                    border: "none",
                    color: file ? "#fff" : css.ink3,
                    boxShadow: file ? "0 8px 32px rgba(99,102,241,0.40)" : "none",
                    cursor: file ? "pointer" : "not-allowed",
                    transition:"all 0.25s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {t.generateBtn} →
                </button>
              </div>
            </div>

            {/* Feature pills */}
            <div className="fade-up" style={{ animationDelay:"0.3s", marginTop:24, display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
              {["📄 PDF & DOCX","🖼️ Images","📝 Text files","🧠 AI Explanations","⏱️ Timer Mode","🌐 Hindi/English"].map(f => (
                <span key={f} style={{
                  fontSize:"0.76rem", fontWeight:600, color:css.ink3,
                  background:css.bgCard, border:`1px solid ${css.border2}`,
                  padding:"5px 13px", borderRadius:99,
                }}>{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            PHASE: PROCESSING
        ══════════════════════════════════════════════════════════ */}
        {phase === "processing" && (
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            minHeight:"calc(100vh - 60px)",
          }}>
            <div className="scale-in" style={{
              background:css.bgCard, border:`1px solid ${css.border}`,
              borderRadius:24, padding:"48px 40px",
              textAlign:"center", maxWidth:380, width:"90%",
              boxShadow:css.shadow,
            }}>
              {/* Brain animation */}
              <div style={{ fontSize:52, marginBottom:16, animation:"pulse 1.5s ease infinite" }}>🧠</div>
              <h2 style={{ fontSize:"1.3rem", fontWeight:800, letterSpacing:"-0.02em", marginBottom:8 }}>
                {t.processingTitle}
              </h2>
              <p style={{ fontSize:"0.875rem", color:css.ink2, marginBottom:28 }}>
                {[t.processingStep1,t.processingStep2,t.processingStep3,t.processingStep4,t.processingStep5][processingStep]}
              </p>
              {/* Spinner */}
              <div style={{
                width:44, height:44, borderRadius:"50%",
                border:`3px solid ${css.border}`, borderTopColor:"#6366F1",
                animation:"spin 0.8s linear infinite", margin:"0 auto 24px",
              }} />
              {/* Progress dots */}
              <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{
                    width:8, height:8, borderRadius:"50%",
                    background: i <= processingStep ? "#6366F1" : css.border,
                    transition:"background 0.3s",
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            PHASE: QUIZ
        ══════════════════════════════════════════════════════════ */}
        {phase === "quiz" && quiz && (
          <div style={{ maxWidth:700, margin:"0 auto", padding:"24px clamp(16px,4vw,32px) 80px" }}>

            {/* Quiz top bar */}
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              gap:12, marginBottom:20, flexWrap:"wrap",
            }}>
              {/* Progress */}
              <div style={{ fontSize:"0.8rem", fontWeight:600, color:css.ink3 }}>
                <span style={{ color:css.ink1, fontWeight:800 }}>{t.questionOf} {currentIdx + 1}</span>
                {" "}{t.of}{" "}{quiz.questions.length}
              </div>

              {/* Dot trail */}
              <div style={{ display:"flex", gap:5, flex:1, justifyContent:"center", flexWrap:"wrap", maxWidth:300 }}>
                {quiz.questions.map((_, i) => {
                  const a = answers[i];
                  const isActive = i === currentIdx;
                  const color = isActive ? "#6366F1"
                    : a?.correct ? "#10B981"
                    : a?.selected !== null ? "#F43F5E"
                    : a?.skipped ? "#F59E0B"
                    : css.border;
                  return (
                    <div key={i} style={{
                      width: isActive ? 20 : 8, height:8,
                      borderRadius:4,
                      background:color,
                      transition:"all 0.3s",
                      cursor:"pointer",
                    }} onClick={() => { stopTimer(); setCurrentIdx(i); setShowExpl(settings.showAfter && answers[i]?.selected !== null); }} />
                  );
                })}
              </div>

              {/* Timer */}
              {settings.timerSecs > 0 && (
                <div style={{
                  display:"flex", alignItems:"center", gap:6,
                  fontSize:"0.85rem", fontWeight:800,
                  color: timeLeft <= 10 ? "#F43F5E" : timeLeft <= settings.timerSecs * 0.3 ? "#F59E0B" : "#10B981",
                  animation: timeLeft <= 10 ? "timerWarn 0.6s ease infinite" : "none",
                }}>
                  ⏱️ {timeLeft}s
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ height:3, background:css.border2, borderRadius:3, marginBottom:22, overflow:"hidden" }}>
              <div style={{
                height:"100%", borderRadius:3,
                width:`${((currentIdx + 1) / quiz.questions.length) * 100}%`,
                background:"linear-gradient(90deg, #6366F1, #F43F5E)",
                transition:"width 0.5s cubic-bezier(0.16,1,0.3,1)",
              }} />
            </div>

            {/* Question card */}
            <div key={currentIdx} className="fade-up" style={{
              background:css.bgCard, border:`1px solid ${css.border}`,
              borderRadius:20, padding:"clamp(20px,3vw,32px)",
              marginBottom:14, boxShadow:css.shadow,
              position:"relative", overflow:"hidden",
            }}>
              {/* Difficulty badge */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{
                  fontSize:"0.68rem", fontWeight:700, textTransform:"uppercase",
                  letterSpacing:"0.1em", color:"#818CF8",
                }}>Q{currentIdx + 1}</span>
                <DiffBadge diff={quiz.questions[currentIdx]?.difficulty} />
                {quiz.questions[currentIdx]?.topic && (
                  <span style={{
                    fontSize:"0.68rem", fontWeight:600, color:css.ink3,
                    background:css.bgCard2, border:`1px solid ${css.border2}`,
                    padding:"2px 9px", borderRadius:99,
                  }}>{quiz.questions[currentIdx].topic}</span>
                )}
                <div style={{ marginLeft:"auto", display:"flex", gap:7 }}>
                  {/* Bookmark */}
                  <button
                    onClick={() => toggleBookmark(currentIdx)}
                    style={{
                      width:30, height:30, borderRadius:7,
                      border:`1px solid ${bookmarks.has(currentIdx) ? "#F59E0B" : css.border}`,
                      background: bookmarks.has(currentIdx) ? "rgba(245,158,11,0.1)" : "transparent",
                      color: bookmarks.has(currentIdx) ? "#F59E0B" : css.ink3,
                      fontSize:"0.85rem", display:"flex", alignItems:"center", justifyContent:"center",
                    }}
                  >🔖</button>
                  {/* TTS */}
                  <button
                    onClick={() => speakText(quiz.questions[currentIdx].question, settings.lang)}
                    style={{
                      width:30, height:30, borderRadius:7,
                      border:`1px solid ${css.border}`,
                      background:"transparent", color:css.ink3, fontSize:"0.85rem",
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}
                  >🔊</button>
                </div>
              </div>

              <p style={{
                fontSize:"clamp(0.95rem, 2.2vw, 1.1rem)", fontWeight:700,
                lineHeight:1.6, letterSpacing:"-0.01em", color:css.ink1,
              }}>
                {quiz.questions[currentIdx].question}
              </p>
            </div>

            {/* Options */}
            <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:14 }} className="fade-up" style={{ animationDelay:"0.05s" }}>
              {quiz.questions[currentIdx].options.map((opt, i) => {
                const ans      = answers[currentIdx];
                const answered = ans?.selected !== null;
                const isSelected = ans?.selected === i;
                const isCorrect  = i === quiz.questions[currentIdx].correct;
                const reveal     = showExpl || (!settings.showAfter && answered);

                let borderColor = css.border;
                let bgColor     = css.bgCard2;
                let textColor   = css.ink2;
                let letterBg    = css.bgCard;

                if (reveal) {
                  if (isCorrect) { borderColor = "#10B981"; bgColor = "rgba(16,185,129,0.09)"; textColor = "#10B981"; letterBg = "#10B981"; }
                  else if (isSelected) { borderColor = "#F43F5E"; bgColor = "rgba(244,63,94,0.09)"; textColor = "#F43F5E"; letterBg = "#F43F5E"; }
                } else if (isSelected) {
                  borderColor = "#6366F1"; bgColor = "rgba(99,102,241,0.10)"; textColor = css.ink1; letterBg = "#6366F1";
                }

                return (
                  <button
                    key={i}
                    className="option-btn"
                    disabled={answered && settings.showAfter}
                    onClick={() => handleSelect(i)}
                    style={{
                      display:"flex", alignItems:"center", gap:12,
                      padding:"13px 16px", borderRadius:13,
                      border:`1.5px solid ${borderColor}`,
                      background:bgColor, cursor: (answered && settings.showAfter) ? "default" : "pointer",
                      textAlign:"left", width:"100%", fontFamily:"inherit",
                    }}
                  >
                    <span style={{
                      minWidth:30, height:30, borderRadius:8,
                      background: (reveal && isCorrect) || (isSelected && !reveal) ? letterBg : "transparent",
                      border:`1.5px solid ${borderColor}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"0.78rem", fontWeight:800, color: (reveal && isCorrect) || (isSelected && !reveal) ? "#fff" : css.ink2,
                      transition:"all 0.18s", flexShrink:0,
                    }}>
                      {["A","B","C","D","E"][i]}
                    </span>
                    <span style={{ flex:1, fontSize:"0.9rem", fontWeight:600, color:textColor, lineHeight:1.45 }}>
                      {opt}
                    </span>
                    {reveal && isCorrect && <span>✅</span>}
                    {reveal && isSelected && !isCorrect && <span>❌</span>}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExpl && quiz.questions[currentIdx].explanation && (
              <div className="fade-in" style={{
                background: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)",
                border:`1px solid rgba(99,102,241,0.22)`,
                borderRadius:13, padding:"14px 16px", marginBottom:14,
              }}>
                <div style={{ fontSize:"0.7rem", fontWeight:700, color:"#818CF8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>
                  💡 {t.explanation}
                </div>
                <p style={{ fontSize:"0.875rem", color:css.ink2, lineHeight:1.7 }}>
                  {quiz.questions[currentIdx].explanation}
                </p>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
              <button onClick={goPrev} disabled={currentIdx === 0} style={navBtnStyle(css, currentIdx === 0)}>
                {t.prevBtn}
              </button>
              <button onClick={handleSkip} style={navBtnStyle(css, false, true)}>
                {t.skipBtn}
              </button>
              <div style={{ flex:1 }} />
              {currentIdx < quiz.questions.length - 1 ? (
                <button onClick={goNext} style={primaryBtnStyle}>
                  {t.nextBtn}
                </button>
              ) : (
                <button onClick={handleSubmit} style={primaryBtnStyle}>
                  {t.submitBtn} ✓
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            PHASE: RESULTS
        ══════════════════════════════════════════════════════════ */}
        {phase === "results" && quiz && (
          <div style={{ maxWidth:720, margin:"0 auto", padding:"24px clamp(16px,4vw,32px) 80px" }}>

            {/* Score Hero */}
            <div className="scale-in" style={{
              background:css.bgCard, border:`1px solid ${css.border}`,
              borderRadius:24, padding:"clamp(28px,4vw,48px) 24px",
              textAlign:"center", marginBottom:16,
              boxShadow:css.shadow, position:"relative", overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", inset:0,
                background:"radial-gradient(ellipse at center, rgba(99,102,241,0.10), transparent 65%)",
                pointerEvents:"none",
              }} />
              <div style={{ fontSize:52, marginBottom:10 }}>
                {pct >= 80 ? "🏆" : pct >= 60 ? "🌟" : pct >= 40 ? "💪" : "📚"}
              </div>
              <h2 style={{ fontSize:"clamp(1.1rem,3vw,1.5rem)", fontWeight:800, letterSpacing:"-0.02em", marginBottom:6 }}>
                {t.quizComplete}
              </h2>
              <p style={{ color:css.ink3, fontSize:"0.875rem", marginBottom:20 }}>{getResultMsg()}</p>
              {/* Big score */}
              <div style={{
                fontSize:"clamp(3rem,12vw,5.5rem)", fontWeight:800, letterSpacing:"-0.04em",
                background:"linear-gradient(125deg, #818CF8, #F43F5E)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                lineHeight:1,
              }}>{numCorrect}/{total}</div>
              <div style={{ color:css.ink3, fontSize:"0.875rem", marginTop:6 }}>correct answers</div>
              <div style={{ fontSize:"1.2rem", fontWeight:800, marginTop:8, color:css.ink1 }}>{pct}%</div>
              <div style={{
                display:"inline-block", padding:"4px 18px", borderRadius:99,
                background: grade.color + "20", color:grade.color,
                fontWeight:800, fontSize:"0.85rem", marginTop:12,
              }}>Grade {grade.label}</div>
            </div>

            {/* Stats row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
              {[
                { icon:"✅", val:numCorrect, label:t.correct, color:"#10B981" },
                { icon:"❌", val:numWrong,   label:t.wrong,   color:"#F43F5E" },
                { icon:"⏭️", val:numSkipped, label:t.skipped, color:"#F59E0B" },
                { icon:"🎯", val:pct+"%",    label:t.accuracy, color:"#6366F1" },
              ].map(({ icon, val, label, color }) => (
                <div key={label} className="fade-in" style={{
                  background:css.bgCard, border:`1px solid ${css.border}`,
                  borderRadius:14, padding:"16px 10px", textAlign:"center",
                  boxShadow:css.shadow,
                }}>
                  <div style={{ fontSize:"1.2rem", marginBottom:5 }}>{icon}</div>
                  <div style={{ fontSize:"1.5rem", fontWeight:800, letterSpacing:"-0.03em", color, lineHeight:1 }}>{val}</div>
                  <div style={{ fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:css.ink3, marginTop:4 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Analysis bars */}
            <div className="fade-in" style={{
              background:css.bgCard, border:`1px solid ${css.border}`,
              borderRadius:18, padding:"22px", marginBottom:16, boxShadow:css.shadow,
            }}>
              <h3 style={{ fontSize:"0.9rem", fontWeight:800, marginBottom:18 }}>📊 Performance Analysis</h3>
              {[
                { label:t.correct, pct:Math.round(numCorrect/total*100), color:"#10B981" },
                { label:t.wrong,   pct:Math.round(numWrong/total*100),   color:"#F43F5E" },
                { label:t.skipped, pct:Math.round(numSkipped/total*100), color:"#F59E0B" },
              ].map(({ label, pct: barPct, color }) => (
                <div key={label} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.82rem", fontWeight:600, marginBottom:5 }}>
                    <span>{label}</span><span style={{ color:css.ink3 }}>{barPct}%</span>
                  </div>
                  <div style={{ height:8, background:css.border2, borderRadius:4, overflow:"hidden" }}>
                    <div style={{
                      height:"100%", borderRadius:4, background:color,
                      width:`${barPct}%`, transition:"width 1s cubic-bezier(0.34,1.56,0.64,1)",
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Review section */}
            <div className="fade-in" style={{
              background:css.bgCard, border:`1px solid ${css.border}`,
              borderRadius:18, padding:"22px", marginBottom:20, boxShadow:css.shadow,
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:18 }}>
                <h3 style={{ fontSize:"0.9rem", fontWeight:800 }}>📋 {t.reviewTitle}</h3>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[
                    { key:"all",     label:t.allFilter,     active:"#6366F1" },
                    { key:"correct", label:t.correctFilter, active:"#10B981" },
                    { key:"wrong",   label:t.wrongFilter,   active:"#F43F5E" },
                    { key:"skipped", label:t.skippedFilter, active:"#F59E0B" },
                  ].map(({ key, label, active }) => (
                    <button key={key} onClick={() => setReviewFilter(key)} style={{
                      padding:"5px 13px", borderRadius:99, fontSize:"0.75rem", fontWeight:700,
                      background: reviewFilter === key ? active : "transparent",
                      border:`1.5px solid ${reviewFilter === key ? active : css.border}`,
                      color: reviewFilter === key ? "#fff" : css.ink3,
                      transition:"all 0.18s",
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              {filteredReview.map((q) => {
                const i  = getReviewIndex(q);
                const a  = answers[i];
                const itemType = a?.correct ? "correct" : a?.skipped || a?.selected === null ? "skipped" : "wrong";
                const borderC  = itemType === "correct" ? "rgba(16,185,129,0.3)" : itemType === "wrong" ? "rgba(244,63,94,0.3)" : "rgba(245,158,11,0.3)";
                const icon     = itemType === "correct" ? "✅" : itemType === "wrong" ? "❌" : "⏭️";
                return (
                  <div key={i} style={{
                    background:css.bgCard2, border:`1.5px solid ${borderC}`,
                    borderRadius:13, padding:"16px", marginBottom:10,
                  }}>
                    <div style={{ display:"flex", gap:9, alignItems:"flex-start", marginBottom:12 }}>
                      <span style={{ fontSize:"0.9rem", flexShrink:0, marginTop:2 }}>{icon}</span>
                      <span style={{ fontSize:"0.9rem", fontWeight:700, color:css.ink1, letterSpacing:"-0.01em", lineHeight:1.45, flex:1 }}>
                        {q.question}
                      </span>
                      <span style={{ fontSize:"0.68rem", fontWeight:700, color:css.ink3, whiteSpace:"nowrap" }}>Q{i+1}</span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:q.explanation ? 10 : 0 }}>
                      {q.options.map((opt, oi) => {
                        const isC = oi === q.correct;
                        const isSel = oi === a?.selected;
                        let style = { color:css.ink3, background:"transparent", borderColor: css.border2 };
                        if (isC)         style = { color:"#10B981", background:"rgba(16,185,129,0.08)", borderColor:"rgba(16,185,129,0.25)" };
                        else if (isSel)  style = { color:"#F43F5E", background:"rgba(244,63,94,0.08)",  borderColor:"rgba(244,63,94,0.25)" };
                        return (
                          <div key={oi} style={{
                            display:"flex", gap:9, alignItems:"center",
                            padding:"7px 11px", borderRadius:8,
                            border:`1px solid ${style.borderColor}`,
                            background:style.background,
                            fontSize:"0.82rem", fontWeight:600, color:style.color,
                          }}>
                            <span style={{
                              width:20, height:20, borderRadius:5,
                              border:`1px solid ${style.borderColor}`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:"0.65rem", fontWeight:800, flexShrink:0,
                            }}>{["A","B","C","D","E"][oi]}</span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div style={{
                        background:"rgba(99,102,241,0.07)", border:"1px solid rgba(99,102,241,0.18)",
                        borderRadius:9, padding:"10px 13px",
                        fontSize:"0.82rem", color:css.ink2, lineHeight:1.65,
                      }}>
                        <span style={{ fontSize:"0.68rem", fontWeight:700, color:"#818CF8", textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:5 }}>💡 Explanation</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA buttons */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button onClick={() => {
                setCurrentIdx(0); setShowExpl(false);
                setAnswers(quiz.questions.map(() => ({ selected:null, correct:false, skipped:false })));
                setPhase("quiz");
              }} style={primaryBtnStyle}>{t.retryBtn}</button>
              <button onClick={() => { setFile(null); setQuiz(null); setPhase("upload"); }} style={{
                ...primaryBtnStyle,
                background:"transparent",
                border:`1.5px solid ${css.border}`,
                color:css.ink1,
                boxShadow:"none",
              }}>{t.newQuizBtn}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function SettingGroup({ label, css, children, style = {} }) {
  return (
    <div style={style}>
      <label style={{ display:"block", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", color:css.ink3, marginBottom:7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleChip({ label, value, onChange, css }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        display:"flex", alignItems:"center", gap:7,
        padding:"7px 14px", borderRadius:99,
        border:`1.5px solid ${value ? "#6366F1" : css.border}`,
        background: value ? "rgba(99,102,241,0.12)" : "transparent",
        color: value ? "#818CF8" : css.ink3,
        fontSize:"0.78rem", fontWeight:700,
        transition:"all 0.18s",
      }}
    >
      <div style={{
        width:16, height:16, borderRadius:8,
        background: value ? "#6366F1" : css.border2,
        border:`2px solid ${value ? "#6366F1" : css.ink3}`,
        transition:"all 0.18s", flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        {value && <div style={{ width:6, height:6, borderRadius:3, background:"#fff" }} />}
      </div>
      {label}
    </button>
  );
}

function DiffBadge({ diff }) {
  const color = DIFFICULTY_COLORS[diff] || DIFFICULTY_COLORS.mixed;
  if (!diff) return null;
  return (
    <span style={{
      fontSize:"0.65rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em",
      padding:"2px 9px", borderRadius:99,
      background:`${color}18`, color,
      border:`1px solid ${color}30`,
    }}>{diff}</span>
  );
}

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────

function selectStyle(css) {
  return {
    width:"100%", padding:"10px 13px", borderRadius:11,
    border:`1.5px solid ${css.border}`, background:css.bgInput,
    color:css.ink1, fontSize:"0.875rem", fontWeight:500,
    outline:"none", appearance:"none",
    backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23818CF8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
    paddingRight:36,
  };
}

function navBtnStyle(css, disabled, ghost = false) {
  return {
    padding:"9px 18px", borderRadius:99, fontSize:"0.82rem", fontWeight:700,
    border:`1.5px solid ${css.border}`, background:"transparent", color:css.ink2,
    opacity: disabled ? 0.35 : 1, cursor: disabled ? "not-allowed" : "pointer",
    transition:"all 0.18s",
  };
}

const primaryBtnStyle = {
  padding:"11px 24px", borderRadius:99, fontSize:"0.875rem", fontWeight:800,
  background:"linear-gradient(135deg, #6366F1, #8B5CF6)",
  border:"none", color:"#fff",
  boxShadow:"0 6px 24px rgba(99,102,241,0.40)",
  transition:"all 0.22s cubic-bezier(0.16,1,0.3,1)",
};
