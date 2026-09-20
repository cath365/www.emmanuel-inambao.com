import type { Project } from '@/lib/project-catalog'
import type { Profile } from '@/lib/profile'
import type { Service } from '@/lib/services'
import type { SkillCategory } from '@/lib/skills'

export interface LocalAssistantContext {
  profile: Profile
  projects: Project[]
  services: Service[]
  skillCategories: SkillCategory[]
  activeProjectId?: string | null
}

export interface LocalAssistantAnswer {
  response: string
  options?: string[]
  activeProjectId?: string | null
}

const STOP_WORDS = new Set([
  'a','an','and','are','as','at','be','been','being','by','can','could','did','do','does',
  'for','from','had','has','have','he','his','how','i','in','is','it','me','of','on','or',
  'that','the','their','them','they','this','to','was','were','what','when','where','which',
  'who','why','will','with','would','you','your','about','tell','show','explain','please',
])

const PROJECT_ALIASES: Record<string, string[]> = {
  'smart-cooking-oil-dispenser': ['cooking oil', 'oil dispenser', 'cooking oil dispenser', 'dispenser', 'depener'],
  'denuel-one-pro-ai-x': ['denuel one', 'one pro', 'ai x', 'smart device'],
  'smart-walking-stick': ['walking stick', 'smart stick', 'blind stick', 'assistive stick'],
  'the-spot-app': ['the spot', 'spot app', 'menstrual app', 'cycle tracker', 'women health app'],
  'quotation-platform': ['astro city', 'astro city crm', 'quotation', 'quotation platform', 'crm'],
  'constituency226': ['constituency226', 'constituency 226', 'civic platform'],
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9+#./-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokens(value: string) {
  return Array.from(new Set(
    normalize(value)
      .split(' ')
      .filter(token => token.length > 1 && !STOP_WORDS.has(token))
  ))
}

function includesAny(value: string, phrases: string[]) {
  const normalized = normalize(value)
  return phrases.some(phrase => normalized.includes(normalize(phrase)))
}

function projectSearchText(project: Project) {
  return normalize([
    project.id,
    project.title,
    project.purpose,
    project.problemSolved,
    project.systemLogic,
    project.outcome,
    project.role || '',
    project.status || '',
    ...(project.techStack || []),
    ...(project.architecture || []),
    ...(project.highlights || []),
  ].join(' '))
}

function projectScore(query: string, project: Project) {
  const normalizedQuery = normalize(query)
  const queryTokens = tokens(query)
  const title = normalize(project.title)
  const tech = normalize((project.techStack || []).join(' '))
  const richText = projectSearchText(project)
  let score = 0

  if (normalizedQuery.includes(title) || title.includes(normalizedQuery)) score += 30

  const aliases = PROJECT_ALIASES[project.id] || []
  for (const alias of aliases) {
    if (normalizedQuery.includes(normalize(alias))) score += 20
  }

  for (const token of queryTokens) {
    if (title.includes(token)) score += 6
    if (tech.includes(token)) score += 5
    if (richText.includes(token)) score += 2
  }

  return score
}

function findBestProject(query: string, projects: Project[]) {
  const ranked = projects
    .map(project => ({ project, score: projectScore(query, project) }))
    .sort((a, b) => b.score - a.score)

  return ranked[0] && ranked[0].score >= 6 ? ranked[0] : null
}

function projectSummary(project: Project) {
  const role = project.role ? ` Emmanuel's documented role: ${project.role}.` : ''
  const status = project.status ? ` Status: ${project.status}.` : ''
  const tech = project.techStack?.length ? `\n\nTechnology: ${project.techStack.slice(0, 9).join(', ')}.` : ''
  const highlights = project.highlights?.length
    ? `\n\nKey points: ${project.highlights.slice(0, 4).join(' • ')}.`
    : ''

  return `${project.title} — ${project.purpose}.${role}${status}\n\nHow it works: ${project.systemLogic}${tech}${highlights}`
}

function projectSpecificAnswer(query: string, project: Project) {
  const q = normalize(query)

  if (includesAny(q, ['how does it work', 'how it works', 'how does this work', 'explain how', 'system logic'])) {
    return `For ${project.title}, the documented system flow is:\n\n${project.systemLogic}${project.architecture?.length ? `\n\nArchitecture: ${project.architecture.join(' → ')}.` : ''}`
  }

  if (includesAny(q, ['technology', 'technologies', 'tech stack', 'what tech', 'hardware', 'components', 'sensors'])) {
    return `${project.title} uses: ${project.techStack.join(', ')}.${project.architecture?.length ? `\n\nIts architecture includes ${project.architecture.join(', ')}.` : ''}`
  }

  if (includesAny(q, ['offline', 'internet', 'connectivity'])) {
    const source = normalize([project.systemLogic, project.highlights?.join(' '), project.purpose].filter(Boolean).join(' '))
    if (source.includes('offline')) {
      return `Yes—offline operation is documented for ${project.title}. ${project.systemLogic}`
    }
    return `The portfolio does not specifically document offline operation for ${project.title}. Its recorded architecture is: ${project.architecture?.join(', ') || project.systemLogic}`
  }

  if (includesAny(q, ['role', 'what did emmanuel do', 'what did he do', 'responsible', 'responsibility'])) {
    return project.role
      ? `On ${project.title}, Emmanuel's documented role is ${project.role}. ${project.outcome}`
      : `The portfolio documents ${project.title} and its implementation, but it does not specify a separate role label for Emmanuel.`
  }

  if (includesAny(q, ['status', 'live', 'deployed', 'production', 'prototype'])) {
    return `${project.title} is listed as ${project.status || 'status not specified'}. ${project.outcome}`
  }

  return projectSummary(project)
}

