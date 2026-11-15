import { useState } from 'react';
import type { Line } from '../content/types';
import { useProgress } from '../engine/progress';
import { play } from '../engine/sound';
import { Dialogue } from '../components/story/Dialogue';
import { SceneBanner } from '../components/story/Scenes';
import { CharacterSvg } from '../components/story/CharacterSvg';

const PART1: Line[] = [
  { who: 'narrator', text: 'むかし、この世界は「理（ことわり）の灯」に照らされていた。' },
  { who: 'narrator', text: '灯のおかげで、人びとは橋をかけ、時をはかり、星の動きを読むことができた。' },
  { who: 'narrator', text: 'けれどある夜、すべての灯がいっせいに消えた。\n橋はくずれ、時計はくるい、市場の値札からは数字が消えた。' },
  { who: 'zero', mood: 'surprised', text: 'あっ！ 起きた！ よかったぁ…ずっと待ってたんだよ！' },
  { who: 'zero', mood: 'happy', text: 'ボクはゼロ。消えた灯の、最後のひとかけら。きみには、灯をともす力があるみたいなんだ。' },
  { who: 'zero', mood: 'normal', text: 'ねえ、きみの名前を教えてくれる？' },
];

const PART2: Line[] = [
  { who: 'zero', mood: 'happy', text: '{name}！ いい名前だね！' },
  { who: 'michiru', mood: 'normal', text: 'あら、目を覚ましたのね。わたしはミチル。この地方を旅している測量士よ。' },
  { who: 'michiru', mood: 'normal', text: '灯を取り戻すには「理術」が必要なの。理術というのは、昔の人が見つけた**公式や考え方**のこと。' },
  { who: 'zero', mood: 'think', text: 'でもさ、公式ってただ覚えて計算するだけでしょ？ それで灯がつくの？' },
  { who: 'michiru', mood: 'happy', text: 'いいえ。理術は「**それが何を求める道具なのか**」「**どこで役に立つのか**」がわかったときに、はじめて力を持つのよ。' },
  { who: 'kai', mood: 'smug', text: 'フン、意味なんてどうでもいいだろ。答えが合えば勝ちさ。' },
  { who: 'michiru', mood: 'think', text: 'あの子はカイ。公式の暗記は得意だけど…まあ、そのうちわかるわ。' },
  { who: 'kai', mood: 'smug', text: 'どっちが先に灯をともすか、勝負だ、{name}！' },
  { who: 'michiru', mood: 'happy', text: 'さあ、まずはふもとのカズノハ村へ行きましょう。最初の灯が、きみを待っているわ。' },
];

export function Prologue() {
  const setName = useProgress((s) => s.setName);
  const finish = useProgress((s) => s.finishPrologue);
  const [phase, setPhase] = useState<'title' | 'p1' | 'name' | 'p2'>('title');
  const [ready, setReady] = useState(false);
  const [name, setNameInput] = useState('');

  if (phase === 'title') {
    return (
      <div className="title-screen">
        <SceneBanner scene="night" />
        <div className="title-body">
          <CharacterSvg who="zero" mood="happy" size={120} />
          <h1 className="game-title">
            コトワリの旅
            <small>― 数理の灯をともせ ―</small>
          </h1>
          <p className="title-desc">公式の「意味」と「使いどころ」を取り戻す、高校数学の冒険</p>
          <button className="btn primary big" onClick={() => (play('clear'), setPhase('p1'))}>
            冒険をはじめる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="prologue">
      <SceneBanner scene="night" />
      <div className="prologue-body">
        {phase === 'p1' && <Dialogue lines={PART1} onDone={() => setReady(true)} />}
        {phase === 'p1' && ready && (
          <button className="btn primary wide" onClick={() => (setReady(false), setPhase('name'))}>
            名前を伝える
          </button>
        )}
        {phase === 'name' && (
          <form
            className="name-form pop-in"
            onSubmit={(e) => {
              e.preventDefault();
              setName(name || 'きみ');
              setPhase('p2');
            }}
          >
            <label>
              きみの名前（10文字まで）
              <input value={name} maxLength={10} autoFocus onChange={(e) => setNameInput(e.target.value)} placeholder="例：ユウ" />
            </label>
            <button className="btn primary wide" type="submit">
              決定
            </button>
          </form>
        )}
        {phase === 'p2' && <Dialogue lines={PART2} onDone={() => setReady(true)} />}
        {phase === 'p2' && ready && (
          <button className="btn primary wide" onClick={() => (play('clear'), finish())}>
            カズノハ村へ ▶
          </button>
        )}
      </div>
    </div>
  );
}
