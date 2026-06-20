import { Controller, Post, Get, Put, Req, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common'
import { AdminService } from './admin.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { AuthGuard } from '@nestjs/passport'
import { AuthRequest } from '../auth/interface/auth-request.interface'
import { AdminRecoverPassService } from './admin-recover-pass.service'
import { ResetPasswordDto } from './dto/reset-pass.dto'

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly adminRecoverPassService: AdminRecoverPassService
    ) {}

    @Post()
    async create(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.create(createAdminDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll() {
        return this.adminService.findAll()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.findById(id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAdminDto: UpdateAdminDto,
        @Req() req: AuthRequest,
    ) {
        const loggedAdmin = req.user.idUser
        return this.adminService.update(id, loggedAdmin, updateAdminDto)
    }

    @Post('recover-password')
    async recoverPassword(@Body('email') email: string) {
        await this.adminRecoverPassService.recoverPassword(email)

        return {
            message: 'Código de recuperação enviado para o e-mail informado'
        }
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        await this.adminRecoverPassService.resetPassword(resetPasswordDto)

        return {
            message: 'Senha redefinida com sucesso'
        }
    }
}