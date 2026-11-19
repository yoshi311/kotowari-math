import type { FigureSpec } from '../../content/types';
import { RichText } from '../RichText';
import { AreaTiles } from './AreaTiles';
import { AbsLine, Budget, FlipLine, SqrtZoom } from './NumberFigures';
import { PriceBox } from './PriceBox';
import { AxisMove, CompleteSquare, Discriminant, DomainMaxMin, FuncMachine, ParabolaA, ParabolaShift, QuadIneq, Roots, Throw } from './QuadFigures';
import { Contra, FactorTiles, Nested, SqrtSquare, Venn } from './ShapeFigures';
import { LikeTerms, MentalMath, PowerBlocks } from './SmallFigures';
import { Bisector, Ceva, Centers, InscribedAngle, Polyhedron, PowerPoint, TangentChord, TwoCircles } from './GeoFigures';
import { CirclePerm, CondProb, DiceTable, Expectation, GridPath, Pascal, PermSlots, RepeatTrial, TreeDiagram } from './ProbFigures';
import { BoxPlot, Histogram, Hypothesis, MeanBalance, Outlier, Scatter, Transform, Variance } from './StatsFigures';
import { CosLaw, Cuboid, Measure, RightTriangle, SinLaw, TriArea, UnitCircle } from './TrigFigures';

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
    case 'funcMachine':
      return <FuncMachine />;
    case 'parabolaA':
      return <ParabolaA />;
    case 'parabolaShift':
      return <ParabolaShift />;
    case 'completeSquare':
      return <CompleteSquare />;
    case 'domainMaxMin':
      return <DomainMaxMin />;
    case 'throw':
      return <Throw />;
    case 'roots':
      return <Roots />;
    case 'discriminant':
      return <Discriminant />;
    case 'quadIneq':
      return <QuadIneq />;
    case 'axisMove':
      return <AxisMove />;
    case 'rightTriangle':
      return <RightTriangle />;
    case 'measure':
      return <Measure />;
    case 'unitCircle':
      return <UnitCircle />;
    case 'sinLaw':
      return <SinLaw />;
    case 'cosLaw':
      return <CosLaw />;
    case 'triArea':
      return <TriArea />;
    case 'cuboid':
      return <Cuboid />;
    case 'meanBalance':
      return <MeanBalance />;
    case 'histogram':
      return <Histogram />;
    case 'boxPlot':
      return <BoxPlot />;
    case 'outlier':
      return <Outlier />;
    case 'variance':
      return <Variance />;
    case 'transform':
      return <Transform />;
    case 'scatter':
      return <Scatter />;
    case 'hypothesis':
      return <Hypothesis />;
    case 'treeDiagram':
      return <TreeDiagram />;
    case 'permSlots':
      return <PermSlots />;
    case 'circlePerm':
      return <CirclePerm />;
    case 'pascal':
      return <Pascal />;
    case 'gridPath':
      return <GridPath />;
    case 'diceTable':
      return <DiceTable />;
    case 'repeatTrial':
      return <RepeatTrial />;
    case 'condProb':
      return <CondProb />;
    case 'expectation':
      return <Expectation />;
    case 'bisector':
      return <Bisector />;
    case 'centers':
      return <Centers mode={spec.mode} />;
    case 'ceva':
      return <Ceva />;
    case 'inscribedAngle':
      return <InscribedAngle />;
    case 'tangentChord':
      return <TangentChord />;
    case 'power':
      return <PowerPoint />;
    case 'twoCircles':
      return <TwoCircles />;
    case 'polyhedron':
      return <Polyhedron />;
  }
}
