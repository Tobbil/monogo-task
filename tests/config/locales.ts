function getLocale(): Locale[] {
  return (process.env.LOCALE ?? "en").toLowerCase().split(",") as Locale[];
}

export const localeTestData: LocaleTestData = {
  en: {
    baseURL: "https://www.ploom.co.uk/en",
    locators: {
      testid: {
        shopBtn: "headerItem-0",
        testSKU: "ploom-x-advanced",
      },
      text: {},
    },
    testData: {
      expCartHeaderCountEmpty: "0 Items",
    },
  },
  pl: {
    baseURL: "https://www.ploom.pl/pl",
    locators: {
      testid: {
        shopBtn: "headerItem-1",
        testSKU: "16199177",
      },
      text: {},
    },
    testData: {
      expCartHeaderCountEmpty: "Ilość produktów: 0",
    },
  },
};

export type LocaleTestData = {
  [market: string]: {
    baseURL: string;
    locators: {
      testid: {
        shopBtn: string;
        testSKU: string;
      };
      text: Record<string, string>;
    };
    testData: {
      expCartHeaderCountEmpty: string;
    };
  };
};

export const locales = getLocale();
export type Locale = "pl" | "en";
