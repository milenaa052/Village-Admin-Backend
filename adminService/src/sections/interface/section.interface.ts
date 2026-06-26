/**
 * Canonical enum of section names.
 * Each value corresponds exactly to an area of the public site and defines
 * which fields are allowed in the admin (see SectionRules).
 * Keys are in English (internal identifiers); values are the strings
 * persisted in the database and sent over the API — do not change them.
 */
export enum SectionName {
  // ─── Home ─────────────────────────────────────────────────────────────────
  home             = 'Principal',
  aboutUs          = 'Quem Somos',
  featuredCraft    = 'Artesanato em Destaque',
  socialImpact     = 'Impacto Social',
  // ─── Nossa História ───────────────────────────────────────────────────────
  identity         = 'Identidade',
  cultureDimensions= 'Dimensões da Nossa Cultura',
  communityMoments = 'Momentos da Nossa Comunidade',
  // ─── Artesanato ───────────────────────────────────────────────────────────
  crafts           = 'Artesanato',
}

export interface SectionCreationAttributes {
  name: SectionName
  title: string
  subtitle?: string
}
