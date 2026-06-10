'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRAKRITI_QUESTIONS } from '../../data/prakritiData';

interface PrakritiQuizProps {
  onComplete: (scores: { Vata: number; Pitta: number; Kapha: number }) => void;
}

export const PrakritiQuiz = ({ onComplete }: PrakritiQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Array<'v' | 'p' | 'k' | null>>([]);
  const [selectedOption, setSelectedOption] = useState<number | 'skip' | null>(null);

  const handleSelectOption = (index: number | 'skip') => {
    setSelectedOption(index);
  };

  const question = PRAKRITI_QUESTIONS[currentQuestion];

  const handleNext = useCallback(() => {
    if (selectedOption === null) return;
    
    let answerValue: 'v' | 'p' | 'k' | null = null;
    if (selectedOption !== 'skip') {
      const dosha = question.opts[selectedOption].d as 'Vata' | 'Pitta' | 'Kapha';
      answerValue = dosha.charAt(0).toLowerCase() as 'v' | 'p' | 'k';
    }

    const newAnswers = [...answers, answerValue];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < PRAKRITI_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = { v: 0, p: 0, k: 0 };
      let total = 0;
      newAnswers.forEach(answer => {
        if (answer !== null) {
          score[answer] += 1;
          total += 1;
        }
      });

      if (total === 0) {
        alert("Please answer at least a few questions to get your Prakriti result.");
        setAnswers(answers);
        return;
      }

      const result = {
        v: total > 0 ? score.v / total : 0,
        p: total > 0 ? score.p / total : 0,
        k: total > 0 ? score.k / total : 0,
      };

      const finalScores = {
        Vata: Math.round(result.v * 18),
        Pitta: Math.round(result.p * 18),
        Kapha: Math.round(result.k * 18),
      };

      onComplete(finalScores);
    }
  }, [selectedOption, answers, currentQuestion, question, onComplete]);

  const handleBack = useCallback(() => {
    if (currentQuestion === 0) return;
    
    const newAnswers = [...answers];
    newAnswers.pop();
    
    setAnswers(newAnswers);
    setSelectedOption(null);
    setCurrentQuestion(currentQuestion - 1);
  }, [currentQuestion, answers]);

  // Keyboard navigation for the quiz
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key shortcuts if user is typing in form inputs
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'a') {
        setSelectedOption(0);
      } else if (key === 'b') {
        setSelectedOption(1);
      } else if (key === 'c') {
        setSelectedOption(2);
      } else if (key === 's') {
        setSelectedOption('skip');
      } else if (e.key === 'ArrowRight') {
        if (selectedOption !== null) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentQuestion > 0) {
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedOption, currentQuestion, handleNext, handleBack]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 md:py-16 w-full animate-fade-rise">
      {/* Header Row: Eyebrow + Q Counter + Category */}
      <div className="flex flex-col mb-8 relative">
        <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] text-white/40 mb-3 block">
          PRAKRITI ASSESSMENT
        </span>
        <div className="flex justify-between items-end">
          <h2 className="text-4xl md:text-[50px] font-serif text-secondary-fixed leading-none">
            Q {String(currentQuestion + 1).padStart(2, '0')} / {PRAKRITI_QUESTIONS.length}
          </h2>
          <div className="border border-white/20 rounded-full px-4 py-1.5 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
            {question.cat}
          </div>
        </div>
      </div>

      {/* Dotted Progress Bar */}
      <div className="w-full relative h-4 flex items-center mb-14">
        {/* Background track line */}
        <div className="absolute left-0 right-0 h-[2px] bg-white/10 z-0 rounded-full"></div>
        
        {/* Fill track line */}
        <div 
          className="absolute left-0 h-[2px] bg-secondary-fixed z-10 transition-all duration-700 rounded-full"
          style={{ width: `${(currentQuestion / (PRAKRITI_QUESTIONS.length - 1)) * 100}%` }}
        ></div>

        {/* Dots overlay */}
        <div className="absolute inset-0 flex justify-between items-center z-20">
          {PRAKRITI_QUESTIONS.map((_, idx) => {
            const isPassed = idx <= currentQuestion;
            const isCurrent = idx === currentQuestion;
            return (
              <div 
                key={idx}
                className={`rounded-full transition-all duration-500 ${
                  isCurrent 
                    ? 'w-4 h-4 bg-secondary-fixed shadow-[0_0_12px_rgba(255,182,203,0.6)]' 
                    : isPassed 
                      ? 'w-2 h-2 bg-secondary-fixed' 
                      : 'w-1.5 h-1.5 bg-white/20'
                }`}
              ></div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Question Text */}
          <h3 className="text-[28px] md:text-[34px] font-quote italic text-secondary-fixed mb-10 font-normal leading-snug max-w-2xl">
            {question.text}
          </h3>

          {/* Answer Options */}
          <div className="flex justify-end mb-3">
            <span className="text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] hidden md:block">
              Press A · B · C to select
            </span>
          </div>
          <div className="space-y-4 mb-6">
            {question.opts.map((option, index) => {
              const isSelected = selectedOption === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full px-6 py-5 text-left border rounded-[14px] transition-all duration-300 font-inter text-sm md:text-[15px] cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-white/5 border-secondary-fixed/60 text-white font-medium shadow-[0_0_20px_rgba(255,182,203,0.05)]'
                      : 'bg-transparent border-white/10 text-white/70 hover:border-white/30 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-colors duration-300 ${
                    isSelected ? 'bg-secondary-fixed border-secondary-fixed' : 'border-white/40'
                  }`} />
                  <span className="leading-relaxed">{option.t}</span>
                </button>
              );
            })}
          </div>

          {/* Skip Button (Pill style) */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => handleSelectOption('skip')}
              className={`px-8 py-3.5 rounded-full border transition-all duration-300 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer ${
                selectedOption === 'skip'
                  ? 'border-secondary-fixed text-secondary-fixed bg-secondary-fixed/5 font-bold'
                  : 'border-white/20 text-white/70 hover:border-white/40'
              }`}
            >
              I CAN&apos;T RELATE TO ANY OF THESE →
            </button>
          </div>

          {/* Skip Warning */}
          {(() => {
            const currentSkips = answers.filter(a => a === null).length + (selectedOption === 'skip' ? 1 : 0);
            if (currentSkips === 5) {
              return (
                <div className="mb-8 p-5 bg-white/5 border border-white/10 text-white/60 text-sm md:text-[15px] text-center rounded-[14px] font-quote italic animate-fade-rise">
                  Answer based on your natural tendency before stress or lifestyle changes — the more you answer, the more accurate your result.
                </div>
              );
            }
            return null;
          })()}
        </motion.div>
      </AnimatePresence>

      {/* Footer Area: Fact Box + Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t border-white/10 pt-8 mt-4 min-h-[80px]">
        {/* Fact Text on the left */}
        <div className="max-w-[60%]">
          {selectedOption !== null && (
            <p className="font-mono text-[9px] text-white/40 tracking-widest leading-[1.8] animate-fade-rise">
              {question.fact}
            </p>
          )}
        </div>

        {/* Navigation Buttons on the right */}
        <div className="flex items-center gap-4 flex-shrink-0 self-end">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`text-[9px] font-mono uppercase tracking-[0.2em] transition-all duration-300 ${
              currentQuestion === 0
                ? 'text-white/20 cursor-not-allowed opacity-0 pointer-events-none'
                : 'text-white/40 hover:text-white cursor-pointer'
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`px-8 py-3.5 rounded-[12px] border transition-all duration-300 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 ${
              selectedOption !== null
                ? 'border-ojas-green text-ojas-green-dark bg-ojas-green-light hover:bg-ojas-cream cursor-pointer font-bold'
                : 'border-white/10 text-white/20 cursor-not-allowed'
            }`}
          >
            {currentQuestion === PRAKRITI_QUESTIONS.length - 1 ? 'FINISH' : 'NEXT'} →
          </button>
        </div>
      </div>
    </main>
  );
};
