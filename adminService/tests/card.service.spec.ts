import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { CardService } from '../src/cards/card.service'
import { Card } from '../src/cards/card.model'

describe('CardService', () => {

    let service: CardService

    const mockCardModel = {
        findAll: jest.fn(),
        findByPk: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CardService,
                {
                    provide: getModelToken(Card),
                    useValue: mockCardModel
                }
            ]
        }).compile()

        service = module.get<CardService>(CardService)
    })

    it('deve retornar todos os cards', async () => {

        const cards = [
            {
                idCard: 1,
                title: 'Card 1',
                description: 'Descrição 1',
                icon: 'icon-1'
            },
            {
                idCard: 2,
                title: 'Card 2',
                description: 'Descrição 2',
                icon: 'icon-2'
            }
        ]

        mockCardModel.findAll.mockResolvedValue(cards)
        const result = await service.findAll()

        expect(mockCardModel.findAll).toHaveBeenCalled()
        expect(result).toEqual(cards)
    })

    it('deve retornar um card pelo id', async () => {

        const card = {
            idCard: 1,
            title: 'Card',
            description: 'Descrição',
            icon: 'icon'
        }

        mockCardModel.findByPk.mockResolvedValue(card)
        const result = await service.findById(1)

        expect(mockCardModel.findByPk).toHaveBeenCalledWith(1)
        expect(result).toEqual(card)
    })

    it('deve lançar NotFoundException ao buscar card inexistente', async () => {

        mockCardModel.findByPk.mockResolvedValue(null)

        await expect(
            service.findById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve atualizar um card com sucesso', async () => {

        const mockCard = {
            idCard: 1,
            title: 'Título Antigo',
            description: 'Descrição Antiga',
            icon: 'icon-antigo',
            save: jest.fn().mockResolvedValue(true)
        }

        mockCardModel.findByPk.mockResolvedValue(mockCard)
        const result = await service.update(1, {
            title: 'Novo Título',
            description: 'Nova Descrição',
            icon: 'novo-icon'
        })

        expect(mockCardModel.findByPk).toHaveBeenCalledWith(1)
        expect(mockCard.title).toBe('Novo Título')
        expect(mockCard.description).toBe('Nova Descrição')
        expect(mockCard.icon).toBe('novo-icon')
        expect(mockCard.save).toHaveBeenCalled()
        expect(result).toEqual(mockCard)
    })

    it('deve manter valores antigos quando campos não forem enviados', async () => {

        const mockCard = {
            idCard: 1,
            title: 'Título Antigo',
            description: 'Descrição Antiga',
            icon: 'icon-antigo',
            save: jest.fn().mockResolvedValue(true)
        }

        mockCardModel.findByPk.mockResolvedValue(mockCard)
        const result = await service.update(1, {} as any)

        expect(mockCard.save).toHaveBeenCalled()
        expect(result.title).toBe('Título Antigo')
        expect(result.description).toBe('Descrição Antiga')
        expect(result.icon).toBe('icon-antigo')
    })

    it('deve lançar NotFoundException ao tentar atualizar card inexistente', async () => {

        mockCardModel.findByPk.mockResolvedValue(null)

        await expect(
            service.update(1, {
                title: 'Novo',
                description: 'Descrição',
                icon: 'icon'
            })
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar BadRequestException ao ocorrer erro na atualização', async () => {

        const mockCard = {
            idCard: 1,
            title: 'Título',
            description: 'Descrição',
            icon: 'icon',
            save: jest.fn().mockRejectedValue(new Error())
        }

        mockCardModel.findByPk.mockResolvedValue(mockCard)

        await expect(
            service.update(1, {
                title: 'Novo',
                description: 'Nova',
                icon: 'novo-icon'
            })
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve deletar um card com sucesso', async () => {

        const mockCard = {
            idCard: 1,
            destroy: jest.fn().mockResolvedValue(true)
        }

        mockCardModel.findByPk.mockResolvedValue(mockCard)
        const result = await service.deleteById(1)

        expect(mockCardModel.findByPk).toHaveBeenCalledWith(1)
        expect(mockCard.destroy).toHaveBeenCalled()
        expect(result).toEqual({
            message: 'Card deletado com sucesso'
        })
    })

    it('deve lançar NotFoundException ao tentar deletar card inexistente', async () => {

        mockCardModel.findByPk.mockResolvedValue(null)

        await expect(
            service.deleteById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })
})