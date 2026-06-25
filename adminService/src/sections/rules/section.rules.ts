import { SectionName } from '../interface/section.interface'

export interface SectionRule {
  /** Whether the admin can edit the title field */
  titleEditable: boolean
  /** Fixed title — when set, title is always this value in the DB */
  fixedTitle?: string
  /** Whether the subtitle field is editable */
  subtitleEditable: boolean
  /** Fixed subtitle — when set, admin cannot change it */
  fixedSubtitle?: string
  /** Whether the section can have text contents (P1–P5) */
  allowContents: boolean
  maxContents?: number
  /** Whether the section can have cards */
  allowCards: boolean
  minCards?: number
  maxCards?: number
  /** Whether the section can have images */
  allowImages: boolean
  maxImages?: number
  /** Whether the section can have stats */
  allowStats: boolean
  maxStats?: number
  /** Buttons: 'none' = no buttons at all; 'fixed' = hardcoded, not persisted */
  buttons: 'none' | 'fixed'
  fixedButtonLabels?: string[]
}

export const SECTION_RULES: Record<SectionName, SectionRule> = {
  // ── Home ──────────────────────────────────────────────────────────────────
  [SectionName.home]: {
    titleEditable:    true,
    subtitleEditable: true,
    allowContents:    false,
    allowCards:       false,
    allowImages:      false,
    allowStats:       false,
    buttons:          'fixed',
    fixedButtonLabels: ['Conheça o Artesanato', 'Nossa História'],
  },

  [SectionName.aboutUs]: {
    titleEditable:    false,
    fixedTitle:       'Quem Somos?',
    subtitleEditable: true,
    allowContents:    true,
    maxContents:      undefined, // unlimited paragraphs
    allowCards:       false,
    allowImages:      true,
    maxImages:        1,
    allowStats:       false,
    buttons:          'fixed',
    fixedButtonLabels: ['Conheça Nossa Cultura'],
  },

  [SectionName.featuredCraft]: {
    titleEditable:    false,
    fixedTitle:       'Artesanato em Destaque',
    subtitleEditable: true,
    allowContents:    false,
    allowCards:       false,
    allowImages:      false,
    allowStats:       false,
    buttons:          'fixed',
    fixedButtonLabels: ['Ver Todos os Artesanatos'],
  },

  [SectionName.socialImpact]: {
    titleEditable:    false,
    fixedTitle:       'Impacto Social',
    subtitleEditable: true,
    allowContents:    false,
    allowCards:       true,
    minCards:         3,
    maxCards:         3,
    allowImages:      false,
    allowStats:       false,
    buttons:          'fixed',
    fixedButtonLabels: ['Conheça Mais Sobre Nossa Cultura'],
  },

  // ── Nossa História ────────────────────────────────────────────────────────
  [SectionName.identity]: {
    titleEditable:    true,
    subtitleEditable: true,
    allowContents:    true,
    maxContents:      4,
    allowCards:       false,
    allowImages:      false,
    allowStats:       false,
    buttons:          'none',
  },

  [SectionName.cultureDimensions]: {
    titleEditable:    false,
    fixedTitle:       'Dimensões da Nossa Cultura',
    subtitleEditable: false,
    allowContents:    false,
    allowCards:       true,
    minCards:         4,
    maxCards:         4,
    allowImages:      false,
    allowStats:       false,
    buttons:          'none',
  },

  [SectionName.communityMoments]: {
    titleEditable:    false,
    fixedTitle:       'Momentos da Nossa Comunidade',
    subtitleEditable: false,
    allowContents:    false,
    allowCards:       false,
    allowImages:      true,
    maxImages:        8,
    allowStats:       false,
    buttons:          'none',
  },

  // ── Artesanato ────────────────────────────────────────────────────────────
  [SectionName.crafts]: {
    titleEditable:    false,
    fixedTitle:       'Artesanato',
    subtitleEditable: false,
    fixedSubtitle:    'Sobre os Produtos',
    allowContents:    true,
    maxContents:      1,
    allowCards:       false,
    allowImages:      false,
    allowStats:       false,
    buttons:          'none',
  },
}

export function getRules(name: SectionName): SectionRule {
  return SECTION_RULES[name]
}
