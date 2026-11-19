// 教材データの型。プログラム（engine / screens）とは分けておき、
// 新しい単元は content にデータを足すだけで増やせるようにする。
//
// テキストの書き方:
//   $...$       … 数式（KaTeX）
//   **...**     … 強調
//   {name}      … プレイヤーの名前
//   ［ア］      … 共通テスト風のマーク欄（mark 問題の prompt 内のみ）

export type Speaker = 'zero' | 'michiru' | 'kai' | 'narrator' | 'npc';
export type Mood = 'normal' | 'happy' | 'surprised' | 'think' | 'smug' | 'sad';

export interface Line {
  who: Speaker;
  text: string;
  mood?: Mood;
  /** who が npc のときの表示名 */
  npcName?: string;
}

/** 練習問題のレベル: 意味を問う / 計算 / 共通テスト風 */
export type QLevel = 'meaning' | 'calc' | 'exam';

interface QBase {
  id: string;
  level: QLevel;
  prompt: string;
  /** 正解したあと・間違えたあとに見せる解説 */
  explain: string;
  /** 間違えたときに先に出すヒント */
  hint?: string;
  /** ライバル・カイの「ありがちな失敗」 */
  kaiMistake?: string;
  figure?: FigureSpec;
}

export interface ChoiceQuestion extends QBase {
  type: 'choice';
  choices: string[];
  answer: number;
}

export interface InputQuestion extends QBase {
  type: 'input';
  /** number: 数として比べる / expr: 式として比べる */
  mode: 'number' | 'expr';
  answer: string;
  /** true なら「整理された形」で書くことも求める */
  tidy?: boolean;
  /** true なら「かっこのかけ算の形（因数分解した形）」で書くことを求める */
  factored?: boolean;
  /** 入力欄の前後に出す文字（例: "答え：", "円"） */
  before?: string;
  after?: string;
  /** テスト用: 答えと同じになるはずの元の式 */
  source?: string;
}

export interface MarkQuestion extends QBase {
  type: 'mark';
  /** 各マーク欄の正解（1 文字ずつ。'-' はマイナス） */
  answers: Record<string, string>;
}

export type Question = ChoiceQuestion | InputQuestion | MarkQuestion;

/** 数値を変えて何度でも出せる問題 */
export interface GenRef {
  type: 'gen';
  gen: string;
  level: QLevel;
}

export type QuestionItem = Question | GenRef;

// ---------- 図 ----------

export type FigureSpec =
  | { type: 'priceBox'; unit: number; base: number; item: string; max?: number }
  | { type: 'area'; mode: 'mono' | 'binomial' | 'square' | 'diffsq'; showMistake?: boolean }
  | { type: 'likeTerms' }
  | { type: 'powerBlocks' }
  | { type: 'mental'; base: number }
  | { type: 'factorTiles' }
  | { type: 'sqrtZoom' }
  | { type: 'absLine'; mode: 'zero' | 'two' | 'range' }
  | { type: 'sqrtSquare' }
  | { type: 'budget'; unit: number; base: number; limit: number }
  | { type: 'flipLine' }
  | { type: 'venn' }
  | { type: 'nested' }
  | { type: 'contra' }
  | { type: 'funcMachine' }
  | { type: 'parabolaA' }
  | { type: 'parabolaShift' }
  | { type: 'completeSquare' }
  | { type: 'domainMaxMin' }
  | { type: 'throw' }
  | { type: 'roots' }
  | { type: 'discriminant' }
  | { type: 'quadIneq' }
  | { type: 'axisMove' }
  | { type: 'rightTriangle' }
  | { type: 'measure' }
  | { type: 'unitCircle' }
  | { type: 'sinLaw' }
  | { type: 'cosLaw' }
  | { type: 'triArea' }
  | { type: 'cuboid' }
  | { type: 'meanBalance' }
  | { type: 'histogram' }
  | { type: 'boxPlot' }
  | { type: 'outlier' }
  | { type: 'variance' }
  | { type: 'transform' }
  | { type: 'scatter' }
  | { type: 'hypothesis' }
  | { type: 'treeDiagram' }
  | { type: 'permSlots' }
  | { type: 'circlePerm' }
  | { type: 'pascal' }
  | { type: 'gridPath' }
  | { type: 'diceTable' }
  | { type: 'repeatTrial' }
  | { type: 'condProb' }
  | { type: 'expectation' };

// ---------- ステップ ----------

export interface StoryStep {
  kind: 'story';
  title: string;
  scene?: SceneId;
  lines: Line[];
}

export interface ExploreStep {
  kind: 'explore';
  title: string;
  lines: Line[];
  figure: FigureSpec;
  /** 図をさわりながら考えるための問いかけ */
  prompts: string[];
  /** 図で気づいたことを確かめる問題（任意） */
  check?: Question;
  after?: Line[];
}

export interface ConceptStep {
  kind: 'concept';
  title: string;
  /** 「この理術は◯◯を求める道具」 */
  tool: string;
  formulas?: string[];
  analogy: { title: string; text: string };
  points: string[];
  figure?: FigureSpec;
  lines?: Line[];
}

export interface UsageStep {
  kind: 'usage';
  title: string;
  items: { icon: string; title: string; text: string; formula?: string }[];
  lines?: Line[];
}

export interface PracticeStep {
  kind: 'practice';
  title: string;
  questions: QuestionItem[];
}

export interface CardStep {
  kind: 'card';
  lines: Line[];
}

/** 章末のボス戦：時間制限つき・ライフ制の共通テスト風総合問題 */
export interface BossStep {
  kind: 'boss';
  title: string;
  boss: { name: string; hp: number };
  /** 制限時間（秒） */
  timeLimit: number;
  /** まちがえてよい回数 */
  lives: number;
  questions: QuestionItem[];
  intro: Line[];
  lose: Line[];
}

export type Step = StoryStep | ExploreStep | ConceptStep | UsageStep | PracticeStep | CardStep | BossStep;

export type SceneId = 'market' | 'workshop' | 'plaza' | 'night' | 'gate' | 'valley' | 'fountain' | 'lighthouse' | 'plain' | 'dice';

export interface CardDef {
  id: string;
  name: string;
  /** 正式な数学用語 */
  term: string;
  rarity: 1 | 2 | 3;
  tool: string;
  formula: string;
  uses: string[];
  color: string;
}

export interface Lesson {
  id: string;
  no: number;
  title: string;
  subtitle: string;
  /** 物語上の依頼名 */
  quest: string;
  steps: Step[];
  card: CardDef;
}

export interface Unit {
  id: string;
  subject: '数学Ⅰ' | '数学A' | '数学Ⅱ' | '数学B' | '数学C';
  title: string;
  region: string;
  description: string;
  lessons: Lesson[];
  /** まだ作っていないレッスンの予告 */
  upcoming: { no: number; title: string }[];
}
