/** Origin markets launching digital services into India */
export const originMarkets = [
  { id: 'AE', name: 'United Arab Emirates' },
  { id: 'US', name: 'United States' },
  { id: 'GB', name: 'United Kingdom' },
  { id: 'SG', name: 'Singapore' },
  { id: 'DE', name: 'Germany' },
  { id: 'AU', name: 'Australia' },
  { id: 'SA', name: 'Saudi Arabia' },
  { id: 'NL', name: 'Netherlands' },
  { id: 'CA', name: 'Canada' },
  { id: 'JP', name: 'Japan' },
  { id: 'FR', name: 'France' },
  { id: 'MY', name: 'Malaysia' },
];

export const INDIA_ID = 'IN';

/** Sankey flows: international businesses → India market */
export const indiaLaunchRoutes = [
  { sourceId: 'AE', targetId: 'IN', value: 320 },
  { sourceId: 'US', targetId: 'IN', value: 480 },
  { sourceId: 'GB', targetId: 'IN', value: 300 },
  { sourceId: 'SG', targetId: 'IN', value: 280 },
  { sourceId: 'DE', targetId: 'IN', value: 210 },
  { sourceId: 'AU', targetId: 'IN', value: 170 },
  { sourceId: 'SA', targetId: 'IN', value: 230 },
  { sourceId: 'NL', targetId: 'IN', value: 140 },
  { sourceId: 'CA', targetId: 'IN', value: 160 },
  { sourceId: 'JP', targetId: 'IN', value: 190 },
  { sourceId: 'FR', targetId: 'IN', value: 150 },
  { sourceId: 'MY', targetId: 'IN', value: 130 },
];

export const countryNames = Object.fromEntries([
  ...originMarkets.map((m) => [m.id, m.name]),
  [INDIA_ID, 'India'],
]);
