"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Screen = "home" | "camera" | "processing" | "detection" | "listings" | "items" | "detail";
type Status = "available" | "reserved" | "sold";

type Item = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  status: Status;
  tone: string;
  mark: string;
};

const initialItems: Item[] = [
  { id: 1, name: "木製ダイニングチェア", category: "家具 / チェア", description: "ナチュラルカラーの木製チェア。使用感はありますが、まだ十分使用できます。", price: 2500, status: "available", tone: "wood", mark: "chair" },
  { id: 2, name: "コンパクトデスク", category: "家具 / テーブル", description: "ワークスペースにちょうどいいコンパクトなデスク。引き出し付きです。", price: 4500, status: "reserved", tone: "blue", mark: "desk" },
  { id: 3, name: "フロアランプ", category: "照明 / ランプ", description: "部屋をやさしく照らすフロアランプ。電球はそのままお使いいただけます。", price: 1800, status: "available", tone: "yellow", mark: "lamp" },
  { id: 4, name: "オープンシェルフ", category: "家具 / 棚", description: "本や小物をまとめて収納できるオープンシェルフです。", price: 3200, status: "sold", tone: "green", mark: "shelf" },
  { id: 5, name: "2人掛けソファ", category: "家具 / ソファ", description: "落ち着いたベージュの2人掛けソファ。引っ越しのためお譲りします。", price: 9000, status: "available", tone: "beige", mark: "sofa" },
  { id: 6, name: "サイドテーブル", category: "家具 / テーブル", description: "ソファ脇に置きやすい小さめのサイドテーブルです。", price: 1500, status: "reserved", tone: "red", mark: "side" },
  ...Array.from({ length: 12 }, (_, index): Item => {
    const id = index + 7;
    const extras = [
      ["スツール", "家具 / チェア", 1200, "wood", "chair"],
      ["ベッドサイドランプ", "照明 / ランプ", 1400, "yellow", "lamp"],
      ["ワイヤーバスケット", "収納 / バスケット", 900, "blue", "side"],
      ["ローテーブル", "家具 / テーブル", 3800, "wood", "desk"],
      ["ミラー", "インテリア / ミラー", 2200, "beige", "shelf"],
      ["デスクチェア", "家具 / チェア", 3500, "green", "chair"],
    ] as const;
    const [name, category, price, tone, mark] = extras[index % extras.length];
    return { id, name, category, description: `${name}。引っ越しのためお譲りします。`, price, status: index < 3 ? "available" : index % 2 === 0 ? "sold" : "reserved", tone, mark };
  }),
];

const detectedSeed = initialItems.slice(0, 5);
// Set this to true for a deterministic local demo without an API request.
const DEMO_MODE = false;
const statusLabel: Record<Status, string> = { available: "出品中", reserved: "予約済み", sold: "売却済み" };
const statusClass: Record<Status, string> = { available: "status-available", reserved: "status-reserved", sold: "status-sold" };

function formatPrice(price: number) { return `¥${price.toLocaleString("ja-JP")}`; }

function RoomIllustration({ compact = false, imageSrc }: { compact?: boolean; imageSrc?: string | null }) {
  return <div className={`room-art ${compact ? "room-art-compact" : ""} ${imageSrc ? "has-photo" : ""}`} aria-label="アップロードした部屋の写真">{imageSrc ? <img className="room-photo-layer" src={imageSrc} alt="撮影した部屋" /> : <><div className="room-wall" /><div className="window"><i /><i /><i /><i /></div><div className="plant"><span /><b /><em /></div><div className="rug" /><div className="room-sofa"><span /><span /><span /></div><div className="room-table"><span /><span /><span /><span /></div><div className="room-chair"><span /><span /><span /></div><div className="room-lamp"><span /><i /></div><div className="room-shelf"><span /><span /><span /></div></>}<div className="photo-label">ROOM / 01</div></div>;
}

function FurnitureShape({ mark, tone }: { mark: string; tone: string }) { return <div className={`furniture-shape shape-${mark} tone-${tone}`} aria-hidden="true"><span /><span /><span /><span /></div>; }

