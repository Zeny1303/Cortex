import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ─── Plan definitions (single source of truth) ──────────────────────────────
export const SUBSCRIPTION_PLANS = [
  {
    id:               '1m',
    label:            '1 Month',
    interviewsPerMonth: 10,
    durationMonths:   1,
    priceINR:         149,
    bestValue:        false,
  },
  {
    id:               '3m',
    label:            '3 Months',
    interviewsPerMonth: 12,
    durationMonths:   3,
    priceINR:         399,
    bestValue:        false,
  },
  {
    id:               '6m',
    label:            '6 Months',
    interviewsPerMonth: 14,
    durationMonths:   6,
    priceINR:         699,
    bestValue:        true,   // 🔥 Best Value
  },
  {
    id:               '12m',
    label:            '12 Months',
    interviewsPerMonth: 16,
    durationMonths:   12,
    priceINR:         1199,
    bestValue:        false,
  },
];

export const FREE_INTERVIEWS_TOTAL = 12;
export const PAY_PER_USE_PRICE_INR = 15;

// ─── Default state ───────────────────────────────────────────────────────────
const DEFAULT_USAGE = {
  freeInterviewsLeft: FREE_INTERVIEWS_TOTAL,
  subscription: null,
  // subscription shape when active:
  // {
  //   plan:               '6m',
  //   interviewsPerMonth: 14,
  //   usedThisMonth:      0,
  //   expiryDate:         ISO string,
  //   lastResetDate:      ISO string,
  // }
};

const STORAGE_KEY = 'cortex-usage';

function loadUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USAGE;
    return { ...DEFAULT_USAGE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USAGE;
  }
}

function saveUsage(usage) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {}
}

// ─── Monthly reset helper ────────────────────────────────────────────────────
function applyMonthlyReset(usage) {
  if (!usage.subscription) return usage;
  const now = new Date();
  const last = new Date(usage.subscription.lastResetDate);
  const monthsPassed =
    (now.getFullYear() - last.getFullYear()) * 12 +
    (now.getMonth() - last.getMonth());
  if (monthsPassed >= 1) {
    return {
      ...usage,
      subscription: {
        ...usage.subscription,
        usedThisMonth: 0,
        lastResetDate: now.toISOString(),
      },
    };
  }
  return usage;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const UsageContext = createContext(null);

export function UsageProvider({ children }) {
  const [usage, setUsageRaw] = useState(() => applyMonthlyReset(loadUsage()));

  const setUsage = useCallback((updater) => {
    setUsageRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveUsage(next);
      return next;
    });
  }, []);

  // Re-check monthly reset on focus (handles tab revisit)
  useEffect(() => {
    const check = () => setUsage(prev => applyMonthlyReset(prev));
    window.addEventListener('focus', check);
    return () => window.removeEventListener('focus', check);
  }, [setUsage]);

  // ── Derived access state ──────────────────────────────────────────────────
  const canStartInterview = (() => {
    if (usage.freeInterviewsLeft > 0) return true;
    if (!usage.subscription) return false;
    const { usedThisMonth, interviewsPerMonth, expiryDate } = usage.subscription;
    if (new Date(expiryDate) < new Date()) return false;
    return usedThisMonth < interviewsPerMonth;
  })();

  const accessMode = (() => {
    if (usage.freeInterviewsLeft > 0) return 'free';
    if (usage.subscription) {
      const { usedThisMonth, interviewsPerMonth, expiryDate } = usage.subscription;
      if (new Date(expiryDate) >= new Date() && usedThisMonth < interviewsPerMonth) return 'subscription';
    }
    return 'blocked';
  })();

  // ── Usage label for navbar / dashboard ───────────────────────────────────
  const usageLabel = (() => {
    if (usage.freeInterviewsLeft > 0) return `Free: ${usage.freeInterviewsLeft} left`;
    if (usage.subscription && new Date(usage.subscription.expiryDate) >= new Date()) {
      const { plan, usedThisMonth, interviewsPerMonth } = usage.subscription;
      return `${plan.toUpperCase()} · ${usedThisMonth}/${interviewsPerMonth} used`;
    }
    return 'No credits';
  })();

  // ── Deduct one interview (call after session ends) ────────────────────────
  const deductInterview = useCallback(() => {
    setUsage(prev => {
      if (prev.freeInterviewsLeft > 0) {
        return { ...prev, freeInterviewsLeft: prev.freeInterviewsLeft - 1 };
      }
      if (prev.subscription) {
        return {
          ...prev,
          subscription: {
            ...prev.subscription,
            usedThisMonth: prev.subscription.usedThisMonth + 1,
          },
        };
      }
      return prev;
    });
  }, [setUsage]);

  // ── Activate a subscription plan (call after payment) ────────────────────
  const activatePlan = useCallback((planId) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;
    const now = new Date();
    const expiry = new Date(now);
    expiry.setMonth(expiry.getMonth() + plan.durationMonths);
    setUsage(prev => ({
      ...prev,
      subscription: {
        plan:               plan.id,
        interviewsPerMonth: plan.interviewsPerMonth,
        usedThisMonth:      0,
        expiryDate:         expiry.toISOString(),
        lastResetDate:      now.toISOString(),
      },
    }));
  }, [setUsage]);

  // ── Pay-per-use: just allow one interview (no deduction from free/sub) ────
  // In production this would verify payment first.
  const usePayPerUse = useCallback(() => {
    // No-op for now — payment gateway hook point
    // Returns true to signal "allowed"
    return true;
  }, []);

  // ── Reset (dev / testing) ─────────────────────────────────────────────────
  const resetUsage = useCallback(() => {
    setUsage(DEFAULT_USAGE);
  }, [setUsage]);

  return (
    <UsageContext.Provider value={{
      usage,
      canStartInterview,
      accessMode,
      usageLabel,
      deductInterview,
      activatePlan,
      usePayPerUse,
      resetUsage,
    }}>
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error('useUsage must be used within UsageProvider');
  return ctx;
}
