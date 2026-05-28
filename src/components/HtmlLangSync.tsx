"use client";

import { useEffect } from "react";

const STORAGE_LANGUAGE_KEY = "periodTracker.language";

export default function HtmlLangSync() {
  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_LANGUAGE_KEY);
    const lang =
      savedLanguage === "de" || savedLanguage === "en" || savedLanguage === "tr"
        ? savedLanguage
        : "de";
    document.documentElement.lang = lang;
  }, []);

  return null;
}
