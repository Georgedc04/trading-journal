"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download, Check } from "lucide-react";

export default function FullscreenImageViewer({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Smooth zoom control (buttons + scroll)
  const handleZoom = (delta: number) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 1), 4)); // clamp between 1x - 4x
  };

  // ✅ Mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      e.preventDefault();
      const zoomAmount = e.deltaY < 0 ? 0.2 : -0.2;
      handleZoom(zoomAmount);
    };

    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: false });
    return () => container?.removeEventListener("wheel", handleWheel);
  }, []);

  // ✅ Download image (works for all URLs)
  const handleDownload = async () => {
    try {
      setDownloading(true);

      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trade_image.jpg";
      a.click();
      window.URL.revokeObjectURL(url);

      setTimeout(() => setDownloading(false), 1000);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloading(false);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* === Toolbar === */}
      <div className="absolute top-4 right-4 flex gap-3">
        <button
          onClick={() => handleZoom(0.2)}
          className="p-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg hover:opacity-90 transition"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="p-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg hover:opacity-90 transition"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="p-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg hover:opacity-90 transition"
          title="Download Image"
        >
          {downloading ? <Check size={18} /> : <Download size={18} />}
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg hover:opacity-90 transition"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* === Draggable & Zoomable Image === */}
      <motion.div
        drag
        dragConstraints={{ top: -400, bottom: 400, left: -400, right: 400 }}
        className="cursor-grab active:cursor-grabbing"
        style={{
          scale,
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <img
          src={image}
          alt="Fullscreen Trade"
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
          draggable={false}
        />
      </motion.div>

      
    </motion.div>
  );
}
