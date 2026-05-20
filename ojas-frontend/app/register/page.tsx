'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useUserStore((state) => state.registerUser);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('female');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !name || !password || !gender) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await registerUser(username, email, password, name, gender);
      if (success) {
        // New user registered -> begin Prakriti questionnaire
        router.push('/prakriti');
      } else {
        setError('Username or email already in use.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to registration server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-[#C27A5D]/10 relative overflow-hidden transition-colors duration-500">
      {/* Decorative ambient blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute w-[400px] h-[400px] bg-[#C27A5D]/5 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-[#8A5A44]/5 rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <div>
          <Header />

          <main className="max-w-md mx-auto px-6 py-12 md:py-24 w-full animate-fade-rise">
            <div className="text-center mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C27A5D] font-semibold mb-2 block">
                BEGIN THE RITUAL
              </span>
              <h1 className="text-3xl md:text-4xl font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-tight">
                Create your <span className="italic text-[#C27A5D]">Ojas Account</span>
              </h1>
              <p className="text-stone-400 font-inter text-xs mt-3 leading-relaxed">
                Connect your Ayurvedic rhythms and celestial cycle alignments with persistent cloud backups.
              </p>
            </div>

            <Card className="border border-stone-200/10 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 p-8 rounded-[28px] backdrop-blur-md">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  label="Display Name"
                  placeholder="e.g. Elena"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />

                <Input
                  type="text"
                  label="Username"
                  placeholder="elena_wellness"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />

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

                <Select
                  label="Biological Sex"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={[
                    { value: 'female', label: 'Female' },
                    { value: 'male', label: 'Male' }
                  ]}
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
                  className="w-full py-4 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[#1C1917] text-[#FAF6F0] dark:bg-[#FAF6F0] dark:text-[#1C1917] hover:bg-[#C27A5D] dark:hover:bg-[#C27A5D] dark:hover:text-white disabled:opacity-30 active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer select-none mt-2"
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-stone-200/10 pt-4">
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                  Have an account?{' '}
                  <Link
                    href="/login"
                    className="text-[#C27A5D] font-bold hover:underline"
                  >
                    Log in here
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
