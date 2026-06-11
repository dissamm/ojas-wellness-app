'use client';

import { Header } from '../components/Header';
import { CosmicMusic } from '../components/music/CosmicMusic';

export default function MusicPage() {
  return (
    <div className="relative min-h-screen text-surface-cream overflow-x-hidden font-body-md transition-all duration-500">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="pt-32 pb-stack-xl w-full flex-grow">
          <CosmicMusic />
        </main>
      </div>
    </div>
  );
}