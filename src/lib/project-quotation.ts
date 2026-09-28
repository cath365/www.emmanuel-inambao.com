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
  customFeatures: string[]
  projectDescription: string
  clientGoal?: string
  targetUsers?: string
  currentProcess?: string
  successOutcome?: string
  timeline: ProjectTimeline
}

export interface QuoteLineItem {
  id: string
  label: string
  amount: number | null
  reason: string
  impact: string
}

export interface ProjectQuotation {
  currency: 'ZMW'
  lineItems: QuoteLineItem[]
  knownTotal: number
  upfrontRate: number
  upfrontAmount: number
  balanceAmount: number
  hasCustomPricing: boolean
}

export type ImprovementAction =
  | 'ecommerce'
  | 'adminDashboard'
  | 'paymentIntegration'
  | 'mobileApplication'
  | 'customFeature'

export interface ProjectImprovement {
  id: string
  title: string
  description: string
  impact: string
  withoutChange: string
  withChange: string
  stage: 'High-impact improvement' | 'Later phase'
  action: ImprovementAction
  featureName?: string
  priceImpact: number
  upfrontImpact: number
  newKnownTotal: number
}

export type ImpactLevel = 'High' | 'Medium' | 'Low'

export interface ImprovementImpactProfile {
  operations: ImpactLevel
  customerExperience: ImpactLevel
  automation: ImpactLevel
}

export interface ScopeOption {
  id: 'core' | 'recommended' | 'growth'
  title: string
  description: string
  total: number
  upfront: number
  addedInvestment: number
  additions: string[]
}

export const PROJECT_PRICING = {
  website: 5000,
  ecommerce: 3000,
  adminDashboard: 2500,
  paymentIntegration: 2000,
  mobileApplication: 12000,
  additionalFeature: 350,
  upfrontRate: 0.35,
} as const

export function formatZmw(amount: number) {
  const hasDecimals = !Number.isInteger(amount)
  return `ZMW ${amount.toLocaleString('en-ZM', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`
}

export function normalizeCustomFeatures(features: string[] | undefined) {
  return Array.from(
    new Set((features || []).map(feature => feature.trim()).filter(Boolean))
  ).slice(0, 30)
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
      impact:
        'Creates a professional digital presence that clients can access on phones and computers, helping the organization present services, build trust and generate enquiries.',
    })
  }

  if (selection.ecommerce) {
    lineItems.push({
      id: 'ecommerce',
      label: 'E-commerce functionality',
      amount: PROJECT_PRICING.ecommerce,
      reason:
        'Adds product catalogue, cart and checkout flows, order logic and the additional data handling needed for online sales.',
      impact:
        'Turns the website into a sales channel so customers can discover products, place orders and complete more of the buying journey without manual back-and-forth.',
    })
  }

  if (selection.adminDashboard) {
    lineItems.push({
      id: 'admin-dashboard',
      label: 'Admin dashboard',
      amount: PROJECT_PRICING.adminDashboard,
      reason:
        'Adds a protected management area for content, customers, orders, reports or other operational data.',
      impact:
        'Reduces dependence on a developer for everyday updates and gives the team one place to manage operations, records and reporting.',
    })
  }

  if (selection.paymentIntegration) {
    lineItems.push({
      id: 'payment-integration',
      label: 'Payment integration',
      amount: PROJECT_PRICING.paymentIntegration,
      reason:
        'Covers payment-provider integration, transaction verification, callback/webhook handling and payment-flow testing.',
      impact:
        'Lets customers complete transactions digitally and reduces manual payment confirmation, making the service easier to buy and easier to reconcile.',
    })
  }

  if (selection.mobileApplication) {
    lineItems.push({
      id: 'mobile-application',
      label: 'Mobile application',
      amount: PROJECT_PRICING.mobileApplication,
      reason:
        'Covers the base mobile application build, interface implementation, API integration, device testing and deployment preparation.',
      impact:
        'Provides a dedicated mobile experience for repeat users, field teams or customers who need fast access from affordable Android/iOS devices.',
    })
  }

  normalizeCustomFeatures(selection.customFeatures).forEach((feature, index) => {
    lineItems.push({
      id: `custom-feature-${index + 1}`,
      label: feature,
      amount: PROJECT_PRICING.additionalFeature,
      reason:
        'Additional requested feature outside the selected core package. Each extra software feature is charged at the fixed ZMW 350 feature rate.',
      impact:
        'Adds a focused capability requested for this project. The value depends on how this feature improves the client workflow, user experience or automation.',
    })
  })

  if (selection.iotIntegration) {
    lineItems.push({
      id: 'iot-integration',
      label: 'IoT / connected-device integration',
      amount: null,
      reason:
        'Custom pricing is required because hardware type, sensors, connectivity, power, enclosure, unit quantity and field conditions can change the engineering effort significantly.',
      impact:
        'Connects physical equipment or sensors to the digital system so measurements, alerts and actions can move between the real world and the application.',
    })
  }

  const knownTotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const upfrontAmount = knownTotal * PROJECT_PRICING.upfrontRate

  return {
    currency: 'ZMW',
    lineItems,
    knownTotal,
    upfrontRate: PROJECT_PRICING.upfrontRate,
    upfrontAmount,
    balanceAmount: knownTotal - upfrontAmount,
    hasCustomPricing: lineItems.some(item => item.amount === null),
  }
}

