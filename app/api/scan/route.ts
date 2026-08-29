import { NextResponse } from "next/server";

type VisionItem = {
  name?: string;
  category?: string;
  description?: string;
  price?: number;
};

function extractOutputText(payload: { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> }) {
  return payload.output?.flatMap((entry) => entry.content ?? []).filter((part) => part.type === "output_text").map((part) => part.text ?? "").join("\n") ?? "";
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ configured: false, items: [] }, { status: 503 });

  let body: { image?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }
  if (!body.image?.startsWith("data:image/")) return NextResponse.json({ error: "A data URL image is required" }, { status: 400 });

  const prompt = `Analyze this room photo for a moving sale. Identify every clearly visible piece of furniture or household item that could be listed. Return ONLY valid JSON in this exact shape: {"items":[{"name":"Japanese name","category":"家具 / category","description":"short Japanese listing description","price":2500}]}. Keep the list to at most 12 high-confidence items. Prices must be integer Japanese yen estimates; do not include markdown or extra keys.`;
  const upstream = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? process.env.OPENAI_VISION_MODEL ?? "gpt-4.1-mini",
      input: [{ role: "user", content: [{ type: "input_text", text: prompt }, { type: "input_image", image_url: body.image }] }],
      max_output_tokens: 1800,
    }),
  });
  if (!upstream.ok) return NextResponse.json({ error: "Vision request failed", details: await upstream.text() }, { status: 502 });

  const payload = await upstream.json() as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  const rawText = extractOutputText(payload).replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    const parsed = JSON.parse(rawText) as { items?: VisionItem[] };
    const items = (parsed.items ?? []).filter((item) => item.name).map((item) => ({ name: item.name, category: item.category ?? "家具", description: item.description ?? "AIが生成した商品説明です。", price: Number(item.price) || 0 }));
    return NextResponse.json({ configured: true, items });
  } catch {
    return NextResponse.json({ configured: true, items: [], raw: rawText }, { status: 502 });
  }
}
