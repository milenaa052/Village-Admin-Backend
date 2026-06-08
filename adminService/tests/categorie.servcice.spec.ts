import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, ConflictException,NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { CategoryService } from '../src/categories/category.service'
import { Category } from '../src/categories/category.model'

describe('CategoryService', () => {

    let service: CategoryService

    const mockCategoryModel = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: getModelToken(Category),
                    useValue: mockCategoryModel
                }
            ]
        }).compile()

        service = module.get<CategoryService>(CategoryService)
    })

    it('deve retornar true quando categoria existir', async () => {

        jest.spyOn(service, 'findByCategory')
            .mockResolvedValue({} as Category)

        const result = await service.checkCategoryExists('Tecnologia')

        expect(result).toBe(true)
    })

    it('deve retornar undefined quando categoria não existir', async () => {

        jest.spyOn(service, 'findByCategory')
            .mockResolvedValue(null)

        const result = await service.checkCategoryExists('Tecnologia')

        expect(result).toBeUndefined()
    })

    it('deve criar categoria com sucesso', async () => {

        jest.spyOn(service, 'checkCategoryExists')
            .mockResolvedValue(undefined)

        const mockCategory = {
            idCategory: 1,
            name: 'Tecnologia'
        }

        mockCategoryModel.create.mockResolvedValue(mockCategory)
        const result = await service.create({
            name: 'Tecnologia'
        })

        expect(mockCategoryModel.create).toHaveBeenCalledWith({
            name: 'Tecnologia'
        })
        expect(result).toEqual(mockCategory)
    })

    it('deve lançar ConflictException se categoria já existir', async () => {

        jest.spyOn(service, 'checkCategoryExists')
            .mockResolvedValue(true)

        await expect(
            service.create({
                name: 'Tecnologia'
            })
        ).rejects.toBeInstanceOf(ConflictException)
    })

    it('deve lançar BadRequestException ao falhar criação da categoria', async () => {

        jest.spyOn(service, 'checkCategoryExists')
            .mockResolvedValue(undefined)

        mockCategoryModel.create.mockRejectedValue(new Error())

        await expect(
            service.create({
                name: 'Tecnologia'
            })
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve retornar todas as categorias', async () => {

        const categories = [
            { idCategory: 1, name: 'Tecnologia' },
            { idCategory: 2, name: 'Educação' }
        ]

        mockCategoryModel.findAll.mockResolvedValue(categories)
        const result = await service.findAll()

        expect(mockCategoryModel.findAll).toHaveBeenCalled()
        expect(result).toEqual(categories)
    })

    it('deve retornar categoria pelo id', async () => {

        const category = {
            idCategory: 1,
            name: 'Tecnologia'
        }

        mockCategoryModel.findByPk.mockResolvedValue(category)
        const result = await service.findById(1)

        expect(mockCategoryModel.findByPk).toHaveBeenCalledWith(1)
        expect(result).toEqual(category)
    })

    it('deve lançar NotFoundException ao buscar categoria inexistente', async () => {

        mockCategoryModel.findByPk.mockResolvedValue(null)

        await expect(
            service.findById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve retornar categoria pelo nome', async () => {

        const category = {
            idCategory: 1,
            name: 'Tecnologia'
        }

        mockCategoryModel.findOne.mockResolvedValue(category)
        const result = await service.findByCategory('Tecnologia')

        expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
            where: {
                name: 'Tecnologia'
            }
        })
        expect(result).toEqual(category)
    })

    it('deve atualizar categoria com sucesso', async () => {

        const mockCategory = {
            idCategory: 1,
            name: 'Tecnologia',
            save: jest.fn().mockResolvedValue(true)
        }

        mockCategoryModel.findByPk.mockResolvedValue(mockCategory)
        jest.spyOn(service, 'findByCategory')
            .mockResolvedValue(null)

        const result = await service.update(
            1,
            {
                name: 'Nova Categoria'
            }
        )

        expect(mockCategory.save).toHaveBeenCalled()
        expect(result.name).toBe('Nova Categoria')
    })

    it('deve manter nome antigo quando name não for enviado', async () => {

        const mockCategory = {
            idCategory: 1,
            name: 'Tecnologia',
            save: jest.fn().mockResolvedValue(true)
        }

        mockCategoryModel.findByPk.mockResolvedValue(mockCategory)
        const result = await service.update(1,{} as any)

        expect(mockCategory.save).toHaveBeenCalled()
        expect(result.name).toBe('Tecnologia')
    })

    it('deve lançar NotFoundException ao atualizar categoria inexistente', async () => {

        mockCategoryModel.findByPk.mockResolvedValue(null)

        await expect(
            service.update(
                1,
                {
                    name: 'Nova Categoria'
                }
            )
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar ConflictException ao atualizar para categoria já existente', async () => {

        const mockCategory = {
            idCategory: 1,
            name: 'Tecnologia'
        }

        mockCategoryModel.findByPk.mockResolvedValue(mockCategory)
        jest.spyOn(service, 'findByCategory')
            .mockResolvedValue({} as Category)

        await expect(
            service.update(
                1,
                {
                    name: 'Educação'
                }
            )
        ).rejects.toBeInstanceOf(ConflictException)
    })

    it('deve lançar BadRequestException ao falhar atualização', async () => {

        const mockCategory = {
            idCategory: 1,
            name: 'Tecnologia',
            save: jest.fn().mockRejectedValue(new Error())
        }

        mockCategoryModel.findByPk.mockResolvedValue(mockCategory)
        jest.spyOn(service, 'findByCategory')
            .mockResolvedValue(null)

        await expect(
            service.update(
                1,
                {
                    name: 'Nova Categoria'
                }
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve deletar categoria com sucesso', async () => {

        const mockCategory = {
            idCategory: 1,
            destroy: jest.fn().mockResolvedValue(true)
        }

        mockCategoryModel.findByPk.mockResolvedValue(mockCategory)
        const result = await service.deleteById(1)

        expect(mockCategory.destroy).toHaveBeenCalled()
        expect(result).toEqual({
            message: 'Categoria deletada com sucesso'
        })
    })

    it('deve lançar NotFoundException ao deletar categoria inexistente', async () => {

        mockCategoryModel.findByPk.mockResolvedValue(null)

        await expect(
            service.deleteById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })
})