"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STORAGE_KEYS = {
  startDate: "periodTracker.startDate",
  cycleLength: "periodTracker.cycleLength",
  periodDuration: "periodTracker.periodDuration",
  onboardingCompleted: "periodTracker.onboardingCompleted",
  language: "periodTracker.language",
  remindersEnabled: "periodTracker.remindersEnabled",
};

type Language = "de" | "en" | "tr";
type Tab = "home" | "calendar" | "settings";

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
    home: "Start",
    homeShort: "Start",
    log: "Eintrag",
    logShort: "Log",
    calendar: "Kalender",
    calendarShort: "Kal",
    insights: "Insights",
    insightsShort: "Info",
    settings: "Einstellungen",
    settingsShort: "Set",
    todayCard: "Heute",
    dayOfCycle: "Zyklustag",
    nextPeriodIn: "Nächste Periode in",
    ovulationIn: "Eisprung in",
    days: "Tagen",
    dueToday: "Heute",
    labelStartDate: "Startdatum der letzten Periode",
    labelCycleLength: "Durchschnittliche Zykluslänge (Tage)",
    labelPeriodDuration: "Durchschnittliche Periodendauer (Tage)",
    reset: "Zurücksetzen",
    saveBasics: "Speichern",
    quickLogTitle: "Tages-Log",
    mood: "Stimmung",
    flow: "Stärke",
    energy: "Energie",
    sleep: "Schlaf",
    note: "Notiz",
    symptoms: "Symptome",
    saveLog: "Für heute speichern",
    saved: "Gespeichert",
    noData: "Noch keine Einträge vorhanden.",
    avgCycle: "Ø Zykluslänge",
    avgPeriod: "Ø Periodendauer",
    topSymptom: "Häufigstes Symptom",
    logsLast90: "Logs (letzte 90 Tage)",
    reminders: "Erinnerungen",
    language: "Sprache",
    legal: "Rechtliches",
    privacyPolicy: "Datenschutz",
    about: "Über Cycle Bloom",
    medicalNote: "Diese Vorhersagen sind Schätzungen und keine medizinische Beratung.",
    period: "Periode",
    fertile: "Fruchtbar",
    ovulation: "Eisprung",
    low: "Niedrig",
    high: "Hoch",
    moodGood: "Gut",
    moodOk: "Okay",
    moodLow: "Niedrig",
    flowNone: "Keine",
    flowLight: "Leicht",
    flowMedium: "Mittel",
    flowHeavy: "Stark",
    todayLog: "Heute bereits geloggt",
    startTag: "Start",
    symptomCramp: "Krämpfe",
    symptomBloating: "Blähungen",
    symptomHeadache: "Kopfschmerz",
    symptomTenderness: "Empfindlichkeit",
  },
  en: {
    loading: "Loading...",
    onboardingTitle: "Cycle Bloom",
    onboardingSubtitle: "Track your cycle with simple, gentle predictions.",
    onboardingDisclaimer: "Predictions are estimates and not medical advice.",
    getStarted: "Get Started",
    home: "Home",
    homeShort: "Home",
    log: "Log",
    logShort: "Log",
    calendar: "Calendar",
    calendarShort: "Cal",
    insights: "Insights",
    insightsShort: "Stats",
    settings: "Settings",
    settingsShort: "Set",
    todayCard: "Today",
    dayOfCycle: "Cycle day",
    nextPeriodIn: "Next period in",
    ovulationIn: "Ovulation in",
    days: "days",
    dueToday: "Today",
    labelStartDate: "Last period start date",
    labelCycleLength: "Average cycle length (days)",
    labelPeriodDuration: "Average period duration (days)",
    reset: "Reset",
    saveBasics: "Save",
    quickLogTitle: "Daily Log",
    mood: "Mood",
    flow: "Flow",
    energy: "Energy",
    sleep: "Sleep",
    note: "Note",
    symptoms: "Symptoms",
    saveLog: "Save for today",
    saved: "Saved",
    noData: "No logs yet.",
    avgCycle: "Avg cycle length",
    avgPeriod: "Avg period duration",
    topSymptom: "Top symptom",
    logsLast90: "Logs (last 90 days)",
    reminders: "Reminders",
    language: "Language",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    about: "About Cycle Bloom",
    medicalNote: "These predictions are estimates and not medical advice.",
    period: "Period",
    fertile: "Fertile",
    ovulation: "Ovulation",
    low: "Low",
    high: "High",
    moodGood: "Good",
    moodOk: "Okay",
    moodLow: "Low",
    flowNone: "None",
    flowLight: "Light",
    flowMedium: "Medium",
    flowHeavy: "Heavy",
    todayLog: "Logged for today",
    startTag: "Start",
    symptomCramp: "Cramp",
    symptomBloating: "Bloating",
    symptomHeadache: "Headache",
    symptomTenderness: "Tenderness",
  },
  tr: {
    loading: "Yükleniyor...",
    onboardingTitle: "Cycle Bloom",
    onboardingSubtitle: "Döngünü basit ve nazik tahminlerle takip et.",
    onboardingDisclaimer: "Tahminler yaklaşık değerlerdir ve tıbbi tavsiye değildir.",
    getStarted: "Başla",
    home: "Ana Sayfa",
    homeShort: "Ana",
    log: "Kayıt",
    logShort: "Kayıt",
    calendar: "Takvim",
    calendarShort: "Takvim",
    insights: "İçgörüler",
    insightsShort: "Özet",
    settings: "Ayarlar",
    settingsShort: "Ayar",
    todayCard: "Bugün",
    dayOfCycle: "Döngü günü",
    nextPeriodIn: "Sonraki adet",
    ovulationIn: "Yumurtlama",
    days: "gün sonra",
    dueToday: "Bugün",
    labelStartDate: "Son adetin başlangıç tarihi",
    labelCycleLength: "Ortalama döngü uzunluğu (gün)",
    labelPeriodDuration: "Ortalama adet süresi (gün)",
    reset: "Sıfırla",
    saveBasics: "Kaydet",
    quickLogTitle: "Günlük Kayıt",
    mood: "Ruh hali",
    flow: "Akış",
    energy: "Enerji",
    sleep: "Uyku",
    note: "Not",
    symptoms: "Semptomlar",
    saveLog: "Bugün için kaydet",
    saved: "Kaydedildi",
    noData: "Henüz kayıt yok.",
    avgCycle: "Ort. döngü süresi",
    avgPeriod: "Ort. adet süresi",
    topSymptom: "En sık semptom",
    logsLast90: "Kayıtlar (son 90 gün)",
    reminders: "Hatırlatmalar",
    language: "Dil",
    legal: "Yasal",
    privacyPolicy: "Gizlilik Politikası",
    about: "Cycle Bloom hakkında",
    medicalNote: "Bu tahminler yaklaşık değerlerdir ve tıbbi tavsiye değildir.",
    period: "Adet",
    fertile: "Doğurgan",
    ovulation: "Yumurtlama",
    low: "Düşük",
    high: "Yüksek",
    moodGood: "İyi",
    moodOk: "Orta",
    moodLow: "Düşük",
    flowNone: "Yok",
    flowLight: "Hafif",
    flowMedium: "Orta",
    flowHeavy: "Yoğun",
    todayLog: "Bugün kayıt var",
    startTag: "Başlangıç",
    symptomCramp: "Kramp",
    symptomBloating: "Şişkinlik",
    symptomHeadache: "Baş ağrısı",
    symptomTenderness: "Hassasiyet",
  },
} as const;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function parseInputDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getCalendarGridDays(monthDate: Date): Date[] {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const firstWeekDayIndex = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -firstWeekDayIndex);
  const minGridSize = Math.ceil((firstWeekDayIndex + daysInMonth) / 7) * 7;
  const days: Date[] = [];

  for (let i = 0; i < minGridSize; i += 1) {
    days.push(addDays(gridStart, i));
  }
  return days;
}

