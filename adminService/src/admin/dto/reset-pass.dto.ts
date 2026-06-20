export interface ResetPasswordDto {
    email: string
    recoveryCode: string
    newPassword: string
}