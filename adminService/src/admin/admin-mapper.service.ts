import { Injectable } from "@nestjs/common"
import { Admin } from "./admin.model"
import { AdminResponseDto } from "./interface/admin-response.dto"

@Injectable()
export class AdminMapperService {

    toResponse(admin: Admin): AdminResponseDto {

        return {
            idAdmin: admin.idAdmin,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            type: admin.type,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        }
    }
}