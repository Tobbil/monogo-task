// Contains test data that differs between markets

export const testDataForMarkets = {
  "https://www.ploom.co.uk/en": {
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
  "https://www.ploom.pl/pl": {
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