function getPeriodDateKeys(start: Date | null, duration: number): Set<string> {
  const keys = new Set<string>();
  if (!start) return keys;
  for (let i = 0; i < duration; i += 1) keys.add(toDateKey(addDays(start, i)));
  return keys;
}

function LanguageSwitcher({ language, onChange }: { language: Language; onChange: (nextLanguage: Language) => void }) {
  return (
    <div className="inline-flex rounded-full border border-rose-200/70 bg-white/85 p-0.5 shadow-sm backdrop-blur">
      {LANGUAGE_OPTIONS.map((option) => {
        const isActive = option.code === language;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => onChange(option.code)}
            aria-label={option.ariaLabel}
            className={`min-h-11 rounded-full px-3 py-2 text-xs font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
              isActive
                ? "bg-gradient-to-r from-rose-400 to-violet-400 text-white shadow-sm"
                : "text-rose-700 hover:bg-rose-100/90"
            }`}
          >
            <span className="mr-1">{option.flag}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("de");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [startDate, setStartDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  const today = new Date();

  useEffect(() => {
    const savedStartDate = localStorage.getItem(STORAGE_KEYS.startDate) ?? "";
    const savedCycleLength = Number(localStorage.getItem(STORAGE_KEYS.cycleLength));
    const savedPeriodDuration = Number(localStorage.getItem(STORAGE_KEYS.periodDuration));
    const savedOnboardingCompleted = localStorage.getItem(STORAGE_KEYS.onboardingCompleted);
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.language);
    const savedReminders = localStorage.getItem(STORAGE_KEYS.remindersEnabled);

    const nextLanguage: Language =
      savedLanguage === "en" || savedLanguage === "tr" || savedLanguage === "de" ? savedLanguage : "de";

    setTimeout(() => {
      setLanguage(nextLanguage);
      setStartDate(savedStartDate);
      setCycleLength(savedCycleLength > 0 ? savedCycleLength : 28);
      setPeriodDuration(savedPeriodDuration > 0 ? savedPeriodDuration : 5);
      setHasCompletedOnboarding(savedOnboardingCompleted === "true");
      setRemindersEnabled(savedReminders === "true");
      setIsLoaded(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.startDate, startDate);
    localStorage.setItem(STORAGE_KEYS.cycleLength, String(cycleLength));
    localStorage.setItem(STORAGE_KEYS.periodDuration, String(periodDuration));
    localStorage.setItem(STORAGE_KEYS.language, language);
    localStorage.setItem(STORAGE_KEYS.remindersEnabled, String(remindersEnabled));
  }, [isLoaded, startDate, cycleLength, periodDuration, language, remindersEnabled]);

  const t = translations[language];
  const locale = LOCALE_BY_LANGUAGE[language];
  const startDateValue = useMemo(() => parseInputDate(startDate), [startDate]);
  const { nextPeriod, ovulation } = useMemo(() => {
    if (!startDateValue) return { nextPeriod: null as Date | null, ovulation: null as Date | null };
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - startDateValue.getTime()) / (1000 * 60 * 60 * 24));
    const cycleOffset = daysSinceStart < 0 ? 0 : Math.floor(daysSinceStart / cycleLength) + 1;
    const nextPeriodDate = addDays(startDateValue, cycleOffset * cycleLength);
    const ovulationDate = addDays(nextPeriodDate, -14);
    return { nextPeriod: nextPeriodDate, ovulation: ovulationDate };
  }, [startDateValue, cycleLength]);

  const calendarMonthDate = nextPeriod ?? startDateValue ?? today;
  const weekdayLabels = useMemo(() => {
    const mondayReference = new Date(2026, 0, 5);
    return Array.from({ length: 7 }, (_, index) => {
      const day = addDays(mondayReference, index);
      return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day);
    });
  }, [locale]);

  const monthTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(calendarMonthDate);
  const calendarDays = getCalendarGridDays(calendarMonthDate);

  const startPeriodKeys = getPeriodDateKeys(startDateValue, periodDuration);
  const nextPeriodKeys = getPeriodDateKeys(nextPeriod, periodDuration);
  const fertileKeys = new Set<string>();
  if (ovulation) {
    fertileKeys.add(toDateKey(addDays(ovulation, -2)));
    fertileKeys.add(toDateKey(addDays(ovulation, -1)));
    fertileKeys.add(toDateKey(ovulation));
    fertileKeys.add(toDateKey(addDays(ovulation, 1)));
    fertileKeys.add(toDateKey(addDays(ovulation, 2)));
  }

  function handleReset() {
    setStartDate("");
    setCycleLength(28);
    setPeriodDuration(5);
  }

  function handleGetStarted() {
    localStorage.setItem(STORAGE_KEYS.onboardingCompleted, "true");
    setHasCompletedOnboarding(true);
  }

  function renderCountdown(target: Date | null): string {
    if (!target) return "-";
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return t.dueToday;
    return `${diff} ${t.days}`;
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-rose-100 via-violet-100 to-amber-50 px-4 py-6">
        <main className="h-[calc(100dvh-3rem)] w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-b from-white/95 to-rose-50/85 p-5 shadow-xl sm:p-6">
          <p className="text-center text-sm text-zinc-500">{t.loading}</p>
        </main>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-rose-100 via-violet-100 to-amber-50 px-4 py-6">
        <main className="h-[calc(100dvh-3rem)] w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-b from-white/95 to-rose-50/85 p-6 shadow-xl">
          <div className="flex justify-end">
            <LanguageSwitcher language={language} onChange={setLanguage} />
          </div>
          <h1 className="mt-4 text-center text-3xl font-bold text-rose-900">{t.onboardingTitle}</h1>
          <p className="mt-3 text-center text-sm text-zinc-600">{t.onboardingSubtitle}</p>
          <p className="mt-6 text-center text-xs text-zinc-500">{t.onboardingDisclaimer}</p>
          <button
            type="button"
            onClick={handleGetStarted}
            className="mt-8 h-12 w-full rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            {t.getStarted}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-rose-100 via-violet-100 to-amber-50 px-4 py-6">
      <main className="relative flex h-[calc(100dvh-3rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-b from-white/95 to-rose-50/85 p-4 shadow-xl backdrop-blur sm:p-6">
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-white/80 bg-white/70 px-3 py-2 shadow-sm">
          <h1 className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-base font-semibold text-transparent">Cycle Bloom</h1>
          <LanguageSwitcher language={language} onChange={setLanguage} />
        </header>

        <div className="flex-1 overflow-hidden">
        {activeTab === "home" && (
          <section id="panel-home" role="tabpanel" aria-labelledby="tab-home" className="flex h-full flex-col gap-3">
            <div className="rounded-2xl border border-violet-100 bg-white/85 p-4 text-center shadow-sm">
              <p className="text-base text-zinc-700">{t.nextPeriodIn}</p>
              <p className="mt-1 text-2xl font-bold text-rose-700">{renderCountdown(nextPeriod)}</p>
              <p className="mt-3 text-base text-zinc-700">{t.ovulationIn}</p>
              <p className="mt-1 text-2xl font-bold text-violet-700">{renderCountdown(ovulation)}</p>
            </div>

            <div className="flex-1 space-y-2 rounded-2xl border border-white/80 bg-white/85 p-3 shadow-sm">
              <div>
                <label htmlFor="startDate" className="mb-1 block text-xs font-medium text-zinc-700">{t.labelStartDate}</label>
                <input id="startDate" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="h-10 w-full rounded-xl border border-rose-200 bg-white px-3 text-zinc-900" />
              </div>
              <div>
                <label htmlFor="cycleLength" className="mb-1 block text-xs font-medium text-zinc-700">{t.labelCycleLength}</label>
                <input id="cycleLength" type="number" min={1} value={cycleLength} onChange={(event) => setCycleLength(Math.max(1, Number(event.target.value) || 1))} className="h-10 w-full rounded-xl border border-rose-200 bg-white px-3 text-zinc-900" />
              </div>
              <div>
                <label htmlFor="periodDuration" className="mb-1 block text-xs font-medium text-zinc-700">{t.labelPeriodDuration}</label>
                <input id="periodDuration" type="number" min={1} value={periodDuration} onChange={(event) => setPeriodDuration(Math.max(1, Number(event.target.value) || 1))} className="h-10 w-full rounded-xl border border-rose-200 bg-white px-3 text-zinc-900" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={handleReset} className="h-10 rounded-xl border border-rose-200 bg-white/70 text-sm font-medium text-rose-700 transition-colors duration-200 hover:bg-rose-50">{t.reset}</button>
                <button type="button" onClick={() => setActiveTab("calendar")} className="h-10 rounded-xl bg-rose-500 text-sm font-semibold text-white transition-colors duration-200 hover:bg-rose-600">{t.saveBasics}</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "calendar" && (
          <section id="panel-calendar" role="tabpanel" aria-labelledby="tab-calendar" className="flex h-full flex-col rounded-2xl border border-violet-100 bg-white/90 p-3 text-center shadow-sm">
            <h2 className="text-sm font-semibold text-violet-900">{t.calendar}</h2>
            <p className="mt-0.5 text-xs text-zinc-600">{monthTitle}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-left">
              <div className="rounded-lg bg-rose-50 p-2">
                <p className="text-[10px] font-medium text-zinc-500">{t.nextPeriodIn}</p>
                <p className="text-xs font-semibold text-rose-700">
                  {nextPeriod ? new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(nextPeriod) : "-"}
                </p>
              </div>
              <div className="rounded-lg bg-violet-50 p-2">
                <p className="text-[10px] font-medium text-zinc-500">{t.ovulationIn}</p>
                <p className="text-xs font-semibold text-violet-700">
                  {ovulation ? new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short" }).format(ovulation) : "-"}
                </p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-zinc-500">
              {weekdayLabels.map((label) => <div key={label}>{label}</div>)}
            </div>

            <div className="mt-2 grid flex-1 grid-cols-7 gap-1">
              {calendarDays.map((date) => {
                const dateKey = toDateKey(date);
                const isCurrentMonth = date.getMonth() === calendarMonthDate.getMonth();
                const isStart = startDateValue ? sameDate(date, startDateValue) : false;
                const isPeriodDay = startPeriodKeys.has(dateKey) || nextPeriodKeys.has(dateKey);
                const isFertileDay = fertileKeys.has(dateKey);
                const marker = isPeriodDay ? "🩸" : isFertileDay ? "🥚" : "";
                const bgClass = isPeriodDay ? "bg-rose-100" : isFertileDay ? "bg-violet-100" : "bg-rose-50/60";

                return (
                  <div key={date.toISOString()} className={`flex h-11 flex-col items-center justify-center rounded-md border border-transparent text-xs ${bgClass}`}>
                    <span className={`leading-none ${isCurrentMonth ? "text-zinc-700" : "text-zinc-400"}`}>{date.getDate()}</span>
                    <span className="mt-0.5 text-[11px] leading-none">{marker}</span>
                    {isStart && <span className="mt-0.5 text-[9px] leading-none text-rose-700">{t.startTag}</span>}
                  </div>
                );
              })}
            </div>

            <div className="mt-2 rounded-lg bg-rose-50 p-2 text-[11px] text-zinc-600">
              <p>🩸 = {t.period}</p>
              <p>🥚 = {t.fertile}</p>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section id="panel-settings" role="tabpanel" aria-labelledby="tab-settings" className="space-y-4 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">{t.language}</p>
              <LanguageSwitcher language={language} onChange={setLanguage} />
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-700">{t.reminders}</p>
                <button type="button" onClick={() => setRemindersEnabled((prev) => !prev)} className={`h-8 min-w-16 rounded-full px-3 text-xs font-semibold ${remindersEnabled ? "bg-rose-500 text-white" : "bg-zinc-200 text-zinc-700"}`}>
                  {remindersEnabled ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
              <div className="flex flex-col gap-1">
                <Link href="/about" className="text-rose-600 underline-offset-4 hover:underline">{t.about}</Link>
                <Link href="/privacy-policy" className="text-rose-600 underline-offset-4 hover:underline">{t.privacyPolicy}</Link>
              </div>
            </div>
          </section>
        )}
        </div>

        <nav className="mt-4 flex-none" role="tablist" aria-label="App sections">
          <div className="grid grid-cols-3 gap-1 rounded-2xl border border-white/80 bg-white/90 p-1 shadow-lg backdrop-blur">
            {([
              ["home", t.home],
              ["calendar", t.calendar],
              ["settings", t.settings],
            ] as Array<[Tab, string]>).map(([tabKey, label]) => (
              <button
                key={tabKey}
                id={`tab-${tabKey}`}
                role="tab"
                aria-selected={activeTab === tabKey}
                aria-controls={`panel-${tabKey}`}
                type="button"
                onClick={() => setActiveTab(tabKey)}
                className={`min-h-11 rounded-xl px-2 py-2 text-xs font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${
                  activeTab === tabKey ? "bg-rose-500 text-white" : "text-rose-700 hover:bg-rose-100"
                }`}
              >
                <span className="sm:hidden">
                  {tabKey === "home"
                    ? t.homeShort
                    : tabKey === "calendar"
                      ? t.calendarShort
                      : t.settingsShort}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      </main>
    </div>
  );
}
