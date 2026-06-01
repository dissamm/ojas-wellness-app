'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../components/Header';
import { useUserStore } from '../store/userStore';
import { useLanguageStore, Language } from '../store/languageStore';
import {
  ArrowLeft, Camera, Edit2, Check, X, Lock, Trash2, Mail,
  Globe, BookOpen, Moon, Sun, Bell, User, Settings, HelpCircle,
  ChevronRight, Shield
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Section = 'account' | 'settings' | 'language' | 'help' | 'learn';

const sectionList: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'account',  label: 'Account',    icon: <User size={16} /> },
  { key: 'settings', label: 'Settings',   icon: <Settings size={16} /> },
  { key: 'language', label: 'Language',   icon: <Globe size={16} /> },
  { key: 'help',     label: 'Get Help',   icon: <HelpCircle size={16} /> },
  { key: 'learn',    label: 'Learn More', icon: <BookOpen size={16} /> },
];

// Shared Tailwind class strings
const inputCls = 'w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#C27A5D] transition-colors';
const labelCls = 'block text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-stone-400 mb-1.5';
const saveBtnCls = 'px-6 py-2.5 bg-[#C27A5D] hover:bg-[#B06B50] text-white text-[10px] font-mono uppercase tracking-[0.18em] rounded-full transition-colors font-bold';
const blockCls = 'bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden';
const rowCls = 'w-full flex items-center justify-between px-5 py-[18px] text-sm text-stone-600 dark:text-stone-300 hover:text-[#C27A5D] cursor-pointer transition-colors';

