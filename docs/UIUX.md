# UIUX.md

## Role

あなたはプロのUI/UXデザイナーです。

「Product.md」と「Persona.md」を読み、プロダクトの目的・MVP機能・ユーザーの課題・利用場面・行動・ゴールを理解したうえで、**SnapListの複数ページで構成された、クリック可能なWebプロトタイプ**を設計してください。

単一のランディングページではなく、ユーザーが主要タスクを最初から最後まで完了できる**複数画面のWebアプリ**として生成してください。

---

# 1. Product Goal

SnapListの中心的な価値は、

**「部屋を一枚撮るだけで、複数の家具をまとめて整理・出品準備できること」**

です。

AIが部屋の写真から複数の家具を認識・分類し、商品情報を自動生成し、ユーザーが複数の商品をまとめて管理できる体験を設計してください。

SnapListは新しい二手取引マーケットではありません。

ユーザーが搬家・回国・卒業などの期限前に、大量の家具を一つずつ処理する負担を減らすための**AI-assisted moving sale tool**です。

---

# 2. UX Principles

Product.mdからプロダクトの目的とMVP機能を理解してください。

Persona.mdから以下を理解してください。

- ユーザーの課題
- 利用場面
- 行動
- ゴール
- 時間的なプレッシャー
- 大量の商品を一度に処理する必要性

UXでは以下を優先してください。

1. 操作数をできるだけ少なくする
2. 一つずつ商品登録する体験を避ける
3. 「One Photo → Multiple Items」を最も強く伝える
4. AIが自動処理し、ユーザーは確認・修正するだけの流れにする
5. 最も重要な操作を視覚的に目立たせる
6. 情報の優先順位を明確にする
7. MVPに含まれない複雑な機能を追加しない
8. AIを主役にしすぎず、家具・部屋・整理の進行状況を主役にする

---

# 3. Output Requirement

**単一ページではなく、複数ページで構成されたクリック可能なWebアプリを作成してください。**

以下の画面をすべて作成してください。

各画面は同じデザインシステムを使用し、ボタンやカードをクリックすると次の画面へ移動できるプロトタイプにしてください。

最低限、以下のユーザーフローを実際にクリックして確認できる状態にしてください。

Home
→ Upload
→ AI Processing
→ Detection Results
→ AI Generated Listings
→ My Items
→ Item Detail / Edit

ブラウザ上で利用するWebアプリとして設計してください。

Desktopを基本としながら、モバイルでも破綻しないResponsive Web Designにしてください。

---

# 4. Required Pages

## Page 01 — Home / Room Upload

このページはSnapListのメインエントリーポイントです。

ユーザーが一目で、

**「部屋の写真を一枚アップロードすれば、複数の商品をまとめて整理できる」**

と理解できるようにしてください。

### Main Content

- SnapList logo / wordmark
- Main headline:
  「部屋を一枚撮るだけで、まとめて売れる。」
- Short description:
  「AIが家具を見つけて、商品情報までまとめて作成します。」
- Room photo upload area
- 「写真を選ぶ」
- 「カメラで撮る」
- Primary CTA:
  「家具を見つける」

### Visual Requirement

Homeは最もEditorialで表現力のある画面にしてください。

家具のシルエット、切り抜き、コラージュ表現、不規則な図形を利用してください。

ただし、ユーザーが何を押せばいいか迷わないことを最優先してください。

---

## Page 02 — AI Processing

アップロードした部屋写真を大きく表示してください。

AIが家具を発見していることが分かるインタラクティブな処理画面にしてください。

### Content

- Uploaded room image
- AI detection progress
- 「家具を探しています…」
- 「8個のアイテムを見つけました」
- Simple progress indicator

家具が徐々に発見されているように見せてください。

単純なspinnerだけにはしないでください。

### Interaction

処理完了後、

「結果を確認」

ボタンからDetection Resultsへ移動します。

---

## Page 03 — Detection Results

このページはSnapListの特徴を最も強く見せるページです。

### Core Concept

