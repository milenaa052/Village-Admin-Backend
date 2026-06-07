import { UserType } from './jwt-payload.interface'

export interface AuthUserResponse {
    idUser: number
    name: string
    email: string
    userType: UserType
}

export interface LoginResponse {
    message: string
    token: string
    user: AuthUserResponse
}

export interface ProfileResponse {
    message: string
    user: AuthUserResponse
}