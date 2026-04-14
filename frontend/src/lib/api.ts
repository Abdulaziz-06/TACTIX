import { MarketServiceClient } from '../generated/client/worldmonitor/market/v1/service_client';
import { EconomicServiceClient } from '../generated/client/worldmonitor/economic/v1/service_client';
import { IntelligenceServiceClient } from '../generated/client/worldmonitor/intelligence/v1/service_client';
import { NewsServiceClient } from '../generated/client/worldmonitor/news/v1/service_client';

// Frontend uses the local Mastra gateway which proxies to the WorldMonitor backend
// The gateway usually runs on 3001
const BASE_URL = 'http://localhost:3001';

export const marketClient = new MarketServiceClient(BASE_URL);
export const economicClient = new EconomicServiceClient(BASE_URL);
export const intelClient = new IntelligenceServiceClient(BASE_URL);
export const newsClient = new NewsServiceClient(BASE_URL);

/**
 * Format currency values in Bloomberg style
 */
export function formatBloombergPrice(value: number | string | null | undefined, currency = '$'): string {
  if (value === null || value === undefined) return '---';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num)) return '---';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format change percentages
 */
export function formatBloombergChange(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '0.00%';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num)) return '0.00%';
  
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}
