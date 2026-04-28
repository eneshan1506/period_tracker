"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEYS = {
  startDate: "periodTracker.startDate",
  cycleLength: "periodTracker.cycleLength",
  periodDuration: "periodTracker.periodDuration",
  onboardingCompleted: "periodTracker.onboardingCompleted",
};

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function parseInputDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

type ResultCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

function ResultCard({ title, value, subtitle }: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white/95 p-4 shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-rose-900">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
    </div>
  );
}

function sameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarGridDays(monthDate: Date): Date[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstWeekDayIndex = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -firstWeekDayIndex);
  const minGridSize = Math.ceil((firstWeekDayIndex + daysInMonth) / 7) * 7;
  const days: Date[] = [];

  for (let i = 0; i < minGridSize; i += 1) {
    days.push(addDays(gridStart, i));
  }

  return days;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPeriodDateKeys(start: Date | null, duration: number): Set<string> {
  const keys = new Set<string>();
  if (!start) return keys;

  for (let i = 0; i < duration; i += 1) {
    keys.add(toDateKey(addDays(start, i)));
  }

  return keys;
}

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const savedStartDate = localStorage.getItem(STORAGE_KEYS.startDate) ?? "";
    const savedCycleLength = localStorage.getItem(STORAGE_KEYS.cycleLength);
    const savedPeriodDuration = localStorage.getItem(STORAGE_KEYS.periodDuration);
    const savedOnboardingCompleted = localStorage.getItem(STORAGE_KEYS.onboardingCompleted);

    const parsedCycleLength = savedCycleLength ? Number(savedCycleLength) : NaN;
    const nextCycleLength = !Number.isNaN(parsedCycleLength) && parsedCycleLength > 0 ? parsedCycleLength : 28;
    const parsedPeriodDuration = savedPeriodDuration ? Number(savedPeriodDuration) : NaN;
    const nextPeriodDuration =
      !Number.isNaN(parsedPeriodDuration) && parsedPeriodDuration > 0 ? parsedPeriodDuration : 5;

    // Load saved values after mount to keep server/client first render identical.
    setTimeout(() => {
      setStartDate(savedStartDate);
      setCycleLength(nextCycleLength);
      setPeriodDuration(nextPeriodDuration);
      setHasCompletedOnboarding(savedOnboardingCompleted === "true");
      setIsLoaded(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.startDate, startDate);
  }, [isLoaded, startDate]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.cycleLength, String(cycleLength));
  }, [cycleLength, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.periodDuration, String(periodDuration));
  }, [isLoaded, periodDuration]);

  const { nextPeriod, ovulation } = useMemo(() => {
    const parsedDate = parseInputDate(startDate);
    if (!parsedDate) return { nextPeriod: null, ovulation: null };

    const nextPeriodDate = addDays(parsedDate, cycleLength);
    const ovulationDate = addDays(nextPeriodDate, -14);

    return {
      nextPeriod: nextPeriodDate,
      ovulation: ovulationDate,
    };
  }, [startDate, cycleLength]);

  const hasStartDate = startDate.trim() !== "";
  const today = new Date();
  const startDateValue = useMemo(() => parseInputDate(startDate), [startDate]);

  const calendarMonthDate = useMemo(() => {
    return startDateValue ?? new Date();
  }, [startDateValue]);

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthTitle = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(calendarMonthDate);
  const calendarDays = getCalendarGridDays(calendarMonthDate);
  const startPeriodKeys = getPeriodDateKeys(startDateValue, periodDuration);
  const nextPeriodKeys = getPeriodDateKeys(nextPeriod, periodDuration);
  const fertileIntensityByKey = new Map<string, string>([]);

  if (ovulation) {
    fertileIntensityByKey.set(toDateKey(addDays(ovulation, -2)), "🥚");
    fertileIntensityByKey.set(toDateKey(addDays(ovulation, -1)), "🥚🥚");
    fertileIntensityByKey.set(toDateKey(ovulation), "🥚🥚🥚");
    fertileIntensityByKey.set(toDateKey(addDays(ovulation, 1)), "🥚🥚");
    fertileIntensityByKey.set(toDateKey(addDays(ovulation, 2)), "🥚");
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEYS.startDate);
    localStorage.removeItem(STORAGE_KEYS.cycleLength);
    localStorage.removeItem(STORAGE_KEYS.periodDuration);
    setStartDate("");
    setCycleLength(28);
    setPeriodDuration(5);
  }

  function handleGetStarted() {
    localStorage.setItem(STORAGE_KEYS.onboardingCompleted, "true");
    setHasCompletedOnboarding(true);
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-100 via-violet-50 to-amber-50 px-4 py-6">
      <main className="w-full max-w-md rounded-3xl border border-white/70 bg-gradient-to-b from-white to-rose-50 p-5 shadow-xl sm:p-6">
          <p className="text-center text-sm text-zinc-500">Loading...</p>
        </main>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-100 via-violet-50 to-amber-50 px-4 py-6">
        <main className="w-full max-w-md rounded-3xl border border-white/70 bg-gradient-to-b from-white to-rose-50 p-6 shadow-xl">
          <h1 className="text-center text-3xl font-bold text-rose-900">Cycle Bloom</h1>
          <p className="mt-3 text-center text-sm text-zinc-600">
            Track your cycle with simple, gentle predictions.
          </p>
          <p className="mt-6 text-center text-xs text-zinc-500">
            Predictions are estimates and not medical advice.
          </p>
          <button
            type="button"
            onClick={handleGetStarted}
            className="mt-8 w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            Get Started
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-100 via-violet-50 to-amber-50 px-4 py-6">
      <main className="w-full max-w-md rounded-3xl border border-white/70 bg-gradient-to-b from-white to-rose-50 p-4 shadow-xl backdrop-blur sm:p-6">
        <h1 className="text-2xl font-bold text-rose-900">Period Tracker</h1>
        <p className="mt-1 text-sm text-zinc-600">Simple MVP for cycle predictions</p>

        <section className="mt-6 space-y-4 sm:mt-7 sm:space-y-5">
          <div>
            <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-zinc-700">
              Last period start date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-zinc-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div>
            <label htmlFor="cycleLength" className="mb-1 block text-sm font-medium text-zinc-700">
              Average cycle length (days)
            </label>
            <input
              id="cycleLength"
              type="number"
              min={1}
              value={cycleLength}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!Number.isNaN(value) && value > 0) {
                  setCycleLength(value);
                }
              }}
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-zinc-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div>
            <label htmlFor="periodDuration" className="mb-1 block text-sm font-medium text-zinc-700">
              Average period duration (days)
            </label>
            <input
              id="periodDuration"
              type="number"
              min={1}
              value={periodDuration}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!Number.isNaN(value) && value > 0) {
                  setPeriodDuration(value);
                }
              }}
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-zinc-900 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Reset
            </button>
          </div>
        </section>

        {hasStartDate && (
          <>
            <section className="mt-7 grid gap-3 sm:mt-8">
              <ResultCard
                title="Next period date"
                value={nextPeriod ? formatDate(nextPeriod) : "-"}
                subtitle="Calculated by start date + cycle length"
              />
              <ResultCard
                title="Estimated ovulation date"
                value={ovulation ? formatDate(ovulation) : "-"}
                subtitle="Estimated as 14 days before next period"
              />
            </section>

            <section className="mt-7 rounded-2xl border border-violet-100 bg-white/95 p-4 shadow-sm sm:mt-8">
              <h2 className="text-base font-semibold text-violet-900">Calendar</h2>
              <p className="mt-1 text-sm text-zinc-600">{monthTitle}</p>

              <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-zinc-500">
                {weekdayLabels.map((label) => (
                  <div key={label}>{label}</div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1">
                {calendarDays.map((date) => {
                  const isToday = sameDate(date, today);
                  const isStart = startDateValue ? sameDate(date, startDateValue) : false;
                  const dateKey = toDateKey(date);
                  const isCurrentMonth = date.getMonth() === calendarMonthDate.getMonth();
                  const isPeriodDay = startPeriodKeys.has(dateKey) || nextPeriodKeys.has(dateKey);
                  const fertileEmoji = fertileIntensityByKey.get(dateKey) ?? "";
                  const hasFertileDay = fertileEmoji !== "";

                  return (
                    <div
                      key={date.toISOString()}
                      className={`flex h-12 flex-col items-center justify-center rounded-lg text-sm sm:h-14 ${
                        hasFertileDay ? "bg-violet-100/70" : "bg-rose-50/60"
                      } ${isToday ? "border border-violet-300" : "border border-transparent"}`}
                    >
                      <span
                        className={`leading-none ${
                          isCurrentMonth ? "text-zinc-700" : "text-zinc-400"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      <span className="mt-1 text-[10px] leading-none sm:text-[11px]">
                        {isPeriodDay ? "🩸" : fertileEmoji}
                      </span>
                      {isStart && <span className="mt-0.5 text-[9px] text-rose-700">start</span>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-zinc-600">
                <p>🩸 Period day</p>
                <p className="mt-1">🥚 Ovulation day</p>
              </div>
            </section>
          </>
        )}

        <p className="mt-8 text-center text-xs text-zinc-500">
          These predictions are estimates and not medical advice.
        </p>
      </main>
    </div>
  );
}