**ONE ROOM PHOTO → MANY OBJECTS**

アップロードした一枚の部屋写真から、

- 椅子
- テーブル
- ランプ
- 棚
- ソファ

など複数の商品が抽出された状態を表示してください。

### UI

- Original room photo
- Detected item list
- Cut-out furniture thumbnails
- Selected / unselected states
- 「削除」
- 「追加」
- 「選択」
- Detected item count

### Primary CTA

「選んだ家具の商品情報を作る」

クリックするとAI Generated Listingsへ移動します。

---

## Page 04 — AI Generated Listings

AIが複数の商品情報を自動生成した状態を表示してください。

### Each Item

- Furniture image
- 商品名
- カテゴリ
- AIおすすめ価格
- 商品説明
- Edit action

Example:

「木製ダイニングチェア」

「家具 / チェア」

「AIおすすめ価格 ¥2,500」

「ナチュラルカラーの木製チェア。使用感はありますが、まだ十分使用できます。」

AIが生成した情報は必ず編集可能であることを表現してください。

### Actions

- 「編集」
- 「削除」
- 「すべて保存」

「すべて保存」をクリックするとMy Itemsへ移動します。

---

## Page 05 — My Items Dashboard

一般的なSaaS Dashboardではなく、

**editorial-style inventory**

として設計してください。

ユーザーが搬家前の家具整理状況を一目で把握できることが目的です。

### Summary

- 「18 items」
- 「12 / 18 処理済み」

### Filters

- すべて
- 出品中
- 予約済み
- 売却済み

### Status

Available / 出品中

Reserved / 予約済み

Sold / 売却済み

### Item Cards

Each card includes:

- furniture image
- item name
- price
- status
- edit / detail

カードをクリックするとItem Detailへ移動してください。

---

## Page 06 — Item Detail / Edit

このページは他の画面より静かで機能的にしてください。

### Content

- Large furniture image
- 商品名
- カテゴリ
- 商品説明
- AIおすすめ価格
- 販売価格
- Status
- Edit controls

### Status Selector

- 出品中
- 予約済み
- 売却済み

### Actions

- 「保存」
- 「削除」

保存後はMy Itemsへ戻れるようにしてください。

---

# 5. Navigation & Clickable Prototype

必ずクリック可能な導線を作成してください。

Prototype flow:

### Flow A

Home  
→ 「家具を見つける」  
→ AI Processing  
→ 「結果を確認」  
→ Detection Results  
→ 「商品情報を作る」  
→ AI Generated Listings  
→ 「すべて保存」  
→ My Items

### Flow B

My Items  
→ Furniture Card  
→ Item Detail  
→ Statusを変更  
→ 「保存」  
→ My Items

### Navigation

Web appの基本Navigationとして以下を使用できます。

- SnapList
- My Items
- New Scan

ただし、ナビゲーションを複雑にしないでください。

---

# 6. Visual Direction

添付した参考画像を主要なVisual Referenceとして使用してください。

また、以下のWebサイトのレイアウト感を参考にしてください。

ICHI Hair Salon

Reference:
https://ichi-hairsalon.com

ただし、ブランドやコンテンツをコピーせず、

- irregular composition
- polygonal layouts
- editorial spacing
- overlapping images
- asymmetry

というレイアウト思想だけを参考にしてください。

---

# 7. Furniture Visual Language

添付された家具シルエットの参考画像を重要なVisual Referenceとして使用してください。

### Characteristics

- Flat furniture silhouettes
- Cut-out collage
- White furniture shapes
- Irregular image crops
- Organic and polygonal shapes
- Furniture as graphic elements
- Large negative space

部屋写真から家具がAIによって切り取られ、

**room → objects → collection**

に変化する体験を視覚的に表現してください。

AI Detectionでは、一般的な青いBounding Boxだけではなく、

家具が写真から「切り抜かれていく」ようなvisual metaphorを使用してください。

---

# 8. Color Direction

添付したUmiの参考画像を配色の主要参考にしてください。

### Main Palette

