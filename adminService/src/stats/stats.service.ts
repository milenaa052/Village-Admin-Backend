import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Stats } from './stats.model'
import { StatsDto } from './dto/stats.dto'
import { CreateStatsDto } from './dto/create-stats.dto'
import { SectionValidatorService } from '../sections/rules/section-validator.service'

@Injectable()
export class StatsService {
    constructor(
        @InjectModel(Stats) private readonly statsModel: typeof Stats,
        private readonly sectionValidator: SectionValidatorService,
    ) {}

    async create(dto: CreateStatsDto): Promise<Stats> {
        await this.sectionValidator.validateStatsCreate(dto.sectionId)
        try {
            return await this.statsModel.create({
                title: dto.title, value: dto.value, sectionId: dto.sectionId
            })
        } catch {
            throw new BadRequestException('Erro ao criar estatística')
        }
    }

    async findAll() {
        return this.statsModel.findAll()
    }

    async findById(id: number) {
        const stats = await this.statsModel.findByPk(id)
        if (!stats) throw new NotFoundException('Estatística não encontrada')
        return stats
    }

    async update(idStats: number, dto: StatsDto) {
        const stats = await this.statsModel.findByPk(idStats)
        if (!stats) throw new NotFoundException('Estatística não encontrada')
        try {
            if (dto.title !== undefined) stats.title = dto.title
            if (dto.value !== undefined) stats.value = dto.value
            await stats.save()
            return stats
        } catch {
            throw new BadRequestException('Erro ao atualizar a estatística')
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const stats = await this.statsModel.findByPk(id)
        if (!stats) throw new NotFoundException('Estatística não encontrada')
        await stats.destroy()
        return { message: 'Estatística deletada com sucesso' }
    }
}
