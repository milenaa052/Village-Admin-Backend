import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Button } from './buttons.model'
import { ButtonDto } from './dto/buttons.dto'

@Injectable()
export class ButtonService {
    constructor(
        @InjectModel(Button) private readonly buttonModel: typeof Button
    ) {}

    async findAll() {
        return await this.buttonModel.findAll()
    }

    async findById(id: number) {
        const button = await this.buttonModel.findByPk(id)

        if (!button) throw new NotFoundException('Botão não encontrado')
        return button
    }

    async update(idButton: number, buttonDto: ButtonDto) {
        const button = await this.buttonModel.findByPk(idButton)
        if (!button) {
            throw new NotFoundException('Botão não encontrado!')
        }

        button.label = buttonDto.label ?? button.label
        button.link = buttonDto.link ?? button.link

        try {
            await button.save()
            return button
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar o botão')
        }
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const button = await this.buttonModel.findByPk(id)
        
        if (!button) {
            throw new NotFoundException('Botão não encontrado!')
        }

        await button.destroy();
        return { message: 'Botão deletado com sucesso' }
    }
}