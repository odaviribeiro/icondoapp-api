import { z } from 'zod'

export const SignUpSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  acceptedTerms: z.boolean(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  password: z.string().min(6),
})

export type SignUpDTO = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type SignInDTO = z.infer<typeof SignInSchema>