function makeImprovement(
  quotation: ProjectQuotation,
  input: Omit<ProjectImprovement, 'upfrontImpact' | 'newKnownTotal'>
): ProjectImprovement {
  return {
    ...input,
    upfrontImpact: input.priceImpact * PROJECT_PRICING.upfrontRate,
    newKnownTotal: quotation.knownTotal + input.priceImpact,
  }
}

function hasFeature(selection: ProjectQuoteSelection, name: string) {
  return normalizeCustomFeatures(selection.customFeatures)
    .some(feature => feature.toLowerCase() === name.toLowerCase())
}

export function projectImprovementIdeas(
  selection: ProjectQuoteSelection,
  quotation = buildProjectQuotation(selection)
): ProjectImprovement[] {
  const text = [
    selection.projectDescription,
    selection.clientGoal,
    selection.targetUsers,
    selection.currentProcess,
    selection.successOutcome,
    selection.iotDetails,
  ].filter(Boolean).join(' ').toLowerCase()
  const ideas: ProjectImprovement[] = []

  if (
    selection.website &&
    !selection.ecommerce &&
    /sell|shop|store|product|catalog|order|retail|marketplace|booking|commerce/.test(text)
  ) {
    ideas.push(makeImprovement(quotation, {
      id: 'suggest-ecommerce',
      title: 'Add online selling / ordering',
      description: 'Add catalogue, cart/ordering and checkout workflows instead of relying on manual enquiries for every sale.',
      impact: 'Can shorten the path from interest to purchase and lets customers place orders outside normal working hours.',
      withoutChange: 'Customers still need to message or call the business to place many orders manually.',
      withChange: 'Customers can browse, choose products and place orders directly through the website.',
      stage: 'High-impact improvement',
      action: 'ecommerce',
      priceImpact: PROJECT_PRICING.ecommerce,
    }))
  }

  if (
    !selection.adminDashboard &&
    (selection.ecommerce ||
      selection.paymentIntegration ||
      /admin|manage|staff|content|order|customer|report|inventory|booking|school|organization|organisation/.test(text))
  ) {
    ideas.push(makeImprovement(quotation, {
      id: 'suggest-admin',
      title: 'Add an admin dashboard',
      description: 'Give the client team a protected workspace to manage records, users, content, orders or reports.',
      impact: 'Reduces manual work and makes the system easier to operate after launch without asking a developer for every update.',
      withoutChange: 'Routine records, updates and operational changes depend on manual work or developer support.',
      withChange: 'Authorized staff can manage day-to-day operations from one protected dashboard.',
      stage: 'High-impact improvement',
      action: 'adminDashboard',
      priceImpact: PROJECT_PRICING.adminDashboard,
    }))
  }

  if (
    !selection.paymentIntegration &&
    (selection.ecommerce || /payment|pay|mobile money|momo|airtel money|mtn|checkout|subscription|fee|invoice/.test(text))
  ) {
    ideas.push(makeImprovement(quotation, {
      id: 'suggest-payment',
      title: 'Add digital payment integration',
      description: 'Connect an approved payment provider and verify transactions automatically inside the system.',
      impact: 'Removes payment friction, reduces manual confirmation and can improve conversion for services that customers need to pay for.',
      withoutChange: 'Customers pay outside the system and staff may need to verify transactions manually.',
      withChange: 'Customers can pay through the service and successful transactions can be verified and recorded automatically.',
      stage: 'High-impact improvement',
      action: 'paymentIntegration',
      priceImpact: PROJECT_PRICING.paymentIntegration,
    }))
  }

  if (
    !selection.mobileApplication &&
    /mobile app|android|ios|field|driver|agent|farmer|student|patient|offline|on the go|tracking/.test(text)
  ) {
    ideas.push(makeImprovement(quotation, {
      id: 'suggest-mobile',
      title: 'Add a dedicated mobile application',
      description: 'Provide a mobile-first experience for repeat users or teams who work away from a desktop.',
      impact: 'Improves convenience and engagement for users who primarily access services through Android/iOS phones.',
      withoutChange: 'Users depend on the browser experience whenever they need to use the service.',
      withChange: 'Repeat and field users get a dedicated mobile experience designed around phone-based use.',
      stage: 'Later phase',
      action: 'mobileApplication',
      priceImpact: PROJECT_PRICING.mobileApplication,
    }))
  }

  const customCandidates = [
    {
      id: 'suggest-notifications',
      name: 'WhatsApp / SMS notifications',
      match: /alert|notify|notification|customer|booking|order|appointment|status|delivery/,
      description: 'Send important status updates or reminders to users instead of requiring them to keep checking the system.',
      impact: 'Improves follow-up and reduces missed updates, especially for users who are already comfortable with messaging channels.',
      withoutChange: 'Users must keep checking the system or wait for someone to contact them manually.',
      withChange: 'Important status changes and reminders can reach users through familiar messaging channels.',
      stage: 'High-impact improvement' as const,
    },
    {
      id: 'suggest-analytics',
      name: 'Analytics and reporting',
      match: /report|analytics|data|performance|sales|usage|monitor|dashboard|decision/,
      description: 'Add simple reporting so the client can see activity, trends and operational results.',
      impact: 'Makes the system more useful for management decisions because the client can see what is happening instead of only storing data.',
      withoutChange: 'The system stores activity, but management has limited visibility into trends and performance.',
      withChange: 'Simple reports turn operational data into information the client can use for decisions.',
      stage: 'Later phase' as const,
    },
    {
      id: 'suggest-roles',
      name: 'Role-based user access',
      match: /staff|teacher|student|employee|admin|manager|organization|organisation|school|team|department/,
      description: 'Give different users the right level of access based on their role.',
      impact: 'Improves security and makes workflows clearer when several people or departments use the same platform.',
      withoutChange: 'Different users may see or manage more information than they actually need.',
      withChange: 'Each user gets access that matches their responsibility, improving control and accountability.',
      stage: 'High-impact improvement' as const,
    },
    {
      id: 'suggest-offline',
      name: 'Offline-friendly workflow',
      match: /offline|field|rural|farm|farmer|unstable|internet|connectivity|remote/,
      description: 'Design critical tasks to tolerate weak connectivity and synchronize when the connection returns.',
      impact: 'Makes the product more reliable in real operating conditions where mobile data can be weak or inconsistent.',
      withoutChange: 'Critical work can stop when the internet connection becomes weak or unavailable.',
      withChange: 'Key tasks can continue during poor connectivity and synchronize when the connection returns.',
      stage: 'High-impact improvement' as const,
    },
  ]

  for (const candidate of customCandidates) {
    if (ideas.length >= 4) break
    if (!candidate.match.test(text) || hasFeature(selection, candidate.name)) continue

    ideas.push(makeImprovement(quotation, {
      id: candidate.id,
      title: candidate.name,
      description: candidate.description,
      impact: candidate.impact,
      withoutChange: candidate.withoutChange,
      withChange: candidate.withChange,
      stage: candidate.stage,
      action: 'customFeature',
      featureName: candidate.name,
      priceImpact: PROJECT_PRICING.additionalFeature,
    }))
  }

  return ideas.slice(0, 4)
}

