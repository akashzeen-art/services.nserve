import { lazy, Suspense, useEffect, useState } from 'react';
import MountainParallax from './components/MountainParallax';

const MapPreloader = lazy(() => import('./components/MapPreloader'));

export default function App() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const finishBoot = () => {
    window.scrollTo(0, 0);
    setBooting(false);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  return (
    <>
      {booting && (
        <Suspense fallback={<div className="fixed inset-0 z-[100] bg-[#F5F7FB]" aria-hidden />}>
          <MapPreloader onDone={finishBoot} durationMs={5000} />
        </Suspense>
      )}

      <div className={booting ? 'invisible' : 'visible'} aria-hidden={booting}>
        {!booting && <MountainParallax />}
      </div>
    </>
  );
}
