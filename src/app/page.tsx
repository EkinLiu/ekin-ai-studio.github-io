"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const BASE_API_URL = "https://gen.pollinations.ai/image/";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY || "sk_ntIb4hRFg7FGEgw33FvjjUNAkUYusTjv";
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("flux");
  const [style, setStyle] = useState("default");
  const [aspectRatio, setAspectRatio] = useState("720x1280");
  const [seed, setSeed] = useState("");
  const [enableWatermark, setEnableWatermark] = useState(true);
  const [availableModels, setAvailableModels] = useState<{name: string, description: string}[]>([]);
  
  const [wmText, setWmText] = useState("EKIN AI STUDIO");
  const [wmFont, setWmFont] = useState("Arial");
  const [wmSize, setWmSize] = useState(36);
  const [wmColor, setWmColor] = useState("#ffffff");
  const [wmPosition, setWmPosition] = useState("bottom-left");

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("AI Sedang Merender Gambar HD...");
  const [resultImg, setResultImg] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const currentBlobUrl = useRef<string | null>(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("ekin_history") || "[]");
    setHistory(savedHistory);

    fetch("https://gen.pollinations.ai/models")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAvailableModels(data);
        }
      })
      .catch((err) => console.error("Gagal memuat daftar model:", err));
  }, []);

  const enhancePrompt = () => {
    if (!prompt.trim()) {
      alert("Masukkan prompt dasar terlebih dahulu!");
      return;
    }
    const enhancements =
      ", masterpiece, 8k resolution, highly detailed, sharp focus, crisp, intricate details, stunning visuals, cinematic lighting, ultra-realistic, octane render, best quality";
    if (!prompt.includes("masterpiece")) {
      setPrompt((prev) => prev + enhancements);
    }
  };

  const getStyleModifier = (currentStyle: string) => {
    const modifiers: Record<string, string> = {
      default: "",
      Psycadelic: ", vibrant colors, trippy, hallucination, fractal patterns, highly detailed psychedelic art, neon glow",
      Macabre: ", dark, gothic, eerie, horror, macabre, highly detailed, creepy atmosphere, shadows",
      Surrealisme: ", dreamlike, Salvador Dali style, surrealism, bizarre, mind-bending, imaginative",
      Chaotic: ", chaotic, messy, explosive, abstract, high energy, disorganized but beautiful, splatters",
      Anime: ", masterpiece anime style, studio ghibli, makoto shinkai, highly detailed, beautiful lighting, cel shading",
      "Chibi 3D Hyper Realistis": ", chibi style, 3D render, Unreal Engine 5, hyper realistic, cute, ultra detailed, ray tracing, volumetric lighting",
    };
    return modifiers[currentStyle] || "";
  };

  const saveToHistory = (promptText: string) => {
    setHistory((prev) => {
      let newHistory = [...prev];
      if (newHistory.length > 0 && newHistory[0] === promptText) return newHistory;
      newHistory.unshift(promptText);
      if (newHistory.length > 20) newHistory.pop();
      localStorage.setItem("ekin_history", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const generateImage = async () => {
    const rawPrompt = prompt.trim();
    if (!rawPrompt) {
      alert("Mohon masukkan prompt gambar!");
      return;
    }

    let currentSeed = seed;
    if (!currentSeed) {
      currentSeed = Math.floor(Math.random() * 999999999).toString();
      setSeed(currentSeed);
    }

    const finalPrompt = rawPrompt + getStyleModifier(style);
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const [width, height] = aspectRatio.split("x");

    let url = `${BASE_API_URL}${encodedPrompt}?width=${width}&height=${height}&seed=${currentSeed}&model=${model}&nologo=true`;
    if (apiKey) {
      url += `&key=${apiKey}`;
    }

    setResultImg(null);
    setLoading(true);

    if (parseInt(width) >= 1080 || parseInt(height) >= 1080) {
      setLoadingText("AI Sedang Merender Gambar FULL HD...");
    } else {
      setLoadingText("AI Sedang Merender Gambar HD...");
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      if (currentBlobUrl.current) URL.revokeObjectURL(currentBlobUrl.current);
      currentBlobUrl.current = URL.createObjectURL(blob);
      setResultImg(currentBlobUrl.current);

      saveToHistory(rawPrompt);
    } catch (error) {
      console.error("Error Detail:", error);
      alert("Gagal generate gambar. Periksa koneksi internet atau API Key Anda.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!resultImg || !imgRef.current) return;
    const img = imgRef.current;

    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      alert("Harap tunggu gambar termuat sepenuhnya.");
      return;
    }

    setDownloading(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (enableWatermark) {
        ctx.font = `bold ${wmSize}px ${wmFont}`;
        ctx.fillStyle = wmColor;

        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 5;

        const padding = 35;
        let x = padding;
        let y = padding;
        const textWidth = ctx.measureText(wmText).width;

        switch (wmPosition) {
          case "top-left": x = padding; y = wmSize + padding; break;
          case "top-right": x = canvas.width - textWidth - padding; y = wmSize + padding; break;
          case "bottom-left": x = padding; y = canvas.height - padding; break;
          case "bottom-right": x = canvas.width - textWidth - padding; y = canvas.height - padding; break;
          case "center": x = (canvas.width - textWidth) / 2; y = canvas.height / 2; break;
        }

        ctx.fillText(wmText, x, y);
      }

      const fileName = enableWatermark
        ? `EKIN-AI-WM-${Date.now()}.png`
        : `EKIN-AI-HQ-${Date.now()}.png`;

      await new Promise<void>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Gagal memproses gambar."));
              return;
            }
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(blobUrl);
              resolve();
            }, 1000);
          },
          "image/png",
          1.0
        );
      });

      setTimeout(() => {
        alert(`✅ Gambar Resolusi Tinggi (${canvas.width}x${canvas.height}) berhasil disimpan ke galeri!`);
      }, 500);
    } catch (err) {
      console.error("Download Error:", err);
      alert("❌ Terjadi kesalahan saat mengunduh gambar.");
    } finally {
      setDownloading(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua riwayat?")) {
      localStorage.removeItem("ekin_history");
      setHistory([]);
    }
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center flex-grow w-full">
      <header className="w-full max-w-6xl mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          EKIN AI STUDIO
        </h1>
        <p className="text-gray-400">Advanced Text-to-Image AI Generator</p>
        <nav className="mt-4 flex justify-center gap-4">
          <Link href="/" className="text-blue-400 font-bold underline">Generator</Link>
          <Link href="/tutorial" className="text-gray-300 hover:text-white transition">Tutorial</Link>
        </nav>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        <div className="lg:col-span-7 flex flex-col gap-6">

          <div className="glass-panel p-5 rounded-2xl">
            <label className="block text-sm font-semibold mb-2">💡 Prompt Gambar</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Deskripsikan gambar yang ingin Anda buat... (Contoh: Kucing terbang di luar angkasa)"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition mb-3"
            ></textarea>

            <button
              onClick={enhancePrompt}
              className="bg-slate-700 hover:bg-slate-600 text-sm py-2 px-4 rounded-lg transition border border-slate-500 mb-4 flex items-center gap-2"
            >
              <i className="fas fa-magic"></i> Enhance Prompt
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Model AI</label>
                <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white">
                  {availableModels.length > 0 ? (
                    availableModels.map((m) => (
                      <option key={m.name} value={m.name} className="truncate">
                        {m.description || m.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="flux">Flux (Terbaik/Realistis)</option>
                      <option value="turbo">Turbo (Lebih Cepat)</option>
                      <option value="flux-realism">Flux Realism</option>
                      <option value="flux-anime">Flux Anime</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white">
                  <option value="default">Default</option>
                  <option value="Psycadelic">Psychedelic</option>
                  <option value="Macabre">Macabre</option>
                  <option value="Surrealisme">Surrealisme</option>
                  <option value="Chaotic">Chaotic</option>
                  <option value="Anime">Anime</option>
                  <option value="Chibi 3D Hyper Realistis">Chibi 3D Hyper Realistis</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Aspek Rasio (Resolusi)</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white">
                  <option value="1024x1024">1:1 (Square HD - 1024x1024)</option>
                  <option value="720x1280">9:16 (Portrait HD - 720x1280)</option>
                  <option value="1080x1920">9:16 (Portrait Full HD - 1080x1920)</option>
                  <option value="1280x720">16:9 (Landscape HD - 1280x720)</option>
                  <option value="1280x960">4:3 (Desktop HD - 1280x960)</option>
                  <option value="960x1280">3:4 (Photo HD - 960x1280)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Seed Number (Opsional)</label>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="Kosong = Random"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className={`border border-slate-700 rounded-xl p-4 mb-6 bg-slate-800/50 transition-opacity ${enableWatermark ? "opacity-100" : "opacity-40"}`}>
              <div className="flex items-center justify-between mb-3 pointer-events-auto">
                <label className="font-semibold text-sm">©️ Aktifkan Watermark (Tampil di hasil Download)</label>
                <input
                  type="checkbox"
                  checked={enableWatermark}
                  onChange={(e) => setEnableWatermark(e.target.checked)}
                  className="w-5 h-5 accent-blue-500"
                />
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 ${!enableWatermark && "pointer-events-none"}`}>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Teks Watermark</label>
                  <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Font</label>
                  <select value={wmFont} onChange={(e) => setWmFont(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white">
                    <option value="Arial">Arial</option>
                    <option value="Impact">Impact</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-400 mb-1">Ukuran</label>
                    <input type="number" value={wmSize} onChange={(e) => setWmSize(parseInt(e.target.value))} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-400 mb-1">Warna</label>
                    <input type="color" value={wmColor} onChange={(e) => setWmColor(e.target.value)} className="w-full h-[38px] bg-slate-800 border border-slate-600 rounded p-1 cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tata Letak (Posisi)</label>
                  <select value={wmPosition} onChange={(e) => setWmPosition(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white">
                    <option value="bottom-left">Kiri Bawah</option>
                    <option value="bottom-right">Kanan Bawah</option>
                    <option value="top-right">Kanan Atas</option>
                    <option value="top-left">Kiri Atas</option>
                    <option value="center">Tengah</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={generateImage}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-gray-400 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg transform active:scale-95 text-lg"
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i> Memproses...</>
              ) : (
                <><i className="fas fa-image mr-2"></i> Generate Gambar Sekarang</>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center min-h-[400px] relative">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="loader"></div>
                <p className="text-blue-300 animate-pulse">{loadingText}</p>
              </div>
            ) : resultImg ? (
              <div className="w-full flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={resultImg}
                  alt="Hasil Generate AI"
                  className="w-full rounded-xl shadow-2xl mb-4 border border-slate-600 object-contain max-h-[450px]"
                />
                <button
                  onClick={downloadImage}
                  disabled={downloading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg flex justify-center items-center gap-2"
                >
                  {downloading ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i> Mengekspor PNG...</>
                  ) : (
                    <><i className="fas fa-download"></i> Download Kualitas Terbaik</>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-gray-500 text-center">
                <i className="fas fa-image text-5xl mb-3 opacity-50"></i>
                <p>Hasil gambar akan muncul di sini</p>
              </div>
            )}
          </div>

          <div className="glass-panel p-5 rounded-2xl flex-grow flex flex-col max-h-[350px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg"><i className="fas fa-history mr-2"></i> Riwayat Prompt</h3>
              <button onClick={clearHistory} className="text-xs bg-red-900/50 hover:bg-red-800 text-red-200 py-1 px-3 rounded-md transition">Clear</button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPrompt(item)}
                    className="bg-slate-700/50 hover:bg-slate-600 p-3 rounded-lg cursor-pointer transition text-sm text-gray-300 border border-slate-600/50 flex gap-2"
                  >
                    <i className="fas fa-quote-left text-blue-400 mt-1 opacity-50"></i>
                    <span className="line-clamp-2">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">Belum ada riwayat prompt.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl mt-12 mb-4 text-center text-sm text-gray-500 border-t border-slate-700 pt-6">
        <p>Copyright @2026 EKIN AI STUDIO</p>
        <p>Powered by. Pollinations API</p>
        <p className="mt-1">Developed by. Ekin Liu | React/Next.js Architecture</p>
      </footer>
    </div>
  );
}