export function improvementImpactProfile(idea: ProjectImprovement): ImprovementImpactProfile {
  switch (idea.action) {
    case 'adminDashboard':
      return { operations: 'High', customerExperience: 'Medium', automation: 'High' }
    case 'paymentIntegration':
      return { operations: 'High', customerExperience: 'High', automation: 'High' }
    case 'ecommerce':
      return { operations: 'Medium', customerExperience: 'High', automation: 'Medium' }
    case 'mobileApplication':
      return { operations: 'Medium', customerExperience: 'High', automation: 'Medium' }
    case 'customFeature':
    default: {
      const name = (idea.featureName || idea.title).toLowerCase()
      if (/analytics|report/.test(name)) {
        return { operations: 'High', customerExperience: 'Low', automation: 'Medium' }
      }
      if (/role|access|permission/.test(name)) {
        return { operations: 'High', customerExperience: 'Low', automation: 'Medium' }
      }
      if (/offline/.test(name)) {
        return { operations: 'High', customerExperience: 'High', automation: 'Medium' }
      }
      if (/sms|whatsapp|notification/.test(name)) {
        return { operations: 'Medium', customerExperience: 'High', automation: 'High' }
      }
      return { operations: 'Medium', customerExperience: 'Medium', automation: 'Medium' }
    }
  }
}

