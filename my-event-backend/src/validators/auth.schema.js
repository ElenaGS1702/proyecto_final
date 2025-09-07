import { z } from "zod";

const allowedRoles = ['user', 'organizer', 'staff', 'admin'];

export const registerSchema = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
    role: z.string()
        .transform(r => r?.trim().toLowerCase())
        .optional()
        .transform(r => (r && allowedRoles.includes(r)) ? r : undefined)
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128)
})