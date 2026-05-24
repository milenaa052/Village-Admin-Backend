export class PasswordValidator {
    static validatePasswordLevel(password: string) {
        const requirements = {
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[@#$%&*°?]/.test(password),
            hasMinLength: password.length >= 8
        }

        const validate = Object.values(requirements).every(Boolean)
        return {
            validate,
            requirements,
            message: validate
                ? 'Valid password'
                : 'Password does not meet minimum requirements'
        }
    }
}