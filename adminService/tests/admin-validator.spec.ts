import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { AdminValidatorService } from '../src/admin/admin-validator.service'
import { PasswordValidator } from '../src/admin/password.validator'

describe('AdminValidatorService', () => {
    let service: AdminValidatorService

    beforeEach(async () => {
        const module: TestingModule =
            await Test.createTestingModule({
                providers: [
                    AdminValidatorService
                ]
            }).compile()

        service = module.get<AdminValidatorService>(
            AdminValidatorService
        )

        jest.clearAllMocks()
    })

    describe('validatePassword', () => {

        it('deve validar uma senha forte com sucesso', () => {

            jest.spyOn(
                PasswordValidator,
                'validatePasswordLevel'
            ).mockReturnValue({
                validate: true,
                requirements: {
                    hasUppercase: true,
                    hasLowercase: true,
                    hasNumber: true,
                    hasSpecialChar: true,
                    hasMinLength: true
                },
                message: 'Valid password'
            })

            expect(() => service.validatePassword('Senha@123')).not.toThrow()
            expect(
                PasswordValidator.validatePasswordLevel
            ).toHaveBeenCalledWith(
                'Senha@123'
            )
        })

        it('deve lançar BadRequestException para senha fraca', () => {

            jest.spyOn(
                PasswordValidator,
                'validatePasswordLevel'
            ).mockReturnValue({
                validate: false,
                requirements: {
                    hasUppercase: true,
                    hasLowercase: true,
                    hasNumber: true,
                    hasSpecialChar: true,
                    hasMinLength: false
                },
                message: 'Password does not meet minimum requirements'
            })

            expect(() =>
                service.validatePassword('123')
            ).toThrow(
                BadRequestException
            )

            expect(
                PasswordValidator.validatePasswordLevel
            ).toHaveBeenCalledWith(
                '123'
            )
        })

        it('deve retornar os requisitos da senha inválida', () => {

            jest.spyOn(
                PasswordValidator,
                'validatePasswordLevel'
            ).mockReturnValue({
                validate: false,
                requirements: {
                    hasUppercase: false,
                    hasLowercase: true,
                    hasNumber: true,
                    hasSpecialChar: true,
                    hasMinLength: false
                },
                message: 'Password does not meet minimum requirements'
            })

            try {
                service.validatePassword('123')
            } catch (error) {
                const exception = error as BadRequestException

                expect(exception.getResponse()).toEqual({
                    message: 'Senha muito fraca',
                    requirements: {
                        hasUppercase: false,
                        hasLowercase: false,
                        hasNumber: true,
                        hasSpecialChar: false,
                        hasMinLength: false
                    }
                })
            }
        })
    })
})