export function buildScopeOptions(
  selection: ProjectQuoteSelection,
  quotation = buildProjectQuotation(selection)
): ScopeOption[] {
  const ideas = projectImprovementIdeas(selection, quotation)
  const highImpact = ideas.filter(idea => idea.stage === 'High-impact improvement')
  const later = ideas.filter(idea => idea.stage === 'Later phase')

  const highImpactTotal = highImpact.reduce((sum, idea) => sum + idea.priceImpact, 0)
  const laterTotal = later.reduce((sum, idea) => sum + idea.priceImpact, 0)

  const core: ScopeOption = {
    id: 'core',
    title: 'Core launch',
    description: 'The selected scope needed to launch the project without automatically adding optional improvements.',
    total: quotation.knownTotal,
    upfront: quotation.upfrontAmount,
    addedInvestment: 0,
    additions: [],
  }

  const recommendedTotal = quotation.knownTotal + highImpactTotal
  const recommended: ScopeOption = {
    id: 'recommended',
    title: 'Recommended',
    description: highImpact.length
      ? 'Adds the improvements most directly connected to reducing friction, manual work or operational gaps identified from the project description.'
      : 'The current scope already covers the strongest deterministic improvements identified from the information provided.',
    total: recommendedTotal,
    upfront: recommendedTotal * PROJECT_PRICING.upfrontRate,
    addedInvestment: highImpactTotal,
    additions: highImpact.map(idea => idea.title),
  }

  const growthTotal = recommendedTotal + laterTotal
  const growth: ScopeOption = {
    id: 'growth',
    title: 'Growth phase',
    description: later.length
      ? 'Adds useful expansion features that can be introduced after the core system is validated with real users.'
      : 'No additional later-phase feature is currently triggered by the project information provided.',
    total: growthTotal,
    upfront: growthTotal * PROJECT_PRICING.upfrontRate,
    addedInvestment: highImpactTotal + laterTotal,
    additions: [...highImpact, ...later].map(idea => idea.title),
  }

  return [core, recommended, growth]
}

