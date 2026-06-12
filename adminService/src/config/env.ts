import * as dotenv from 'dotenv'
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    PASSWORD_SALT_ROUNDS: z.coerce.number(),
    JWT_SECRET: z.string(),
    JWT_EXPIRATION: z.string()
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    console.error("Invalid environment variables:", _env.error.format())
    throw new Error("Invalid environment variables")
}

export const env = _env.data