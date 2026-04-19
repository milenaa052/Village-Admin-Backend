export interface JwtPayload {
    idUser: number;
    name: string;
    email: string;
    userType: 'ADMIN';
}

export interface AuthenticatedUser {
    idUser: number;
    name: string;
    email: string;
    userType: 'ADMIN';
}