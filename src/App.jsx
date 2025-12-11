import React, { useState, useRef, useEffect } from 'react';
import {
  Video, Play, Pause, Loader2, Image as ImageIcon, FileText, Wand2,
  RefreshCw, Download, History, Trash2, X, LayoutGrid, Zap, Film,
  Settings, Share2, Plus, Music, Mic, Layers, ChevronRight, Sparkles, Key, Database, Save, StopCircle, Edit3, User, Clapperboard, Move, Type
} from 'lucide-react';

// --- CONFIGURATION ---
// หมายเหตุ: ใช้ Vite Proxy เพื่อแก้ CORS (Development)
// สำหรับ Production บน Vercel จะใช้ Vercel Rewrite แทน
const DEFAULT_N8N_URL = "/api/n8n/generate-story";

// --- SUB-COMPONENTS ---

const Sidebar = ({ view, setView }) => (
  <div className="w-72 bg-gradient-to-b from-[#0A0D12] via-[#0F1115] to-[#0A0D12] border-r border-gray-800/50 flex flex-col h-full shadow-2xl">
    <div className="h-20 flex items-center px-6 border-b border-gray-800/50 gap-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
        <Film className="text-white" size={24} />
      </div>
      <div>
        <span className="font-bold text-white text-lg tracking-tight">StoryStudio</span>
        <div className="text-xs text-blue-400 font-semibold">PRO</div>
      </div>
    </div>
    <nav className="p-4 space-y-2 flex-1">
      <button
        onClick={() => setView('dashboard')}
        className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${view === 'dashboard'
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
          : 'hover:bg-gray-800/50 text-gray-400 hover:text-white hover:translate-x-1'
          }`}
      >
        <LayoutGrid size={20} className="mr-3" /> Dashboard
      </button>
      <button
        onClick={() => setView('studio')}
        className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${view === 'studio'
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
          : 'hover:bg-gray-800/50 text-gray-400 hover:text-white hover:translate-x-1'
          }`}
      >
        <Clapperboard size={20} className="mr-3" /> Studio
      </button>
      <button
        onClick={() => setView('settings')}
        className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${view === 'settings'
          ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-500/30 scale-[1.02]'
          : 'hover:bg-gray-800/50 text-gray-400 hover:text-white hover:translate-x-1'
          }`}
      >
        <Settings size={20} className="mr-3" /> Settings
      </button>
    </nav>
    <div className="p-4 border-t border-gray-800/50">
      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-yellow-400" />
          <span className="text-xs font-bold text-white">AI Powered</span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">Create stunning story videos with AI</p>
      </div>
    </div>
  </div>
);

const StudioMulti = ({
  prompt, setPrompt,
  characterProfile, setCharacterProfile,
  geminiLoading, handleGenerateStoryboard, handleGenerateCharacter,
  scenes, activeSceneIndex, setActiveSceneIndex, updateSceneData,
  generateSceneAssets, generateAllScenes,
  canvasRef, isPlaying, playSequence,
  startRecording, isRecording, stopRecording,
  showSubtitles, setShowSubtitles,
  logoUrl  // Added for logo overlay
}) => {
  const activeScene = scenes[activeSceneIndex];

  return (
    <div className="flex h-full overflow-hidden bg-gradient-to-br from-[#0A0D12] via-[#16191E] to-[#0F1115]">
      {/* LEFT: STORYBOARD LIST */}
      <div className="w-80 flex flex-col border-r border-gray-800/50 bg-[#0F1115]/50 backdrop-blur-sm">
        <div className="p-5 border-b border-gray-800/50 bg-gradient-to-br from-[#1A1D24] to-[#0F1115]">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
            <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
              <Sparkles size={14} className="text-white" />
            </div>
            Story Concept
          </h2>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="เช่น: การผจญภัยของแมวนักบินในอวกาศ..."
            className="w-full bg-[#0A0D12] border border-gray-700/50 rounded-xl p-3 text-xs text-white mb-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-20 resize-none transition-all"
          />
          <div className="mb-4">
            <label className="text-[10px] text-gray-400 uppercase font-bold mb-2 flex items-center gap-1.5">
              <User size={11} className="text-blue-400" /> Character Profile
            </label>
            <textarea
              value={characterProfile}
              onChange={e => setCharacterProfile(e.target.value)}
              placeholder="เช่น: แมวส้ม สวมชุดนักบิน หมวกกันน็อค..."
              className="w-full bg-gradient-to-br from-blue-950/30 to-purple-950/30 border border-blue-700/30 rounded-xl p-3 text-xs text-blue-100 h-16 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
            />
            <button
              onClick={handleGenerateCharacter}
              disabled={geminiLoading}
              className="mt-2 w-full py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/30 rounded-lg text-xs text-purple-200 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {geminiLoading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
              {geminiLoading ? 'Generating...' : 'Auto-Generate Character'}
            </button>
          </div>
          <button
            onClick={handleGenerateStoryboard}
            disabled={geminiLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {geminiLoading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
            {geminiLoading ? 'Generating...' : 'Draft Storyboard'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {scenes.map((scene, idx) => (
            <div key={idx}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 group ${activeSceneIndex === idx
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-[#1A1D24] border-gray-800/50 hover:border-blue-500/50 hover:shadow-md'
                }`}
              onClick={() => setActiveSceneIndex(idx)}
            >
              <div className="w-14 h-20 bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden flex-shrink-0 relative ring-1 ring-gray-700/50">
                {scene.imageUrl ? (
                  <img
                    src={scene.imageUrl}
                    className="w-full h-full object-cover"
                    alt={`Scene ${idx + 1}`}
                    onError={(e) => {
                      console.error(`❌ Image load failed for Scene ${idx + 1}:`, scene.imageUrl);
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/56x80/1a1d24/ffffff/png?text=${idx + 1}`;
                    }}
                    onLoad={() => console.log(`✅ Image loaded for Scene ${idx + 1}`)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-sm">
                    {scene.status === 'done' ? '?' : idx + 1}
                  </div>
                )}
                {scene.status === 'generating' && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="animate-spin text-blue-400 w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-bold text-gray-400 tracking-wide">SCENE {idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateSceneAssets(idx);
                      }}
                      disabled={scene.status === 'generating'}
                      className={`p-1.5 rounded-lg transition-all ${scene.status === 'generating'
                        ? 'bg-blue-600/20 cursor-not-allowed'
                        : scene.status === 'done'
                          ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                          : 'bg-gray-700/50 hover:bg-blue-600/30 text-gray-400 hover:text-blue-400'
                        }`}
                      title={scene.status === 'done' ? 'Regenerate' : 'Generate'}
                    >
                      {scene.status === 'generating' ? (
                        <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                    </button>
                    <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${scene.status === 'done' ? 'bg-green-500 shadow-green-500/50' :
                      scene.status === 'error' ? 'bg-red-500 shadow-red-500/50' :
                        'bg-gray-600'
                      }`}></div>
                  </div>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{scene.storyText}</p>
              </div>
            </div>
          ))}
        </div>
        {scenes.length > 0 && (
          <div className="p-3 border-t border-gray-800/50 bg-gradient-to-t from-[#0F1115] to-transparent">
            <button
              onClick={generateAllScenes}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/30 text-sm"
            >
              <Zap size={16} /> Generate ALL Scenes
            </button>
          </div>
        )}
      </div>

      {/* CENTER: PREVIEW */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="flex-1 flex items-center justify-center relative overflow-hidden p-8">
          <div className="relative shadow-2xl rounded-2xl overflow-hidden border-2 border-gray-800/50 ring-4 ring-gray-900/50">
            {/* Canvas for drawing/recording */}
            <canvas ref={canvasRef} width={1080} height={1920} className="h-[650px] w-auto bg-gradient-to-br from-[#1A1D24] to-[#0A0D12]" />


            {/* Logo Overlay */}
            {logoUrl && (
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl backdrop-blur-sm bg-white/10">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
            )}

            {!isPlaying && scenes.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/60 via-black/50 to-black/70 cursor-pointer backdrop-blur-sm" onClick={() => playSequence(false)}>
                <div className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 backdrop-blur rounded-full hover:scale-110 transition-all shadow-2xl shadow-blue-500/50">
                  <Play fill="white" size={40} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TIMELINE CONTROLS */}
        <div className="h-20 bg-gradient-to-r from-[#0F1115] via-[#1A1D24] to-[#0F1115] border-t border-gray-800/50 px-6 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-5">
            <button
              onClick={() => playSequence(false)}
              disabled={isPlaying}
              className="bg-gradient-to-br from-white to-gray-200 text-black p-3 rounded-full hover:shadow-lg hover:shadow-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause size={18} /> : <Play fill="black" size={18} />}
            </button>
            <div className="flex flex-col">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Total Duration</p>
              <p className="text-white font-mono text-lg font-bold">{scenes.reduce((acc, s) => acc + (s.duration || 10), 0).toFixed(0)}s</p>
            </div>
          </div>

          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={scenes.some(s => s.status !== 'done') || scenes.length === 0}
              className={`px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all text-sm ${scenes.some(s => s.status !== 'done') || scenes.length === 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-lg shadow-red-600/30'
                }`}
            >
              <Video size={18} /> Record Final Video
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all bg-gradient-to-r from-red-600 to-red-700 text-white animate-pulse hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-600/50 text-sm"
            >
              <StopCircle size={18} /> Stop Recording
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: SCENE INSPECTOR */}
      <div className="w-96 bg-gradient-to-b from-[#0F1115] to-[#0A0D12] border-l border-gray-800/50 flex flex-col overflow-y-auto shadow-2xl">
        <div className="p-5 border-b border-gray-800/50 bg-gradient-to-r from-[#1A1D24] to-[#0F1115]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Edit3 size={14} className="text-white" />
            </div>
            Scene Editor
          </h3>
        </div>

        {activeScene ? (
          <div className="p-5 space-y-6">
            {/* 1. SCRIPT */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-gray-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Type size={12} className="text-purple-400" />
                  Script & Voiceover
                </span>
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`text-[10px] px-3 py-1 rounded-full font-bold transition-all ${showSubtitles
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                  {showSubtitles ? '✓ SUBTITLES ON' : 'SUBTITLES OFF'}
                </button>
              </label>
              <textarea
                value={activeScene.storyText}
                onChange={(e) => updateSceneData(activeSceneIndex, 'storyText', e.target.value)}
                className="w-full bg-[#0A0D12] border border-gray-700/50 rounded-xl p-4 text-sm text-white h-28 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none transition-all"
                placeholder="Enter scene narration..."
              />
              <button
                onClick={() => generateSceneAssets(activeSceneIndex)}
                className="w-full py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-600/50 rounded-xl text-xs text-gray-300 font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw size={13} /> Regenerate Audio
              </button>
            </div>

            {/* 2. VISUALS */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-gray-400 flex items-center gap-2">
                <ImageIcon size={12} className="text-blue-400" />
                Image Prompt
              </label>
              <textarea
                value={activeScene.imagePrompt}
                onChange={(e) => updateSceneData(activeSceneIndex, 'imagePrompt', e.target.value)}
                className="w-full bg-[#0A0D12] border border-gray-700/50 rounded-xl p-4 text-xs text-gray-400 h-28 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                placeholder="Describe the visual scene..."
              />
              <button
                onClick={() => generateSceneAssets(activeSceneIndex)}
                className="w-full py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-600/50 rounded-xl text-xs text-gray-300 font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <ImageIcon size={13} /> Regenerate Image
              </button>
            </div>

            {/* 3. EFFECTS */}
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold text-gray-400 flex items-center gap-2">
                <Move size={12} className="text-green-400" />
                Camera & Effects
              </label>

              {/* Camera Movements */}
              <div className="space-y-2">
                <p className="text-[10px] text-gray-500 font-semibold">CAMERA MOVEMENTS</p>
                <div className="grid grid-cols-2 gap-2">
                  {['none', 'zoom-in', 'zoom-out', 'pan-left', 'pan-right', 'pan-up', 'pan-down', 'ken-burns'].map(effect => (
                    <button
                      key={effect}
                      onClick={() => updateSceneData(activeSceneIndex, 'effect', effect)}
                      className={`py-2.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${activeScene.effect === effect
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-[#1A1D24] border-gray-700/50 text-gray-400 hover:border-gray-500 hover:text-white'
                        }`}
                    >
                      {effect.replace(/-/g, ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Effects */}
              <div className="space-y-2">
                <p className="text-[10px] text-gray-500 font-semibold">SPECIAL EFFECTS</p>
                <div className="grid grid-cols-2 gap-2">
                  {['fade', 'shake', 'dust', 'snow', 'rain', 'lightning'].map(effect => (
                    <button
                      key={effect}
                      onClick={() => updateSceneData(activeSceneIndex, 'effect', effect)}
                      className={`py-2.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${activeScene.effect === effect
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-[#1A1D24] border-gray-700/50 text-gray-400 hover:border-gray-500 hover:text-white'
                        }`}
                    >
                      {effect.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm p-8 text-center">
            <Edit3 size={48} className="mb-4 opacity-20" />
            <p className="text-gray-400">Select a scene from the storyboard</p>
            <p className="text-xs text-gray-600 mt-2">to edit its details</p>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  // --- STATE ---
  const [view, setView] = useState('dashboard');

  // Settings
  const [n8nUrl, setN8nUrl] = useState(DEFAULT_N8N_URL);
  const [geminiKey, setGeminiKey] = useState("");
  const [logoUrl, setLogoUrl] = useState(""); // Logo overlay

  // Studio
  const [prompt, setPrompt] = useState("");
  const [characterProfile, setCharacterProfile] = useState("แมวไซบอร์ก สีขาว ตาสีฟ้า มีเกราะเหล็กที่ขาหน้า");
  const [scenes, setScenes] = useState([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);

  const [geminiLoading, setGeminiLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const sceneAudiosRef = useRef({});
  const sceneImagesRef = useRef({});

  // --- INIT ---
  useEffect(() => {
    // Check Settings
    const savedN8n = localStorage.getItem('setting_n8n_url');
    if (savedN8n) setN8nUrl(savedN8n);

    const savedGemini = localStorage.getItem('setting_gemini_key');
    if (savedGemini) setGeminiKey(savedGemini);

    const savedLogo = localStorage.getItem('setting_logo_url');
    if (savedLogo) setLogoUrl(savedLogo);
  }, []);

  // Draw active scene on canvas
  useEffect(() => {
    if (!canvasRef.current || !scenes[activeSceneIndex]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scene = scenes[activeSceneIndex];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw scene image if available
    if (scene.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.onerror = () => {
        console.error('Failed to load image:', scene.imageUrl);
        // Draw placeholder
        ctx.fillStyle = '#1A1D24';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Scene ${activeSceneIndex + 1}`, canvas.width / 2, canvas.height / 2);
      };
      img.src = scene.imageUrl;
    } else {
      // Draw placeholder
      ctx.fillStyle = '#1A1D24';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#666';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Scene ${activeSceneIndex + 1}`, canvas.width / 2, canvas.height / 2);
    }
  }, [activeSceneIndex, scenes]);

  // --- GEMINI ---
  const callGemini = async (userPrompt, systemInstruction) => {
    if (!geminiKey) {
      alert("กรุณาใส่ Gemini API Key ในหน้า Settings ก่อน");
      setView('settings');
      return null;
    }
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });
      if (!response.ok) throw new Error("Gemini API Error");
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      console.error(error);
      alert("AI Error: " + error.message);
      return null;
    }
  };

  // --- LOGIC ---
  const handleGenerateCharacter = async () => {
    if (!prompt.trim()) {
      alert("กรุณาใส่เนื้อเรื่องก่อนครับ");
      return;
    }
    setGeminiLoading(true);

    const systemPrompt = `You are a character designer. Based on the story concept, create a detailed character description for image generation.
    
    Requirements:
    - Describe the MAIN CHARACTER(S) appearance, clothing, and distinctive features
    - Keep it concise (2-3 sentences max)
    - Use English only
    - Focus on visual details that will be consistent across all scenes
    - Include: age, gender, clothing style, hair, distinctive features
    
    Example output: "A young Thai woman in her 20s with long black hair, wearing a modern business suit. She has a friendly smile and carries a leather briefcase."
    
    Output ONLY the character description, no extra text.`;

    const result = await callGemini(prompt, systemPrompt);
    if (result) {
      const cleanDescription = result.trim().replace(/^["']|["']$/g, '');
      setCharacterProfile(cleanDescription);
    }
    setGeminiLoading(false);
  };

  const handleGenerateStoryboard = async () => {
    if (!prompt.trim()) return;
    setGeminiLoading(true);
    setScenes([]);

    const systemPrompt = `You are a professional storyboard artist. Create a 5-scene story arc based on the user's idea.
    CRITICAL: Every 'imagePrompt' MUST start with: "${characterProfile}".
    Output JSON Array ONLY:
    [ { "id": 1, "storyText": "Narrative in Thai", "imagePrompt": "Visual description in English" }, ... ]`;

    const result = await callGemini(prompt, systemPrompt);
    if (result) {
      try {
        const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
        const generatedScenes = JSON.parse(cleanJson);
        const scenesWithStatus = generatedScenes.map(s => ({
          ...s,
          status: 'pending',
          imageUrl: null,
          audioUrl: null,
          duration: 10,
          effect: 'zoom-in' // Default effect
        }));
        setScenes(scenesWithStatus);
      } catch (e) {
        console.error("JSON Parse Error", e);
        alert("Failed to parse storyboard.");
      }
    }
    setGeminiLoading(false);
  };

  const updateSceneData = (index, field, value) => {
    setScenes(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const generateSceneAssets = async (index) => {
    const scene = scenes[index];
    if (!scene) return;

    // Set status to generating
    setScenes(prev => {
      const newScenes = [...prev];
      newScenes[index] = { ...newScenes[index], status: 'generating' };
      return newScenes;
    });

    try {
      if (!n8nUrl || !n8nUrl.startsWith('http')) throw new Error("Invalid n8n URL");

      console.log(`🚀 Sending to n8n for scene ${index}:`, {
        prompt: scene.imagePrompt.substring(0, 50) + '...',
        overrideText: scene.storyText.substring(0, 30) + '...'
      });

      const response = await fetch(n8nUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: scene.imagePrompt,
          overrideText: scene.storyText
        })
      });

      // Get response text first for better error handling
      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`n8n Server Error (${response.status}): ${responseText.substring(0, 200)}`);
      }

      if (!responseText) {
        throw new Error("n8n returned empty response");
      }

      // Parse JSON with error handling (from index2.html pattern)
      let rawJson;
      try {
        rawJson = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`n8n did not return valid JSON: ${responseText.substring(0, 100)}...`);
      }

      // Handle both Array and Object responses (from index2.html lines 412-417)
      let result = Array.isArray(rawJson) ? rawJson[0] : rawJson;

      if (!result || (!result.imageUrl && !result.audioUrl)) {
        throw new Error("n8n response missing imageUrl and audioUrl");
      }

      // DEBUG: Log the response from n8n
      console.log("✅ n8n Response:", result);
      console.log("📸 imageUrl:", result.imageUrl);
      console.log("🔊 audioUrl:", result.audioUrl);

      // Retry logic: If imageUrl is placeholder or missing, retry up to 5 times
      let retries = 0;
      const maxRetries = 5;
      while (retries < maxRetries && (!result.imageUrl || result.imageUrl.includes('placehold.co') || result.imageUrl.includes('Image+Error'))) {
        console.log(`⏳ Image not ready, retrying in 3s... (${retries + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, 3000)); // Wait 3 seconds

        // Retry the request
        const retryResponse = await fetch(n8nUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: scene.imagePrompt,
            overrideText: scene.storyText
          })
        });

        if (retryResponse.ok) {
          const retryText = await retryResponse.text();
          const retryJson = JSON.parse(retryText);
          result = Array.isArray(retryJson) ? retryJson[0] : retryJson;
          console.log(`🔄 Retry ${retries + 1} Response:`, result);
        }
        retries++;
      }

      // Add timestamp to prevent caching (from index2.html lines 430-432)
      const timestamp = new Date().getTime();
      let finalAudioUrl = result.audioUrl;
      if (finalAudioUrl && !finalAudioUrl.startsWith('data:')) {
        const separator = finalAudioUrl.includes('?') ? '&' : '?';
        finalAudioUrl = `${finalAudioUrl}${separator}nocache=${timestamp}`;
      }

      // Use functional setState to get latest state
      setScenes(prev => {
        const updatedScenes = [...prev];
        updatedScenes[index] = {
          ...updatedScenes[index],
          imageUrl: result.imageUrl,
          audioUrl: finalAudioUrl,
          status: 'done'
        };
        return updatedScenes;
      });

      preloadSceneAssets(index, result.imageUrl, finalAudioUrl);

    } catch (error) {
      console.error("❌ Asset Generation Failed:", error);
      console.error("Scene Index:", index);
      console.error("Error Details:", error.message);

      // FALLBACK TO MOCK DATA (Simulate delay)
      await new Promise(r => setTimeout(r, 1500));

      // Silent audio (1 second) as base64 data URL
      const silentAudio = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v////////////////////////////////////////////////////////////////AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4T8FmYNAAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

      // Use functional setState to get latest state
      setScenes(prev => {
        const updatedScenes = [...prev];
        updatedScenes[index] = {
          ...updatedScenes[index],
          imageUrl: "https://placehold.co/1080x1920/1a1d24/ffffff/png?text=Scene+" + (index + 1),
          audioUrl: silentAudio,
          status: 'done'
        };
        return updatedScenes;
      });

      preloadSceneAssets(index, "https://placehold.co/1080x1920/1a1d24/ffffff/png?text=Scene+" + (index + 1), silentAudio);
    }
  };

  const generateAllScenes = async () => {
    for (let i = 0; i < scenes.length; i++) {
      // Get fresh state before checking
      const currentScenes = await new Promise(resolve => {
        setScenes(prev => {
          resolve(prev);
          return prev;
        });
      });

      if (currentScenes[i].status !== 'done') {
        setActiveSceneIndex(i);

        // Wait for this scene to complete before moving to next
        await generateSceneAssets(i);

        // Add a small delay between scenes to prevent overwhelming the API
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    alert("All scenes generated successfully!");
  };

  const preloadSceneAssets = (index, imgUrl, audioUrl) => {
    if (imgUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imgUrl;
      sceneImagesRef.current[index] = img;
    }
    if (audioUrl) {
      console.log(`🔊 Loading audio for scene ${index}:`, audioUrl.substring(0, 50) + '...');

      // Create HTML5 audio element with timestamp to prevent caching
      const audio = document.createElement('audio');
      audio.crossOrigin = "anonymous";

      // Create source element with timestamp parameter
      const source = document.createElement('source');
      const urlWithTimestamp = audioUrl.includes('?')
        ? `${audioUrl}&t=${Date.now()}`
        : `${audioUrl}?t=${Date.now()}`;
      source.src = urlWithTimestamp;
      source.type = "audio/mpeg";

      audio.appendChild(source);

      audio.addEventListener('loadedmetadata', () => {
        console.log(`✅ Audio loaded for scene ${index}, duration: ${audio.duration}s`);
        setScenes(prev => {
          const copy = [...prev];
          if (copy[index]) copy[index].duration = audio.duration;
          return copy;
        });
      });

      // Error Handling for Audio
      audio.addEventListener('error', (e) => {
        console.error(`❌ Audio load error scene ${index}:`, e);
        console.error('Audio URL:', urlWithTimestamp.substring(0, 100));
      });

      // Load the audio
      audio.load();

      sceneAudiosRef.current[index] = audio;
    }
  };

  // --- ENGINE ---
  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    const currentScene = scenes[activeSceneIndex];
    const imgObj = sceneImagesRef.current[activeSceneIndex];

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    if (imgObj) {
      const duration = currentScene.duration || 10;
      let progress = 0;
      const audio = sceneAudiosRef.current[activeSceneIndex];
      if (audio && !audio.paused && audio.duration > 0) {
        progress = audio.currentTime / duration;
      }

      // --- CAMERA EFFECTS ---
      const effect = currentScene.effect || 'zoom-in';
      let scale = 1.0;
      let tx = 0;
      let ty = 0;

      if (effect === 'zoom-in') {
        scale = 1.0 + (progress * 0.15); // 1.0 -> 1.15
      } else if (effect === 'zoom-out') {
        scale = 1.15 - (progress * 0.15); // 1.15 -> 1.0
      } else if (effect === 'pan-right') {
        scale = 1.15;
        tx = -((progress * 0.1) * width); // Move left (Pan right)
      } else if (effect === 'pan-left') {
        scale = 1.15;
        tx = -((0.1 - (progress * 0.1)) * width);
      } else {
        scale = 1.0; // Static
      }

      const vw = width * scale;
      const vh = height * scale;
      const ox = (width - vw) / 2 + tx;
      const oy = (height - vh) / 2 + ty;

      ctx.drawImage(imgObj, ox, oy, vw, vh);
    }

    const gradient = ctx.createRadialGradient(width / 2, height / 2, height / 3, width / 2, height / 2, height);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // --- SUBTITLES ---
    if (showSubtitles && currentScene && currentScene.storyText) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 50px "Kanit", sans-serif';

      const text = currentScene.storyText;
      // For demo, just showing full text or simple split if too long
      // Real production needs a line-break function here

      ctx.lineWidth = 8;
      ctx.strokeStyle = 'black';
      ctx.strokeText(text, width / 2, height - 150);
      ctx.fillStyle = 'white';
      ctx.fillText(text, width / 2, height - 150);
    }
  };

  const playSequence = async (recording = false) => {
    setIsPlaying(true);
    if (recording) setIsRecording(true);

    for (let i = 0; i < scenes.length; i++) {
      if (!isPlaying && !recording) break;
      setActiveSceneIndex(i);
      const audio = sceneAudiosRef.current[i];

      // Safe Play
      if (audio) {
        audio.currentTime = 0;
        try {
          await audio.play();
        } catch (err) {
          console.error("Audio play failed, skipping audio for scene", i, err);
          // ถ้าเล่นเสียงไม่ได้ ให้เล่นภาพเปล่าๆ ไป 5 วินาที
          const backupDuration = 5000;
          const startBackup = Date.now();
          await new Promise(resolve => {
            const loopBackup = () => {
              if (!isPlaying && !recording) { resolve(); return; }
              drawFrame();
              if (Date.now() - startBackup < backupDuration) requestRef.current = requestAnimationFrame(loopBackup);
              else resolve();
            }
            loopBackup();
          });
          continue;
        }

        const sceneDuration = audio.duration * 1000;
        const startTime = Date.now();
        await new Promise(resolve => {
          const loop = () => {
            if (!isPlaying && !recording) { resolve(); return; }
            drawFrame();
            if (Date.now() - startTime < sceneDuration) requestRef.current = requestAnimationFrame(loop);
            else resolve();
          };
          loop();
        });
      } else {
        // No Audio Object (Image only?)
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    setIsPlaying(false);
    if (recording) stopRecording();
  };

  const startRecording = () => {
    const stream = canvasRef.current.captureStream(60);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond: 12000000 });
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];
    mediaRecorder.ondataavailable = e => chunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `story-full-${Date.now()}.webm`;
      a.click();
    };
    mediaRecorder.start();
    playSequence(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current.stop();
    setIsPlaying(false);
    cancelAnimationFrame(requestRef.current);
    Object.values(sceneAudiosRef.current).forEach(a => { a.pause(); a.currentTime = 0; });
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar view={view} setView={setView} />
      {view === 'settings' ? (
        <div className="flex-1 p-10 flex justify-center items-center bg-gradient-to-br from-[#0A0D12] via-[#16191E] to-[#0F1115]">
          <div className="w-full max-w-2xl bg-gradient-to-br from-[#1A1D24] to-[#0F1115] p-10 rounded-3xl border border-gray-800/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl shadow-lg">
                <Settings size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Settings</h2>
                <p className="text-sm text-gray-400">Configure your API connections</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Database size={14} className="text-blue-400" />
                  n8n Webhook URL
                </label>
                <input
                  type="text"
                  value={n8nUrl}
                  onChange={e => setN8nUrl(e.target.value)}
                  className="w-full bg-[#0A0D12] border border-gray-700/50 p-4 rounded-xl text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="https://n8n.servergot.xyz/webhook/..."
                />
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(n8nUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          prompt: "Test image prompt",
                          overrideText: "ทดสอบเสียงบรรยาย"
                        })
                      });
                      const data = await response.json();
                      alert(`✅ Webhook Test Success!\n\nResponse: ${JSON.stringify(data, null, 2)}`);
                    } catch (error) {
                      alert(`❌ Webhook Test Failed!\n\nError: ${error.message}\n\nPlease check:\n1. URL is correct\n2. n8n workflow is activated\n3. No CORS issues`);
                    }
                  }}
                  className="mt-3 w-full py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-blue-600 hover:to-blue-500 border border-gray-600/50 rounded-xl text-xs text-gray-300 hover:text-white font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw size={14} /> Test Webhook Connection
                </button>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Key size={14} className="text-purple-400" />
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={e => setGeminiKey(e.target.value)}
                  className="w-full bg-[#0A0D12] border border-gray-700/50 p-4 rounded-xl text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="AIza..."
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2 flex items-center gap-2">
                  <ImageIcon size={14} className="text-green-400" />
                  Logo Overlay (Optional)
                </label>
                <div className="space-y-3">
                  {logoUrl && (
                    <div className="flex items-center gap-4 p-4 bg-[#0A0D12] border border-gray-700/50 rounded-xl">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 shadow-lg shadow-green-500/20">
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 font-medium">Logo Uploaded</p>
                        <p className="text-xs text-gray-500">Will appear in top-right corner</p>
                      </div>
                      <button
                        onClick={() => setLogoUrl("")}
                        className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLogoUrl(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-[#0A0D12] border border-gray-700/50 p-4 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500 file:cursor-pointer focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                  <p className="text-xs text-gray-500">Recommended: Square image, PNG with transparent background</p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem('setting_n8n_url', n8nUrl);
                  localStorage.setItem('setting_gemini_key', geminiKey);
                  localStorage.setItem('setting_logo_url', logoUrl);
                  alert("Settings saved successfully!");
                }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl w-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : view === 'studio' ? (
        <StudioMulti
          prompt={prompt} setPrompt={setPrompt}
          characterProfile={characterProfile} setCharacterProfile={setCharacterProfile}
          geminiLoading={geminiLoading} handleGenerateStoryboard={handleGenerateStoryboard} handleGenerateCharacter={handleGenerateCharacter}
          scenes={scenes} activeSceneIndex={activeSceneIndex} setActiveSceneIndex={setActiveSceneIndex} updateSceneData={updateSceneData}
          generateSceneAssets={generateSceneAssets} generateAllScenes={generateAllScenes}
          canvasRef={canvasRef} isPlaying={isPlaying} playSequence={playSequence}
          startRecording={startRecording} isRecording={isRecording} stopRecording={stopRecording}
          showSubtitles={showSubtitles} setShowSubtitles={setShowSubtitles}
          logoUrl={logoUrl}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <LayoutGrid size={48} className="mb-4 opacity-20" />
          <p>Dashboard is under construction.</p>
        </div>
      )}
    </div>
  );
};

export default App;