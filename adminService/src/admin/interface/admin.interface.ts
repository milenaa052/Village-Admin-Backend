export enum UserType {
    ADMIN = 'ADMIN'
}

export interface AdminCreationAttributes {
    name: string
    email: string
    password: string
    phone: string
    type: UserType
}