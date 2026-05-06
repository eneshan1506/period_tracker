"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Language = "de" | "en" | "tr";

const STORAGE_LANGUAGE_KEY = "periodTracker.language";

const content = {
  de: {
    back: "Zurück zur App",
    eyebrow: "Über die App",
    title: "Cycle Bloom",
    intro:
      "Cycle Bloom hilft dir, deinen Zyklus einfach zu verfolgen und kommende Perioden, fruchtbare Tage und den geschätzten Eisprung sanft sichtbar zu machen.",
    note: "Alle Vorhersagen sind nur Schätzungen und keine medizinische Beratung.",
    sections: [
      {
        title: "Was die App macht",
        text: "Du gibst den Start deiner letzten Periode, deine durchschnittliche Zykluslänge und deine Periodendauer ein. Daraus zeigt Cycle Bloom deinen aktuellen Status und wichtige kommende Tage.",
      },
      {
        title: "Wie Vorhersagen funktionieren",
        text: "Die nächste Periode wird aus deinem letzten Startdatum plus deiner durchschnittlichen Zykluslänge berechnet. Wenn dein Zyklus sich verändert, können sich die tatsächlichen Tage verschieben.",
      },
      {
        title: "Eisprung-Schätzung",
        text: "Der Eisprung wird ungefähr 14 Tage vor der nächsten erwarteten Periode geschätzt. Die fruchtbaren Tage werden um dieses Datum herum markiert.",
      },
      {
        title: "Kalenderansicht",
        text: "Der Kalender markiert Periodentage und fruchtbare Tage mit einfachen Symbolen, damit du deinen Monat schnell überblicken kannst.",
      },
    ],
  },
  en: {
    back: "Back to app",
    eyebrow: "About the app",
    title: "Cycle Bloom",
    intro:
      "Cycle Bloom helps you track your cycle simply and gently see upcoming periods, fertile days, and estimated ovulation.",
    note: "All predictions are estimates only and are not medical advice.",
    sections: [
      {
        title: "What the app does",
        text: "You enter the start of your last period, your average cycle length, and your period duration. Cycle Bloom uses those details to show your current status and important upcoming days.",
      },
      {
        title: "How predictions work",
        text: "The next period is calculated from your last start date plus your average cycle length. If your cycle changes, the actual dates may move.",
      },
      {
        title: "Ovulation estimate",
        text: "Ovulation is estimated as about 14 days before the next expected period. Fertile days are marked around that date.",
      },
      {
        title: "Calendar view",
        text: "The calendar marks period days and fertile days with simple symbols, so you can understand your month at a glance.",
      },
    ],
  },
  tr: {
    back: "Uygulamaya dön",
    eyebrow: "Uygulama hakkında",
    title: "Cycle Bloom",
    intro:
      "Cycle Bloom, döngünü kolayca takip etmene ve yaklaşan adet günlerini, doğurgan günleri ve tahmini yumurtlamayı nazikçe görmene yardımcı olur.",
    note: "Tüm tahminler yalnızca yaklaşık değerlerdir ve tıbbi tavsiye değildir.",
    sections: [
      {
        title: "Uygulama ne yapar",
        text: "Son adetinin başlangıç tarihini, ortalama döngü uzunluğunu ve adet süreni girersin. Cycle Bloom bu bilgilerle bugünkü durumunu ve yaklaşan önemli günleri gösterir.",
      },
      {
        title: "Tahminler nasıl çalışır",
        text: "Sonraki adet tarihi, son başlangıç tarihine ortalama döngü uzunluğun eklenerek hesaplanır. Döngün değişirse gerçek tarihler de değişebilir.",
      },
      {
        title: "Yumurtlama tahmini",
        text: "Yumurtlama, beklenen sonraki adetten yaklaşık 14 gün önce olarak tahmin edilir. Doğurgan günler bu tarihin etrafında işaretlenir.",
      },
      {
        title: "Takvim görünümü",
        text: "Takvim, adet günlerini ve doğurgan günleri basit sembollerle işaretler. Böylece ayını hızlıca görebilirsin.",
      },
    ],
  },
} as const;

function getSavedLanguage(): Language {
  const savedLanguage = localStorage.getItem(STORAGE_LANGUAGE_KEY);
  return savedLanguage === "en" || savedLanguage === "tr" || savedLanguage === "de" ? savedLanguage : "de";
}

export default function AboutPage() {
  const [language, setLanguage] = useState<Language>("de");

  useEffect(() => {
    setTimeout(() => setLanguage(getSavedLanguage()), 0);
  }, []);

  const t = content[language];

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-violet-100 to-amber-50 px-4 py-6 text-zinc-800">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-5 shadow-xl sm:p-6">
        <Link href="/" className="text-sm font-medium text-rose-700 underline-offset-4 hover:underline">
          {t.back}
        </Link>

        <header className="mt-8">
          <p className="text-sm font-medium text-rose-500">{t.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold text-rose-900">{t.title}</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{t.intro}</p>
        </header>

        <div className="mt-7 space-y-3">
          {t.sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
              <h2 className="text-base font-semibold text-rose-900">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700">{section.text}</p>
            </section>
          ))}
        </div>

        <p className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/70 p-4 text-center text-sm leading-6 text-violet-900">
          {t.note}
        </p>
      </div>
    </main>
  );
}
