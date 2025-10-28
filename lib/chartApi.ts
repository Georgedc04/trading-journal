export async function saveChartToServer(data: any) {
  const res = await fetch("/api/chart/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save chart");
  return res.json();
}

export async function loadChartFromServer() {
  const res = await fetch("/api/chart/load");
  if (!res.ok) throw new Error("Failed to load chart");
  const json = await res.json();
  return json.chart?.data ?? null;
}