import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Stats } from './stats.model'
import { StatsDto } from './dto/stats.dto'

@Injectable()
export class StatsService {
    constructor(
        @InjectModel(Stats) private readonly statsModel: typeof Stats
    ) {}

    async findAll() {
        return await this.statsModel.findAll()
    }

    async findById(id: number) {
        const stats = await this.statsModel.findByPk(id)

        if (!stats) throw new NotFoundException('Estatísticas não encontrada')
        return stats
    }

    async update(idStats: number, statsDto: StatsDto) {
        const stats = await this.statsModel.findByPk(idStats)
        if (!stats) {
            throw new NotFoundException('Estatísticas não encontrada')
        }

        try {
            await stats.save()
            return stats
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar as estatísticas')
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const stats = await this.statsModel.findByPk(id)
        
        if (!stats) {
            throw new NotFoundException('Estatísticas não encontrada')
        }

        await stats.destroy();
        return { message: 'Estatísticas deletada com sucesso' }
    }
}