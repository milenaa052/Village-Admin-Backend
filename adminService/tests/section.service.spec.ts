import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { SectionService } from '../src/sections/section.service'
import { Section } from '../src/sections/section.model'
import { SectionName } from '../src/sections/interface/section.interface'

describe('SectionService', () => {

    let service: SectionService

    const mockSectionModel = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SectionService,
                {
                    provide: getModelToken(Section),
                    useValue: mockSectionModel
                }
            ]
        }).compile()

        service = module.get<SectionService>(SectionService)
    })

    it('deve criar uma seção com sucesso', async () => {

        const mockSection = {
            idSection: 1,
            name: SectionName.homePage,
            title: 'Título',
            subtitle: 'Subtítulo'
        }

        mockSectionModel.create.mockResolvedValue(mockSection)
        const result = await service.create({
            name: SectionName.homePage,
            title: 'Título',
            subtitle: 'Subtítulo'
        })

        expect(mockSectionModel.create).toHaveBeenCalledWith({
            name: SectionName.homePage,
            title: 'Título',
            subtitle: 'Subtítulo'
        })
        expect(result).toEqual(mockSection)
    })

    it('deve lançar BadRequestException ao falhar criação da seção', async () => {

        mockSectionModel.create.mockRejectedValue(new Error())

        await expect(
            service.create({
                name: SectionName.homePage,
                title: 'Título',
                subtitle: 'Subtítulo'
            })
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve retornar todas as seções', async () => {

        const sections = [
            {
                idSection: 1,
                name: SectionName.homePage
            },
            {
                idSection: 2,
                name: SectionName.aboutUs
            }
        ]

        mockSectionModel.findAll.mockResolvedValue(sections)
        const result = await service.findAll()

        expect(mockSectionModel.findAll).toHaveBeenCalled()
        expect(result).toEqual(sections)
    })

    it('deve retornar seção pelo id', async () => {

        const section = {
            idSection: 1,
            name: SectionName.homePage
        }

        mockSectionModel.findByPk.mockResolvedValue(section)
        const result = await service.findById(1)

        expect(mockSectionModel.findByPk).toHaveBeenCalledWith(1)
        expect(result).toEqual(section)
    })

    it('deve lançar NotFoundException ao buscar seção inexistente', async () => {

        mockSectionModel.findByPk.mockResolvedValue(null)

        await expect(
            service.findById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve atualizar seção com sucesso', async () => {

        const mockSection = {
            idSection: 1,
            name: SectionName.homePage,
            title: 'Título',
            subtitle: 'Subtítulo',
            save: jest.fn().mockResolvedValue(true)
        }

        mockSectionModel.findByPk.mockResolvedValue(mockSection)
        const result = await service.update(1,{} as any)

        expect(mockSectionModel.findByPk)
            .toHaveBeenCalledWith(1)

        expect(mockSection.save)
            .toHaveBeenCalled()

        expect(result).toEqual(mockSection)
    })

    it('deve lançar NotFoundException ao atualizar seção inexistente', async () => {

        mockSectionModel.findByPk.mockResolvedValue(null)

        await expect(
            service.update(1, {} as any)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar BadRequestException ao falhar atualização da seção', async () => {

        const mockSection = {
            idSection: 1,
            name: SectionName.homePage,
            title: 'Título',
            subtitle: 'Subtítulo',
            save: jest.fn().mockRejectedValue(new Error())
        }

        mockSectionModel.findByPk.mockResolvedValue(mockSection)

        await expect(
            service.update(1, {} as any)
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve deletar seção com sucesso', async () => {

        const mockSection = {
            idSection: 1,
            destroy: jest.fn().mockResolvedValue(true)
        }

        mockSectionModel.findByPk.mockResolvedValue(mockSection)
        const result = await service.deleteById(1)

        expect(mockSectionModel.findByPk)
            .toHaveBeenCalledWith(1)

        expect(mockSection.destroy)
            .toHaveBeenCalled()

        expect(result).toEqual({
            message: 'Seção deletada com sucesso'
        })
    })

    it('deve lançar NotFoundException ao deletar seção inexistente', async () => {

        mockSectionModel.findByPk.mockResolvedValue(null)

        await expect(
            service.deleteById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })
})