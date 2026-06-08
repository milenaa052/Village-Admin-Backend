import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { ButtonService } from '../src/buttons/button.service'
import { Button } from '../src/buttons/buttons.model'

describe('ButtonService', () => {

    let service: ButtonService

    const mockButtonModel = {
        findAll: jest.fn(),
        findByPk: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ButtonService,
                {
                    provide: getModelToken(Button),
                    useValue: mockButtonModel
                }
            ]
        }).compile()

        service = module.get<ButtonService>(ButtonService)
    })

    it('deve retornar todos os botões', async () => {

        const buttons = [
            { idButton: 1, label: 'Home', link: '/home' },
            { idButton: 2, label: 'Contato', link: '/contato' }
        ]

        mockButtonModel.findAll.mockResolvedValue(buttons)
        const result = await service.findAll()

        expect(mockButtonModel.findAll).toHaveBeenCalled()
        expect(result).toEqual(buttons)
    })

    it('deve retornar um botão pelo id', async () => {

        const button = {
            idButton: 1,
            label: 'Home',
            link: '/home'
        }

        mockButtonModel.findByPk.mockResolvedValue(button)
        const result = await service.findById(1)

        expect(mockButtonModel.findByPk).toHaveBeenCalledWith(1)
        expect(result).toEqual(button)
    })

    it('deve lançar NotFoundException ao buscar botão inexistente', async () => {

        mockButtonModel.findByPk.mockResolvedValue(null)

        await expect(
            service.findById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve atualizar um botão com sucesso', async () => {

        const mockButton = {
            idButton: 1,
            label: 'Antigo',
            link: '/antigo',
            save: jest.fn().mockResolvedValue(true)
        }

        mockButtonModel.findByPk.mockResolvedValue(mockButton)
        const result = await service.update(1, {
            label: 'Novo',
            link: '/novo'
        })

        expect(mockButtonModel.findByPk).toHaveBeenCalledWith(1)
        expect(mockButton.label).toBe('Novo')
        expect(mockButton.link).toBe('/novo')
        expect(mockButton.save).toHaveBeenCalled()
        expect(result).toEqual(mockButton)
    })

    it('deve manter valores antigos quando label e link não forem enviados', async () => {

        const mockButton = {
            idButton: 1,
            label: 'Label Antiga',
            link: '/link-antigo',
            save: jest.fn().mockResolvedValue(true)
        }

        mockButtonModel.findByPk.mockResolvedValue(mockButton)
        const result = await service.update(1, {} as any)

        expect(mockButton.save).toHaveBeenCalled()
        expect(result.label).toBe('Label Antiga')
        expect(result.link).toBe('/link-antigo')
    })

    it('deve lançar NotFoundException ao tentar atualizar botão inexistente', async () => {

        mockButtonModel.findByPk.mockResolvedValue(null)

        await expect(
            service.update(1, {
                label: 'Novo',
                link: '/novo'
            })
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar BadRequestException ao ocorrer erro na atualização', async () => {

        const mockButton = {
            idButton: 1,
            label: 'Antigo',
            link: '/antigo',
            save: jest.fn().mockRejectedValue(new Error())
        }

        mockButtonModel.findByPk.mockResolvedValue(mockButton)

        await expect(
            service.update(1, {
                label: 'Novo',
                link: '/novo'
            })
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve deletar um botão com sucesso', async () => {

        const mockButton = {
            idButton: 1,
            destroy: jest.fn().mockResolvedValue(true)
        }

        mockButtonModel.findByPk.mockResolvedValue(mockButton)
        const result = await service.deleteById(1)

        expect(mockButtonModel.findByPk).toHaveBeenCalledWith(1)
        expect(mockButton.destroy).toHaveBeenCalled()
        expect(result).toEqual({
            message: 'Botão deletado com sucesso'
        })
    })

    it('deve lançar NotFoundException ao tentar deletar botão inexistente', async () => {

        mockButtonModel.findByPk.mockResolvedValue(null)

        await expect(
            service.deleteById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })
})