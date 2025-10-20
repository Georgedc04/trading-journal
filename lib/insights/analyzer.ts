// ⚙️ Local AI-like trading analyzer
// No API — fully deterministic engine for real-time insights

export type Trade = {
  id?: string;
  date: string | Date;
  result: number;
  reason?: string;
  direction?: string;
  quality?: string;
  session?: string;
  pair?: string;
};

// Helper: safe average
const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

export function analyzeTrades(trades: Trade[]) {
  const total = trades.length;
  const wins = trades.filter((t) => t.result > 0).length;
  const losses = trades.filter((t) => t.result < 0).length;
  const winRate = total ? (wins / total) * 100 : 0;

  const avgWin = avg(trades.filter((t) => t.result > 0).map((t) => t.result));
  const avgLoss = avg(trades.filter((t) => t.result < 0).map((t) => t.result));
  const expectancy = (winRate / 100) * avgWin + ((100 - winRate) / 100) * avgLoss;

  // 🔢 Daily PnL
  const daily: Record<string, number> = {};
  trades.forEach((t) => {
    const d = new Date(t.date).toLocaleDateString();
    daily[d] = (daily[d] || 0) + t.result;
  });
  const dailyValues = Object.values(daily);
  const maxDailyLoss = dailyValues.length ? Math.min(...dailyValues) : 0;
  const maxDailyProfit = dailyValues.length ? Math.max(...dailyValues) : 0;

  // 🔄 Streaks
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  let currentWin = 0;
  let currentLoss = 0;

  trades
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((t) => {
      if (t.result > 0) {
        currentWin++;
        currentLoss = 0;
      } else if (t.result < 0) {
        currentLoss++;
        currentWin = 0;
      }
      longestWinStreak = Math.max(longestWinStreak, currentWin);
      longestLossStreak = Math.max(longestLossStreak, currentLoss);
    });

  // 🧠 Reason frequency
  const reasonFrequency: Record<string, number> = {};
  trades.forEach((t) => {
    const r = (t.reason || "No reason").trim();
    if (!r) return;
    reasonFrequency[r] = (reasonFrequency[r] || 0) + 1;
  });
  const topReasons = Object.entries(reasonFrequency)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // 🌍 Session breakdown
  const sessionCounts: Record<string, { wins: number; losses: number; total: number }> = {};
  trades.forEach((t) => {
    const s = t.session || "London";
    if (!sessionCounts[s]) sessionCounts[s] = { wins: 0, losses: 0, total: 0 };
    sessionCounts[s].total++;
    if (t.result > 0) sessionCounts[s].wins++;
    else if (t.result < 0) sessionCounts[s].losses++;
  });

  // 🧭 Recommendations based on trade behavior
  const recs: string[] = [];

  if (winRate < 45) recs.push("Focus on A+ setups — reduce overtrading in uncertain markets.");
  if (avgLoss && Math.abs(avgLoss) > avgWin * 1.5)
    recs.push("Losses are outweighing wins — consider reducing risk per trade.");
  if (maxDailyLoss < -200)
    recs.push("You exceeded your daily loss threshold — pause trading and review journal.");
  if (longestLossStreak >= 3)
    recs.push("Recent loss streak detected — trade smaller size or take a mental break.");
  if (expectancy > 10)
    recs.push("Great expectancy! Maintain discipline and log your best patterns.");
  if (sessionCounts["London"]?.total > (sessionCounts["Asian"]?.total || 0) * 2)
    recs.push("You're heavily trading London session — consider diversifying across sessions.");

  // 🧩 Psychological or mindset tips (dynamic tone)
  const mindset: string[] = [];
  if (winRate >= 60)
    mindset.push("Confidence zone: Stay patient and keep compounding your edge.");
  else if (winRate < 40)
    mindset.push("Focus on emotional discipline — avoid revenge trading.");
  if (maxDailyLoss < -300)
    mindset.push("You're likely pushing boundaries. Remember: survival > hero trades.");

  // 🎯 Goals
  const goals = {
    winRateTarget: 60,
    currentWinRate: Math.round(winRate * 10) / 10,
    expectancyTarget: 5,
    currentExpectancy: Math.round(expectancy * 10) / 10,
  };

  // 📈 Performance tags (to display badges)
  const tags = [];
  if (winRate > 65) tags.push("🔥 Hot Streak");
  if (expectancy > 0) tags.push("💰 Profitable Strategy");
  if (maxDailyLoss > -100) tags.push("🧘 Controlled Risk");
  if (longestLossStreak === 0 && total > 3) tags.push("🎯 Precision Phase");

  return {
    total,
    wins,
    losses,
    winRate: Math.round(winRate * 10) / 10,
    avgWin: Math.round((avgWin || 0) * 100) / 100,
    avgLoss: Math.round((avgLoss || 0) * 100) / 100,
    expectancy: Math.round((expectancy || 0) * 100) / 100,
    maxDailyLoss,
    maxDailyProfit,
    longestWinStreak,
    longestLossStreak,
    topReasons,
    reasonFrequency,
    sessionCounts,
    recommendations: recs,
    mindset,
    goals,
    tags,
  };
}
