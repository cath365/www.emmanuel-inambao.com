export type MobilePlatform = 'android' | 'ios' | 'both' | 'not-sure'
export type ProjectTimeline = 'flexible' | '4-8-weeks' | '2-4-weeks' | 'urgent'

export interface ProjectQuoteSelection {
  website: boolean
  ecommerce: boolean
  adminDashboard: boolean
  paymentIntegration: boolean
  mobileApplication: boolean
  mobilePlatform: MobilePlatform
  iotIntegration: boolean
  iotDetails: string
  projectDescription: string
  timeline: ProjectTimeline
}

export interface QuoteLineItem {
  id: string
  label: string
  amount: number | null
  reason: string
}

export interface ProjectQuotation {
  currency: 'ZMW'
  lineItems: QuoteLineItem[]
  knownTotal: number
  hasCustomPricing: boolean
}

export const PROJECT_PRICING = {
  website: 5000,
  ecommerce: 3000,
  adminDashboard: 2500,
  paymentIntegration: 2000,
  mobileApplication: 12000,
} as const

export function formatZmw(amount: number) {
  return `ZMW ${amount.toLocaleString('en-ZM')}`
}

export function buildProjectQuotation(selection: ProjectQuoteSelection): ProjectQuotation {
  const lineItems: QuoteLineItem[] = []

  if (selection.website) {
    lineItems.push({
      id: 'website',
      label: 'Website development',
      amount: PROJECT_PRICING.website,
      reason:
        'Covers the base responsive website build, core pages, frontend implementation, standard forms and deployment setup.',
    })
  }

  if (selection.ecommerce) {
    lineItems.push({
      id: 'ecommerce',
      label: 'E-commerce functionality',
      amount: PROJECT_PRICING.ecommerce,
      reason:
        'Adds product catalogue, cart and checkout flows, order logic and the additional data handling needed for online sales.',
    })
  }

  if (selection.adminDashboard) {
    lineItems.push({
      id: 'admin-dashboard',
      label: 'Admin dashboard',
      amount: PROJECT_PRICING.adminDashboard,
      reason:
        'Adds a protected management area for content, customers, orders, reports or other operational data.',
    })
  }

  if (selection.paymentIntegration) {
    lineItems.push({
      id: 'payment-integration',
      label: 'Payment integration',
      amount: PROJECT_PRICING.paymentIntegration,
      reason:
        'Covers payment-provider integration, transaction verification, callback/webhook handling and payment-flow testing.',
    })
  }

  if (selection.mobileApplication) {
    lineItems.push({
      id: 'mobile-application',
      label: 'Mobile application',
      amount: PROJECT_PRICING.mobileApplication,
      reason:
        'Covers the base mobile application build, interface implementation, API integration, device testing and deployment preparation.',
    })
  }

  if (selection.iotIntegration) {
    lineItems.push({
      id: 'iot-integration',
      label: 'IoT / connected-device integration',
      amount: null,
      reason:
        'Custom pricing is required because hardware type, sensors, connectivity, power, enclosure, unit quantity and field conditions can change the engineering effort significantly.',
    })
  }

  return {
    currency: 'ZMW',
    lineItems,
    knownTotal: lineItems.reduce((sum, item) => sum + (item.amount || 0), 0),
    hasCustomPricing: lineItems.some(item => item.amount === null),
  }
}

export function quotationSummary(selection: ProjectQuoteSelection, quotation: ProjectQuotation) {
  const priced = quotation.lineItems
    .map(item => `- ${item.label}: ${item.amount === null ? 'Custom quotation' : formatZmw(item.amount)}\n  Reason: ${item.reason}`)
    .join('\n')

  return [
    priced || '- Scope still needs to be selected.',
    '',
    `Known subtotal: ${formatZmw(quotation.knownTotal)}`,
    quotation.hasCustomPricing
      ? 'IoT/custom engineering is excluded from the known subtotal and requires final technical scoping.'
      : 'No custom-priced item is currently selected.',
    '',
    `Mobile platform: ${selection.mobileApplication ? selection.mobilePlatform : 'Not applicable'}`,
    `Timeline: ${selection.timeline}`,
    `Project description: ${selection.projectDescription || 'Not provided'}`,
    selection.iotIntegration ? `IoT details: ${selection.iotDetails || 'Not provided'}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export function fallbackQuoteExplanation(selection: ProjectQuoteSelection, quotation: ProjectQuotation) {
  if (quotation.lineItems.length === 0) {
    return 'Select at least one deliverable first so I can explain the pricing.'
  }

  const lines = quotation.lineItems.map(item => {
    const price = item.amount === null ? 'custom quotation' : formatZmw(item.amount)
    return `${item.label} is ${price} because ${item.reason.charAt(0).toLowerCase()}${item.reason.slice(1)}`
  })

  const customNote = quotation.hasCustomPricing
    ? ' The IoT portion stays custom until the hardware, sensors, connectivity and quantity are clear.'
    : ''

  return `${lines.join(' ')} The current known subtotal is ${formatZmw(quotation.knownTotal)}.${customNote}`
}
