import { PlaywrightTestProject } from "@playwright/test";

const knownLocales = ["en", "pl"] as const;

const localeConfig: Record<Locale, PlaywrightTestProject["use"]> = {
  en: {
    baseURL: "https://www.ploom.co.uk/en",
    storageState: `${__dirname}/../../storageStates/baseState-en.json`,
  },
  pl: {
    baseURL: "https://www.ploom.pl/pl",
    storageState: `${__dirname}/../../storageStates/baseState-pl.json`,
  },
};

export function getConfigForLocale(locale: Locale) {
  const config = localeConfig[locale];
  if (!config) {
    throw new Error("Config not found for locale: " + locale);
  }
  return config;
}

export function getLocale(): Locale[] {
  const locales = (process.env.LOCALE ?? knownLocales.join(",")).toLowerCase().split(",");
  if (locales.every((locale) => isValidLocale(locale))) {
    return locales;
  } else {
    throw new Error(`Unknown locale: ${locales.join(", ")}`);
  }
}

export type Locale = (typeof knownLocales)[number];

function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === "string" && knownLocales.some((knownLocale) => knownLocale === locale);
}
