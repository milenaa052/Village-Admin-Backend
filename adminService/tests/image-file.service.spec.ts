import { Test, TestingModule } from '@nestjs/testing'
import { ImageFileService } from '../src/images/image-file.service'
import * as uploadUtils from '../src/images/config/upload.utils'

jest.mock('../src/images/config/upload.utils', () => ({
    removeFileByUrl: jest.fn(),
    imageUrlFromFilename: jest.fn()
}))

describe('ImageFileService', () => {

    let service: ImageFileService

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [ImageFileService]
        }).compile()

        service = module.get<ImageFileService>(ImageFileService)
    })

    it('deve remover arquivo com sucesso', async () => {

        ;(uploadUtils.removeFileByUrl as jest.Mock)
            .mockResolvedValue(undefined)

        await service.remove('/uploads/image.jpg')

        expect(uploadUtils.removeFileByUrl)
            .toHaveBeenCalledWith('/uploads/image.jpg')
    })

    it('deve gerar url da imagem corretamente', () => {

        ;(uploadUtils.imageUrlFromFilename as jest.Mock)
            .mockReturnValue(
                'http://localhost/uploads/image.jpg'
            )

        const result = service.generateUrl(
            'image.jpg'
        )

        expect(uploadUtils.imageUrlFromFilename)
            .toHaveBeenCalledWith('image.jpg')

        expect(result).toBe(
            'http://localhost/uploads/image.jpg'
        )
    })
})