- Warm off-white
- Black
- Acid / Lime Green
- Muted Beige
- Small amount of Pale Blue

### Lime Green Usage

Lime Greenは以下の重要な箇所だけに使用してください。

- Primary CTA
- Selected item
- AI action
- Active state
- Progress
- Success state

画面全体を緑にしないでください。

---

# 9. Typography

Apple Human Interface Guidelinesの読みやすさを参考にしながら、Editorialな文字組みを取り入れてください。

### Hierarchy

- Large expressive headline
- Section heading
- Body text
- Secondary information
- Utility labels

日本語は読みやすいSans-serifを基本にしてください。

必要に応じて大きなHero MessageだけSerif的なEditorial Typographyを使用しても構いません。

Typographyは単なる説明ではなくVisual Compositionの一部として使用してください。

---

# 10. UI Components

必要なUIコンポーネントを具体的に設計してください。

- Buttons
- Upload area
- Cards
- Product cards
- Status chips
- Filters
- Progress indicators
- Navigation
- Form fields
- Editable text
- Price input
- Image thumbnails
- Modal / confirmation when necessary

Apple Human Interface Guidelinesを参考にし、

- 明確なtap / click target
- 十分な余白
- 一貫したspacing
- 明確なhover / selected / disabled states
- readable contrast

を確保してください。

---

# 11. Shape Language

すべてを同じRounded Cardにしないでください。

Visual areasでは、

- polygon
- organic shape
- cut-out
- irregular crop
- asymmetric composition

を利用してください。

一方で、

- form
- input
- status selector
- edit controls
- confirmation

などFunctional UIはシンプルで規則的にしてください。

つまり、

**Visual Layer = expressive**

**Functional Layer = clear**

という構成にしてください。

---

# 12. Experience Rhythm

画面が進むにつれて、

**chaos → organization**

へ変化するUXにしてください。

### Home

自由でEditorial

### AI Processing

Visual / Dynamic

### Detection

Collage + Interactive

### Listings

Semi-structured

### My Items

Organized inventory

### Edit

Calm / Functional

これは意図的な体験設計です。

ユーザーの現実の状態も、

**散らかった部屋**
→ **家具を発見**
→ **商品として整理**
→ **販売状況を管理**

と変化します。

UIそのものがこの変化を表現してください。

---

# 13. Japanese UI Copy

Lorem Ipsumは使用しないでください。

実際に利用できる自然な日本語を使用してください。

Examples:

「部屋を一枚撮るだけで、まとめて売れる。」

「家具を見つける」

「家具を探しています…」

「8個のアイテムを見つけました」

「この家具を売りますか？」

「商品情報を作る」

「AIが商品情報を作成しました」

「AIおすすめ価格」

「すべて保存」

「出品中」

「予約済み」

「売却済み」

「12 / 18 処理済み」

---

# 14. Important Restrictions

Do NOT:

- generate only one screen
- create only a landing page
- create static mockups without navigation
- use generic SaaS dashboard design
- imitate Mercari
- use generic purple / blue AI gradients
- use neon futuristic AI visuals
- use glassmorphism
- fill every space with cards
- use excessive shadows
- add unnecessary charts
- add meaningless AI icons
- add features outside the MVP
- make AI the visual protagonist

The main visual subjects should be:

**ROOM**

**FURNITURE**

**OBJECTS**

**ORGANIZATION**

**PROGRESS**

---

# 15. Final Output

Generate a polished, multi-page, clickable Responsive Web prototype for SnapList.

It must include all 6 required screens and allow the main user flow to be tested by clicking.

Do not present the pages as six unrelated mockups.

Create them as one coherent Web application with shared:

- design system
- navigation
- typography
- colors
- spacing
- components
- interaction patterns

The final experience should communicate the transformation:

**ROOM PHOTO**

→ **AI DETECTION**

→ **MULTIPLE FURNITURE ITEMS**

→ **AUTO-GENERATED LISTINGS**

→ **ORGANIZED SELLING STATUS**

The user should immediately understand:

**“I don't need to list every item one by one.”**
