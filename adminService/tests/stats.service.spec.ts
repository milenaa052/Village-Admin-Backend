import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { StatsService } from '../src/stats/stats.service'
import { Stats } from '../src/stats/stats.model'

describe('StatsService', () => {

    let service: StatsService

    const mockStatsModel = {
        findAll: jest.fn(),
        findByPk: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StatsService,
                {
                    provide: getModelToken(Stats),
                    useValue: mockStatsModel
                }
            ]
        }).compile()

        service = module.get<StatsService>(StatsService)
    })

    it('deve retornar todas as estatísticas', async () => {

        const stats = [
            {
                idStats: 1,
                title: 'Clientes',
                value: '100'
            },
            {
                idStats: 2,
                title: 'Projetos',
                value: '50'
            }
        ]

        mockStatsModel.findAll.mockResolvedValue(stats)
        const result = await service.findAll()

        expect(mockStatsModel.findAll).toHaveBeenCalled()
        expect(result).toEqual(stats)
    })

    it('deve retornar estatística pelo id', async () => {

        const stats = {
            idStats: 1,
            title: 'Clientes',
            value: '100'
        }

        mockStatsModel.findByPk.mockResolvedValue(stats)
        const result = await service.findById(1)

        expect(mockStatsModel.findByPk).toHaveBeenCalledWith(1)
        expect(result).toEqual(stats)
    })

    it('deve lançar NotFoundException ao buscar estatística inexistente', async () => {

        mockStatsModel.findByPk.mockResolvedValue(null)

        await expect(
            service.findById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve atualizar estatística com sucesso', async () => {

        const mockStats = {
            idStats: 1,
            title: 'Clientes',
            value: '100',
            save: jest.fn().mockResolvedValue(true)
        }

        mockStatsModel.findByPk.mockResolvedValue(mockStats)
        const result = await service.update(1, {} as any)

        expect(mockStatsModel.findByPk)
            .toHaveBeenCalledWith(1)

        expect(mockStats.save)
            .toHaveBeenCalled()

        expect(result).toEqual(mockStats)
    })

    it('deve lançar NotFoundException ao atualizar estatística inexistente', async () => {

        mockStatsModel.findByPk.mockResolvedValue(null)

        await expect(
            service.update(
                1,
                {} as any
            )
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar BadRequestException ao falhar atualização da estatística', async () => {

        const mockStats = {
            idStats: 1,
            title: 'Clientes',
            value: '100',
            save: jest.fn().mockRejectedValue(new Error())
        }

        mockStatsModel.findByPk.mockResolvedValue(mockStats)
        await expect(
            service.update(1, {} as any)
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve deletar estatística com sucesso', async () => {

        const mockStats = {
            idStats: 1,
            destroy: jest.fn().mockResolvedValue(true)
        }

        mockStatsModel.findByPk.mockResolvedValue(mockStats)
        const result = await service.deleteById(1)

        expect(mockStatsModel.findByPk)
            .toHaveBeenCalledWith(1)

        expect(mockStats.destroy)
            .toHaveBeenCalled()

        expect(result).toEqual({
            message: 'Estatísticas deletada com sucesso'
        })
    })

    it('deve lançar NotFoundException ao deletar estatística inexistente', async () => {

        mockStatsModel.findByPk.mockResolvedValue(null)

        await expect(
            service.deleteById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })
})