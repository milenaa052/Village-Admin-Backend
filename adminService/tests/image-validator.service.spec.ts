import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import FileType from 'file-type'

import { ImageValidatorService } from '../src/images/image-validator.service'
import * as uploadUtils from '../src/images/config/upload.utils'

jest.mock('file-type', () => ({
    __esModule: true,
    default: {
        fromFile: jest.fn()
    }
}))

jest.mock('../src/images/config/upload.utils', () => ({
    removeFileByUrl: jest.fn()
}))

describe('ImageValidatorService', () => {

    let service: ImageValidatorService

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule =
            await Test.createTestingModule({
                providers: [
                    ImageValidatorService
                ]
            }).compile()

        service = module.get<ImageValidatorService>(
            ImageValidatorService
        )
    })

    it('deve validar imagem jpg com sucesso', async () => {

        const file = {
            path: '/uploads/image.jpg',
            originalname: 'image.jpg'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock)
            .mockResolvedValue({
                ext: 'jpg'
            })

        await expect(
            service.validate(file)
        ).resolves.not.toThrow()

        expect(
            FileType.fromFile
        ).toHaveBeenCalledWith(
            '/uploads/image.jpg'
        )

        expect(
            uploadUtils.removeFileByUrl
        ).not.toHaveBeenCalled()
    })

    it('deve validar imagem png com sucesso', async () => {

        const file = {
            path: '/uploads/image.png',
            originalname: 'image.png'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock)
            .mockResolvedValue({
                ext: 'png'
            })

        await expect(
            service.validate(file)
        ).resolves.not.toThrow()
    })

    it('deve lançar BadRequestException quando FileType retornar null', async () => {

        const file = {
            path: '/uploads/image.jpg',
            originalname: 'image.jpg'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock)
            .mockResolvedValue(null)

        await expect(
            service.validate(file)
        ).rejects.toBeInstanceOf(
            BadRequestException
        )

        expect(
            uploadUtils.removeFileByUrl
        ).toHaveBeenCalledWith(
            '/uploads/image.jpg'
        )
    })

    it('deve lançar BadRequestException para extensão não permitida', async () => {

        const file = {
            path: '/uploads/image.txt',
            originalname: 'image.txt'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock)
            .mockResolvedValue({
                ext: 'txt'
            })

        await expect(
            service.validate(file)
        ).rejects.toBeInstanceOf(
            BadRequestException
        )

        expect(
            uploadUtils.removeFileByUrl
        ).toHaveBeenCalledWith(
            '/uploads/image.txt'
        )
    })

    it('deve lançar BadRequestException quando extensão original não corresponder', async () => {

        const file = {
            path: '/uploads/image.png',
            originalname: 'image.jpg'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock)
            .mockResolvedValue({
                ext: 'png'
            })

        await expect(
            service.validate(file)
        ).rejects.toBeInstanceOf(
            BadRequestException
        )

        expect(
            uploadUtils.removeFileByUrl
        ).toHaveBeenCalledWith(
            '/uploads/image.png'
        )
    })

    it('deve aceitar quando originalname estiver sem extensão', async () => {

        const file = {
            path: '/uploads/image.jpg',
            originalname: 'imagem'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock)
            .mockResolvedValue({
                ext: 'jpg'
            })

        await expect(
            service.validate(file)
        ).resolves.not.toThrow()
    })

    it('deve aceitar extensão em maiúsculo', async () => {

        const file = {
            path: '/uploads/image.jpg',
            originalname: 'IMAGE.JPG'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock)
            .mockResolvedValue({
                ext: 'jpg'
            })

        await expect(
            service.validate(file)
        ).resolves.not.toThrow()
    })

    it('deve propagar erro inesperado do FileType', async () => {

        const file = {
            path: '/uploads/image.jpg',
            originalname: 'image.jpg'
        } as Express.Multer.File

        const error = new Error(
            'Erro inesperado'
        )

        ;(FileType.fromFile as jest.Mock)
            .mockRejectedValue(error)

        await expect(
            service.validate(file)
        ).rejects.toThrow(
            'Erro inesperado'
        )
    })

    it('deve chamar removeFileByUrl antes de lançar erro para extensão inválida', async () => {

        const file = {
            path: '/uploads/image.gif',
            originalname: 'image.gif'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock)
            .mockResolvedValue({
                ext: 'gif'
            })

        await expect(
            service.validate(file)
        ).rejects.toBeInstanceOf(
            BadRequestException
        )

        expect(
            uploadUtils.removeFileByUrl
        ).toHaveBeenCalledTimes(1)
    })

    it('deve chamar removeFileByUrl antes de lançar erro por divergência de extensão', async () => {

        const file = {
            path: '/uploads/image.png',
            originalname: 'image.jpg'
        } as Express.Multer.File

        ;(FileType.fromFile as jest.Mock)
            .mockResolvedValue({
                ext: 'png'
            })

        await expect(
            service.validate(file)
        ).rejects.toBeInstanceOf(
            BadRequestException
        )

        expect(
            uploadUtils.removeFileByUrl
        ).toHaveBeenCalledTimes(1)
    })
})