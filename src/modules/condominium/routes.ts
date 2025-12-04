import { Hono } from 'hono'
import {
  createCondominiumSchema,
  createEntitySchema,
  deleteCondominiumSchema,
  removeEntitySchema,
  updateCondominiumSchema,
  updateEntitySchema,
} from './dto'
import z from 'zod'
import {
  createCondominium,
  createCondominiumEntity,
  deleteCondominium,
  getCondominiumById,
  getCondominiumEntities,
  listCondominiums,
  removeCondominiumEntity,
  updateCondominium,
  updateCondominiumEntity,
} from './service'
import { isAuthenticated, requireRole } from '../auth/middleware'

export const condominium = new Hono()

condominium.post('/create-condominium', requireRole('MASTER'), async c => {
  const json = await c.req.json()
  const parsed = createCondominiumSchema.safeParse(json)

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: 'Validation error',
        data: z.treeifyError(parsed.error),
      },
      400
    )
  }

  const response = await createCondominium(parsed.data)
  return c.json(response, response.success ? 200 : 400)
})

condominium.put('/update', requireRole('MASTER'), async c => {
  const json = await c.req.json()
  const parsed = updateCondominiumSchema.safeParse(json)

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: 'Validation error',
        data: z.treeifyError(parsed.error),
      },
      400
    )
  }

  const response = await updateCondominium(parsed.data)
  return c.json(response, response.success ? 200 : 400)
})

condominium.delete('/delete', requireRole('MASTER'), async c => {
  const json = c.req.json()
  const parsed = deleteCondominiumSchema.safeParse(json)

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: 'Validation error',
        data: z.treeifyError(parsed.error),
      },
      400
    )
  }

  const response = await deleteCondominium(parsed.data.id)
  return c.json(response, response.success ? 200 : 400)
})

condominium.get('/list', isAuthenticated, async c => {
  const response = await listCondominiums()
  return c.json(response)
})

condominium.get('/:id', isAuthenticated, async c => {
  const id = c.req.param('id')
  const response = await getCondominiumById(id)
  return c.json(response, response.success ? 200 : 404)
})

condominium.post('/create-entity', requireRole('MASTER', 'ADMIN', 'MANAGER'), async c => {
  const json = await c.req.json()
  const parsed = createEntitySchema.safeParse(json)

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: 'Validation error',
        data: z.treeifyError(parsed.error),
      },
      400
    )
  }

  const response = await createCondominiumEntity(parsed.data)
  return c.json(response, response.success ? 200 : 400)
})

condominium.put('/update-entity', requireRole('MASTER', 'ADMIN', 'MANAGER'), async c => {
  const json = await c.req.json()
  const parsed = updateEntitySchema.safeParse(json)

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: 'Validation error',
        data: z.treeifyError(parsed.error),
      },
      400
    )
  }

  const response = await updateCondominiumEntity(parsed.data)
  return c.json(response, response.success ? 200 : 400)
})

condominium.delete(
  '/delete-entity',
  requireRole('MASTER', 'ADMIN', 'MANAGER'),
  async c => {
    const json = await c.req.json()
    const parsed = removeEntitySchema.safeParse(json)

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: 'Validation error',
          data: z.treeifyError(parsed.error),
        },
        400
      )
    }

    const response = await removeCondominiumEntity(parsed.data.id)
    return c.json(response, response.success ? 200 : 400)
  }
)

condominium.get('/entity/:condominiumId', isAuthenticated, async c => {
  const condominiumId = c.req.param('condominiumId')

  const response = await getCondominiumEntities(condominiumId)

  return c.json(response, response.success ? 200 : 404)
})