function TopBar({ screen, onHome, onItems, onNew }: { screen: Screen; onHome: () => void; onItems: () => void; onNew: () => void }) {
  return <header className="topbar"><button className="brand" onClick={onHome} aria-label="SnapList ホーム"><span className="brand-mark">✳</span><span>SnapList</span></button><div className="global-search"><span aria-hidden="true">⌕</span><input aria-label="家具を検索" placeholder="家具を探す / Search items" /></div><nav className="main-nav" aria-label="メインナビゲーション"><button className={screen === "items" || screen === "detail" ? "nav-active" : ""} onClick={onItems}>My Items <span className="nav-count">18</span></button><button onClick={onNew}><span className="plus">＋</span> New scan</button></nav><div className="deadline"><span className="deadline-dot" />搬出まで <strong>12日</strong></div></header>;
}

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [items, setItems] = useState<Item[]>(initialItems);
  const [detected, setDetected] = useState<Item[]>(detectedSeed);
  const [selected, setSelected] = useState<number[]>(detectedSeed.map((item) => item.id));
  const [processingDone, setProcessingDone] = useState(false);
  const [progress, setProgress] = useState(28);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (screen !== "processing") return;
    setProcessingDone(false); setProgress(16);
    const steps = [45, 68, 86, 100];
    const timers = steps.map((value, index) => window.setTimeout(() => { setProgress(value); if (value === 100) setProcessingDone(true); }, 550 + index * 620));
    return () => timers.forEach(window.clearTimeout);
  }, [screen]);

  const filteredItems = useMemo(() => filter === "all" ? items : items.filter((item) => item.status === filter), [filter, items]);
  const stats = useMemo(() => ({ all: items.length, available: items.filter((item) => item.status === "available").length, reserved: items.filter((item) => item.status === "reserved").length, sold: items.filter((item) => item.status === "sold").length }), [items]);
  const goHome = () => setScreen("home");
  const startScan = () => setScreen("camera");
  const runVisionScan = async (image: string) => {
    setCapturedImage(image || null); setScreen("processing");
    if (DEMO_MODE || !image.startsWith("data:image/")) return;
    try {
      const response = await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image }) });
      if (!response.ok) return;
      const payload = await response.json() as { items?: Array<{ name?: string; category?: string; description?: string; price?: number }> };
      if (!payload.items?.length) return;
      const marks = ["chair", "desk", "lamp", "shelf", "sofa", "side"];
      const tones = ["wood", "blue", "yellow", "green", "beige", "red"];
      const nextItems: Item[] = payload.items.map((item, index) => ({ id: index + 1, name: item.name ?? "家具", category: item.category ?? "家具", description: item.description ?? "AIが生成した商品説明です。", price: Number(item.price) || 0, status: "available", tone: tones[index % tones.length], mark: marks[index % marks.length] }));
      setDetected(nextItems); setSelected(nextItems.map((item) => item.id));
      setItems((current) => { const byId = new Map(current.map((item) => [item.id, item])); nextItems.forEach((item) => byId.set(item.id, item)); return Array.from(byId.values()); });
    } catch { /* Keep the local demo result if the optional API is unavailable. */ }
  };
  const handleUpload = async (file?: File) => {
    if (!file) { setScreen("processing"); return; }
    // Demo mode keeps the browser payload small and avoids posting large images.
    if (DEMO_MODE) { setCapturedImage(URL.createObjectURL(file)); setScreen("processing"); return; }
    const image = await new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result ?? "")); reader.onerror = () => resolve(""); reader.readAsDataURL(file); });
    await runVisionScan(image);
  };
  const openItems = () => setScreen("items");
  const toggleSelected = (id: number) => setSelected((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
  const removeDetected = (id: number) => { setDetected((current) => current.filter((item) => item.id !== id)); setSelected((current) => current.filter((itemId) => itemId !== id)); };
  const addDetected = () => { const nextId = Math.max(...detected.map((item) => item.id), 0) + 1; const item: Item = { id: nextId, name: "サイドテーブル", category: "家具 / テーブル", description: "部屋に置きやすいコンパクトなテーブルです。", price: 1500, status: "available", tone: "red", mark: "side" }; setDetected((current) => [...current, item]); setSelected((current) => [...current, nextId]); };
  const createListings = () => { const chosen = detected.filter((item) => selected.includes(item.id)); setItems((current) => { const ids = new Set(current.map((item) => item.id)); return [...current, ...chosen.filter((item) => !ids.has(item.id))]; }); setScreen("listings"); };
  const updateItem = (id: number, patch: Partial<Item>) => setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  const saveDetail = () => { setEditingId(null); setScreen("items"); };

  return <main className="app-shell"><TopBar screen={screen} onHome={goHome} onItems={openItems} onNew={startScan} />{screen === "home" && <HomeScreen onStart={startScan} onUpload={handleUpload} />}{screen === "camera" && <CameraScreen onCapture={runVisionScan} onCancel={goHome} />}{screen === "processing" && <ProcessingScreen imageSrc={capturedImage} progress={progress} done={processingDone} onContinue={() => setScreen("detection")} />}{screen === "detection" && <DetectionScreen imageSrc={capturedImage} detected={detected} selected={selected} onToggle={toggleSelected} onRemove={removeDetected} onAdd={addDetected} onContinue={createListings} />}{screen === "listings" && <ListingsScreen items={items.filter((item) => selected.includes(item.id))} onUpdate={updateItem} onSave={openItems} />}{screen === "items" && <ItemsScreen items={filteredItems} stats={stats} filter={filter} setFilter={setFilter} onOpen={(id) => { setEditingId(id); setScreen("detail"); }} onNew={startScan} />}{screen === "detail" && <DetailScreen item={items.find((item) => item.id === editingId) ?? items[0]} onUpdate={updateItem} onSave={saveDetail} onBack={openItems} />}</main>;
}

function HomeScreen({ onStart, onUpload }: { onStart: () => void; onUpload: (file?: File) => void }) {
  return <section className="home-screen page-wrap"><div className="hero-copy"><p className="eyebrow"><span /> AI-assisted moving sale tool</p><h1>部屋を一枚撮るだけで、<br /><i>まとめて売れる。</i></h1><p className="hero-description">AIが家具を見つけて、商品情報までまとめて作成します。<br />搬出までの時間を、もっと身軽に。</p><div className="hero-actions"><button className="button button-dark" onClick={onStart}>家具を見つける <Arrow /></button><span className="action-note">5 items detected in one scan</span></div></div><div className="hero-visual"><RoomIllustration /><div className="cutout cutout-chair"><FurnitureShape mark="chair" tone="wood" /><span>chair detected</span></div><div className="cutout cutout-lamp"><FurnitureShape mark="lamp" tone="yellow" /><span>lamp found</span></div><div className="cutout cutout-sofa"><FurnitureShape mark="sofa" tone="beige" /><span>sofa found</span></div><div className="scribble">✳</div></div><div className="home-foot"><span>01 / 06</span><span>Furniture, found together.</span><span className="scroll-line" /></div><div className="upload-panel"><div className="upload-header"><span>INPUT_SOURCE</span><span>＋</span></div><label className="upload-drop"><input type="file" accept="image/*" onChange={(event) => onUpload(event.target.files?.[0])} /><span className="upload-symbol">↑</span><strong>Drag &amp; Drop Room Photo</strong><small>画像をここにドロップするか、クリックしてファイルを選択してください。AIが自動で家具を認識します。</small><span className="upload-hints">CHAIR　 TABLE　 LAMP</span></label></div></section>;
}

function CameraScreen({ onCapture, onCancel }: { onCapture: (image: string) => void; onCancel: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let active = true;
    if (!navigator.mediaDevices?.getUserMedia) { setCameraError(true); return; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }).then((stream) => {
      if (!active) { stream.getTracks().forEach((track) => track.stop()); return; }
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => undefined); }
    }).catch(() => setCameraError(true));
    return () => { active = false; streamRef.current?.getTracks().forEach((track) => track.stop()); };
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) { onCapture(""); return; }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL("image/jpeg", .88));
  };

  return <section className="camera-screen page-wrap"><div className="camera-header"><div><p className="eyebrow"><span /> STEP 01 / NEW SCAN</p><h2>部屋を撮影して、<br /><i>家具を見つける。</i></h2><p>部屋全体が写るように、少し離れて撮影してください。</p></div><button className="back-button" onClick={onCancel}>← キャンセル</button></div><div className="camera-layout"><div className={`camera-frame ${cameraError ? "camera-fallback" : ""}`}>{cameraError ? <><RoomIllustration /><div className="camera-message">カメラを利用できません。<br />写真を選択してください。</div></> : <video ref={videoRef} muted playsInline autoPlay aria-label="部屋を撮影するカメラ" />}<div className="camera-corners" /><span className="camera-status"><i /> LIVE CAMERA</span></div><div className="camera-controls"><button className="capture-button" onClick={takePhoto} aria-label="写真を撮影"><span /></button><p>撮影すると、ChatGPT Vision が家具を自動で分類します。</p><label className="camera-file-button">写真を選ぶ<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (DEMO_MODE) { onCapture(URL.createObjectURL(file)); return; } const reader = new FileReader(); reader.onload = () => onCapture(String(reader.result ?? "")); reader.onerror = () => onCapture(""); reader.readAsDataURL(file); }} /></label></div></div></section>;
}

