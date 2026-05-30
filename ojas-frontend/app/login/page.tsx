'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Input } from '../components/Input';

export default function LoginPage() {
  const router = useRouter();
  const loginUser = useUserStore((state) => state.loginUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await loginUser(email, password);
      if (success) {
        router.push('/prakriti');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to auth server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-[#c06080]/10 relative overflow-hidden transition-colors duration-500">
      {/* Decorative ambient blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute w-[400px] h-[400px] bg-[#c06080]/5 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-[#8A5A44]/5 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <div>
          <Header />

          <main className="max-w-md mx-auto px-6 py-12 md:py-24 w-full animate-fade-rise">
            <div className="text-center mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c06080] font-semibold mb-2 block">
                WELCOME BACK
              </span>
              <h1 className="text-3xl md:text-4xl font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-tight">
                Enter your <span className="italic text-[#c06080]">Sanctuary</span>
              </h1>
              <p className="text-stone-400 font-inter text-xs mt-3 leading-relaxed">
                Log in to restore your Ayurvedic Prakriti insights, cosmic calendar alignments, and sound preferences.
              </p>
            </div>

            <Card className="border border-stone-200/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 p-8 rounded-[28px] backdrop-blur-md">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />

                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />

                {error && (
                  <p className="text-red-500 font-mono text-[10px] uppercase tracking-wider text-center mt-2">
                    ⚠️ {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] text-[#FAF6F0] dark:bg-[#FAF6F0] dark:text-[#1C1917] hover:bg-[#c06080] dark:hover:bg-[#c06080] dark:hover:text-white disabled:opacity-30 active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer select-none mt-2"
                >
                  {loading ? 'Entering Sanctuary...' : 'Log In'}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-stone-200/10 pt-4">
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                  New to Ojas?{' '}
                  <Link
                    href="/register"
                    className="text-[#c06080] font-bold hover:underline"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </Card>
          </main>
        </div>

        <footer className="w-full max-w-7xl mx-auto px-8 pb-6 pt-6 border-t border-[#1C1917]/5 dark:border-stone-850 flex items-center justify-between text-[9px] md:text-[10px] font-mono text-stone-500 tracking-wider">
          <div>SECURE PASS</div>
          <div>© OJAS RITUAL MMXXVI</div>
        </footer>
      </div>
    </div>
  );
}
