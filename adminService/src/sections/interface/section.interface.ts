export enum SectionName {
    homePage = 'Página Inicial',
    aboutUs = 'Sobre Nós',
    socialImpact = 'Impacto Social',
    identity = 'Identidade',
    values = 'Valores',
    traditionalTechniques = 'Técnicas Tradicionais',
    preserve = 'Preserve',
    doubts = 'Dúvidas',
    aboutProducts = 'Sobre os Produtos',
    guarantee = 'Garantia'
}

export interface SectionCreationAttributes {
    name: SectionName
    title: string
    subtitle: string
}