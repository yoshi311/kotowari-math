import { useProgress } from '../engine/progress';
import { CardsScreen } from '../screens/CardsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LessonScreen } from '../screens/LessonScreen';
import { Prologue } from '../screens/Prologue';
import { ReviewScreen } from '../screens/ReviewScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { BottomNav, TopBar } from './Chrome';
import { useRoute } from './router';

export function App() {
  const route = useRoute();
  const prologueSeen = useProgress((s) => s.prologueSeen);

  if (!prologueSeen) return <Prologue />;

  const inLesson = route.name === 'lesson';
  return (
    <div className={`app ${inLesson ? 'in-lesson' : ''}`}>
      {!inLesson && <TopBar />}
      <main className="main">
        {route.name === 'home' && <HomeScreen />}
        {route.name === 'lesson' && <LessonScreen key={route.id} id={route.id} />}
        {route.name === 'review' && <ReviewScreen />}
        {route.name === 'cards' && <CardsScreen />}
        {route.name === 'stats' && <StatsScreen />}
      </main>
      {!inLesson && <BottomNav current={route.name} />}
    </div>
  );
}
