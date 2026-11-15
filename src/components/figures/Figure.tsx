import type { FigureSpec } from '../../content/types';
import { AreaTiles } from './AreaTiles';
import { PriceBox } from './PriceBox';
import { LikeTerms, MentalMath, PowerBlocks } from './SmallFigures';

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
  }
}