function relevantSkills(query: string, categories: SkillCategory[]) {
  const q = normalize(query)
  const queryTokens = tokens(query)

  return categories.flatMap(category =>
    category.skills
      .filter(skill => {
        const name = normalize(skill.name)
        return q.includes(name) || queryTokens.some(token => name.includes(token) || token.includes(name))
      })
      .map(skill => ({ ...skill, category: category.title }))
  )
}

function capabilityAnswer(query: string, context: LocalAssistantContext): LocalAssistantAnswer {
  const ranked = context.projects
    .map(project => ({ project, score: projectScore(query, project) }))
    .filter(item => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const matchedSkills = relevantSkills(query, context.skillCategories).slice(0, 6)

  if (ranked.length > 0) {
    const evidence = ranked
      .map(({ project }) => `• ${project.title} — ${project.purpose}`)
      .join('\n')

    const skillText = matchedSkills.length
      ? `\n\nRelevant documented skills: ${matchedSkills.map(skill => skill.name).join(', ')}.`
      : ''

    return {
      response: `Yes, the portfolio shows experience relevant to that type of work. The closest documented evidence is:\n\n${evidence}${skillText}\n\nA new solution would still need proper scoping before Emmanuel could commit to architecture, price or delivery time. Useful first questions are: what must the system measure/control, and does it need to work when internet connectivity is poor?`,
      options: ['📩 Send inquiry', 'Book a meeting', 'See projects'],
      activeProjectId: ranked[0].project.id,
    }
  }

  const serviceMatches = context.services
    .filter(service => {
      const text = normalize([service.title, service.description, ...(service.features || [])].join(' '))
      return tokens(query).some(token => text.includes(token))
    })
    .slice(0, 3)

  if (serviceMatches.length > 0) {
    return {
      response: `Emmanuel's documented services include work relevant to your request: ${serviceMatches.map(service => service.title).join(', ')}. I don't have enough project-specific evidence to claim he has already built your exact system, but the portfolio shows related capability.\n\nTo scope it properly, describe what the system should do and the environment it will operate in.`,
      options: ['📩 Send inquiry', 'Book a meeting', 'View skills'],
    }
  }

  return {
    response: `I can't confirm from the portfolio that Emmanuel has already built that exact type of system. His documented work covers embedded systems, IoT, robotics, mobile/web applications and connected hardware.\n\nIf you describe the main problem, inputs/sensors, outputs/actions and connectivity needs, I can compare it against his documented projects.`,
    options: ['📩 Send inquiry', 'See projects', 'View skills'],
  }
}

export function answerPortfolioQuestion(query: string, context: LocalAssistantContext): LocalAssistantAnswer {
  const q = normalize(query)

  if (!q) {
    return { response: 'Ask me about a project, technology, service, or whether Emmanuel\'s experience fits your idea.' }
  }

  if (includesAny(q, ['api key', 'openai_api_key', 'password', 'admin password', 'secret key', 'environment variable', 'credentials'])) {
    return {
      response: 'I can explain Emmanuel\'s public portfolio and documented work, but I cannot provide passwords, API keys, private credentials or internal secrets.',
      options: ['See projects', 'View skills', 'Contact info'],
    }
  }

  if (includesAny(q, ['who should i vote', 'who should vote', 'which candidate should', 'who will win', 'predict election', 'best candidate'])) {
    return {
      response: 'I can explain Constituency226 as a civic-information platform and describe its documented features, but I do not recommend candidates, tell visitors how to vote, or predict election outcomes.',
      options: ['Tell me about Constituency226', 'See projects'],
      activeProjectId: 'constituency226',
    }
  }

  if (includesAny(q, ['university degree', 'what degree', 'degree does', 'which university', 'education qualification'])) {
    return {
      response: 'A university degree is not documented in the portfolio data available to me, so I will not invent one. You can use the contact option if you need Emmanuel to confirm a qualification directly.',
      options: ['Contact info', 'View skills', 'See projects'],
    }
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/.test(q)) {
    return {
      response: `Hello! 👋 I'm Emmanuel's portfolio assistant. I can explain his projects, technologies and services, compare his documented experience with your idea, or help you contact him.`,
      options: ['See projects', 'View skills', 'Book a meeting', 'Contact info'],
    }
  }

  if (includesAny(q, ['who is emmanuel', 'about emmanuel', 'tell me about emmanuel', 'what does emmanuel do'])) {
    return {
      response: `${context.profile.name} is presented in this portfolio as ${context.profile.title} and ${context.profile.subtitle}. ${context.profile.bio} He is based in ${context.profile.location}.`,
      options: ['See projects', 'View skills', 'Contact info'],
    }
  }

  if (includesAny(q, ['contact', 'email', 'phone number', 'whatsapp', 'reach emmanuel'])) {
    return {
      response: `You can reach Emmanuel at:\n\n📧 ${context.profile.email}\n📱 ${context.profile.phone}\n📍 ${context.profile.location}\n\nYou can also start a project inquiry or book a meeting here in the portfolio.`,
      options: ['📩 Send inquiry', 'Book a meeting', 'See projects'],
    }
  }

  const activeProject = context.activeProjectId
    ? context.projects.find(project => project.id === context.activeProjectId)
    : undefined

  const looksLikeFollowUp = /\b(it|this|that|the project|the app|the system|its|those)\b/.test(q) ||
    includesAny(q, ['how does it work', 'what technology', 'what tech', 'what hardware', 'what sensors', 'is it offline', 'what was his role', 'what is its status'])

  if (activeProject && looksLikeFollowUp) {
    return {
      response: projectSpecificAnswer(query, activeProject),
      options: ['View another project', '📩 Send inquiry', 'Book a meeting'],
      activeProjectId: activeProject.id,
    }
  }

  const normalizedTechQuery = q.replace(/[^a-z0-9+#. -]/g, ' ')
  const techProjects = context.projects.filter(project =>
    project.techStack.some(tech => {
      const name = normalize(tech)
      return normalizedTechQuery.includes(name) || tokens(query).some(token => name.includes(token))
    })
  )

  const technologyListIntent =
    includesAny(q, ['built with', 'projects with', 'projects using', 'what did emmanuel build with', 'what has emmanuel built with']) ||
    /\b(esp32|arduino|react|next\.js|iot|sensor|sim800|bluetooth|wifi|wi-fi)\b/.test(q)

  if (techProjects.length > 0 && technologyListIntent) {
    const technology = tokens(query)
      .filter(token => !['built','emmanuel','uses','using','use','project','projects'].includes(token))
      .join(' ')

    return {
      response: `Projects in the portfolio related to ${technology || 'that technology'} include:\n\n${techProjects.slice(0, 6).map(project => `• ${project.title} — ${project.purpose}`).join('\n')}\n\nAsk me about any one of them and I can explain how it works, its architecture, and Emmanuel's documented role.`,
      options: techProjects.slice(0, 3).map(project => project.title),
      activeProjectId: techProjects[0].id,
    }
  }

  const directMatch = findBestProject(query, context.projects)
  if (directMatch) {
    return {
      response: projectSpecificAnswer(query, directMatch.project),
      options: ['How does it work?', 'What technology does it use?', '📩 Send inquiry'],
      activeProjectId: directMatch.project.id,
    }
  }

  if (includesAny(q, ['can emmanuel', 'can he', 'could emmanuel', 'could he', 'build for me', 'build me', 'my business', 'my farm', 'i need a', 'i need an', 'would he be able'])) {
    return capabilityAnswer(query, context)
  }

  if (includesAny(q, ['skill', 'skills', 'technology', 'technologies', 'tech stack', 'what can he do', 'what does he know'])) {
    const matched = relevantSkills(query, context.skillCategories)
    if (matched.length > 0) {
      return {
        response: `Relevant documented skills include:\n\n${matched.slice(0, 12).map(skill => `• ${skill.name} — ${skill.category}`).join('\n')}`,
        options: ['See projects', '📩 Send inquiry', 'Book a meeting'],
      }
    }

    return {
      response: `Emmanuel's documented technical areas include:\n\n${context.skillCategories.map(category => `• ${category.title} — ${category.skills.slice(0, 5).map(skill => skill.name).join(', ')}`).join('\n')}\n\nAsk about a technology such as ESP32, Next.js, IoT or offline-first systems and I can connect it to actual projects.`,
      options: ['ESP32 projects', 'See projects', 'Book a meeting'],
    }
  }

  if (includesAny(q, ['service', 'services', 'offer', 'hire', 'price', 'cost', 'quote'])) {
    return {
      response: `Documented services include:\n\n${context.services.map(service => `• ${service.title} — ${service.price || 'scope-based pricing'}`).join('\n')}\n\nDisplayed prices are starting points only; a real quote depends on scope, hardware, integrations, testing and deployment requirements.`,
      options: ['📩 Send inquiry', 'Book a meeting', 'See projects'],
    }
  }

  if (includesAny(q, ['project', 'projects', 'work', 'portfolio', 'what has he built', 'what did he build', 'things he built'])) {
    return {
      response: `Some documented projects are:\n\n${context.projects.slice(0, 8).map(project => `• ${project.title} — ${project.purpose}`).join('\n')}\n\nYou can ask me about any project by name for a more detailed engineering explanation.`,
      options: context.projects.slice(0, 3).map(project => project.title),
    }
  }

  return capabilityAnswer(query, context)
}
