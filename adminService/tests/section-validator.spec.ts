import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { SectionValidatorService } from '../src/sections/rules/section-validator.service'
import { Section } from '../src/sections/section.model'
import { Content } from '../src/contents/content.model'
import { Card } from '../src/cards/card.model'
import { Image } from '../src/images/images.model'
import { SectionName } from '../src/sections/interface/section.interface'

describe('SectionValidatorService', () => {

    let service: SectionValidatorService

    const mockSectionModel = {
        findByPk: jest.fn(),
        count:    jest.fn(),
    }

    const mockContentModel = { count: jest.fn() }
    const mockCardModel    = { count: jest.fn() }
    const mockImageModel   = { count: jest.fn() }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SectionValidatorService,
                { provide: getModelToken(Section), useValue: mockSectionModel },
                { provide: getModelToken(Content), useValue: mockContentModel },
                { provide: getModelToken(Card),    useValue: mockCardModel    },
                { provide: getModelToken(Image),   useValue: mockImageModel   },
            ],
        }).compile()

        service = module.get<SectionValidatorService>(SectionValidatorService)
    })

    describe('getSectionOrFail', () => {

        it('deve retornar a seção quando encontrada', async () => {

            const section = { idSection: 1, name: SectionName.home }
            mockSectionModel.findByPk.mockResolvedValue(section)

            const result = await service.getSectionOrFail(1)

            expect(mockSectionModel.findByPk).toHaveBeenCalledWith(1)
            expect(result).toEqual(section)
        })

        it('deve lançar NotFoundException quando seção não existe', async () => {

            mockSectionModel.findByPk.mockResolvedValue(null)

            await expect(
                service.getSectionOrFail(99)
            ).rejects.toBeInstanceOf(NotFoundException)
        })
    })

    describe('validateContentCreate', () => {

        it('deve lançar BadRequestException quando seção não permite conteúdos (home)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 1, name: SectionName.home })

            await expect(
                service.validateContentCreate(1)
            ).rejects.toBeInstanceOf(BadRequestException)

            expect(mockContentModel.count).not.toHaveBeenCalled()
        })

        it('deve lançar NotFoundException quando seção não existe', async () => {

            mockSectionModel.findByPk.mockResolvedValue(null)

            await expect(
                service.validateContentCreate(99)
            ).rejects.toBeInstanceOf(NotFoundException)
        })

        it('deve passar quando seção permite conteúdos ilimitados e ainda não atingiu limite (aboutUs)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 1, name: SectionName.aboutUs })
            mockContentModel.count.mockResolvedValue(10)

            await expect(
                service.validateContentCreate(1)
            ).resolves.toBeUndefined()
        })

        it('deve passar quando count está abaixo do limite (identity: maxContents = 4)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 2, name: SectionName.identity })
            mockContentModel.count.mockResolvedValue(3)

            await expect(
                service.validateContentCreate(2)
            ).resolves.toBeUndefined()
        })

        it('deve lançar BadRequestException quando limite de conteúdos é atingido (identity: maxContents = 4)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 2, name: SectionName.identity })
            mockContentModel.count.mockResolvedValue(4)

            await expect(
                service.validateContentCreate(2)
            ).rejects.toBeInstanceOf(BadRequestException)
        })

        it('deve passar quando count está abaixo do limite (crafts: maxContents = 1)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 3, name: SectionName.crafts })
            mockContentModel.count.mockResolvedValue(0)

            await expect(
                service.validateContentCreate(3)
            ).resolves.toBeUndefined()
        })

        it('deve lançar BadRequestException quando limite de conteúdos é atingido (crafts: maxContents = 1)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 3, name: SectionName.crafts })
            mockContentModel.count.mockResolvedValue(1)

            await expect(
                service.validateContentCreate(3)
            ).rejects.toBeInstanceOf(BadRequestException)
        })
    })

    describe('validateCardCreate', () => {

        it('deve lançar BadRequestException quando seção não permite cards (home)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 1, name: SectionName.home })

            await expect(
                service.validateCardCreate(1)
            ).rejects.toBeInstanceOf(BadRequestException)

            expect(mockCardModel.count).not.toHaveBeenCalled()
        })

        it('deve lançar NotFoundException quando seção não existe', async () => {

            mockSectionModel.findByPk.mockResolvedValue(null)

            await expect(
                service.validateCardCreate(99)
            ).rejects.toBeInstanceOf(NotFoundException)
        })

        it('deve passar quando count está abaixo do limite (socialImpact: maxCards = 3)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 4, name: SectionName.socialImpact })
            mockCardModel.count.mockResolvedValue(2)

            await expect(
                service.validateCardCreate(4)
            ).resolves.toBeUndefined()
        })

        it('deve lançar BadRequestException quando limite de cards é atingido (socialImpact: maxCards = 3)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 4, name: SectionName.socialImpact })
            mockCardModel.count.mockResolvedValue(3)

            await expect(
                service.validateCardCreate(4)
            ).rejects.toBeInstanceOf(BadRequestException)
        })

        it('deve passar quando count está abaixo do limite (cultureDimensions: maxCards = 4)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 5, name: SectionName.cultureDimensions })
            mockCardModel.count.mockResolvedValue(3)

            await expect(
                service.validateCardCreate(5)
            ).resolves.toBeUndefined()
        })

        it('deve lançar BadRequestException quando limite de cards é atingido (cultureDimensions: maxCards = 4)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 5, name: SectionName.cultureDimensions })
            mockCardModel.count.mockResolvedValue(4)

            await expect(
                service.validateCardCreate(5)
            ).rejects.toBeInstanceOf(BadRequestException)
        })
    })

    describe('validateCardDelete', () => {

        it('deve lançar NotFoundException quando seção não existe', async () => {

            mockSectionModel.findByPk.mockResolvedValue(null)

            await expect(
                service.validateCardDelete(99)
            ).rejects.toBeInstanceOf(NotFoundException)
        })

        it('deve passar quando seção não tem minCards definido (home)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 1, name: SectionName.home })

            await expect(
                service.validateCardDelete(1)
            ).resolves.toBeUndefined()

            expect(mockCardModel.count).not.toHaveBeenCalled()
        })

        it('deve passar quando count está acima do mínimo (socialImpact: minCards = 3)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 4, name: SectionName.socialImpact })
            mockCardModel.count.mockResolvedValue(4)

            await expect(
                service.validateCardDelete(4)
            ).resolves.toBeUndefined()
        })

        it('deve lançar BadRequestException quando count é igual ao mínimo (socialImpact: minCards = 3)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 4, name: SectionName.socialImpact })
            mockCardModel.count.mockResolvedValue(3)

            await expect(
                service.validateCardDelete(4)
            ).rejects.toBeInstanceOf(BadRequestException)
        })

        it('deve lançar BadRequestException quando count está abaixo do mínimo (cultureDimensions: minCards = 4)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 5, name: SectionName.cultureDimensions })
            mockCardModel.count.mockResolvedValue(4)

            await expect(
                service.validateCardDelete(5)
            ).rejects.toBeInstanceOf(BadRequestException)
        })
    })

    describe('validateImageCreate', () => {

        it('deve lançar BadRequestException quando seção não permite imagens (home)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 1, name: SectionName.home })

            await expect(
                service.validateImageCreate(1)
            ).rejects.toBeInstanceOf(BadRequestException)

            expect(mockImageModel.count).not.toHaveBeenCalled()
        })

        it('deve lançar NotFoundException quando seção não existe', async () => {

            mockSectionModel.findByPk.mockResolvedValue(null)

            await expect(
                service.validateImageCreate(99)
            ).rejects.toBeInstanceOf(NotFoundException)
        })

        it('deve passar quando count está abaixo do limite (aboutUs: maxImages = 1)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 2, name: SectionName.aboutUs })
            mockImageModel.count.mockResolvedValue(0)

            await expect(
                service.validateImageCreate(2)
            ).resolves.toBeUndefined()
        })

        it('deve lançar BadRequestException quando limite de imagens é atingido (aboutUs: maxImages = 1)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 2, name: SectionName.aboutUs })
            mockImageModel.count.mockResolvedValue(1)

            await expect(
                service.validateImageCreate(2)
            ).rejects.toBeInstanceOf(BadRequestException)
        })

        it('deve passar quando count está abaixo do limite (communityMoments: maxImages = 8)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 6, name: SectionName.communityMoments })
            mockImageModel.count.mockResolvedValue(7)

            await expect(
                service.validateImageCreate(6)
            ).resolves.toBeUndefined()
        })

        it('deve lançar BadRequestException quando limite de imagens é atingido (communityMoments: maxImages = 8)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 6, name: SectionName.communityMoments })
            mockImageModel.count.mockResolvedValue(8)

            await expect(
                service.validateImageCreate(6)
            ).rejects.toBeInstanceOf(BadRequestException)
        })
    })

    describe('validateStatsCreate', () => {

        it('deve lançar BadRequestException quando seção não permite stats (home)', async () => {

            mockSectionModel.findByPk.mockResolvedValue({ idSection: 1, name: SectionName.home })

            await expect(
                service.validateStatsCreate(1)
            ).rejects.toBeInstanceOf(BadRequestException)
        })

        it('deve lançar NotFoundException quando seção não existe', async () => {

            mockSectionModel.findByPk.mockResolvedValue(null)

            await expect(
                service.validateStatsCreate(99)
            ).rejects.toBeInstanceOf(NotFoundException)
        })
    })

    describe('validateTitleEdit', () => {

        it('deve passar quando título é undefined (sem alteração)', () => {

            expect(() =>
                service.validateTitleEdit(SectionName.aboutUs, undefined)
            ).not.toThrow()
        })

        it('deve passar quando seção permite edição de título (home)', () => {

            expect(() =>
                service.validateTitleEdit(SectionName.home, 'Novo Título')
            ).not.toThrow()
        })

        it('deve passar quando seção permite edição de título (identity)', () => {

            expect(() =>
                service.validateTitleEdit(SectionName.identity, 'Novo Título')
            ).not.toThrow()
        })

        it('deve lançar BadRequestException quando seção tem título fixo (aboutUs)', () => {

            expect(() =>
                service.validateTitleEdit(SectionName.aboutUs, 'Novo Título')
            ).toThrow(BadRequestException)
        })

        it('deve lançar BadRequestException quando seção tem título fixo (cultureDimensions)', () => {

            expect(() =>
                service.validateTitleEdit(SectionName.cultureDimensions, 'Novo Título')
            ).toThrow(BadRequestException)
        })

        it('deve lançar BadRequestException quando seção tem título fixo (crafts)', () => {

            expect(() =>
                service.validateTitleEdit(SectionName.crafts, 'Artesanato Editado')
            ).toThrow(BadRequestException)
        })
    })

    describe('validateSubtitleEdit', () => {

        it('deve passar quando subtítulo é undefined (sem alteração)', () => {

            expect(() =>
                service.validateSubtitleEdit(SectionName.cultureDimensions, undefined)
            ).not.toThrow()
        })

        it('deve passar quando seção permite edição de subtítulo (home)', () => {

            expect(() =>
                service.validateSubtitleEdit(SectionName.home, 'Novo Subtítulo')
            ).not.toThrow()
        })

        it('deve passar quando seção permite edição de subtítulo (aboutUs)', () => {

            expect(() =>
                service.validateSubtitleEdit(SectionName.aboutUs, 'Novo Subtítulo')
            ).not.toThrow()
        })

        it('deve lançar BadRequestException quando seção tem subtítulo fixo (cultureDimensions)', () => {

            expect(() =>
                service.validateSubtitleEdit(SectionName.cultureDimensions, 'Novo Subtítulo')
            ).toThrow(BadRequestException)
        })

        it('deve lançar BadRequestException quando seção tem subtítulo fixo (communityMoments)', () => {

            expect(() =>
                service.validateSubtitleEdit(SectionName.communityMoments, 'Novo Subtítulo')
            ).toThrow(BadRequestException)
        })

        it('deve lançar BadRequestException quando seção tem subtítulo fixo (crafts)', () => {

            expect(() =>
                service.validateSubtitleEdit(SectionName.crafts, 'Editado')
            ).toThrow(BadRequestException)
        })
    })
})