export function quotationSummary(selection: ProjectQuoteSelection, quotation: ProjectQuotation) {
  const priced = quotation.lineItems
    .map(item =>
      `- ${item.label}: ${item.amount === null ? 'Custom quotation' : formatZmw(item.amount)}\n  Reason: ${item.reason}\n  Client impact: ${item.impact}`
    )
    .join('\n')

  return [
    priced || '- Scope still needs to be selected.',
    '',
    `Known total: ${formatZmw(quotation.knownTotal)}`,
    `Upfront payment (35%): ${formatZmw(quotation.upfrontAmount)}`,
    `Remaining balance (65%): ${formatZmw(quotation.balanceAmount)}`,
    quotation.hasCustomPricing
      ? 'IoT/custom engineering is excluded from the known total and requires final technical scoping.'
      : 'No custom-priced item is currently selected.',
    '',
    `Additional features: ${normalizeCustomFeatures(selection.customFeatures).length} × ${formatZmw(PROJECT_PRICING.additionalFeature)} each`,
    `Mobile platform: ${selection.mobileApplication ? selection.mobilePlatform : 'Not applicable'}`,
    `Timeline: ${selection.timeline}`,
    `Project description: ${selection.projectDescription || 'Not provided'}`,
    `Client goal: ${selection.clientGoal || 'Not provided'}`,
    `Target users: ${selection.targetUsers || 'Not provided'}`,
    `Current process: ${selection.currentProcess || 'Not provided'}`,
    `Success outcome: ${selection.successOutcome || 'Not provided'}`,
    selection.iotIntegration ? `IoT details: ${selection.iotDetails || 'Not provided'}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export function fallbackQuoteExplanation(selection: ProjectQuoteSelection, quotation: ProjectQuotation) {
  if (quotation.lineItems.length === 0) {
    return 'Select at least one deliverable first so I can explain the pricing.'
  }

  const selectedValue = quotation.lineItems
    .map(item => {
      const price = item.amount === null ? 'Custom quotation after technical discovery' : formatZmw(item.amount)
      return `• ${item.label} — ${price}\n  What it changes: ${item.impact}`
    })
    .join('\n')

  const ideas = projectImprovementIdeas(selection, quotation)
  const improvementText = ideas.length
    ? ideas
        .map(idea => {
          const newUpfront = quotation.upfrontAmount + idea.upfrontImpact
          return [
            `• ${idea.title} — ${idea.stage}`,
            `  Without it: ${idea.withoutChange}`,
            `  With it: ${idea.withChange}`,
            `  Added investment: +${formatZmw(idea.priceImpact)}`,
            `  Total: ${formatZmw(quotation.knownTotal)} → ${formatZmw(idea.newKnownTotal)}`,
            `  35% upfront: ${formatZmw(quotation.upfrontAmount)} → ${formatZmw(newUpfront)} (+${formatZmw(idea.upfrontImpact)})`,
            `  Practical impact: ${idea.impact}`,
          ].join('\n')
        })
        .join('\n\n')
    : 'No extra paid improvement is currently triggered by the project description. The current scope can be treated as the core launch version.'

  const customNote = quotation.hasCustomPricing
    ? '\n\nIoT note: the connected-device portion still needs technical discovery because hardware, sensors, connectivity, power, enclosure and quantity affect the final amount.'
    : ''

  return [
    'WHAT YOU ARE BUILDING',
    selection.projectDescription || 'A digital system based on the selected project scope.',
    '',
    'WHY THE CURRENT SCOPE MATTERS',
    selectedValue,
    '',
    'CURRENT INVESTMENT',
    `Known total: ${formatZmw(quotation.knownTotal)}`,
    `35% upfront: ${formatZmw(quotation.upfrontAmount)}`,
    `65% remaining balance: ${formatZmw(quotation.balanceAmount)}`,
    '',
    'BEFORE VS AFTER — BEST IMPROVEMENTS',
    improvementText,
    '',
    'RECOMMENDED NEXT STEP',
    ideas.length
      ? 'Keep the core scope needed to launch, add the high-impact improvement only when its operational benefit justifies the extra investment, and move lower-priority items to phase 2.'
      : 'Proceed with the current core scope, then review optional improvements after the first version is validated with real users.',
  ].join('\n') + customNote
}
