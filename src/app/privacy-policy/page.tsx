"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "de" | "en" | "tr";

const STORAGE_LANGUAGE_KEY = "periodTracker.language";

const languages: Array<{ code: Language; label: string }> = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "tr", label: "Türkçe" },
];

const content = {
  de: {
    title: "Datenschutz",
    updated: "Zuletzt aktualisiert: Mai 2026",
    intro: "Cycle Bloom ist bewusst einfach und privat gehalten.",
    back: "Zurück zur App",
    sections: [
      {
        title: "Lokale Speicherung",
        text: "Deine Eingaben werden nur lokal im Browser auf deinem Gerät gespeichert. Dazu gehören zum Beispiel Startdatum, Zykluslänge, Periodendauer und Sprache.",
      },
      {
        title: "Keine Weitergabe persönlicher Daten",
        text: "Wir teilen keine persönlichen Daten mit anderen Personen, Unternehmen oder Diensten.",
      },
      {
        title: "Vorhersagen sind Schätzungen",
        text: "Perioden-, Eisprung- und Fruchtbarkeitsdaten sind nur Schätzungen. Dein tatsächlicher Zyklus kann davon abweichen.",
      },
      {
        title: "Keine medizinische Beratung",
        text: "Diese App ersetzt keine medizinische Beratung, Diagnose oder Behandlung. Bitte sprich mit medizinischem Fachpersonal, wenn du Fragen zu deiner Gesundheit hast.",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: May 2026",
    intro: "Cycle Bloom is designed to be simple and private.",
    back: "Back to app",
    sections: [
      {
        title: "Local storage",
        text: "Your entries are stored only locally in the browser on your device. This can include your start date, cycle length, period duration, and language.",
      },
      {
        title: "No personal data is shared",
        text: "We do not share personal data with other people, companies, or services.",
      },
      {
        title: "Predictions are estimates",
        text: "Period, ovulation, and fertility dates are estimates only. Your actual cycle may be different.",
      },
      {
        title: "Not medical advice",
        text: "This app does not provide medical advice, diagnosis, or treatment. Please talk to a healthcare professional if you have questions about your health.",
      },
    ],
  },
  tr: {
    title: "Gizlilik Politikası",
    updated: "Son güncelleme: Mayıs 2026",
    intro: "Cycle Bloom basit ve gizli kalacak şekilde tasarlanmıştır.",
    back: "Uygulamaya dön",
    sections: [
      {
        title: "Yerel depolama",
        text: "Girdiğin bilgiler yalnızca cihazındaki tarayıcıda yerel olarak saklanır. Buna başlangıç tarihi, döngü uzunluğu, adet süresi ve dil dahil olabilir.",
      },
      {
        title: "Kişisel veri paylaşılmaz",
        text: "Kişisel verileri başka kişilerle, şirketlerle veya hizmetlerle paylaşmayız.",
      },
      {
        title: "Tahminler yaklaşık değerlerdir",
        text: "Adet, yumurtlama ve doğurganlık tarihleri yalnızca tahmindir. Gerçek döngün farklı olabilir.",
      },
      {
        title: "Tıbbi tavsiye değildir",
        text: "Bu uygulama tıbbi tavsiye, teşhis veya tedavi sunmaz. Sağlığınla ilgili soruların varsa lütfen bir sağlık uzmanıyla görüş.",
      },
    ],
  },
} as const;

function getSavedLanguage(): Language {
  if (typeof window === "undefined") return "de";
  const savedLanguage = localStorage.getItem(STORAGE_LANGUAGE_KEY);
  return savedLanguage === "de" || savedLanguage === "en" || savedLanguage === "tr" ? savedLanguage : "de";
}

export default function PrivacyPolicy() {
  const [language, setLanguage] = useState<Language>(() => getSavedLanguage());

  function handleLanguageChange(nextLanguage: Language) {
    setLanguage(nextLanguage);
    localStorage.setItem(STORAGE_LANGUAGE_KEY, nextLanguage);
  }

  const t = content[language];

  return (
    <main className="h-[100dvh] bg-gradient-to-br from-rose-100 via-violet-100 to-amber-50 px-4 py-6 text-zinc-800">
      <div className="mx-auto h-[calc(100dvh-3rem)] w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-5 shadow-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-sm font-medium text-rose-700 underline-offset-4 hover:underline">
            {t.back}
          </Link>
          <div className="inline-flex rounded-full border border-rose-200 bg-white p-0.5 text-xs shadow-sm">
            {languages.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => handleLanguageChange(option.code)}
                className={`min-h-11 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  language === option.code ? "bg-rose-500 text-white" : "text-rose-700 hover:bg-rose-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <header className="mt-8">
          <p className="text-sm text-zinc-500">{t.updated}</p>
          <h1 className="mt-2 text-3xl font-bold text-rose-900">{t.title}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{t.intro}</p>
        </header>

        <div className="mt-8 space-y-4">
          {t.sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
              <h2 className="text-base font-semibold text-rose-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
