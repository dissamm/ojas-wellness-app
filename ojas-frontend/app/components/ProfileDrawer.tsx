'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useLanguageStore, useTranslation, Language } from '../store/languageStore';
import { Camera, Edit2, Check, X, Lock, Trash2, Mail, Globe, BookOpen, Moon, Sun, Bell } from 'lucide-react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer = ({ isOpen, onClose }: ProfileDrawerProps) => {
  const { user, changeEmail, changePassword, deleteAccount, syncUserProfile, logout } = useUserStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  // Component state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  
  // Account forms toggles
  const [activeAccountSection, setActiveAccountSection] = useState<'none' | 'email' | 'password' | 'delete'>('none');
  
  // Account forms inputs
  const [emailInput, setEmailInput] = useState('');
  const [emailPasswordInput, setEmailPasswordInput] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  
  // Status messages
  const [emailStatus, setEmailStatus] = useState<{ success?: boolean; message?: string }>({});
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string }>({});
  const [deleteStatus, setDeleteStatus] = useState<{ success?: boolean; message?: string }>({});
  const [helpStatus, setHelpStatus] = useState<{ success?: boolean; message?: string }>({});
  
  // Support form inputs
  const [helpSubject, setHelpSubject] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  
  // Learn more accordions
  const [activeLearnSection, setActiveLearnSection] = useState<'none' | 'tutorials' | 'usage' | 'privacy'>('none');

  // Dark mode theme state
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Notification preference
  const [notificationsOn, setNotificationsOn] = useState(true);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load name, dark mode, notifications on mount/open
  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
    // Check dark mode
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
      setIsDarkMode(isDark);
      
      const notifs = localStorage.getItem('notifications_preference') !== 'false';
      setNotificationsOn(notifs);
    }
  }, [user, isOpen]);

  // Sync dark mode toggle
  const handleToggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (nextDark) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const handleToggleNotifications = () => {
    const nextVal = !notificationsOn;
    setNotificationsOn(nextVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications_preference', String(nextVal));
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    useUserStore.setState((state) => ({
      user: { ...state.user, name: newName }
    }));
    await syncUserProfile();
    setIsEditingName(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // Verify format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert("Invalid format! Please upload PNG, JPG, or WEBP.");
      return;
    }
    
    // Read as Base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      useUserStore.setState((state) => ({
        user: { ...state.user, profilePicture: base64 }
      }));
      await syncUserProfile();
    };
    reader.readAsDataURL(file);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus({});
    if (!emailInput || !emailPasswordInput) {
      setEmailStatus({ success: false, message: "Please fill in all fields" });
      return;
    }
    const res = await changeEmail(emailInput, emailPasswordInput);
    if (res.success) {
      setEmailStatus({ success: true, message: "Email changed successfully!" });
      setEmailInput('');
      setEmailPasswordInput('');
      setTimeout(() => setActiveAccountSection('none'), 2000);
    } else {
      setEmailStatus({ success: false, message: res.message });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({});
    if (!currentPasswordInput || !newPasswordInput) {
      setPasswordStatus({ success: false, message: "Please fill in all fields" });
      return;
    }
    const res = await changePassword(currentPasswordInput, newPasswordInput);
    if (res.success) {
      setPasswordStatus({ success: true, message: "Password updated successfully!" });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setTimeout(() => setActiveAccountSection('none'), 2000);
    } else {
      setPasswordStatus({ success: false, message: res.message });
    }
  };

  const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteStatus({});
    const confirmed = window.confirm(t('confirmDeleteMessage'));
    if (!confirmed) return;
    
    const res = await deleteAccount();
    if (res.success) {
      setDeleteStatus({ success: true, message: "Account deleted successfully. Logging out..." });
      setTimeout(() => {
        onClose();
        window.location.href = '/login';
      }, 2000);
    } else {
      setDeleteStatus({ success: false, message: res.message });
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpSubject.trim() || !helpMessage.trim()) return;
    setHelpStatus({ success: true, message: t('supportSuccess') });
    setHelpSubject('');
    setHelpMessage('');
    setTimeout(() => setHelpStatus({}), 3000);
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="relative w-full sm:w-[440px] h-full bg-[#FAF6F0] dark:bg-[#12100E] shadow-2xl flex flex-col z-10 transition-transform duration-350 transform translate-x-0 border-l border-stone-200 dark:border-stone-850 overflow-y-auto">
        
        {/* Panel Header */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-stone-500 dark:text-stone-400">
            {t('profilePanel')}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-stone-300/40 dark:border-stone-800 text-stone-500 hover:text-[#c06080] hover:border-[#c06080] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 px-6 py-6 space-y-8 pb-12">
          
          {/* Section 1 & 2: Header + Avatar Upload */}
          <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-stone-200 dark:border-stone-850">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              {/* Avatar circle */}
              <div className="w-24 h-24 rounded-full overflow-hidden border border-stone-300/80 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-center text-xl font-mono font-bold text-stone-600 dark:text-stone-400 relative">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
                {/* Upload Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="text-white" size={20} />
                </div>
              </div>
            </div>
            
            {/* Hidden Input File Picker */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg, image/webp" 
              className="hidden" 
            />

            {/* Editable Name */}
            <div className="w-full flex flex-col items-center">
              {isEditingName ? (
                <div className="flex items-center gap-2 max-w-xs">
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-[#c06080]"
                  />
                  <button 
                    onClick={handleSaveName}
                    className="p-2 rounded-lg bg-[#c06080] text-white hover:bg-[#B06B50] transition-colors"
                  >
                    <Check size={14} />
                  </button>
                  <button 
                    onClick={() => { setIsEditingName(false); setNewName(user?.name || ''); }}
                    className="p-2 rounded-lg border border-stone-300 dark:border-stone-800 text-stone-500 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-cormorant text-xl font-semibold text-stone-800 dark:text-stone-100">
                    {user?.name || 'Anonymous User'}
                  </span>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="text-stone-400 hover:text-[#c06080] transition-colors"
                    title={t('editProfile')}
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
              )}
              <span className="text-xs font-mono text-stone-400 mt-1">{user?.email}</span>
            </div>
          </div>

          {/* Section 3: Account Credentials */}
          <div className="space-y-3 pb-6 border-b border-stone-200 dark:border-stone-850">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-stone-400">
              {t('account')}
            </h3>

            {/* Email form toggler */}
            <div>
              <button 
                onClick={() => setActiveAccountSection(activeAccountSection === 'email' ? 'none' : 'email')}
                className="w-full flex items-center justify-between text-xs py-2 text-stone-600 dark:text-stone-300 hover:text-[#c06080] transition-colors"
              >
                <span className="flex items-center gap-2"><Mail size={14} /> {t('changeEmail')}</span>
                <span>{activeAccountSection === 'email' ? '−' : '+'}</span>
              </button>
              {activeAccountSection === 'email' && (
                <form onSubmit={handleEmailSubmit} className="mt-2 pl-6 space-y-3 bg-stone-100/50 dark:bg-stone-900/40 p-4 rounded-2xl border border-stone-200/50 dark:border-stone-800/40">
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider mb-1 text-stone-400 font-bold">{t('newEmail')}</label>
                    <input 
                      type="email" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300/60 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#c06080]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider mb-1 text-stone-400 font-bold">{t('password')}</label>
                    <input 
                      type="password" 
                      value={emailPasswordInput}
                      onChange={(e) => setEmailPasswordInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300/60 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#c06080]"
                      required
                    />
                  </div>
                  {emailStatus.message && (
                    <p className={`text-[10px] font-mono ${emailStatus.success ? 'text-green-500' : 'text-red-500'}`}>
                      {emailStatus.message}
                    </p>
                  )}
                  <button 
                    type="submit" 
                    className="w-full py-2 bg-[#c06080] hover:bg-[#B06B50] text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-colors font-bold"
                  >
                    {t('save')}
                  </button>
                </form>
              )}
            </div>

            {/* Password form toggler */}
            <div>
              <button 
                onClick={() => setActiveAccountSection(activeAccountSection === 'password' ? 'none' : 'password')}
                className="w-full flex items-center justify-between text-xs py-2 text-stone-600 dark:text-stone-300 hover:text-[#c06080] transition-colors"
              >
                <span className="flex items-center gap-2"><Lock size={14} /> {t('changePassword')}</span>
                <span>{activeAccountSection === 'password' ? '−' : '+'}</span>
              </button>
              {activeAccountSection === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="mt-2 pl-6 space-y-3 bg-stone-100/50 dark:bg-stone-900/40 p-4 rounded-2xl border border-stone-200/50 dark:border-stone-800/40">
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider mb-1 text-stone-400 font-bold">{t('currentPassword')}</label>
                    <input 
                      type="password" 
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300/60 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#c06080]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider mb-1 text-stone-400 font-bold">{t('newPassword')}</label>
                    <input 
                      type="password" 
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300/60 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#c06080]"
                      required
                    />
                  </div>
                  {passwordStatus.message && (
                    <p className={`text-[10px] font-mono ${passwordStatus.success ? 'text-green-500' : 'text-red-500'}`}>
                      {passwordStatus.message}
                    </p>
                  )}
                  <button 
                    type="submit" 
                    className="w-full py-2 bg-[#c06080] hover:bg-[#B06B50] text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-colors font-bold"
                  >
                    {t('save')}
                  </button>
                </form>
              )}
            </div>

            {/* Delete Account toggler */}
            <div>
              <button 
                onClick={() => setActiveAccountSection(activeAccountSection === 'delete' ? 'none' : 'delete')}
                className="w-full flex items-center justify-between text-xs py-2 text-stone-600 dark:text-stone-300 hover:text-red-500 transition-colors"
              >
                <span className="flex items-center gap-2"><Trash2 size={14} className="text-red-400" /> {t('deleteAccount')}</span>
                <span>{activeAccountSection === 'delete' ? '−' : '+'}</span>
              </button>
              {activeAccountSection === 'delete' && (
                <form onSubmit={handleDeleteAccountSubmit} className="mt-2 pl-6 space-y-3 bg-red-500/5 dark:bg-red-950/10 p-4 rounded-2xl border border-red-500/20">
                  <p className="text-[11px] text-red-500 dark:text-red-400 font-medium">
                    ⚠️ {t('confirmDeleteMessage')}
                  </p>
                  {deleteStatus.message && (
                    <p className={`text-[10px] font-mono ${deleteStatus.success ? 'text-green-500' : 'text-red-500'}`}>
                      {deleteStatus.message}
                    </p>
                  )}
                  <button 
                    type="submit" 
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-colors font-bold"
                  >
                    {t('deleteButton')}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Section 4: Settings (Theme & Notification Toggles) */}
          <div className="space-y-3 pb-6 border-b border-stone-200 dark:border-stone-850">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-stone-400">
              {t('settings')}
            </h3>
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between text-xs py-1 text-stone-600 dark:text-stone-300">
              <span className="flex items-center gap-2">
                {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
                {isDarkMode ? t('nightMode') : t('dayMode')}
              </span>
              <button 
                onClick={handleToggleTheme}
                className="w-9 h-5 rounded-full bg-stone-300 dark:bg-[#c06080] p-0.5 relative transition-colors duration-300"
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Notification preferences toggle */}
            <div className="flex items-center justify-between text-xs py-1 text-stone-600 dark:text-stone-300">
              <span className="flex items-center gap-2">
                <Bell size={14} />
                {t('notifications')}
              </span>
              <button 
                onClick={handleToggleNotifications}
                className={`w-9 h-5 rounded-full p-0.5 relative transition-colors duration-300 ${notificationsOn ? 'bg-[#c06080]' : 'bg-stone-300 dark:bg-stone-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${notificationsOn ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Section 5: Language Selection */}
          <div className="space-y-3 pb-6 border-b border-stone-200 dark:border-stone-850">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-stone-400 flex items-center gap-2">
              <Globe size={14} /> {t('language')}
            </h3>
            <div className="relative">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300/60 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#c06080] uppercase tracking-wider font-mono cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="it">Italiano (Italian)</option>
                <option value="zh">中文 (Chinese)</option>
                <option value="fr">Français (French)</option>
              </select>
            </div>
          </div>

          {/* Section 6: Get Help Support Form */}
          <div className="space-y-3 pb-6 border-b border-stone-200 dark:border-stone-850">
            <button 
              onClick={() => setActiveAccountSection(activeAccountSection === 'delete' ? 'none' : 'none')} // resetting if needed
              className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-stone-400"
            >
              <span>{t('getHelp')}</span>
            </button>
            
            <form onSubmit={handleSupportSubmit} className="space-y-3 bg-stone-100/50 dark:bg-stone-900/40 p-4 rounded-2xl border border-stone-200/50 dark:border-stone-800/40">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">{t('supportForm')}</h4>
              <div>
                <input 
                  type="text" 
                  placeholder={t('subject')}
                  value={helpSubject}
                  onChange={(e) => setHelpSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300/60 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#c06080]"
                  required
                />
              </div>
              <div>
                <textarea 
                  placeholder={t('message')}
                  rows={3}
                  value={helpMessage}
                  onChange={(e) => setHelpMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300/60 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#c06080]"
                  required
                />
              </div>
              {helpStatus.message && (
                <p className="text-[10px] font-mono text-green-500">
                  {helpStatus.message}
                </p>
              )}
              <button 
                type="submit" 
                className="w-full py-2 bg-[#c06080] hover:bg-[#B06B50] text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-colors font-bold"
              >
                {t('submitMessage')}
              </button>
            </form>
          </div>

          {/* Section 7: Learn More Accordions */}
          <div className="space-y-3 pb-6">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-stone-400 flex items-center gap-2">
              <BookOpen size={14} /> {t('learnMore')}
            </h3>
            
            {/* Tutorials */}
            <div className="border-b border-stone-200/50 dark:border-stone-850">
              <button 
                onClick={() => setActiveLearnSection(activeLearnSection === 'tutorials' ? 'none' : 'tutorials')}
                className="w-full flex items-center justify-between text-xs py-2 text-stone-600 dark:text-stone-400 hover:text-[#c06080]"
              >
                <span>{t('tutorials')}</span>
                <span>{activeLearnSection === 'tutorials' ? '−' : '+'}</span>
              </button>
              {activeLearnSection === 'tutorials' && (
                <p className="pb-3 text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed pl-2">
                  Welcome to Ojas! Start by taking your Prakriti analysis. Based on your dosha mix, we suggest daily self-care rituals, personalized meditation music, and tailored sleep rhythms. Follow the tabs at the top to configure your day.
                </p>
              )}
            </div>

            {/* Usage Policy */}
            <div className="border-b border-stone-200/50 dark:border-stone-850">
              <button 
                onClick={() => setActiveLearnSection(activeLearnSection === 'usage' ? 'none' : 'usage')}
                className="w-full flex items-center justify-between text-xs py-2 text-stone-600 dark:text-stone-400 hover:text-[#c06080]"
              >
                <span>{t('usagePolicy')}</span>
                <span>{activeLearnSection === 'usage' ? '−' : '+'}</span>
              </button>
              {activeLearnSection === 'usage' && (
                <p className="pb-3 text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed pl-2">
                  Ojas wellness applications are designed for lifestyle tracking, health suggestions, and mindfulness recommendations. They are not medical advise. Please consult clinical experts for specific healthcare needs.
                </p>
              )}
            </div>

            {/* Privacy Policy */}
            <div>
              <button 
                onClick={() => setActiveLearnSection(activeLearnSection === 'privacy' ? 'none' : 'privacy')}
                className="w-full flex items-center justify-between text-xs py-2 text-stone-600 dark:text-stone-400 hover:text-[#c06080]"
              >
                <span>{t('privacyPolicy')}</span>
                <span>{activeLearnSection === 'privacy' ? '−' : '+'}</span>
              </button>
              {activeLearnSection === 'privacy' && (
                <p className="pb-3 text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed pl-2">
                  Your profile data, Prakriti answers, and cycle patterns are stored securely and never shared with 3rd parties. You can download or delete your entire history at any time from this account panel.
                </p>
              )}
            </div>
          </div>

          {/* Section 8: Destructive Logout */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-850">
            <button 
              onClick={() => { logout(); onClose(); }}
              className="w-full py-3 bg-[#c06080]/10 hover:bg-[#c06080]/25 border border-[#c06080]/20 text-[#c06080] text-xs font-mono uppercase tracking-[0.15em] font-bold rounded-2xl transition-all duration-300 text-center select-none"
            >
              {t('logout')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
