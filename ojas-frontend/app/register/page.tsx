'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Check, X } from 'lucide-react';

const hasSequentialCharacters = (val: string): boolean => {
  if (val.length < 3) return false;
  const str = val.toLowerCase();
  for (let i = 0; i <= str.length - 3; i++) {
    const code1 = str.charCodeAt(i);
    const code2 = str.charCodeAt(i + 1);
    const code3 = str.charCodeAt(i + 2);

    const isDigit = (c: number) => c >= 48 && c <= 57;
    const isLetter = (c: number) => c >= 97 && c <= 122;

    const allDigits = isDigit(code1) && isDigit(code2) && isDigit(code3);
    const allLetters = isLetter(code1) && isLetter(code2) && isLetter(code3);

    if (allDigits || allLetters) {
      if ((code2 === code1 + 1 && code3 === code2 + 1) || // ascending
          (code2 === code1 - 1 && code3 === code2 - 1)) {  // descending
        return true;
      }
    }
  }
  return false;
};

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
  const [showRules, setShowRules] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState('');

  const hasSequential = hasSequentialCharacters(password);
  const rules = [
    { id: 'length', label: 'Minimum 6 characters', valid: password.length >= 6 },
    { id: 'uppercase', label: 'At least 1 uppercase letter (A–Z)', valid: /[A-Z]/.test(password) },
    { id: 'digit', label: 'At least 1 digit (0–9)', valid: /\d/.test(password) },
    { id: 'special', label: 'At least 1 special character (e.g. !@#$%^&*)', valid: /[^A-Za-z0-9]/.test(password) },
    { id: 'sequence', label: 'No sequential characters (e.g. 123, abc)', valid: !hasSequential },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !name || !password || !gender) {
      setError('All fields are required.');
      return;
    }

    const allRulesSatisfied = rules.every((r) => r.valid);
    if (!allRulesSatisfied) {
      setPasswordWarning('Password does not meet all requirements');
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
                BEGIN THE RITUAL
              </span>
              <h1 className="text-3xl md:text-4xl font-normal font-cormorant text-[#1C1917] dark:text-[#FAF6F0] leading-tight">
                Create your <span className="italic text-[#c06080]">Ojas Account</span>
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

                <div>
                  <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordWarning) setPasswordWarning('');
                    }}
                    onFocus={() => setShowRules(true)}
                    required
                    disabled={loading}
                  />
                  {passwordWarning && (
                    <p className="text-red-500 font-mono text-[10px] uppercase tracking-wider mt-1">
                      ⚠️ {passwordWarning}
                    </p>
                  )}
                  {showRules && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-[#FAF6F0]/50 dark:bg-stone-900/50 border border-stone-200/50 dark:border-stone-800/50 space-y-1.5 animate-fade-in">
                      <p className="text-[9px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 font-bold">
                        Password Requirements
                      </p>
                      <ul className="space-y-1">
                        {rules.map((rule) => (
                          <li key={rule.id} className="flex items-center text-[10px] font-mono tracking-wide">
                            {rule.valid ? (
                              <Check size={12} className="text-green-600 dark:text-green-400 mr-1.5 flex-shrink-0 stroke-[2.5]" />
                            ) : (
                              <X size={12} className="text-red-500 dark:text-red-400 mr-1.5 flex-shrink-0 stroke-[2.5]" />
                            )}
                            <span className={rule.valid ? "text-stone-400 line-through decoration-stone-300/30" : "text-stone-600 dark:text-stone-300"}>
                              {rule.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-[9px] font-mono uppercase tracking-wider mb-1.5 font-bold text-stone-400">
                    Biological Sex
                  </label>
                  <div className="flex w-full gap-3">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setGender('female')}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs font-mono uppercase tracking-widest font-bold border transition-all duration-300 select-none cursor-pointer ${
                        gender === 'female'
                          ? "bg-[#c06080] border-[#c06080] text-white shadow-sm"
                          : "bg-[#FAF6F0] border-stone-300/40 text-stone-600 dark:bg-stone-900/40 dark:border-stone-800 dark:text-stone-400 hover:border-[#c06080]/50 hover:text-stone-900 dark:hover:text-white"
                      }`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setGender('male')}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs font-mono uppercase tracking-widest font-bold border transition-all duration-300 select-none cursor-pointer ${
                        gender === 'male'
                          ? "bg-[#c06080] border-[#c06080] text-white shadow-sm"
                          : "bg-[#FAF6F0] border-stone-300/40 text-stone-600 dark:bg-stone-900/40 dark:border-stone-800 dark:text-stone-400 hover:border-[#c06080]/50 hover:text-stone-900 dark:hover:text-white"
                      }`}
                    >
                      Male
                    </button>
                  </div>
                </div>

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
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-stone-200/10 pt-4">
                <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                  Have an account?{' '}
                  <Link
                    href="/login"
                    className="text-[#c06080] font-bold hover:underline"
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