function ProcessingScreen({ imageSrc, progress, done, onContinue }: { imageSrc?: string | null; progress: number; done: boolean; onContinue: () => void }) {
  return <section className="flow-screen page-wrap processing-screen"><div className="flow-heading"><p className="eyebrow"><span /> STEP 02 / ANALYZING</p><h2>部屋の中から、<br /><i>家具を探しています。</i></h2><p>写真を眺めている間に、AIが複数のアイテムを切り出しています。</p></div><div className="processing-grid"><div className="scan-photo"><RoomIllustration imageSrc={imageSrc} /><div className="scan-sweep" /><div className="scan-tag tag-one">01 CHAIR</div><div className="scan-tag tag-two">02 TABLE</div><div className="scan-tag tag-three">03 LAMP</div></div><div className="progress-panel"><div className="progress-kicker">VISION SCAN / DEMO <span className="live-dot" /></div><div className="progress-number">{progress}<small>%</small></div><div className="progress-bar"><span style={{ width: `${progress}%` }} /></div><div className="progress-labels"><span>image received</span><span>{done ? "scan complete" : "finding objects..."}</span></div><div className="found-list"><span className={progress > 40 ? "found" : ""}>椅子</span><span className={progress > 55 ? "found" : ""}>テーブル</span><span className={progress > 70 ? "found" : ""}>ランプ</span><span className={progress > 85 ? "found" : ""}>棚</span><span className={progress === 100 ? "found" : ""}>ソファ</span></div>{done && <button className="button button-dark full-button" onClick={onContinue}>結果を確認する <Arrow /></button>}</div></div><div className="flow-foot"><span>03 / 06</span><span>AI keeps the busywork moving.</span></div></section>;
}

