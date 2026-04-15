import React, { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

export const INTERVIEW_TYPES = [
  {
    id: 'dsa',
    label: 'DSA',
    title: 'Data Structures & Algorithms',
    desc: 'Arrays, trees, graphs, dynamic programming, sorting.',
    num: '01',
    editorDefault: true,
  },
  {
    id: 'frontend',
    label: 'Frontend',
    title: 'Frontend Engineering',
    desc: 'React, CSS, browser APIs, performance, accessibility.',
    num: '02',
    editorDefault: false,
  },
  {
    id: 'backend',
    label: 'Backend',
    title: 'Backend Engineering',
    desc: 'APIs, databases, caching, auth, system internals.',
    num: '03',
    editorDefault: false,
  },
  {
    id: 'system',
    label: 'System Design',
    title: 'System Design',
    desc: 'Scalability, distributed systems, architecture patterns.',
    num: '04',
    editorDefault: false,
  },
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const DIFF_META = {
  Easy:   { desc: 'Arrays, strings, basic logic' },
  Medium: { desc: 'Trees, graphs, dynamic programming' },
  Hard:   { desc: 'Advanced algorithms, system design' },
};

export const PACKS = [
  { id: 'starter',  title: 'Starter',  questions: 2, price: 9,  popular: false },
  { id: 'standard', title: 'Standard', questions: 3, price: 15, popular: true  },
  { id: 'pro',      title: 'Pro',      questions: 5, price: 20, popular: false },
];

const DEFAULT_STATE = {
  type:       null,
  difficulty: 'Medium',
  pack:       PACKS[1],
  sessionId:  null,
  interviewId: null,
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(DEFAULT_STATE);

  const setType        = useCallback((type)        => setBooking(p => ({ ...p, type })),        []);
  const setDifficulty  = useCallback((difficulty)  => setBooking(p => ({ ...p, difficulty })),  []);
  const setPack        = useCallback((pack)        => setBooking(p => ({ ...p, pack })),        []);
  const setSessionId   = useCallback((sessionId)   => setBooking(p => ({ ...p, sessionId })),   []);
  const setInterviewId = useCallback((interviewId) => setBooking(p => ({ ...p, interviewId })), []);
  const resetBooking   = useCallback(()            => setBooking(DEFAULT_STATE),                []);

  return (
    <BookingContext.Provider value={{
      booking,
      setType, setDifficulty, setPack,
      setSessionId, setInterviewId,
      resetBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
