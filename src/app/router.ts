import { useEffect, useState } from 'react';

// ハッシュ方式の画面遷移（#/lesson/m1-01 など）。GitHub Pages で再読み込みしても 404 にならない。

export type Route =
  | { name: 'home' }
  | { name: 'lesson'; id: string }
  | { name: 'review' }
  | { name: 'cards' }
  | { name: 'stats' };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  switch (parts[0]) {
    case 'lesson':
      return parts[1] ? { name: 'lesson', id: decodeURIComponent(parts[1]) } : { name: 'home' };
    case 'review':
      return { name: 'review' };
    case 'cards':
      return { name: 'cards' };
    case 'stats':
      return { name: 'stats' };
    default:
      return { name: 'home' };
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseHash(location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function go(path: string) {
  location.hash = path;
}