function DetectionScreen({ imageSrc, detected, selected, onToggle, onRemove, onAdd, onContinue }: { imageSrc?: string | null; detected: Item[]; selected: number[]; onToggle: (id: number) => void; onRemove: (id: number) => void; onAdd: () => void; onContinue: () => void }) {
  return <section className="flow-screen page-wrap detection-screen"><div className="flow-heading split-heading"><div><p className="eyebrow"><span /> STEP 03 / DETECTION RESULTS</p><h2>一枚の写真から、<br /><i>{detected.length}つの家具</i>が見つかりました。</h2></div><p className="heading-side">必要なものだけ選んでください。<br />あとからいつでも編集できます。</p></div><div className="detection-layout"><div className="detected-photo"><RoomIllustration imageSrc={imageSrc} /><div className="hotspot hs-chair">01</div><div className="hotspot hs-table">02</div><div className="hotspot hs-lamp">03</div><div className="hotspot hs-shelf">04</div><div className="hotspot hs-sofa">05</div><div className="photo-caption">ORIGINAL ROOM PHOTO / 01</div></div><div className="detection-list"><div className="list-top"><span><strong>{selected.length}</strong> / {detected.length} selected</span><button className="text-button" onClick={() => selected.length === detected.length ? detected.forEach((item) => onToggle(item.id)) : detected.filter((item) => !selected.includes(item.id)).forEach((item) => onToggle(item.id))}>{selected.length === detected.length ? "すべて解除" : "すべて選択"}</button></div><div className="detected-cards">{detected.map((item, index) => <div className={`detected-card ${selected.includes(item.id) ? "is-selected" : ""}`} key={item.id} onClick={() => onToggle(item.id)}><div className="check-box">{selected.includes(item.id) ? "✓" : ""}</div><div className="mini-shape"><FurnitureShape mark={item.mark} tone={item.tone} /></div><div className="detected-name"><span>0{index + 1}</span><strong>{item.name}</strong><small>{item.category}</small></div><button className="icon-button" aria-label={`${item.name}を削除`} onClick={(event) => { event.stopPropagation(); onRemove(item.id); }}>×</button></div>)}</div><button className="add-item" onClick={onAdd}><span>＋</span> 写真にない家具を追加</button><button className="button button-lime full-button" disabled={!selected.length} onClick={onContinue}>選んだ家具の商品情報を作る <Arrow /></button></div></div><div className="flow-foot"><span>04 / 06</span><span>Room → objects → collection.</span></div></section>;
}

