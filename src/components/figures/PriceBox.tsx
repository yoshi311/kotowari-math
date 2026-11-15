import { useState } from 'react';
import { Tex } from '../RichText';
import { Slider } from './Slider';

/** 文字＝中身を入れかえられる箱。x を動かすと代金がその場で変わる */
export function PriceBox({ unit, base, item, max = 10 }: { unit: number; base: number; item: string; max?: number }) {
  const [x, setX] = useState(3);
  const total = unit * x + base;
  return (
    <div className="figure price-box">
      <div className="pb-row">
        <div className="pb-box">
          <div className="pb-box-lid">x</div>
          <div className="pb-box-body">
            <span key={x} className="pop-in">{x}</span>
          </div>
        </div>
        <div className="pb-items" aria-label={`${item}が${x}個`}>
          {Array.from({ length: x }, (_, i) => (
            <span key={i} className="pb-item pop-in" style={{ animationDelay: `${i * 0.03}s` }}>
              {item}
            </span>
          ))}
          <span className="pb-basket" title="かご代">🧺</span>
        </div>
      </div>
      <Slider label={<>箱 <Tex>x</Tex> の中身</>} value={x} min={0} max={max} onChange={setX} />
      <div className="pb-formula">
        <div>
          <Tex>{`${unit}\\,x + ${base}`}</Tex>
          <span className="arrow">← 式はずっと同じ</span>
        </div>
        <div className="pb-calc">
          <Tex>{`= ${unit} \\times ${x} + ${base} = `}</Tex>
          <strong key={total} className="pop-in big-num">{total.toLocaleString()} 円</strong>
        </div>
      </div>
      <table className="pb-table">
        <tbody>
          <tr>
            <th><Tex>x</Tex>（個）</th>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <td key={n} className={n === x ? 'hl' : ''}>{n}</td>
            ))}
          </tr>
          <tr>
            <th>代金（円）</th>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <td key={n} className={n === x ? 'hl' : ''}>{unit * n + base}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
