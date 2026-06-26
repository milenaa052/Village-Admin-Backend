import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { ContentService } from '../src/contents/content.service'
import { Content } from '../src/contents/content.model'
import { SectionValidatorService } from '../src/sections/rules/section-validator.service'
import { ContentType } from '../src/contents/interface/content.interface'

describe('ContentService', () => {

    let service: ContentService

    const mockContentModel = {
        create:   jest.fn(),
        findAll:  jest.fn(),
        findByPk: jest.fn()
    }

    const mockSectionValidator = {
        validateContentCreate: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ContentService,
                {
                    provide: getModelToken(Content),
                    useValue: mockContentModel
                },
                {
                    provide: SectionValidatorService,
                    useValue: mockSectionValidator
                }
            ]
        }).compile()

        service = module.get<ContentService>(ContentService)
    })

    describe('create', () => {

        it('deve criar conteúdo com sucesso', async () => {

            const mockContent = {
                idContent: 1,
                type: ContentType.P1,
                content: 'Texto',
                sectionId: 1
            }

            mockSectionValidator.validateContentCreate.mockResolvedValue(undefined)
            mockContentModel.create.mockResolvedValue(mockContent)

            const result = await service.create({
                type: ContentType.P1,
                content: 'Texto',
                sectionId: 1
            })

            expect(mockSectionValidator.validateContentCreate)
                .toHaveBeenCalledWith(1)

            expect(mockContentModel.create).toHaveBeenCalledWith({
                type: ContentType.P1,
                content: 'Texto',
                sectionId: 1
            })

            expect(result).toEqual(mockContent)
        })

        it('deve lançar exceção quando validação da seção falhar', async () => {

            mockSectionValidator.validateContentCreate
                .mockRejectedValue(new BadRequestException('Seção não permite conteúdos'))

            await expect(
                service.create({
                    type: ContentType.P1,
                    content: 'Texto',
                    sectionId: 1
                })
            ).rejects.toBeInstanceOf(BadRequestException)

            expect(mockContentModel.create).not.toHaveBeenCalled()
        })

        it('deve lançar BadRequestException ao falhar criação no banco', async () => {

            mockSectionValidator.validateContentCreate.mockResolvedValue(undefined)
            mockContentModel.create.mockRejectedValue(new Error())

            await expect(
                service.create({
                    type: ContentType.P1,
                    content: 'Texto',
                    sectionId: 1
                })
            ).rejects.toBeInstanceOf(BadRequestException)
        })
    })

    describe('findAll', () => {

        it('deve retornar todos os conteúdos', async () => {

            const contents = [
                { idContent: 1, title: 'Conteúdo 1' },
                { idContent: 2, title: 'Conteúdo 2' }
            ]

            mockContentModel.findAll.mockResolvedValue(contents)
            const result = await service.findAll()

            expect(mockContentModel.findAll).toHaveBeenCalled()
            expect(result).toEqual(contents)
        })
    })

    describe('findById', () => {

        it('deve retornar conteúdo pelo id', async () => {

            const content = { idContent: 1, title: 'Conteúdo' }

            mockContentModel.findByPk.mockResolvedValue(content)
            const result = await service.findById(1)

            expect(mockContentModel.findByPk).toHaveBeenCalledWith(1)
            expect(result).toEqual(content)
        })

        it('deve lançar NotFoundException ao buscar conteúdo inexistente', async () => {

            mockContentModel.findByPk.mockResolvedValue(null)

            await expect(
                service.findById(1)
            ).rejects.toBeInstanceOf(NotFoundException)
        })
    })

    describe('update', () => {

        it('deve atualizar conteúdo com sucesso', async () => {

            const mockContent = {
                idContent: 1,
                title: 'Conteúdo',
                save: jest.fn().mockResolvedValue(true)
            }

            mockContentModel.findByPk.mockResolvedValue(mockContent)
            const result = await service.update(1, {} as any)

            expect(mockContentModel.findByPk).toHaveBeenCalledWith(1)
            expect(mockContent.save).toHaveBeenCalled()
            expect(result).toEqual(mockContent)
        })

        it('deve lançar NotFoundException ao atualizar conteúdo inexistente', async () => {

            mockContentModel.findByPk.mockResolvedValue(null)

            await expect(
                service.update(1, {} as any)
            ).rejects.toBeInstanceOf(NotFoundException)
        })

        it('deve lançar BadRequestException ao falhar atualização', async () => {

            const mockContent = {
                idContent: 1,
                title: 'Conteúdo',
                save: jest.fn().mockRejectedValue(new Error())
            }

            mockContentModel.findByPk.mockResolvedValue(mockContent)

            await expect(
                service.update(1, {} as any)
            ).rejects.toBeInstanceOf(BadRequestException)
        })
    })

    describe('deleteById', () => {

        it('deve deletar conteúdo com sucesso', async () => {

            const mockContent = {
                idContent: 1,
                destroy: jest.fn().mockResolvedValue(true)
            }

            mockContentModel.findByPk.mockResolvedValue(mockContent)
            const result = await service.deleteById(1)

            expect(mockContentModel.findByPk).toHaveBeenCalledWith(1)
            expect(mockContent.destroy).toHaveBeenCalled()
            expect(result).toEqual({ message: 'Conteúdo deletado com sucesso' })
        })

        it('deve lançar NotFoundException ao deletar conteúdo inexistente', async () => {

            mockContentModel.findByPk.mockResolvedValue(null)

            await expect(
                service.deleteById(1)
            ).rejects.toBeInstanceOf(NotFoundException)
        })
    })
})