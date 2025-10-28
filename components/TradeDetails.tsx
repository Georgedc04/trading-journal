"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Globe2,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import FullscreenImageViewer from "./FullImageViewer";

export default function TradeDetails({ trade }: { trade: any }) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!trade) return null;

  const palette = isLight
    ? {
        bg: "linear-gradient(135deg, #FFF8F3, #F1F5F9)",
        border: "#E2E8F0",
        text: "#1E293B",
        subtext: "#475569",
        accent: "#2563EB",
        profit: "#16A34A",
        loss: "#DC2626",
        shadow: "0 4px 25px rgba(37,99,235,0.15)",
      }
    : {
        bg: "linear-gradient(135deg, rgba(11,15,20,0.9), rgba(17,24,39,0.95))",
        border: "rgba(56,189,248,0.15)",
        text: "#E2E8F0",
        subtext: "#94A3B8",
        accent: "#38BDF8",
        profit: "#22C55E",
        loss: "#EF4444",
        shadow: "0 4px 25px rgba(56,189,248,0.15)",
      };

  // ✅ Safely convert trade.result to number
  const result = Number(trade.result);
  const profitColor = result > 0 ? palette.profit : palette.loss;

  const resolveImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return url.startsWith("/uploads") ? url : `/uploads/${url}`;
  };

  const beforeImg = resolveImageUrl(trade.beforeImageUrl);
  const afterImg = resolveImageUrl(trade.afterImageUrl);

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 w-full max-w-5xl mx-auto shadow-lg border transition-all duration-300"
      style={{
        background: palette.bg,
        borderColor: palette.border,
        boxShadow: palette.shadow,
        color: palette.text,
      }}
    >
      {/* === Header === */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 border-b pb-3"
        style={{ borderColor: palette.border }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">
          {trade.pair}
        </h2>
        <p className="text-sm mt-1 sm:mt-0" style={{ color: palette.subtext }}>
          {new Date(trade.date).toLocaleDateString()} •{" "}
          <span style={{ color: palette.accent }}>{trade.session || "—"}</span>
        </p>
      </div>

      {/* === Trade Info === */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 text-sm sm:text-base">
        <InfoItem
          icon={
            trade.direction === "Buy" ? (
              <TrendingUp color={palette.profit} size={18} />
            ) : (
              <TrendingDown color={palette.loss} size={18} />
            )
          }
          label="Direction"
          value={trade.direction}
        />
        <InfoItem
          icon={<Tag size={18} color={palette.accent} />}
          label="Quality"
          value={trade.quality || "—"}
        />
        <InfoItem
          icon={<Globe2 size={18} color={palette.accent} />}
          label="Session"
          value={trade.session || "—"}
        />
        {/* ✅ Fixed Result Handling */}
        <InfoItem
          icon={<DollarSign size={18} color={profitColor} />}
          label="Result"
          value={`${result > 0 ? "+" : ""}${!isNaN(result) ? result.toFixed(2) : "0.00"} $`}
          className="font-semibold"
          style={{ color: profitColor }}
        />
      </div>

      {/* === Reason === */}
      <div className="mb-6">
        <p
          className="font-semibold mb-1 text-sm"
          style={{ color: palette.subtext }}
        >
          Reason:
        </p>
        <p
          className="italic text-sm sm:text-base leading-relaxed"
          style={{ color: palette.subtext }}
        >
          {trade.reason || "No reason provided."}
        </p>
      </div>

      {/* === Images === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {beforeImg ? (
          <ImageCard
            title="Before Trade"
            src={beforeImg}
            onClick={setFullscreenImage}
            palette={palette}
          />
        ) : (
          <EmptyImageCard
            title="Before Trade"
            palette={palette}
            isLight={isLight}
          />
        )}
        {afterImg ? (
          <ImageCard
            title="After Trade"
            src={afterImg}
            onClick={setFullscreenImage}
            palette={palette}
          />
        ) : (
          <EmptyImageCard
            title="After Trade"
            palette={palette}
            isLight={isLight}
          />
        )}
      </div>

      {/* === Fullscreen Image Viewer === */}
      <AnimatePresence>
        {fullscreenImage && (
          <FullscreenImageViewer
            image={fullscreenImage}
            onClose={() => setFullscreenImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ✅ Info Item */
function InfoItem({
  icon,
  label,
  value,
  className = "",
  style = {},
}: {
  icon: any;
  label: string;
  value: string | number;
  className?: string;
  style?: any;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`} style={style}>
      {icon}
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] uppercase opacity-70 tracking-wider">
          {label}
        </span>
        <span className="text-sm sm:text-base">{value}</span>
      </div>
    </div>
  );
}

/* ✅ Image Card */
function ImageCard({
  title,
  src,
  onClick,
  palette,
}: {
  title: string;
  src: string;
  onClick: (url: string) => void;
  palette: any;
}) {
  return (
    <div className="w-full">
      <p className="text-xs opacity-70 mb-1" style={{ color: palette.subtext }}>
        {title}:
      </p>
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="rounded-xl w-full h-60 sm:h-72 object-cover shadow-md cursor-pointer hover:scale-[1.03] hover:shadow-lg transition-all duration-300"
        onClick={() => onClick(src)}
        style={{
          border: `1px solid ${palette.border}`,
          boxShadow: palette.shadow,
        }}
      />
    </div>
  );
}

/* ⚠️ Empty Image Card */
function EmptyImageCard({
  title,
  palette,
  isLight,
}: {
  title: string;
  palette: any;
  isLight: boolean;
}) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center h-60 sm:h-72 rounded-xl border transition-all duration-300"
      style={{
        borderColor: palette.border,
        background: isLight
          ? "rgba(240,240,240,0.7)"
          : "rgba(51,65,85,0.3)",
      }}
    >
      <ImageIcon size={32} className="mb-2" color={palette.subtext} />
      <p className="text-sm" style={{ color: palette.subtext }}>
        {title} image not uploaded
      </p>
    </div>
  );
}
