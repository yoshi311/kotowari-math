import katex from 'katex';
import { Fragment, useMemo, type ReactNode } from 'react';
import { useProgress } from '../engine/progress';

export function Tex({ children, block = false }: { children: string; block?: boolean }) {
  const html = useMemo(
    () => katex.renderToString(children, { throwOnError: false, displayMode: block }),
    [children, block],
  );
  return <span className={block ? 'tex-block' : 'tex'} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** マーク欄 ［アイ］ を描くための差し込み口 */
export type MarkRenderer = (label: string) => ReactNode;

/**
 * $数式$・**強調**・{name}・［マーク欄］ をまとめて描画する。
 * 改行は段落として扱う。
 */
export function RichText({ text, mark, inline = false }: { text: string; mark?: MarkRenderer; inline?: boolean }) {
  const name = useProgress((s) => s.playerName) || 'きみ';
  const filled = text.replace(/\{name\}/g, name);
  const paras = filled.split('\n');
  const content = paras.map((p, i) => (
    <Fragment key={i}>
      {inline ? renderInline(p, mark) : <p>{renderInline(p, mark)}</p>}
    </Fragment>
  ));
  return inline ? <>{content}</> : <div className="rich">{content}</div>;
}

function renderInline(s: string, mark?: MarkRenderer): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\$([^$]+)\$|\*\*([^*]+)\*\*|［([ァ-ヶ]+)］/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[1] !== undefined) out.push(<Tex key={k++}>{m[1]}</Tex>);
    else if (m[2] !== undefined) out.push(<strong key={k++}>{renderInline(m[2], mark)}</strong>);
    else if (m[3] !== undefined) {
      for (const ch of m[3]) {
        out.push(
          <Fragment key={k++}>{mark ? mark(ch) : <span className="mark-box static">{ch}</span>}</Fragment>,
        );
      }
    }
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
