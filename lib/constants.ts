export const stocks = ["GLSCH", "BNSAI", "GLDN"] as const;
export type StockSymbol = typeof stocks[number];
