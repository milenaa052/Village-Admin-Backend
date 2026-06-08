import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import FileType from 'file-type'
import { ImageService } from '../src/images/image.service'
import { Image } from '../src/images/images.model'
import * as uploadUtils from '../src/images/config/upload.utils'

jest.mock('file-type', () => ({
    __esModule: true,
    default: {
        fromFile: jest.fn()
    }
}))

jest.mock('../src/images/config/upload.utils', () => ({
    removeFileByUrl: jest.fn(),
    imageUrlFromFilename: jest.fn()
}))

describe('ImageService', () => {

    let service: ImageService

    const mockImageModel = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageService,
                {
                    provide: getModelToken(Image),
                    useValue: mockImageModel
                }
            ]
        }).compile()

        service = module.get<ImageService>(ImageService)
    })

    it('deve retornar todas as imagens', async () => {

        const images = [
            {
                idImage: 1,
                imageUrl: 'image1.jpg',
                altText: 'Imagem 1',
                sectionId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]

        mockImageModel.findAll.mockResolvedValue(images)
        const result = await service.findAll()

        expect(mockImageModel.findAll).toHaveBeenCalled()
        expect(result).toEqual([
            {
                idImage: 1,
                imageUrl: 'image1.jpg',
                altText: 'Imagem 1',
                sectionId: 1,
                createdAt: images[0].createdAt,
                updatedAt: images[0].updatedAt
            }
        ])
    })

    it('deve retornar imagem pelo id', async () => {

        const image = {
            idImage: 1,
            imageUrl: 'image.jpg',
            altText: 'Imagem',
            sectionId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        mockImageModel.findByPk.mockResolvedValue(image)
        const result = await service.findOneById(1)

        expect(mockImageModel.findByPk).toHaveBeenCalledWith(1)
        expect(result).toEqual({
            idImage: image.idImage,
            imageUrl: image.imageUrl,
            altText: image.altText,
            sectionId: image.sectionId,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt
        })
    })

    it('deve lançar NotFoundException ao buscar imagem inexistente', async () => {

        mockImageModel.findByPk.mockResolvedValue(null)

        await expect(
            service.findOneById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve criar imagem com sucesso', async () => {

        const file = {
            filename: 'image.jpg',
            path: '/uploads/image.jpg',
            originalname: 'image.jpg'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock).mockResolvedValue({
            ext: 'jpg'
        })
        
        ;(uploadUtils.imageUrlFromFilename as jest.Mock)
            .mockReturnValue('http://localhost/image.jpg')

        const mockImage = {
            idImage: 1,
            imageUrl: 'http://localhost/image.jpg',
            altText: 'Imagem',
            sectionId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        mockImageModel.create.mockResolvedValue(mockImage)

        const result = await service.create(
            {
                altText: 'Imagem',
                sectionId: 1
            },
            file
        )

        expect(mockImageModel.create).toHaveBeenCalled()
        expect(result.imageUrl)
            .toBe('http://localhost/image.jpg')
    })

    it('deve lançar BadRequestException se arquivo não for enviado', async () => {

        await expect(
            service.create(
                {
                    altText: 'Imagem',
                    sectionId: 1
                },
                undefined as any
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve lançar BadRequestException para arquivo inválido', async () => {

        const file = {
            filename: 'image.txt',
            path: '/uploads/image.txt',
            originalname: 'image.txt'
        } as Express.Multer.File

        (FileType.fromFile as jest.Mock).mockResolvedValue({
            ext: 'txt'
        })

        await expect(
            service.create(
                {
                    altText: 'Imagem',
                    sectionId: 1
                },
                file
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve lançar BadRequestException se extensão não conferir', async () => {

        const file = {
            filename: 'image.png',
            path: '/uploads/image.png',
            originalname: 'image.jpg'
        } as Express.Multer.File

        (FileType.fromFile as jest.Mock).mockResolvedValue({
            ext: 'png'
        })

        await expect(
            service.create(
                {
                    altText: 'Imagem',
                    sectionId: 1
                },
                file
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve lançar InternalServerErrorException ao falhar criação da imagem', async () => {

        const file = {
            filename: 'image.jpg',
            path: '/uploads/image.jpg',
            originalname: 'image.jpg'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock).mockResolvedValue({
            ext: 'jpg'
        })

        ;(uploadUtils.imageUrlFromFilename as jest.Mock)
            .mockReturnValue('http://localhost/image.jpg')

        mockImageModel.create.mockRejectedValue(new Error())

        await expect(
            service.create(
                {
                    altText: 'Imagem',
                    sectionId: 1
                },
                file
            )
        ).rejects.toBeInstanceOf(InternalServerErrorException)
    })

    it('deve atualizar imagem com sucesso', async () => {

        const mockImage = {
            idImage: 1,
            imageUrl: 'old.jpg',
            altText: 'Imagem',
            sectionId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            save: jest.fn().mockResolvedValue(true)
        }

        mockImageModel.findByPk.mockResolvedValue(mockImage)
        const result = await service.update(
            1,
            {
                altText: 'Nova Imagem'
            }
        )

        expect(mockImage.save).toHaveBeenCalled()
        expect(result.altText).toBe('Nova Imagem')
    })

    it('deve atualizar imagem com novo arquivo', async () => {

        const file = {
            filename: 'new.jpg',
            path: '/uploads/new.jpg',
            originalname: 'new.jpg'
        } as Express.Multer.File

        const mockImage = {
            idImage: 1,
            imageUrl: 'old.jpg',
            altText: 'Imagem',
            sectionId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            save: jest.fn().mockResolvedValue(true)
        }

        mockImageModel.findByPk.mockResolvedValue(mockImage)

        ;(FileType.fromFile as jest.Mock).mockResolvedValue({
            ext: 'jpg'
        })

        ;(uploadUtils.imageUrlFromFilename as jest.Mock)
            .mockReturnValue('new.jpg')

        const result = await service.update(
            1,
            {
                altText: 'Nova'
            },
            file
        )

        expect(mockImage.save).toHaveBeenCalled()
        expect(result.imageUrl).toBe('new.jpg')
    })

    it('deve lançar BadRequestException para arquivo inválido no update', async () => {

        const file = {
            path: '/uploads/image.jpg'
        } as Express.Multer.File

        const mockImage = {
            idImage: 1,
            imageUrl: 'old.jpg',
            save: jest.fn()
        }

        mockImageModel.findByPk.mockResolvedValue(mockImage)

        await expect(
            service.update(
                1,
                {},
                file
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve lançar InternalServerErrorException ao falhar update', async () => {

        const mockImage = {
            idImage: 1,
            imageUrl: 'old.jpg',
            altText: 'Imagem',
            save: jest.fn().mockRejectedValue(new Error())
        }

        mockImageModel.findByPk.mockResolvedValue(mockImage)

        await expect(
            service.update(
                1,
                {
                    altText: 'Nova'
                }
            )
        ).rejects.toBeInstanceOf(InternalServerErrorException)
    })

    it('deve deletar imagem com sucesso', async () => {

        const mockImage = {
            idImage: 1,
            imageUrl: 'image.jpg',
            destroy: jest.fn().mockResolvedValue(true)
        }

        mockImageModel.findByPk.mockResolvedValue(mockImage)
        const result = await service.deleteById(1)

        expect(mockImage.destroy).toHaveBeenCalled()
        expect(result).toEqual({
            message: 'Imagem deletada com sucesso'
        })
    })

    it('deve lançar NotFoundException ao deletar imagem inexistente', async () => {

        mockImageModel.findByPk.mockResolvedValue(null)

        await expect(
            service.deleteById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar BadRequestException ao ocorrer erro inesperado na validação da imagem', async () => {

        const file = {
            filename: 'image.jpg',
            path: '/uploads/image.jpg',
            originalname: 'image.jpg'
        } as Express.Multer.File

        jest.spyOn(require('fs'), 'existsSync')
            .mockReturnValue(true)

        ;(FileType.fromFile as jest.Mock)
            .mockRejectedValue(new Error())

        await expect(
            service.create(
                {
                    altText: 'Imagem',
                    sectionId: 1
                },
                file
            )
        ).rejects.toBeInstanceOf(BadRequestException)

        expect(uploadUtils.removeFileByUrl)
            .toHaveBeenCalledWith('/uploads/image.jpg')
    })

    it('deve lançar erro de validação mesmo sem arquivo existir', async () => {

        const file = {
            filename: 'image.jpg',
            path: '/uploads/image.jpg',
            originalname: 'image.jpg'
        } as Express.Multer.File

        jest.spyOn(require('fs'), 'existsSync')
            .mockReturnValue(false)

        ;(FileType.fromFile as jest.Mock)
            .mockRejectedValue(new Error())

        await expect(
            service.create(
                {
                    altText: 'Imagem',
                    sectionId: 1
                },
                file
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })
})