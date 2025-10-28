"use client";

export default function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: any;
  color: string;
}) {
  const colors: any = {
    cyan: "from-sky-500 to-cyan-400",
    emerald: "from-emerald-500 to-green-400",
    teal: "from-teal-500 to-emerald-400",
  };

  return (
    <div
      className={`rounded-lg p-6 text-center shadow-lg bg-gradient-to-r ${colors[color]} text-black font-bold`}
    >
      <h3 className="text-sm font-medium opacity-80 mb-1">{title}</h3>
      <p className="text-3xl">{value}</p>
    </div>
  );
}
