"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEYS = {
  startDate: "periodTracker.startDate",
  cycleLength: "periodTracker.cycleLength",
  periodDuration: "periodTracker.periodDuration",
  onboardingCompleted: "periodTracker.onboardingCompleted",
  language: "periodTracker.language",
};

type Language = "de" | "en" | "tr";
type Tab = "tracker" | "calendar";

const LANGUAGE_OPTIONS: Array<{ code: Language; label: string; flag: string; ariaLabel: string }> = [
  { code: "de", label: "DE", flag: "🇩🇪", ariaLabel: "German" },
  { code: "en", label: "EN", flag: "🇬🇧", ariaLabel: "English" },
  { code: "tr", label: "TR", flag: "🇹🇷", ariaLabel: "Turkish" },
];

const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  de: "de-DE",
  en: "en-GB",
  tr: "tr-TR",
};

const translations = {
  de: {
    loading: "Lädt...",
    onboardingTitle: "Cycle Bloom",
    onboardingSubtitle: "Verfolge deinen Zyklus mit einfachen, sanften Vorhersagen.",
    onboardingDisclaimer: "Vorhersagen sind Schätzungen und keine medizinische Beratung.",
    getStarted: "Loslegen",
    appTitle: "Perioden-Tracker",
    appSubtitle: "Einfaches MVP für Zyklusvorhersagen",
    headerSubtitle: "Sanfte Einblicke für deinen Zyklus",
    todayStatusTitle: "Heutiger Status",
    statusPeriod: "Periodentag",
    statusOvulation: "Eisprungtag",
    statusHighFertility: "Hohe Fruchtbarkeit",
    statusLowFertility: "Niedrige Fruchtbarkeit",
    motivationPeriod: "Nimm dir heute bewusst etwas Ruhe 🌸",
    motivationOvulation: "Dein Körper leistet heute Großartiges 💜",
    motivationHighFertility: "Bleib sanft zu dir und höre auf deinen Rhythmus ✨",
    motivationLowFertility: "Du machst das toll, Schritt für Schritt 🌷",
    labelStartDate: "Startdatum der letzten Periode",
    labelCycleLength: "Durchschnittliche Zykluslänge (Tage)",
    labelPeriodDuration: "Durchschnittliche Periodendauer (Tage)",
    reset: "Zurücksetzen",
    nextPeriodTitle: "Nächstes Periodendatum",
    nextPeriodSubtitle: "Berechnet aus Startdatum + Zykluslänge",
    ovulationTitle: "Geschätzter Eisprung",
    ovulationSubtitle: "Geschätzt als 14 Tage vor der nächsten Periode",
    calendarTitle: "Kalender",
    tabsTracker: "Tracker",
    tabsCalendar: "Kalender",
    emptyStateTitle: "Start tracking your cycle",
    emptyStateText: "Select your last period date to begin",
    startTag: "Start",
    legendPeriod: "🩸 Periodentag",
    legendOvulation: "🥚 Eisprungtag",
    disclaimer: "Diese Vorhersagen sind Schätzungen und keine medizinische Beratung.",
  },
  en: {
    loading: "Loading...",
    onboardingTitle: "Cycle Bloom",
    onboardingSubtitle: "Track your cycle with simple, gentle predictions.",
    onboardingDisclaimer: "Predictions are estimates and not medical advice.",
    getStarted: "Get Started",
    appTitle: "Period Tracker",
    appSubtitle: "Simple MVP for cycle predictions",
    headerSubtitle: "Gentle insights for your cycle",
    todayStatusTitle: "Today Status",
    statusPeriod: "Period day",
    statusOvulation: "Ovulation day",
    statusHighFertility: "High fertility",
    statusLowFertility: "Low fertility",
    motivationPeriod: "Take care of yourself today 🌸",
    motivationOvulation: "Your body is doing great 💜",
    motivationHighFertility: "Stay gentle with yourself today ✨",
    motivationLowFertility: "You are doing great, one day at a time 🌷",
    labelStartDate: "Last period start date",
    labelCycleLength: "Average cycle length (days)",
    labelPeriodDuration: "Average period duration (days)",
    reset: "Reset",
    nextPeriodTitle: "Next period date",
    nextPeriodSubtitle: "Calculated by start date + cycle length",
    ovulationTitle: "Estimated ovulation date",
    ovulationSubtitle: "Estimated as 14 days before next period",
    calendarTitle: "Calendar",
    tabsTracker: "Tracker",
    tabsCalendar: "Calendar",
    emptyStateTitle: "Start tracking your cycle",
    emptyStateText: "Select your last period date to begin",
    startTag: "start",
    legendPeriod: "🩸 Period day",
    legendOvulation: "🥚 Ovulation day",
    disclaimer: "These predictions are estimates and not medical advice.",
  },
  tr: {
    loading: "Yükleniyor...",
    onboardingTitle: "Cycle Bloom",
    onboardingSubtitle: "Döngünü basit ve nazik tahminlerle takip et.",
    onboardingDisclaimer: "Tahminler yaklaşık değerlerdir ve tıbbi tavsiye değildir.",
    getStarted: "Başla",
    appTitle: "Adet Takipçisi",
    appSubtitle: "Döngü tahminleri için basit MVP",
    headerSubtitle: "Döngün için nazik içgörüler",
    todayStatusTitle: "Bugünkü Durum",
    statusPeriod: "Adet günü",
    statusOvulation: "Yumurtlama günü",
    statusHighFertility: "Yüksek doğurganlık",
    statusLowFertility: "Düşük doğurganlık",
    motivationPeriod: "Bugün kendine nazik davran 🌸",
    motivationOvulation: "Vücudun harika bir iş çıkarıyor 💜",
    motivationHighFertility: "Bugün kendine yumuşak ve sabırlı ol ✨",
    motivationLowFertility: "Harika gidiyorsun, adım adım 🌷",
    labelStartDate: "Son adetin başlangıç tarihi",
    labelCycleLength: "Ortalama döngü uzunluğu (gün)",
    labelPeriodDuration: "Ortalama adet süresi (gün)",
    reset: "Sıfırla",
    nextPeriodTitle: "Sonraki adet tarihi",
    nextPeriodSubtitle: "Başlangıç tarihi + döngü uzunluğu ile hesaplanır",
    ovulationTitle: "Tahmini yumurtlama tarihi",
    ovulationSubtitle: "Bir sonraki adetten 14 gün önce olarak tahmin edilir",
    calendarTitle: "Takvim",
    tabsTracker: "Takip",
    tabsCalendar: "Takvim",
    emptyStateTitle: "Start tracking your cycle",
    emptyStateText: "Select your last period date to begin",
    startTag: "başlangıç",
    legendPeriod: "🩸 Adet günü",
    legendOvulation: "🥚 Yumurtlama günü",
    disclaimer: "Bu tahminler yaklaşık değerlerdir ve tıbbi tavsiye değildir.",
  },
} as const;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date, language: Language): string {
  return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
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
    <div className="rounded-2xl border border-pink-100 bg-white/95 p-5 text-center shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-rose-900">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
    </div>
  );
}

