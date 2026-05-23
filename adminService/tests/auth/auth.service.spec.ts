import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../../src/admin/admin.service';

describe('AuthService', () => {

    let service: AuthService;

    const mockAdminService = {
        findByEmail: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: AdminService,
                    useValue: mockAdminService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('deve lançar erro se usuário não existir', async () => {

        mockAdminService.findByEmail.mockResolvedValue(null);

        await expect(
            service.validateUser('teste@email.com', '123')
        ).rejects.toThrow(UnauthorizedException);
    });
});