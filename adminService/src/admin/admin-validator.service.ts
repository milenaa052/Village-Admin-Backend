import { BadRequestException, Injectable } from "@nestjs/common"
import { PasswordValidator } from "./password.validator"

@Injectable()
export class AdminValidatorService {

    validatePassword(password: string) {

        const validation =
            PasswordValidator.validatePasswordLevel(
                password
            )

        if (!validation.validate) {

            throw new BadRequestException({
                message: 'Senha muito fraca',
                requirements: validation.requirements
            })
        }
    }
}