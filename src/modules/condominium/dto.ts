import { z } from 'zod'

export const createCondominiumSchema = z.object({
  name: z.string().max(255).nonempty(),
  address: z.string().nonempty(),
  cnpj: z.string().length(18).nonempty(),
})

export const updateCondominiumSchema = z.object({
  id: z.uuid(),
  name: z.string().optional(),
  address: z.string().optional(),
})

export const deleteCondominiumSchema = z.object({
  id: z.uuid(),
})

export type CreateCondominiumDto = z.infer<typeof createCondominiumSchema>
export type UpdateCondominiumDto = z.infer<typeof updateCondominiumSchema>

export const createEntitySchema = z.object({
  condominiumId: z.uuid(),
  title: z.string().min(1),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  order: z.number().optional(),
})

export const updateEntitySchema = createEntitySchema
  .extend({
    id: z.uuid(),
  })
  .partial()
  .required({ id: true })

export const removeEntitySchema = createEntitySchema
  .extend({
    id: z.uuid(),
  })
  .partial()
  .required({ id: true })

export type CreateEntityDto = z.infer<typeof createEntitySchema>
export type UpdateEntityDto = z.infer<typeof updateEntitySchema>
export type RemoveEntityDto = z.infer<typeof removeEntitySchema>
