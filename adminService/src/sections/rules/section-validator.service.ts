import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Section } from '../section.model'
import { Content } from '../../contents/content.model'
import { Card } from '../../cards/card.model'
import { Image } from '../../images/images.model'
import { SectionName } from '../interface/section.interface'
import { getRules } from './section.rules'

@Injectable()
export class SectionValidatorService {

  constructor(
    @InjectModel(Section) private readonly sectionModel: typeof Section,
    @InjectModel(Content) private readonly contentModel: typeof Content,
    @InjectModel(Card)    private readonly cardModel:    typeof Card,
    @InjectModel(Image)   private readonly imageModel:   typeof Image,
  ) {}

  // ─── Load section or throw ─────────────────────────────────────────────────

  async getSectionOrFail(sectionId: number): Promise<Section> {
    const section = await this.sectionModel.findByPk(sectionId)
    if (!section) throw new NotFoundException('Seção não encontrada')
    return section
  }

  // ─── Content validation ────────────────────────────────────────────────────

  async validateContentCreate(sectionId: number): Promise<void> {
    const section = await this.getSectionOrFail(sectionId)
    const rules = getRules(section.name as SectionName)

    if (!rules.allowContents) {
      throw new BadRequestException(
        `A seção "${section.name}" não permite textos/parágrafos.`
      )
    }

    if (rules.maxContents !== undefined) {
      const count = await this.contentModel.count({ where: { sectionId } })
      if (count >= rules.maxContents) {
        throw new BadRequestException(
          `A seção "${section.name}" permite no máximo ${rules.maxContents} parágrafo(s). Limite atingido.`
        )
      }
    }
  }

  // ─── Card validation ───────────────────────────────────────────────────────

  async validateCardCreate(sectionId: number): Promise<void> {
    const section = await this.getSectionOrFail(sectionId)
    const rules = getRules(section.name as SectionName)

    if (!rules.allowCards) {
      throw new BadRequestException(
        `A seção "${section.name}" não permite cards.`
      )
    }

    if (rules.maxCards !== undefined) {
      const count = await this.cardModel.count({ where: { sectionId } })
      if (count >= rules.maxCards) {
        throw new BadRequestException(
          `A seção "${section.name}" permite no máximo ${rules.maxCards} card(s). Limite atingido.`
        )
      }
    }
  }

  async validateCardDelete(sectionId: number): Promise<void> {
    const section = await this.getSectionOrFail(sectionId)
    const rules = getRules(section.name as SectionName)

    if (rules.minCards !== undefined) {
      const count = await this.cardModel.count({ where: { sectionId } })
      if (count <= rules.minCards) {
        throw new BadRequestException(
          `A seção "${section.name}" exige no mínimo ${rules.minCards} card(s). Não é possível remover.`
        )
      }
    }
  }

  // ─── Image validation ──────────────────────────────────────────────────────

  async validateImageCreate(sectionId: number): Promise<void> {
    const section = await this.getSectionOrFail(sectionId)
    const rules = getRules(section.name as SectionName)

    if (!rules.allowImages) {
      throw new BadRequestException(
        `A seção "${section.name}" não permite imagens.`
      )
    }

    if (rules.maxImages !== undefined) {
      const count = await this.imageModel.count({ where: { sectionId } })
      if (count >= rules.maxImages) {
        throw new BadRequestException(
          `A seção "${section.name}" permite no máximo ${rules.maxImages} imagem(ns). Limite atingido.`
        )
      }
    }
  }

  // ─── Stats validation ──────────────────────────────────────────────────────

  async validateStatsCreate(sectionId: number): Promise<void> {
    const section = await this.getSectionOrFail(sectionId)
    const rules = getRules(section.name as SectionName)

    if (!rules.allowStats) {
      throw new BadRequestException(
        `A seção "${section.name}" não permite estatísticas.`
      )
    }

    if (rules.maxStats !== undefined) {
      const count = await this.sectionModel.count()
      if (count >= rules.maxStats) {
        throw new BadRequestException(
          `A seção "${section.name}" atingiu o limite de estatísticas.`
        )
      }
    }
  }

  // ─── Title/subtitle edit validation ───────────────────────────────────────

  validateTitleEdit(sectionName: SectionName, newTitle?: string): void {
    if (newTitle === undefined) return
    const rules = getRules(sectionName)
    if (!rules.titleEditable) {
      throw new BadRequestException(
        `O título da seção "${sectionName}" é fixo e não pode ser alterado.`
      )
    }
  }

  validateSubtitleEdit(sectionName: SectionName, newSubtitle?: string): void {
    if (newSubtitle === undefined) return
    const rules = getRules(sectionName)
    if (!rules.subtitleEditable) {
      throw new BadRequestException(
        `O subtítulo da seção "${sectionName}" é fixo e não pode ser alterado.`
      )
    }
  }
}