export default function ProfilePage() {
  const router = useRouter();
  const { user, changeEmail, changePassword, deleteAccount, syncUserProfile, logout, isAuthenticated, loadProfileFromToken } = useUserStore();
  const { language, setLanguage } = useLanguageStore();

  const [activeSection, setActiveSection] = useState<Section>('account');
  const [mobileShowMenu, setMobileShowMenu] = useState(true);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileGender, setProfileGender] = useState('female');
  const [profileDobDay, setProfileDobDay] = useState('');
  const [profileDobMonth, setProfileDobMonth] = useState('');
  const [profileDobYear, setProfileDobYear] = useState('');
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  const daysList = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const monthsList = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 120 }, (_, i) => String(currentYear - i));

  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '' });
  const [emailStatus, setEmailStatus] = useState<{ ok?: boolean; msg?: string }>({});
  const [passwordStatus, setPasswordStatus] = useState<{ ok?: boolean; msg?: string }>({});
  const [deleteStatus, setDeleteStatus] = useState<{ ok?: boolean; msg?: string }>({});
  const [openAccountForm, setOpenAccountForm] = useState<'none' | 'email' | 'password' | 'delete'>('none');

  const [isDark, setIsDark] = useState(false);
  const [notifs, setNotifs] = useState(true);

  const [helpForm, setHelpForm] = useState({ subject: '', message: '' });
  const [helpStatus, setHelpStatus] = useState<{ ok?: boolean; msg?: string }>({});

  const [openLearn, setOpenLearn] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      setIsLoading(false);
      return;
    }
    loadProfileFromToken().finally(() => setIsLoading(false));
  }, [hydrated, isAuthenticated, router, loadProfileFromToken]);


  useEffect(() => {
    setNewName(user?.name || '');
    if (user?.gender) setProfileGender(user.gender);
    if (user?.dateOfBirth) {
      const parts = user.dateOfBirth.split('-'); // YYYY-MM-DD
      if (parts.length === 3) {
        setProfileDobYear(parts[0]);
        setProfileDobMonth(parts[1]);
        setProfileDobDay(parts[2]);
      }
    } else {
      setProfileDobYear('');
      setProfileDobMonth('');
      setProfileDobDay('');
    }
    if (typeof window !== 'undefined') {
      const dark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
      setIsDark(dark);
      setNotifs(localStorage.getItem('notifications_preference') !== 'false');
    }
  }, [user]);

  const profileDetailsChanged = 
    profileGender !== (user?.gender || 'female') ||
    profileDobDay !== (user?.dateOfBirth ? user.dateOfBirth.split('-')[2] : '') ||
    profileDobMonth !== (user?.dateOfBirth ? user.dateOfBirth.split('-')[1] : '') ||
    profileDobYear !== (user?.dateOfBirth ? user.dateOfBirth.split('-')[0] : '');

  const handleSaveProfileDetails = async () => {
    const dob = (profileDobYear && profileDobMonth && profileDobDay)
      ? `${profileDobYear}-${profileDobMonth}-${profileDobDay}`
      : undefined;

    useUserStore.setState(st => ({
      user: {
        ...st.user,
        gender: profileGender,
        dateOfBirth: dob
      }
    }));
    await syncUserProfile();
    setSaveProfileSuccess(true);
    setTimeout(() => setSaveProfileSuccess(false), 3000);
  };

  const switchSection = useCallback((s: Section) => {
    setActiveSection(s);
    setMobileShowMenu(false);
  }, []);

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    useUserStore.setState(st => ({ user: { ...st.user, name: newName } }));
    await syncUserProfile();
    setIsEditingName(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload PNG, JPG, or WEBP.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      useUserStore.setState(st => ({ user: { ...st.user, profilePicture: reader.result as string } }));
      await syncUserProfile();
    };
    reader.readAsDataURL(file);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus({});
    const res = await changeEmail(emailForm.newEmail, emailForm.password);
    if (res.success) {
      setEmailStatus({ ok: true, msg: 'Email updated successfully!' });
      setEmailForm({ newEmail: '', password: '' });
      setTimeout(() => setOpenAccountForm('none'), 2000);
    } else setEmailStatus({ ok: false, msg: res.message });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({});
    const res = await changePassword(passwordForm.current, passwordForm.next);
    if (res.success) {
      setPasswordStatus({ ok: true, msg: 'Password updated successfully!' });
      setPasswordForm({ current: '', next: '' });
      setTimeout(() => setOpenAccountForm('none'), 2000);
    } else setPasswordStatus({ ok: false, msg: res.message });
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = window.confirm('This action is permanent and cannot be undone. Are you sure?');
    if (!confirmed) return;
    const res = await deleteAccount();
    if (res.success) {
      setDeleteStatus({ ok: true, msg: 'Account deleted. Redirecting...' });
      setTimeout(() => router.push('/login'), 2000);
    } else setDeleteStatus({ ok: false, msg: res.message });
  };

  const handleToggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    if (next) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleToggleNotifs = () => {
    const next = !notifs;
    setNotifs(next);
    localStorage.setItem('notifications_preference', String(next));
  };

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHelpStatus({ ok: true, msg: 'Thank you! We will get back to you shortly.' });
    setHelpForm({ subject: '', message: '' });
    setTimeout(() => setHelpStatus({}), 4000);
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  const renderContent = () => {
    switch (activeSection) {

      case 'account':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="font-cormorant text-4xl font-medium text-stone-800 dark:text-stone-100 mb-2">Account</h2>
              <p className="text-sm text-stone-500 leading-relaxed">Manage your login credentials and account data.</p>
            </div>

            {/* Profile Details (Sex & Date of Birth) */}
            <div className={`${blockCls} p-6 space-y-5`}>
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#C27A5D] font-bold">Profile Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Biological Sex */}
                <div>
                  <label className={labelCls}>Biological Sex</label>
                  <select
                    value={profileGender}
                    onChange={(e) => setProfileGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:border-[#C27A5D] transition-colors cursor-pointer select-none"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                
                {/* Date of Birth */}
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <div className="flex gap-2.5">
                    <select
                      value={profileDobDay}
                      onChange={(e) => setProfileDobDay(e.target.value)}
                      className={`flex-1 px-3 py-3 rounded-2xl border bg-white dark:bg-stone-900 text-sm focus:outline-none focus:border-[#C27A5D] transition-colors cursor-pointer select-none ${
                        profileDobDay ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400'
                      } ${
                        profileDobDay ? 'border-stone-200 dark:border-stone-800' : 'border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <option value="" className="text-stone-400">DD</option>
                      {daysList.map(d => <option key={d} value={d} className="text-stone-800 dark:bg-stone-900 dark:text-stone-100">{d}</option>)}
                    </select>

                    <select
                      value={profileDobMonth}
                      onChange={(e) => setProfileDobMonth(e.target.value)}
                      className={`flex-1 px-3 py-3 rounded-2xl border bg-white dark:bg-stone-900 text-sm focus:outline-none focus:border-[#C27A5D] transition-colors cursor-pointer select-none ${
                        profileDobMonth ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400'
                      } ${
                        profileDobMonth ? 'border-stone-200 dark:border-stone-800' : 'border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <option value="" className="text-stone-400">MM</option>
                      {monthsList.map(m => <option key={m.value} value={m.value} className="text-stone-800 dark:bg-stone-900 dark:text-stone-100">{m.label}</option>)}
                    </select>

                    <select
                      value={profileDobYear}
                      onChange={(e) => setProfileDobYear(e.target.value)}
                      className={`flex-1 px-3 py-3 rounded-2xl border bg-white dark:bg-stone-900 text-sm focus:outline-none focus:border-[#C27A5D] transition-colors cursor-pointer select-none ${
                        profileDobYear ? 'text-stone-800 dark:text-stone-100' : 'text-stone-400'
                      } ${
                        profileDobYear ? 'border-stone-200 dark:border-stone-800' : 'border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <option value="" className="text-stone-400">YYYY</option>
                      {yearsList.map(y => <option key={y} value={y} className="text-stone-800 dark:bg-stone-900 dark:text-stone-100">{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-[10px] text-stone-400 font-mono">Used for Jyotish planetary alignments & insights</span>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {saveProfileSuccess && (
                    <span className="text-xs font-mono text-green-500 animate-pulse">✓ Saved!</span>
                  )}
                  {profileDetailsChanged && (
                    <button
                      onClick={handleSaveProfileDetails}
                      className={saveBtnCls}
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Change Email */}
            <div className={blockCls}>
              <button className={rowCls} onClick={() => setOpenAccountForm(openAccountForm === 'email' ? 'none' : 'email')}>
                <span className="flex items-center gap-3"><Mail size={15} className="text-[#C27A5D]" /><span>Change Email</span></span>
                <ChevronRight size={15} className={`text-stone-400 transition-transform ${openAccountForm === 'email' ? 'rotate-90' : ''}`} />
              </button>
              {openAccountForm === 'email' && (
                <form onSubmit={handleEmailSubmit} className="px-5 pb-5 space-y-4 border-t border-stone-100 dark:border-stone-800 pt-4">
                  <div><label className={labelCls}>New Email Address</label>
                    <input type="email" value={emailForm.newEmail} onChange={e => setEmailForm(f => ({ ...f, newEmail: e.target.value }))} className={inputCls} required placeholder="you@example.com" /></div>
                  <div><label className={labelCls}>Current Password</label>
                    <input type="password" value={emailForm.password} onChange={e => setEmailForm(f => ({ ...f, password: e.target.value }))} className={inputCls} required placeholder="••••••••" /></div>
                  {emailStatus.msg && <p className={`text-xs font-mono ${emailStatus.ok ? 'text-green-500' : 'text-red-500'}`}>{emailStatus.msg}</p>}
                  <button type="submit" className={saveBtnCls}>Save Email</button>
                </form>
              )}
            </div>

            {/* Change Password */}
            <div className={blockCls}>
              <button className={rowCls} onClick={() => setOpenAccountForm(openAccountForm === 'password' ? 'none' : 'password')}>
                <span className="flex items-center gap-3"><Lock size={15} className="text-[#C27A5D]" /><span>Change Password</span></span>
                <ChevronRight size={15} className={`text-stone-400 transition-transform ${openAccountForm === 'password' ? 'rotate-90' : ''}`} />
              </button>
              {openAccountForm === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="px-5 pb-5 space-y-4 border-t border-stone-100 dark:border-stone-800 pt-4">
                  <div><label className={labelCls}>Current Password</label>
                    <input type="password" value={passwordForm.current} onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))} className={inputCls} required placeholder="••••••••" /></div>
                  <div><label className={labelCls}>New Password</label>
                    <input type="password" value={passwordForm.next} onChange={e => setPasswordForm(f => ({ ...f, next: e.target.value }))} className={inputCls} required placeholder="••••••••" /></div>
                  {passwordStatus.msg && <p className={`text-xs font-mono ${passwordStatus.ok ? 'text-green-500' : 'text-red-500'}`}>{passwordStatus.msg}</p>}
                  <button type="submit" className={saveBtnCls}>Update Password</button>
                </form>
              )}
            </div>

            {/* Delete Account */}
            <div className={`${blockCls} border-red-200/70 dark:border-red-900/30`}>
              <button className={`${rowCls} text-red-500 dark:text-red-400 hover:text-red-600`} onClick={() => setOpenAccountForm(openAccountForm === 'delete' ? 'none' : 'delete')}>
                <span className="flex items-center gap-3"><Trash2 size={15} /><span>Delete Account</span></span>
                <ChevronRight size={15} className={`transition-transform ${openAccountForm === 'delete' ? 'rotate-90' : ''}`} />
              </button>
              {openAccountForm === 'delete' && (
                <form onSubmit={handleDeleteAccount} className="px-5 pb-5 space-y-4 border-t border-red-100 dark:border-red-900/20 pt-4">
                  <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 leading-relaxed bg-red-50 dark:bg-red-950/20 rounded-xl p-4">
                    <Shield size={15} className="mt-0.5 shrink-0" />
                    <span>This action is <strong>permanent and irreversible</strong>. All data including Prakriti results, cycle history, and preferences will be deleted.</span>
                  </div>
                  {deleteStatus.msg && <p className={`text-xs font-mono ${deleteStatus.ok ? 'text-green-500' : 'text-red-500'}`}>{deleteStatus.msg}</p>}
                  <button type="submit" className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-mono uppercase tracking-[0.18em] rounded-full transition-colors font-bold">
                    Delete Permanently
                  </button>
                </form>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="font-cormorant text-4xl font-medium text-stone-800 dark:text-stone-100 mb-2">Settings</h2>
              <p className="text-sm text-stone-500 leading-relaxed">Customize your experience.</p>
            </div>

            <div className={blockCls}>
              <div className={rowCls}>
                <span className="flex items-center gap-3">
                  {isDark ? <Moon size={15} className="text-[#C27A5D]" /> : <Sun size={15} className="text-[#C27A5D]" />}
                  <div>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{isDark ? 'Night Mode' : 'Day Mode'}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Switch between light and dark theme</p>
                  </div>
                </span>
                <button onClick={handleToggleDark} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ${isDark ? 'bg-[#C27A5D]' : 'bg-stone-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className={blockCls}>
              <div className={rowCls}>
                <span className="flex items-center gap-3">
                  <Bell size={15} className="text-[#C27A5D]" />
                  <div>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-200">Notifications</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Receive wellness reminders and updates</p>
                  </div>
                </span>
                <button onClick={handleToggleNotifs} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ${notifs ? 'bg-[#C27A5D]' : 'bg-stone-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${notifs ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="font-cormorant text-4xl font-medium text-stone-800 dark:text-stone-100 mb-2">Language</h2>
              <p className="text-sm text-stone-500 leading-relaxed">Choose your preferred display language.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { code: 'en', label: 'English',  sub: 'English' },
                { code: 'hi', label: 'हिन्दी',    sub: 'Hindi' },
                { code: 'pa', label: 'ਪੰਜਾਬੀ',   sub: 'Punjabi' },
                { code: 'it', label: 'Italiano',  sub: 'Italian' },
                { code: 'zh', label: '中文',       sub: 'Chinese' },
                { code: 'fr', label: 'Français',  sub: 'French' },
              ] as { code: Language; label: string; sub: string }[]).map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200 text-left ${
                    language === lang.code
                      ? 'border-[#C27A5D] bg-[#C27A5D]/5 dark:bg-[#C27A5D]/10'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900'
                  }`}
                >
                  <div>
                    <p className={`font-medium text-sm ${language === lang.code ? 'text-[#C27A5D]' : 'text-stone-700 dark:text-stone-200'}`}>{lang.label}</p>
                    <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mt-0.5">{lang.sub}</p>
                  </div>
                  {language === lang.code && (
                    <div className="w-5 h-5 rounded-full bg-[#C27A5D] flex items-center justify-center shrink-0">
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="font-cormorant text-4xl font-medium text-stone-800 dark:text-stone-100 mb-2">Get Help</h2>
              <p className="text-sm text-stone-500 leading-relaxed">Having trouble? Send us a message and we will respond within 24 hours.</p>
            </div>
            <form onSubmit={handleHelpSubmit} className="space-y-5 max-w-xl">
              <div>
                <label className={labelCls}>Subject</label>
                <input type="text" value={helpForm.subject} onChange={e => setHelpForm(f => ({ ...f, subject: e.target.value }))} className={inputCls} placeholder="What can we help you with?" required />
              </div>
              <div>
                <label className={labelCls}>Message</label>
                <textarea value={helpForm.message} onChange={e => setHelpForm(f => ({ ...f, message: e.target.value }))} rows={5} className={`${inputCls} resize-none`} placeholder="Describe your issue in detail..." required />
              </div>
              {helpStatus.msg && <p className={`text-xs font-mono ${helpStatus.ok ? 'text-green-500' : 'text-red-500'}`}>{helpStatus.msg}</p>}
              <button type="submit" className={saveBtnCls}>Send Message</button>
            </form>
          </div>
        );

      case 'learn':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="font-cormorant text-4xl font-medium text-stone-800 dark:text-stone-100 mb-2">Learn More</h2>
              <p className="text-sm text-stone-500 leading-relaxed">Understand how Ojas works and how your data is handled.</p>
            </div>
            <div className="space-y-3">
              {[
                {
                  key: 'tutorials',
                  title: 'Tutorials — How to use the app',
                  body: 'Welcome to Ojas! Begin by completing your Prakriti analysis. Based on your unique dosha mix — Vata, Pitta, or Kapha — Ojas personalizes daily self-care rituals, recommends healing music frequencies, and aligns your rhythms with the lunar cycle. Navigate using the top menu to explore each feature.'
                },
                {
                  key: 'usage',
                  title: 'Usage Policy',
                  body: 'Ojas wellness applications are designed for lifestyle tracking, health suggestions, and mindfulness recommendations. The content provided is informational and does not constitute medical advice. Please consult qualified healthcare professionals for any specific health concerns or medical conditions.'
                },
                {
                  key: 'privacy',
                  title: 'Privacy Policy',
                  body: 'Your personal profile data, Prakriti assessment answers, and cycle patterns are stored securely and are never shared with third parties. All data is encrypted at rest and in transit. You can request complete deletion of your data at any time from the Account section.'
                },
              ].map(item => (
                <div key={item.key} className={`${blockCls}`}>
                  <button className={rowCls} onClick={() => setOpenLearn(openLearn === item.key ? null : item.key)}>
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-200 text-left">{item.title}</span>
                    <ChevronRight size={15} className={`text-stone-400 shrink-0 transition-transform duration-200 ${openLearn === item.key ? 'rotate-90' : ''}`} />
                  </button>
                  {openLearn === item.key && (
                    <div className="px-5 pb-5 border-t border-stone-100 dark:border-stone-800 pt-4">
                      <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{item.body}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  if (!hydrated || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] dark:bg-[#0F0D0B] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#C27A5D] border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE] dark:bg-[#0F0D0B] text-[#1C1917] dark:text-[#FAF6F0] transition-colors duration-300">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12">

        {/* Back to dashboard */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-[#C27A5D] transition-colors mb-10 group"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </Link>

        {/* Mobile: back to menu */}
        {!mobileShowMenu && (
          <button
            onClick={() => setMobileShowMenu(true)}
            className="md:hidden inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-[#C27A5D] transition-colors mb-6 group"
          >
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
            All Sections
          </button>
        )}

        <div className="flex flex-col md:flex-row gap-10 md:gap-14 lg:gap-20">

          {/* ── LEFT SIDEBAR ──────────────────────────────────────────────────── */}
          <aside className={`${mobileShowMenu ? 'block' : 'hidden'} md:block w-full md:w-64 lg:w-72 shrink-0`}>
            <div className="sticky top-24">

              {/* Avatar + Name + Email + Dosha */}
              <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-stone-200 dark:border-stone-800">
                <div
                  className="relative group cursor-pointer mb-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-center text-2xl font-mono font-bold text-stone-500 relative">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                    ) : userInitial}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                      <Camera size={18} className="text-white" />
                    </div>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png,image/jpeg,image/webp" className="hidden" />

                {isEditingName ? (
                  <div className="flex items-center gap-2 w-full max-w-[200px]">
                    <input
                      type="text" value={newName} onChange={e => setNewName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:border-[#C27A5D] text-center"
                    />
                    <button onClick={handleSaveName} className="p-1.5 rounded-lg bg-[#C27A5D] text-white hover:bg-[#B06B50] transition-colors"><Check size={12} /></button>
                    <button onClick={() => { setIsEditingName(false); setNewName(user?.name || ''); }} className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-500 hover:text-red-500"><X size={12} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-cormorant text-xl font-semibold text-stone-800 dark:text-stone-100">{user?.name || 'Your Name'}</span>
                    <button onClick={() => setIsEditingName(true)} className="text-stone-400 hover:text-[#C27A5D] transition-colors">
                      <Edit2 size={11} />
                    </button>
                  </div>
                )}
                <span className="text-[11px] font-mono text-stone-400 mt-1">{user?.email}</span>
                {user?.dominantDosha && (
                  <span className="mt-2 px-2.5 py-0.5 bg-[#C27A5D]/10 dark:bg-[#C27A5D]/15 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] text-[#C27A5D]">
                    {user.dominantDosha}
                  </span>
                )}
              </div>

              {/* Section nav */}
              <nav className="space-y-1 mb-8">
                {sectionList.map(s => (
                  <button
                    key={s.key}
                    onClick={() => switchSection(s.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left ${
                      activeSection === s.key
                        ? 'bg-[#C27A5D]/10 dark:bg-[#C27A5D]/15 text-[#C27A5D]'
                        : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/50 hover:text-stone-700 dark:hover:text-stone-200'
                    }`}
                  >
                    <span className={activeSection === s.key ? 'text-[#C27A5D]' : 'text-stone-400 dark:text-stone-500'}>{s.icon}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-bold">{s.label}</span>
                  </button>
                ))}
                
                <Link
                  href="/jyotish"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/50 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <span className="text-stone-400 dark:text-stone-500 font-mono text-sm leading-none flex items-center justify-center w-[16px] h-[16px]">☿</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-bold">Jyotish Blueprint</span>
                </Link>
              </nav>

              {/* Log Out */}
              <button
                onClick={() => { logout(); router.push('/login'); }}
                className="w-full py-3 rounded-2xl border border-stone-200 dark:border-stone-800 text-[10px] font-mono uppercase tracking-[0.18em] font-bold text-stone-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800/50 transition-all duration-200"
              >
                Log Out
              </button>
            </div>
          </aside>

          {/* ── RIGHT CONTENT AREA ────────────────────────────────────────────── */}
          <main className={`flex-1 min-w-0 ${mobileShowMenu ? 'max-md:hidden' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>

    </div>
  );
}