function ListingsScreen({ items, onUpdate, onSave }: { items: Item[]; onUpdate: (id: number, patch: Partial<Item>) => void; onSave: () => void }) {
  const [editing, setEditing] = useState<number | null>(null);
  return <section className="flow-screen page-wrap listings-screen"><div className="flow-heading split-heading"><div><p className="eyebrow"><span /> STEP 02 / AI GENERATED LISTINGS</p><h2>AI Detected <i>Items</i></h2></div><p className="heading-side">AI has successfully extracted the following items from your scan.<br />Review, edit details, or remove unwanted items before saving.</p></div><div className="listing-toolbar"><span><strong>{items.length} items</strong> ready to review</span><span className="ai-pill">✳ AI GENERATED</span></div><div className="listing-grid">{items.map((item) => <article className="listing-card" key={item.id}><div className="listing-image"><FurnitureShape mark={item.mark} tone={item.tone} /><span className="ai-label">#{String(item.id).padStart(3, "0")}</span></div><div className="listing-content">{editing === item.id ? <><label>商品名<input value={item.name} onChange={(e) => onUpdate(item.id, { name: e.target.value })} /></label><label>商品説明<textarea value={item.description} onChange={(e) => onUpdate(item.id, { description: e.target.value })} /></label></> : <><div className="listing-meta"><p className="item-category">{item.category}</p><span className="listing-price">{formatPrice(item.price)}</span></div><h3>{item.name}</h3><p className="item-description">{item.description}</p></>}<div className="listing-bottom"><div>{editing === item.id && <><span className="price-label">AIおすすめ価格</span><input className="price-input" value={item.price} onChange={(e) => onUpdate(item.id, { price: Number(e.target.value) || 0 })} /></>}</div><div className="listing-actions"><button className="edit-link" onClick={() => setEditing(editing === item.id ? null : item.id)}>{editing === item.id ? "完了" : "編集"} <Arrow /></button><button className="delete-link" onClick={() => onUpdate(item.id, { name: `${item.name}（削除予定）` })}>削除</button></div></div></div></article>)}</div><div className="save-bar"><span>{items.length} items detected ready to be saved.</span><button className="button button-dark" onClick={onSave}>すべて保存 <Arrow /></button></div></section>;
}

function ItemsScreen({ items, stats, filter, setFilter, onOpen, onNew }: { items: Item[]; stats: { all: number; available: number; reserved: number; sold: number }; filter: "all" | Status; setFilter: (filter: "all" | Status) => void; onOpen: (id: number) => void; onNew: () => void }) {
  const filterOptions: { key: "all" | Status; label: string; count: number }[] = [{ key: "all", label: "すべて", count: stats.all }, { key: "available", label: "出品中", count: stats.available }, { key: "reserved", label: "予約済み", count: stats.reserved }, { key: "sold", label: "売却済み", count: stats.sold }];
  return <section className="items-screen page-wrap"><div className="items-header"><div><p className="eyebrow"><span /> YOUR INVENTORY / 05</p><h2>My <i>Items</i></h2><p>搬出まであと12日。あと少しで、部屋が空になります。</p></div><button className="button button-lime" onClick={onNew}>＋ 新しい写真を追加</button></div><div className="inventory-summary"><div className="total-stat"><span>ALL ITEMS</span><strong>{stats.all}</strong><small>items</small></div><div className="processed-stat"><div className="stat-row"><span>処理済み</span><strong>{stats.sold + stats.reserved} / {stats.all}</strong></div><div className="summary-bar"><span style={{ width: `${((stats.sold + stats.reserved) / Math.max(stats.all, 1)) * 100}%` }} /></div><small>出品・予約・売却済み</small></div><div className="status-summary"><div><span className="status-dot dot-green" />出品中 <strong>{stats.available}</strong></div><div><span className="status-dot dot-yellow" />予約済み <strong>{stats.reserved}</strong></div><div><span className="status-dot dot-black" />売却済み <strong>{stats.sold}</strong></div></div></div><div className="items-toolbar"><div className="filter-tabs">{filterOptions.map((option) => <button className={filter === option.key ? "filter-active" : ""} key={option.key} onClick={() => setFilter(option.key)}>{option.label} <span>{option.count}</span></button>)}</div><span className="sort-label">最新の更新順　⌄</span></div><div className="inventory-grid">{items.map((item) => <article className="inventory-card" key={item.id} onClick={() => onOpen(item.id)}><div className="inventory-image"><FurnitureShape mark={item.mark} tone={item.tone} /><span className={`status-chip ${statusClass[item.status]}`}><i />{statusLabel[item.status]}</span><span className="card-index">0{item.id}</span></div><div className="inventory-content"><p>{item.category}</p><h3>{item.name}</h3><strong>{formatPrice(item.price)}</strong><span className="detail-link">詳細を見る <Arrow /></span></div></article>)}</div>{!items.length && <div className="empty-state"><span>○</span><h3>このステータスの商品はありません</h3><p>別のフィルターを選んでください。</p></div>}</section>;
}

function DetailScreen({ item, onUpdate, onSave, onBack }: { item: Item; onUpdate: (id: number, patch: Partial<Item>) => void; onSave: () => void; onBack: () => void }) {
  return <section className="detail-screen page-wrap"><button className="back-button" onClick={onBack}>← My Items に戻る</button><div className="detail-layout"><div className="detail-visual"><div className="detail-image"><FurnitureShape mark={item.mark} tone={item.tone} /><span>SNAPLIST / ITEM 0{item.id}</span></div><p className="detail-tip">✳ 写真はAIが部屋の画像から切り出しました。</p></div><div className="detail-form"><p className="eyebrow"><span /> ITEM DETAIL / EDIT</p><div className="detail-title-row"><div><span className="item-id">ITEM 0{item.id}</span><h2>商品情報を編集</h2></div><span className={`status-chip ${statusClass[item.status]}`}><i />{statusLabel[item.status]}</span></div><div className="form-fields"><label>商品名<input value={item.name} onChange={(e) => onUpdate(item.id, { name: e.target.value })} /></label><label>カテゴリ<input value={item.category} onChange={(e) => onUpdate(item.id, { category: e.target.value })} /></label><label>商品説明<textarea rows={4} value={item.description} onChange={(e) => onUpdate(item.id, { description: e.target.value })} /></label><label>販売価格<div className="price-field"><span>¥</span><input type="number" value={item.price} onChange={(e) => onUpdate(item.id, { price: Number(e.target.value) || 0 })} /></div><small>AIおすすめ価格から自由に変更できます。</small></label><label>販売ステータス<div className="status-select">{(["available", "reserved", "sold"] as Status[]).map((status) => <button key={status} className={item.status === status ? "selected-status" : ""} onClick={() => onUpdate(item.id, { status })}><i className={`status-dot ${status === "available" ? "dot-green" : status === "reserved" ? "dot-yellow" : "dot-black"}`} />{statusLabel[status]}</button>)}</div></label></div><div className="detail-actions"><button className="button button-dark" onClick={onSave}>保存する <Arrow /></button><button className="delete-button">商品を削除</button></div></div></div></section>;
}
