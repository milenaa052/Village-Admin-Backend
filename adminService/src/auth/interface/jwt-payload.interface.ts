export type UserType = 'ADMIN'

export interface JwtPayload {
    idUser: number
    name: string
    email: string
    userType: UserType
}

export interface AuthenticatedUser {
    idUser: number
    name: string
    email: string
    userType: UserType
}