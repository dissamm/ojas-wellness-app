'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { useUserStore } from '../store/userStore';
import {
  getJyotishProfile,
  MONTHS,
  TRANSITS_LIST,
  MONTHLY_FORECASTS,
  NUMEROLOGY_GRID_DATA,
  VENUS_STYLE_PROFILES,
  getGrahaDoshaMatrix,
  FORECAST_STYLE_MAP,
  TransitRitual
} from '../utils/jyotishData';

export default function JyotishPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  const [addedTransitIds, setAddedTransitIds] = useState<Record<string, boolean>>({});
  const [forecastMonthIdx, setForecastMonthIdx] = useState(new Date().getMonth());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  useEffect(() => {
    if (!isMounted) return;
    const stored = localStorage.getItem('ojas_custom_transit_rituals');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const activeMap: Record<string, boolean> = {};
        parsed.forEach((r: TransitRitual) => {
          activeMap[r.id] = true;
        });
        setAddedTransitIds(activeMap);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isMounted]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  if (!isMounted || !user) return null;

  const jyotish = getJyotishProfile(user.dateOfBirth);

  if (!jyotish || !jyotish.sunSign || !jyotish.moonSign || !jyotish.lagna) {
    return (
      <div className="bg-forest-ink text-surface-cream min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="glass-card max-w-md w-full p-8 space-y-4">
            <span className="material-symbols-outlined text-4xl text-resonant-pink">error_outline</span>
            <h2 className="font-headline-sm text-xl uppercase">Incomplete Celestial Profile</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              We could not compute your Janma Kundali Vedic chart. Please ensure your date of birth is configured in your profile.
            </p>
            <button
              onClick={() => router.push('/profile')}
              className="px-6 py-2.5 bg-resonant-pink text-forest-ink font-label-caps text-xs uppercase rounded cursor-pointer hover:opacity-90 transition-opacity font-semibold tracking-wider"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddRitual = (transit: TransitRitual) => {
    const stored = localStorage.getItem('ojas_custom_transit_rituals');
    let list: TransitRitual[] = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }

    const isAlreadyAdded = list.some((r) => r.id === transit.id);

    if (isAlreadyAdded) {
      const updatedList = list.filter((r) => r.id !== transit.id);
      localStorage.setItem('ojas_custom_transit_rituals', JSON.stringify(updatedList));
      setAddedTransitIds((prev) => ({ ...prev, [transit.id]: false }));
      showToast(`✗ Removed "${transit.title}" from Sanctuary`);
    } else {
      list.push({
        id: transit.id,
        time: transit.time,
        duration: transit.duration,
        activity: transit.activity,
        description: transit.description,
        dosha: transit.dosha,
        planetaryTag: transit.planetaryTag,
        icon: transit.icon,
        title: transit.title,
        badgeText: transit.badgeText,
      });
      localStorage.setItem('ojas_custom_transit_rituals', JSON.stringify(list));
      setAddedTransitIds((prev) => ({ ...prev, [transit.id]: true }));
      showToast(`✦ Added "${transit.title}" to Sanctuary`);
    }
  };

  const signKey = (jyotish.venusSign?.english ?? 'Taurus').toLowerCase();
  const venusProfile = VENUS_STYLE_PROFILES[signKey] ?? VENUS_STYLE_PROFILES['taurus'];
  const availableMonthsCount = Object.keys(MONTHLY_FORECASTS).length;
  const currentForecasts = MONTHLY_FORECASTS[forecastMonthIdx] ?? MONTHLY_FORECASTS[0] ?? [];
  const domInf = jyotish.dominantInfluence ?? '';
  const derivedDosha = domInf.includes('Pitta') ? 'Pitta' : domInf.includes('Vata') ? 'Vata' : 'Kapha';
  const grahaRows = getGrahaDoshaMatrix(derivedDosha);

  return (
    <div className="bg-forest-ink text-surface-cream selection:bg-resonant-pink selection:text-forest-ink overflow-x-hidden min-h-screen">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="breathing-glow absolute top-[-10%] right-[-10%] w-[600px] h-[600px]"></div>
        <div className="breathing-glow absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px]" style={{ animationDelay: '-4s' }}></div>
      </div>

      <Header />

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-8 right-8 z-50 bg-[#120D1E] border border-resonant-pink/60 px-5 py-3 rounded-xl shadow-[0_10px_30px_rgba(254,181,202,0.25)] text-surface-cream flex items-center gap-3 transition-all duration-300 transform ${
          toastMessage ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span className="font-label-caps text-xs tracking-wider text-resonant-pink">{toastMessage ?? ''}</span>
      </div>

      <main className="relative z-10 pt-[120px] pb-stack-xl max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Compact Hero Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-stack-md fade-in-up">
          <div className="max-w-3xl">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 font-label-caps text-[10px] text-resonant-pink hover:opacity-70 transition-opacity mb-4 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Return to Dashboard
            </button>
            <h1 className="font-headline-md text-[36px] md:text-[56px] uppercase leading-none">
              Your <span className="italic-serif-font lowercase tracking-normal text-resonant-pink">Jyotish</span> Blueprint
            </h1>
            <p className="mt-2 font-italic-serif italic text-body-lg text-white/70">
              A celestial mapping of your cosmic anatomy.
            </p>
          </div>
          <div className="hidden lg:block text-right pb-1">
            <span className="font-label-caps text-[10px] opacity-50 uppercase text-white/50">Session Status</span>
            <p className="font-label-md text-resonant-pink uppercase tracking-widest">Active Alignment</p>
          </div>
        </header>

        {/* Full-width stacked layout */}
        <div className="space-y-gutter">
          {/* 1. Birth Chart — full width */}
          <section className="fade-in-up delay-1 opacity-0">
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-label-caps text-label-caps text-resonant-pink block mb-1">Janma Kundali</span>
                  <h2 className="font-headline-sm text-headline-sm uppercase">Vedic Alignment</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-white/5">
                  <span className="material-symbols-outlined text-resonant-pink text-[32px] mb-2" style={{ fontVariationSettings: "'wght' 200" }}>sunny</span>
                  <span className="font-label-caps text-[10px] opacity-60 uppercase text-white/60">Sun</span>
                  <span className="font-headline-sm text-[16px] uppercase">{jyotish.sunSign.rashi}</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-white/5">
                  <span className="material-symbols-outlined text-resonant-pink text-[32px] mb-2" style={{ fontVariationSettings: "'wght' 200" }}>dark_mode</span>
                  <span className="font-label-caps text-[10px] opacity-60 uppercase text-white/60">Moon</span>
                  <span className="font-headline-sm text-[16px] uppercase">{jyotish.moonSign.rashi}</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-white/5">
                  <span className="material-symbols-outlined text-resonant-pink text-[32px] mb-2" style={{ fontVariationSettings: "'wght' 200" }}>north_east</span>
                  <span className="font-label-caps text-[10px] opacity-60 uppercase text-white/60">Asc</span>
                  <span className="font-headline-sm text-[16px] uppercase">{jyotish.lagna.rashi}</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-white/5">
                  <span className="material-symbols-outlined text-resonant-pink text-[32px] mb-2" style={{ fontVariationSettings: "'wght' 200" }}>stars</span>
                  <span className="font-label-caps text-[10px] opacity-60 uppercase text-white/60">Nakshatra</span>
                  <span className="font-headline-sm text-[16px] uppercase">{jyotish.nakshatra}</span>
                </div>
              </div>
              <div className="p-4 bg-primary-container/10 border border-primary/20 rounded-lg">
                <p className="font-body-md text-[15px] leading-relaxed text-white/80">
                  <span className="text-resonant-pink font-semibold">Synthesis:</span> Your {jyotish.lagna.english} ascendant brings emotional depth to your {jyotish.sunSign.english} restlessness. The {jyotish.moonSign.english} moon gifts you transformative intuition.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Graha-Dosha Matrix — full width */}
          <section className="fade-in-up delay-2 opacity-0">
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="font-label-caps text-[10px] text-resonant-pink uppercase tracking-widest block mb-1">Planetary Influences</span>
                  <h3 className="font-headline-sm text-[18px] uppercase">Graha-Dosha Matrix</h3>
                </div>
                <span className="font-label-caps text-[10px] text-resonant-pink uppercase tracking-widest">{derivedDosha} Priority</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {grahaRows.map((row) => {
                  const doshaBadgeColor =
                    row.dosha.includes('Pitta') ? 'bg-orange-900/30 text-orange-300 border-orange-700/30' :
                    row.dosha.includes('Vata')  ? 'bg-blue-900/30 text-blue-300 border-blue-700/30' :
                                                  'bg-emerald-900/30 text-emerald-300 border-emerald-700/30';

                  return (
                    <div
                      key={row.name}
                      className="p-5 rounded-xl border border-white/8 bg-white/5 hover:bg-white/[0.08] hover:border-resonant-pink/30 transition-all duration-300 flex flex-col gap-3"
                    >
                      {/* Planet header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl text-resonant-pink leading-none">{row.symbol}</span>
                          <span className="font-headline-sm text-[13px] uppercase text-white">{row.name}</span>
                        </div>
                        <span className={`text-[9px] font-label-caps px-2 py-0.5 rounded-full border uppercase tracking-wider ${doshaBadgeColor}`}>
                          {row.dosha}
                        </span>
                      </div>

                      {/* Governs pill */}
                      <div className="flex flex-wrap gap-1.5">
                        {row.governs.split(',').map((g) => (
                          <span key={g} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60 uppercase tracking-wide">
                            {g.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Plain-English insight */}
                      <p className="text-[12px] text-white/60 font-body-md leading-relaxed">
                        {row.insight}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. Transits + Numerology side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {/* Active Transits */}
            <section className="fade-in-up delay-3 opacity-0">
              <div className="glass-card p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline-sm text-[18px] uppercase">Active Transits</h3>
                  <span className="material-symbols-outlined text-white/50 text-[20px]">auto_awesome</span>
                </div>
                <div className="space-y-4">
                  {TRANSITS_LIST.map((transit) => {
                    const isPitta = transit.dosha.includes('Pitta');
                    const borderColor = isPitta ? 'border-primary-fixed' : 'border-resonant-pink';
                    const iconColor = isPitta ? 'text-primary-fixed' : 'text-resonant-pink';
                    const badgeBg = isPitta ? 'bg-primary-container text-on-primary-container' : 'bg-resonant-pink text-forest-ink';
                    const btnHover = isPitta
                      ? 'hover:bg-primary-fixed border-primary-fixed/30 text-primary-fixed hover:text-forest-ink'
                      : 'hover:bg-resonant-pink border-resonant-pink/30 hover:text-forest-ink';

                    return (
                      <div key={transit.id} className={`p-4 border-l-2 ${borderColor} bg-white/5 space-y-2 transition-all hover:bg-white/[0.08]`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className={`text-xl ${iconColor}`}>{transit.icon}</span>
                            <span className="font-headline-sm text-[12px] uppercase">{transit.title}</span>
                          </div>
                          <span className={`${badgeBg} px-2 py-0.5 font-label-caps text-[9px] rounded-sm`}>
                            {transit.badgeText}
                          </span>
                        </div>
                        <p className="font-body-md text-[13px] text-white/70">{transit.description}</p>
                        <button
                          onClick={() => handleAddRitual(transit)}
                          className={`ritual-btn w-full mt-2 py-1.5 border font-label-caps text-[9px] transition-all uppercase cursor-pointer ${btnHover}`}
                        >
                          {addedTransitIds[transit.id] ? '✗ REMOVE' : '+ RITUAL'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Numerology Matrix */}
            <section className="fade-in-up delay-4 opacity-0">
              <div className="glass-card p-6 h-full">
                <div className="mb-6">
                  <h3 className="font-headline-sm text-[18px] uppercase">Anka Jyotish</h3>
                  <p className="font-italic-serif italic text-white/70 text-[14px]">Numerical vibrations of your path.</p>
                </div>
                <div className="flex justify-around mb-6 text-center">
                  <div>
                    <span className="font-label-caps text-[9px] opacity-60 uppercase block mb-1 text-white/60">Life Path</span>
                    <div className="font-headline-md text-resonant-pink text-[40px] leading-none">{jyotish.lifePathNumber}</div>
                    <span className="font-italic-serif text-[12px] opacity-60">{jyotish.lifePathTagline}</span>
                  </div>
                  <div className="w-px h-12 bg-white/10 self-center"></div>
                  <div>
                    <span className="font-label-caps text-[9px] opacity-60 uppercase block mb-1 text-white/60">Personal Year</span>
                    <div className="font-headline-md text-white/80 text-[40px] leading-none">{jyotish.personalYearNumber}</div>
                    <span className="font-italic-serif text-[12px] opacity-60">Cycle</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 border border-white/10">
                  {NUMEROLOGY_GRID_DATA.map((cell) => {
                    const isLifePath = cell.number === jyotish.lifePathNumber;
                    return (
                      <div
                        key={cell.number}
                        className={`matrix-cell aspect-square border border-white/10 flex flex-col items-center justify-center p-2 text-center ${
                          isLifePath
                            ? 'bg-resonant-pink/20 text-resonant-pink ring-1 ring-inset ring-resonant-pink/40 shadow-[0_0_15px_rgba(254,181,202,0.2)]'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <span className="text-sm md:text-base text-resonant-pink/80 mb-0.5">{cell.symbol}</span>
                        <span className="font-headline-sm text-[14px] md:text-[18px] font-semibold">{cell.number}</span>
                        <span className="font-label-caps text-[8px] md:text-[9px] opacity-60 uppercase tracking-wider mt-0.5">
                          {cell.keyword}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Section: Full-Width Timeline */}
        <section className="mt-gutter fade-in-up delay-5 opacity-0">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline-sm text-headline-sm uppercase">
                Cosmic Wellness Forecast: {MONTHS[forecastMonthIdx]}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setForecastMonthIdx((prev) => (prev > 0 ? prev - 1 : availableMonthsCount - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-resonant-pink transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <button
                  onClick={() => setForecastMonthIdx((prev) => (prev < availableMonthsCount - 1 ? prev + 1 : 0))}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-resonant-pink transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {currentForecasts.map((item) => {
                const style = FORECAST_STYLE_MAP[item.colorClass] ?? FORECAST_STYLE_MAP.neutral;

                return (
                  <div key={item.week} className={`relative pl-6 border-l ${style.border}`}>
                    <div className={`absolute -left-[6px] top-0 w-3 h-3 rounded-full ${style.dot}`}></div>
                    <span className={`font-label-caps text-[10px] mb-2 block uppercase tracking-widest ${style.label}`}>
                      {item.week}
                    </span>
                    <h4 className="font-headline-sm text-[16px] uppercase mb-2">{item.title}</h4>
                    <p className="font-body-md text-white/70 text-[14px]">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Venus Style Section */}
        <section className="mt-gutter fade-in-up delay-6 opacity-0">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-label-caps text-[10px] text-resonant-pink uppercase tracking-widest block mb-1">
                  ♀ Venus in {jyotish.venusSign?.rashi ?? 'Taurus'}
                </span>
                <h3 className="font-headline-sm text-headline-sm uppercase">
                  Dress Like Your Venus Sign
                </h3>
              </div>
              <span className="text-3xl">♀</span>
            </div>
            <p className="font-italic-serif italic text-white/60 text-[14px] mb-8">
              Your Venus sign reveals your aesthetic soul — how you attract, adorn, and express beauty.
            </p>

            <div className="space-y-8">
              {/* Keyword + Affirmation */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 p-5 bg-white/5 border border-white/10 rounded-xl">
                  <span className="font-label-caps text-[9px] text-resonant-pink uppercase tracking-widest block mb-2">Style Archetype</span>
                  <h4 className="font-headline-sm text-[22px] uppercase mb-1">{venusProfile.keyword}</h4>
                  <p className="font-italic-serif italic text-white/60 text-[13px]">
                    &ldquo;{venusProfile.affirmation}&rdquo;
                  </p>
                </div>
                <div className="flex-1 p-5 bg-white/5 border border-white/10 rounded-xl">
                  <span className="font-label-caps text-[9px] text-resonant-pink uppercase tracking-widest block mb-2">Sacred Fabrics</span>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {venusProfile.fabrics.map((f) => (
                      <span key={f} className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-resonant-pink/30 text-resonant-pink/80 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/60 text-[12px] font-body-md leading-relaxed">
                    {venusProfile.silhouette}
                  </p>
                </div>
              </div>

              {/* Colour Palette */}
              <div>
                <span className="font-label-caps text-[9px] text-resonant-pink uppercase tracking-widest block mb-3">Your Cosmic Palette</span>
                <div className="grid grid-cols-4 gap-3">
                  {venusProfile.palette.map((color) => (
                    <div key={color.name} className="flex flex-col items-center gap-2">
                      <div
                        className="w-full aspect-square rounded-xl border border-white/10 shadow-lg"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-label-caps text-[9px] text-white/60 uppercase tracking-wider text-center">
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessories + Avoid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <span className="font-label-caps text-[9px] text-resonant-pink uppercase tracking-widest block mb-3">✦ Signature Accessories</span>
                  <ul className="space-y-2">
                    {venusProfile.accessories.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-[13px] text-white/70 font-body-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-resonant-pink flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 bg-red-950/20 border border-red-900/20 rounded-xl">
                  <span className="font-label-caps text-[9px] text-red-400/80 uppercase tracking-widest block mb-3">✗ Venus Warns</span>
                  <p className="text-[13px] text-white/60 font-body-md leading-relaxed">
                    {venusProfile.avoid}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full mt-stack-xl bg-transparent border-t border-white/10 px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-gutter">
        <div className="font-display-lg text-headline-sm text-white">OJAS</div>
        <div className="flex gap-6">
          <a className="font-label-caps text-label-caps text-white/80 hover:text-resonant-pink transition-all" href="/">Home</a>
          <a className="font-label-caps text-label-caps text-white/80 hover:text-resonant-pink transition-all" href="/dashboard">Dashboard</a>
          <a className="font-label-caps text-label-caps text-white/80 hover:text-resonant-pink transition-all" href="/rituals">Rituals</a>
        </div>
        <p className="font-body-md text-[14px] text-white/60">© 2026 OJAS Wellness. Ancient Wisdom, Modern Rhythm.</p>
      </footer>
    </div>
  );
}
