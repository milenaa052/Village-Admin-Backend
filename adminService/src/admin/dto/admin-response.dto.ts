import { UserType } from "../admin.interface"

export class AdminResponseDto {
  idAdmin!: number;
  name!: string;
  email!: string;
  phone!: string;
  type!: UserType;
  createdAt!: Date;
  updatedAt!: Date;
}