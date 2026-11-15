import { useMemo, useState } from 'react';
import { fmt } from '../../engine/format';
import { Tex } from '../RichText';
import { Slider } from './Slider';

// ---------- 同類項：同じ種類のタイルだけまとめられる ----------

type Kind = 'x2' | 'x' | '1';
const KIND_INFO: Record<Kind, { label: string; cls: string; name: string }> = {
  x2: { label: 'x²', cls: 'tile-x2', name: 'x² タイル（正方形）' },
  x: { label: 'x', cls: 'tile-x', name: 'x タイル（細長い）' },
  '1': { label: '1', cls: 'tile-1', name: '1 タイル（小さい正方形）' },
};

export function LikeTerms() {
  const [seed, setSeed] = useState(0);
  const [grouped, setGrouped] = useState(false);
  const tiles = useMemo(() => {
    const counts: Record<Kind, number> = {
      x2: 1 + Math.floor(Math.random() * 3),
      x: 1 + Math.floor(Math.random() * 4),
      '1': 1 + Math.floor(Math.random() * 5),
    };
    const list: Kind[] = [];
    (Object.keys(counts) as Kind[]).forEach((k) => {
      for (let i = 0; i < counts[k]; i++) list.push(k);
    });
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return { counts, shuffled };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  const order: Kind[] = ['x2', 'x', '1'];
  const messy = tiles.shuffled.map((k) => KIND_INFO[k].label).join(' + ').replace(/x²/g, 'x^2');
  const tidy = fmt([
    [tiles.counts.x2, 'x^2'],
    [tiles.counts.x, 'x'],
    [tiles.counts['1'], ''],
  ]);

  return (
    <div className="figure like-terms">
      {!grouped ? (
        <div className="tile-pile">
          {tiles.shuffled.map((k, i) => (
            <span key={i} className={`tile ${KIND_INFO[k].cls}`}>{KIND_INFO[k].label}</span>
          ))}
        </div>
      ) : (
        <div className="tile-groups">
          {order.map((k) => (
            <div key={k} className="tile-group pop-in">
              <div className="tile-row">
                {Array.from({ length: tiles.counts[k] }, (_, i) => (
                  <span key={i} className={`tile ${KIND_INFO[k].cls}`}>{KIND_INFO[k].label}</span>
                ))}
              </div>
              <div className="tile-count">
                <Tex>{fmt([[tiles.counts[k], k === 'x2' ? 'x^2' : k === 'x' ? 'x' : '']])}</Tex>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="area-formula">
        <Tex>{grouped ? tidy : messy}</Tex>
      </div>
      <div className="row-buttons">
        <button className="btn small" onClick={() => setGrouped((g) => !g)}>
          {grouped ? 'バラバラにもどす' : '同じ形どうしでまとめる'}
        </button>
        <button className="btn small ghost" onClick={() => (setSeed((s) => s + 1), setGrouped(false))}>
          別のタイルで
        </button>
      </div>
      <p className="figure-note">
        形がちがうタイル（<Tex>x^2</Tex> と <Tex>x</Tex>）は、くっつけても1つの形にならない。だから<strong>同じ形どうし</strong>しかまとめられない。
      </p>
    </div>
  );
}

// ---------- 指数法則：x を何個かけたか数えるだけ ----------

export function PowerBlocks() {
  const [m, setM] = useState(2);
  const [n, setN] = useState(3);
  return (
    <div className="figure power-blocks">
      <div className="pw-row">
        <div className="pw-group" style={{ borderColor: '#00bbf9' }}>
          {Array.from({ length: m }, (_, i) => <span key={i} className="pw-x a">x</span>)}
        </div>
        <span className="pw-op">×</span>
        <div className="pw-group" style={{ borderColor: '#f15bb5' }}>
          {Array.from({ length: n }, (_, i) => <span key={i} className="pw-x b">x</span>)}
        </div>
      </div>
      <div className="pw-row">
        <div className="pw-group merged">
          {Array.from({ length: m + n }, (_, i) => (
            <span key={`${m}-${n}-${i}`} className={`pw-x ${i < m ? 'a' : 'b'} pop-in`} style={{ animationDelay: `${i * 0.04}s` }}>x</span>
          ))}
        </div>
      </div>
      <div className="area-formula">
        <Tex>{`x^{${m}} \\times x^{${n}} = \\underbrace{x \\times \\cdots \\times x}_{${m}+${n}\\text{ 個}} = x^{${m + n}}`}</Tex>
      </div>
      <div className="sliders">
        <Slider label={<Tex>m</Tex>} value={m} min={1} max={5} onChange={setM} color="#00bbf9" />
        <Slider label={<Tex>n</Tex>} value={n} min={1} max={5} onChange={setN} color="#f15bb5" />
      </div>
      <p className="figure-note">指数は「x を何個かけたか」の個数。かけ算すると、個数が<strong>たし算</strong>になる。</p>
    </div>
  );
}

// ---------- 展開で暗算：(100 - d)^2 ----------

export function MentalMath({ base }: { base: number }) {
  const [d, setD] = useState(1);
  const [plus, setPlus] = useState(false);
  const n = plus ? base + d : base - d;
  const s = plus ? '+' : '-';
  return (
    <div className="figure mental">
      <div className="mental-big">
        <Tex>{`${n}^2 = ?`}</Tex>
      </div>
      <div className="mental-steps">
        <div><Tex>{`${n}^2 = (${base} ${s} ${d})^2`}</Tex></div>
        <div><Tex>{`= ${base}^2 ${s} 2 \\times ${base} \\times ${d} + ${d}^2`}</Tex></div>
        <div><Tex>{`= ${base * base} ${s} ${2 * base * d} + ${d * d}`}</Tex></div>
        <div className="mental-ans pop-in" key={n}>
          <Tex>{`= ${n * n}`}</Tex>
        </div>
      </div>
      <div className="sliders">
        <Slider label={<>ずれ <Tex>d</Tex></>} value={d} min={1} max={9} onChange={setD} />
      </div>
      <button className="btn small ghost" onClick={() => setPlus((p) => !p)}>
        {plus ? `${base} より小さい数にする` : `${base} より大きい数にする`}
      </button>
      <p className="figure-note">きりのいい数 {base} を「x」、ずれを「a」とみれば、むずかしいかけ算が、かんたんなたし算・ひき算に変わる。</p>
    </div>
  );
}
