export type MarketPricingCategory =
  | 'basic-website'
  | 'business-website'
  | 'ecommerce'
  | 'maintenance'

export interface MarketPricingEntry {
  id: string
  provider: string
  category: MarketPricingCategory
  label: string
  min: number
  max: number | null
  currency: 'ZMW'
  sourceUrl: string
  checkedAt: string
  enabled: boolean
  note?: string
}

export interface MarketPricingConfig {
  enabled: boolean
  updatedAt: string
  disclaimer: string
  entries: MarketPricingEntry[]
}

export const defaultMarketPricing: MarketPricingConfig = {
  enabled: true,
  updatedAt: '2026-09-25',
  disclaimer:
    'Publicly advertised Zambia-market prices are reference points only. Emmanuel\'s fixed quotation rules remain the source of truth for his own pricing.',
  entries: [
    {
      id: 'pixel-pulse-basic',
      provider: 'Pixel Pulse Studio',
      category: 'basic-website',
      label: 'Basic website',
      min: 6500,
      max: 6500,
      currency: 'ZMW',
      sourceUrl: 'https://www.pixelpulse.co.zm/',
      checkedAt: '2026-09-25',
      enabled: true,
      note: 'Public starting price for a small-business / portfolio website.',
    },
    {
      id: 'pixel-pulse-business',
      provider: 'Pixel Pulse Studio',
      category: 'business-website',
      label: 'Multi-page business website',
      min: 15000,
      max: 15000,
      currency: 'ZMW',
      sourceUrl: 'https://www.pixelpulse.co.zm/',
      checkedAt: '2026-09-25',
      enabled: true,
      note: 'Public starting price for a multi-page site with forms, SEO and analytics.',
    },
    {
      id: 'exponent-basic',
      provider: 'Exponent',
      category: 'basic-website',
      label: 'Basic website package',
      min: 11500,
      max: 11500,
      currency: 'ZMW',
      sourceUrl: 'https://www.exponent.co.zm/services/managed-it/website-design-packages/',
      checkedAt: '2026-09-25',
      enabled: true,
      note: 'Public WordPress basic package.',
    },
    {
      id: 'exponent-standard',
      provider: 'Exponent',
      category: 'business-website',
      label: 'Standard professional website',
      min: 15500,
      max: 15500,
      currency: 'ZMW',
      sourceUrl: 'https://www.exponent.co.zm/services/managed-it/website-design-packages/',
      checkedAt: '2026-09-25',
      enabled: true,
      note: 'Public professional website package.',
    },
    {
      id: 'exponent-ecommerce',
      provider: 'Exponent',
      category: 'ecommerce',
      label: 'E-commerce website',
      min: 19500,
      max: 19500,
      currency: 'ZMW',
      sourceUrl: 'https://www.exponent.co.zm/services/managed-it/website-design-packages/',
      checkedAt: '2026-09-25',
      enabled: true,
      note: 'Public online-store package with payment gateway configuration.',
    },
    {
      id: 'seamedia-basic-range',
      provider: 'SeaMedia Zambia 2026 Guide',
      category: 'basic-website',
      label: 'Basic informational website market range',
      min: 1000,
      max: 5000,
      currency: 'ZMW',
      sourceUrl: 'https://www.seamedia.co.zm/website-design-cost-zambia-2026/',
      checkedAt: '2026-09-25',
      enabled: true,
      note: 'Published Zambia market guide range.',
    },
    {
      id: 'seamedia-business-range',
      provider: 'SeaMedia Zambia 2026 Guide',
      category: 'business-website',
      label: 'Professional business website market range',
      min: 5000,
      max: 15000,
      currency: 'ZMW',
      sourceUrl: 'https://www.seamedia.co.zm/website-design-cost-zambia-2026/',
      checkedAt: '2026-09-25',
      enabled: true,
      note: 'Published Zambia market guide range.',
    },
    {
      id: 'seamedia-ecommerce-range',
      provider: 'SeaMedia Zambia 2026 Guide',
      category: 'ecommerce',
      label: 'E-commerce market range',
      min: 15000,
      max: 25000,
      currency: 'ZMW',
      sourceUrl: 'https://www.seamedia.co.zm/website-design-cost-zambia-2026/',
      checkedAt: '2026-09-25',
      enabled: true,
      note: 'Published starting market range; complex stores can exceed this.',
    },
  ],
}

export function resolveMarketPricing(input: unknown): MarketPricingConfig {
  if (!input || typeof input !== 'object') return defaultMarketPricing
  const candidate = input as Partial<MarketPricingConfig>
  const entries = Array.isArray(candidate.entries)
    ? candidate.entries.filter((entry): entry is MarketPricingEntry => Boolean(
        entry &&
        typeof entry === 'object' &&
        typeof (entry as MarketPricingEntry).provider === 'string' &&
        typeof (entry as MarketPricingEntry).min === 'number'
      ))
    : defaultMarketPricing.entries

  return {
    enabled: candidate.enabled !== false,
    updatedAt:
      typeof candidate.updatedAt === 'string' && candidate.updatedAt
        ? candidate.updatedAt
        : defaultMarketPricing.updatedAt,
    disclaimer:
      typeof candidate.disclaimer === 'string' && candidate.disclaimer
        ? candidate.disclaimer
        : defaultMarketPricing.disclaimer,
    entries,
  }
}

export function activeMarketEntries(config: MarketPricingConfig) {
  if (!config.enabled) return []
  return config.entries.filter(entry => entry.enabled)
}

export function marketCategoryLabel(category: MarketPricingCategory) {
  const labels: Record<MarketPricingCategory, string> = {
    'basic-website': 'Basic website',
    'business-website': 'Business website',
    ecommerce: 'E-commerce',
    maintenance: 'Maintenance',
  }
  return labels[category]
}

export function marketRangeSummary(config: MarketPricingConfig) {
  const groups = new Map<MarketPricingCategory, MarketPricingEntry[]>()
  for (const entry of activeMarketEntries(config)) {
    const group = groups.get(entry.category) || []
    group.push(entry)
    groups.set(entry.category, group)
  }

  return Array.from(groups.entries()).map(([category, entries]) => {
    const lows = entries.map(entry => entry.min)
    const highs = entries.map(entry => entry.max ?? entry.min)
    return {
      category,
      label: marketCategoryLabel(category),
      min: Math.min(...lows),
      max: Math.max(...highs),
      sourceCount: entries.length,
    }
  })
}
