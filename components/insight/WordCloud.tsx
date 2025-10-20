"use client";
import React from "react";


export default function WordCloud({ reasons }: { reasons: Record<string, number> }) {
// Convert to array and map sizes
const arr = Object.entries(reasons || {}).map(([reason, count]) => ({ reason, count }));
const max = Math.max(...arr.map((a) => a.count), 1);


return (
<div className="flex flex-wrap gap-2">
{arr.slice(0, 40).map((r) => (
<span
key={r.reason}
style={{ fontSize: `${Math.max(12, (r.count / max) * 28)}px` }}
className="px-2 py-1 rounded-md bg-gradient-to-r from-sky-400/10 to-cyan-400/10 border border-sky-400/10"
>
{r.reason}
</span>
))}
</div>
);
}