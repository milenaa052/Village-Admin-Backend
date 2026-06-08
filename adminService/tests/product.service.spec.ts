import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { ProductService } from '../src/products/product.service'
import { Product } from '../src/products/product.model'
import { Category } from '../src/categories/category.model'

describe('ProductService', () => {

    let service: ProductService

    const mockProductModel = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn()
    }

    const mockCategoryModel = {
        findByPk: jest.fn()
    }

    beforeEach(async () => {

        jest.clearAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getModelToken(Product),
                    useValue: mockProductModel
                },
                {
                    provide: getModelToken(Category),
                    useValue: mockCategoryModel
                }
            ]
        }).compile()

        service = module.get<ProductService>(ProductService)
    })

    it('deve criar produto com sucesso', async () => {

        mockCategoryModel.findByPk.mockResolvedValue({
            idCategory: 1
        })
        const mockProduct = {
            idProduct: 1,
            name: 'Produto',
            description: 'Descrição',
            price: 100,
            size: 'M',
            imageUrl: 'imagem.jpg',
            categoryId: 1
        }

        mockProductModel.create.mockResolvedValue(mockProduct)
        const result = await service.create({
            name: 'Produto',
            description: 'Descrição',
            price: 100,
            size: 'M',
            imageUrl: 'imagem.jpg',
            categoryId: 1
        })

        expect(mockProductModel.create).toHaveBeenCalledWith({
            name: 'Produto',
            description: 'Descrição',
            price: 100,
            size: 'M',
            imageUrl: 'imagem.jpg',
            categoryId: 1
        })
        expect(result).toEqual(mockProduct)
    })

    it('deve lançar NotFoundException para categoria inexistente ao criar produto', async () => {

        mockCategoryModel.findByPk.mockResolvedValue(null)

        await expect(
            service.create({
                name: 'Produto',
                description: 'Descrição',
                price: 100,
                size: 'M',
                imageUrl: 'imagem.jpg',
                categoryId: 1
            })
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar BadRequestException ao falhar criação do produto', async () => {

        mockCategoryModel.findByPk.mockResolvedValue({
            idCategory: 1
        })

        mockProductModel.create.mockRejectedValue(new Error())

        await expect(
            service.create({
                name: 'Produto',
                description: 'Descrição',
                price: 100,
                size: 'M',
                imageUrl: 'imagem.jpg',
                categoryId: 1
            })
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve retornar todos os produtos', async () => {

        const products = [
            { idProduct: 1, name: 'Produto 1' },
            { idProduct: 2, name: 'Produto 2' }
        ]

        mockProductModel.findAll.mockResolvedValue(products)
        const result = await service.findAll()

        expect(mockProductModel.findAll).toHaveBeenCalled()
        expect(result).toEqual(products)
    })

    it('deve retornar produto pelo id', async () => {

        const product = {
            idProduct: 1,
            name: 'Produto'
        }

        mockProductModel.findByPk.mockResolvedValue(product)
        const result = await service.findById(1)

        expect(mockProductModel.findByPk).toHaveBeenCalledWith(1)
        expect(result).toEqual(product)
    })

    it('deve lançar NotFoundException ao buscar produto inexistente', async () => {

        mockProductModel.findByPk.mockResolvedValue(null)

        await expect(
            service.findById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve buscar produto pelo nome', async () => {

        const products = [
            { idProduct: 1, name: 'Produto Teste' }
        ]

        mockProductModel.findAll.mockResolvedValue(products)
        const result = await service.findByProduct('Teste')

        expect(mockProductModel.findAll).toHaveBeenCalledWith({
            where: {
                name: {
                    [Op.like]: '%Teste%'
                }
            }
        })

        expect(result).toEqual(products)
    })

    it('deve atualizar produto com sucesso', async () => {

        mockCategoryModel.findByPk.mockResolvedValue({
            idCategory: 1
        })
        const mockProduct = {
            idProduct: 1,
            name: 'Produto',
            description: 'Descrição',
            price: 100,
            size: 'M',
            imageUrl: 'imagem.jpg',
            categoryId: 1,
            save: jest.fn().mockResolvedValue(true)
        }

        mockProductModel.findByPk.mockResolvedValue(mockProduct)
        const result = await service.update(
            1,
            {
                name: 'Novo Produto',
                description: 'Nova Descrição',
                price: 200,
                size: 'G',
                imageUrl: 'nova.jpg',
                categoryId: 1
            }
        )

        expect(mockProduct.save).toHaveBeenCalled()
        expect(result.name).toBe('Novo Produto')
        expect(result.description).toBe('Nova Descrição')
        expect(result.price).toBe(200)
        expect(result.size).toBe('G')
        expect(result.imageUrl).toBe('nova.jpg')
    })

    it('deve manter valores antigos quando campos não forem enviados', async () => {

        const mockProduct = {
            idProduct: 1,
            name: 'Produto',
            description: 'Descrição',
            price: 100,
            size: 'M',
            imageUrl: 'imagem.jpg',
            categoryId: 1,
            save: jest.fn().mockResolvedValue(true)
        }

        mockProductModel.findByPk.mockResolvedValue(mockProduct)
        const result = await service.update(1, {} as any)

        expect(mockProduct.save).toHaveBeenCalled()
        expect(result.name).toBe('Produto')
        expect(result.description).toBe('Descrição')
        expect(result.price).toBe(100)
        expect(result.size).toBe('M')
        expect(result.imageUrl).toBe('imagem.jpg')
        expect(result.categoryId).toBe(1)
    })

    it('deve lançar NotFoundException ao atualizar produto inexistente', async () => {

        mockProductModel.findByPk.mockResolvedValue(null)

        await expect(
            service.update(1, {} as any)
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar NotFoundException para categoria inexistente ao atualizar produto', async () => {

        const mockProduct = {
            idProduct: 1,
            categoryId: 1
        }

        mockProductModel.findByPk.mockResolvedValue(mockProduct)
        mockCategoryModel.findByPk.mockResolvedValue(null)

        await expect(
            service.update(
                1,
                {
                    categoryId: 999
                }
            )
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('deve lançar BadRequestException ao falhar atualização do produto', async () => {

        mockCategoryModel.findByPk.mockResolvedValue({
            idCategory: 1
        })

        const mockProduct = {
            idProduct: 1,
            name: 'Produto',
            description: 'Descrição',
            price: 100,
            size: 'M',
            imageUrl: 'imagem.jpg',
            categoryId: 1,
            save: jest.fn().mockRejectedValue(new Error())
        }
        mockProductModel.findByPk.mockResolvedValue(mockProduct)

        await expect(
            service.update(
                1,
                {
                    name: 'Novo Produto',
                    categoryId: 1
                }
            )
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('deve deletar produto com sucesso', async () => {

        const mockProduct = {
            idProduct: 1,
            destroy: jest.fn().mockResolvedValue(true)
        }

        mockProductModel.findByPk.mockResolvedValue(mockProduct)
        const result = await service.deleteById(1)

        expect(mockProduct.destroy).toHaveBeenCalled()
        expect(result).toEqual({
            message: 'Produto deletado com sucesso'
        })
    })

    it('deve lançar NotFoundException ao deletar produto inexistente', async () => {

        mockProductModel.findByPk.mockResolvedValue(null)

        await expect(
            service.deleteById(1)
        ).rejects.toBeInstanceOf(NotFoundException)
    })
})