type LanguageSwitcherProps = {
  language: Language;
  onChange: (nextLanguage: Language) => void;
};

function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  return (
    <div className="flex justify-end">
      <div className="inline-flex rounded-full border border-rose-200/70 bg-white/85 p-0.5 shadow-sm backdrop-blur">
        {LANGUAGE_OPTIONS.map((option) => {
          const isActive = option.code === language;
          return (
            <button
              key={option.code}
              type="button"
              onClick={() => onChange(option.code)}
              aria-label={option.ariaLabel}
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-95 ${
                isActive
                  ? "bg-gradient-to-r from-rose-400 to-violet-400 text-white shadow-sm hover:scale-[1.02]"
                  : "text-rose-700 hover:scale-[1.03] hover:bg-rose-100/90 hover:opacity-90"
              }`}
            >
              <span className="mr-1">{option.flag}</span>
              {option.label}
            </button>
          );
        })}
      </div>
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
  const [language, setLanguage] = useState<Language>("de");
  const [activeTab, setActiveTab] = useState<Tab>("tracker");
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
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.language);

    const parsedCycleLength = savedCycleLength ? Number(savedCycleLength) : NaN;
    const nextCycleLength = !Number.isNaN(parsedCycleLength) && parsedCycleLength > 0 ? parsedCycleLength : 28;
    const parsedPeriodDuration = savedPeriodDuration ? Number(savedPeriodDuration) : NaN;
    const nextPeriodDuration =
      !Number.isNaN(parsedPeriodDuration) && parsedPeriodDuration > 0 ? parsedPeriodDuration : 5;
    const nextLanguage: Language =
      savedLanguage === "en" || savedLanguage === "tr" || savedLanguage === "de" ? savedLanguage : "de";

    // Load saved values after mount to keep server/client first render identical.
    setTimeout(() => {
      setLanguage(nextLanguage);
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

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.language, language);
  }, [isLoaded, language]);

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

  const t = translations[language];
  const locale = LOCALE_BY_LANGUAGE[language];
  const weekdayLabels = useMemo(() => {
    const mondayReference = new Date(2026, 0, 5);
    return Array.from({ length: 7 }, (_, index) => {
      const day = addDays(mondayReference, index);
      return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day);
    });
  }, [locale]);
  const monthTitle = new Intl.DateTimeFormat(locale, {
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

  const todayKey = toDateKey(today);
  const isTodayPeriodDay = startPeriodKeys.has(todayKey) || nextPeriodKeys.has(todayKey);
  const isTodayOvulationDay = ovulation ? sameDate(ovulation, today) : false;
  const isTodayFertileWindowDay = fertileIntensityByKey.has(todayKey);

  let todayStatusText: string = `${t.statusLowFertility} 🌿`;
  let todayStatusStyle: string = "border-violet-100 bg-violet-50/70 text-violet-900";
  let todayMotivation: string = t.motivationLowFertility;

  if (isTodayPeriodDay) {
    todayStatusText = `${t.statusPeriod} 🩸`;
    todayStatusStyle = "border-rose-200 bg-rose-50 text-rose-900";
    todayMotivation = t.motivationPeriod;
  } else if (isTodayOvulationDay) {
    todayStatusText = `${t.statusOvulation} 🥚`;
    todayStatusStyle = "border-violet-200 bg-violet-100/80 text-violet-900";
    todayMotivation = t.motivationOvulation;
  } else if (isTodayFertileWindowDay) {
    todayStatusText = `${t.statusHighFertility} 💜`;
    todayStatusStyle = "border-violet-200 bg-violet-100/70 text-violet-900";
    todayMotivation = t.motivationHighFertility;
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 via-violet-100 to-amber-50 px-4 py-6">
      <main className="w-full max-w-md rounded-3xl border border-white/70 bg-gradient-to-b from-white/95 to-rose-50/85 p-5 shadow-xl sm:p-6">
          <p className="text-center text-sm text-zinc-500">{t.loading}</p>
        </main>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 via-violet-100 to-amber-50 px-4 py-6">
        <main className="w-full max-w-md rounded-3xl border border-white/70 bg-gradient-to-b from-white/95 to-rose-50/85 p-6 shadow-xl">
          <LanguageSwitcher language={language} onChange={setLanguage} />
          <h1 className="mt-4 text-center text-3xl font-bold text-rose-900">{t.onboardingTitle}</h1>
          <p className="mt-3 text-center text-sm text-zinc-600">
            {t.onboardingSubtitle}
          </p>
          <p className="mt-6 text-center text-xs text-zinc-500">
            {t.onboardingDisclaimer}
          </p>
          <button
            type="button"
            onClick={handleGetStarted}
            className="mt-8 w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-150 ease-out hover:scale-[1.01] hover:bg-rose-600 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            {t.getStarted}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 via-violet-100 to-amber-50 px-4 py-6">
      <main className="relative w-full max-w-md overflow-x-hidden rounded-3xl border border-white/70 bg-gradient-to-b from-white/95 to-rose-50/85 p-4 pb-24 shadow-xl backdrop-blur sm:p-6 sm:pb-24">
        <header className="relative mb-4 flex h-[60px] items-center justify-between rounded-2xl border border-white/80 bg-white/70 px-3 shadow-sm">
          <p className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-base font-semibold text-transparent">
            Cycle Bloom 🌸
          </p>
          <LanguageSwitcher language={language} onChange={setLanguage} />
          <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-pink-200/70 via-violet-200/70 to-amber-200/70" />
        </header>

        {activeTab === "tracker" && (
        <>
        <section className={`mt-5 rounded-2xl border p-5 text-center shadow-sm ${todayStatusStyle}`}>
          <p className="text-xs font-semibold uppercase tracking-wide/loose opacity-80">{t.todayStatusTitle}</p>
          <p className="mt-1 text-base font-semibold">{todayStatusText}</p>
          <p className="mt-2 text-xs text-violet-700/80">{todayMotivation}</p>
        </section>

        <section className="mt-4 space-y-5 rounded-2xl border border-white/80 bg-white/85 p-4 text-center shadow-sm sm:space-y-5 sm:p-6">
          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-center text-sm font-medium text-zinc-700">
              {t.labelStartDate}
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mx-auto h-14 w-full max-w-[280px] rounded-xl border border-rose-200 bg-white px-3 text-zinc-900 outline-none transition duration-150 ease-out focus:border-rose-300 focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-1"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cycleLength" className="block text-center text-sm font-medium text-zinc-700">
              {t.labelCycleLength}
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
              className="mx-auto h-14 w-full max-w-[280px] rounded-xl border border-rose-200 bg-white px-3 text-zinc-900 outline-none transition duration-150 ease-out focus:border-rose-300 focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-1"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="periodDuration" className="block text-center text-sm font-medium text-zinc-700">
              {t.labelPeriodDuration}
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
              className="mx-auto h-14 w-full max-w-[280px] rounded-xl border border-rose-200 bg-white px-3 text-zinc-900 outline-none transition duration-150 ease-out focus:border-rose-300 focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-1"
            />
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="h-12 w-full rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm font-medium text-rose-700 transition duration-150 ease-out hover:scale-[1.02] hover:bg-rose-100 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 sm:mx-auto sm:w-auto sm:min-w-40"
            >
              {t.reset}
            </button>
          </div>
        </section>

        {hasStartDate && (
            <section className="mt-4 grid gap-3 sm:mt-5">
              <ResultCard
                title={t.nextPeriodTitle}
                value={nextPeriod ? formatDate(nextPeriod, language) : "-"}
                subtitle={t.nextPeriodSubtitle}
              />
              <ResultCard
                title={t.ovulationTitle}
                value={ovulation ? formatDate(ovulation, language) : "-"}
                subtitle={t.ovulationSubtitle}
              />
            </section>
        )}

        {!hasStartDate && (
          <section className="mt-4 flex min-h-40 items-center justify-center rounded-2xl border border-violet-100 bg-gradient-to-b from-white/90 to-violet-50/80 p-7 text-center shadow-sm">
            <div>
              <p className="text-base font-semibold text-violet-900">{t.emptyStateTitle}</p>
              <p className="mt-2 text-sm text-zinc-600">{t.emptyStateText}</p>
            </div>
          </section>
        )}
        </>
        )}

        {activeTab === "calendar" && (
          hasStartDate ? (
            <section className="mt-6 rounded-2xl border border-violet-100 bg-white/90 p-5 text-center shadow-sm sm:mt-7 sm:p-6">
              <h2 className="text-base font-semibold text-violet-900">{t.calendarTitle}</h2>
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
                      {isStart && <span className="mt-0.5 text-[9px] text-rose-700">{t.startTag}</span>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-rose-50 p-4 text-center text-xs text-zinc-600">
                <p>{t.legendPeriod}</p>
                <p className="mt-1">{t.legendOvulation}</p>
              </div>
            </section>
          ) : (
            <section className="mt-6 flex min-h-56 items-center justify-center rounded-2xl border border-violet-100 bg-gradient-to-b from-white/90 to-violet-50/80 p-7 text-center shadow-sm sm:mt-7">
              <div>
                <p className="text-lg font-semibold text-violet-900">{t.emptyStateTitle}</p>
                <p className="mt-2 text-sm text-zinc-600">{t.emptyStateText}</p>
              </div>
            </section>
          )
        )}

        <p className="mt-7 text-center text-xs text-zinc-500 sm:mt-8">
          {t.disclaimer}
        </p>

        <nav className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md p-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/80 bg-white/90 p-1 shadow-lg backdrop-blur">
            <button
              type="button"
              onClick={() => setActiveTab("tracker")}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
                activeTab === "tracker" ? "bg-rose-500 text-white" : "text-rose-700 hover:bg-rose-100"
              }`}
            >
              {t.tabsTracker}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
                activeTab === "calendar" ? "bg-rose-500 text-white" : "text-rose-700 hover:bg-rose-100"
              }`}
            >
              {t.tabsCalendar}
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}
