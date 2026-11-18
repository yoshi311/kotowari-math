import type { FigureSpec } from '../../content/types';
import { RichText } from '../RichText';
import { AreaTiles } from './AreaTiles';
import { AbsLine, Budget, FlipLine, SqrtZoom } from './NumberFigures';
import { PriceBox } from './PriceBox';
import { Contra, FactorTiles, Nested, SqrtSquare, Venn } from './ShapeFigures';
import { LikeTerms, MentalMath, PowerBlocks } from './SmallFigures';

const rt = (s: string) => <RichText text={s} inline />;

/** 教材データの figure 指定から、対応する図を描く */
export function Figure({ spec }: { spec: FigureSpec }) {
  switch (spec.type) {
    case 'priceBox':
      return <PriceBox unit={spec.unit} base={spec.base} item={spec.item} max={spec.max} />;
    case 'area':
      return <AreaTiles mode={spec.mode} showMistake={spec.showMistake} />;
    case 'likeTerms':
      return <LikeTerms />;
    case 'powerBlocks':
      return <PowerBlocks />;
    case 'mental':
      return <MentalMath base={spec.base} />;
    case 'factorTiles':
      return <FactorTiles />;
    case 'sqrtZoom':
      return <SqrtZoom />;
    case 'absLine':
      return <AbsLine mode={spec.mode} />;
    case 'sqrtSquare':
      return <SqrtSquare />;
    case 'budget':
      return <Budget unit={spec.unit} base={spec.base} limit={spec.limit} />;
    case 'flipLine':
      return <FlipLine />;
    case 'venn':
      return <Venn />;
    case 'nested':
      return <Nested renderText={rt} />;
    case 'contra':
      return <Contra renderText={rt} />;
  }
}
