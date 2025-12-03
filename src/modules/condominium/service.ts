import { getDb } from '../../db/db'
import { condominiumEntities, condominiums } from '../../db/schema'
import {
  CreateCondominiumDto,
  CreateEntityDto,
  UpdateCondominiumDto,
  UpdateEntityDto,
} from './dto'
import { GlobalResponse } from '../../types/http'
import {
  CondominiumEntityData,
  CreateCondominiumResponse,
  DeleteCondominiumResponse,
  GetCondominiumResponse,
  ListCondominiumsResponse,
  UpdateCondominiumResponse,
} from './types'
import { eq } from 'drizzle-orm'

export async function createCondominium(
  dto: CreateCondominiumDto
): Promise<GlobalResponse<CreateCondominiumResponse>> {
  const db = getDb()

  try {
    const inserted = await db.insert(condominiums).values(dto).returning()

    return {
      success: true,
      error: null,
      data: {
        message: 'Condominium created successfully.',
        condominium: inserted[0],
      },
    }
  } catch (err: any) {
    if (err.cause.code === '23505') {
      return {
        success: false,
        error: 'CONDOMINIUM_ALREADY_EXISTS',
        data: null,
      }
    }

    return {
      success: false,
      error: 'INTERNAL_ERROR',
      data: null,
    }
  }
}

export async function updateCondominium(
  dto: UpdateCondominiumDto
): Promise<GlobalResponse<UpdateCondominiumResponse>> {
  const db = getDb()

  const { id, ...fields } = dto

  const updated = await db
    .update(condominiums)
    .set({
      ...fields,
      updatedAt: new Date(),
    })
    .where(eq(condominiums.id, id))
    .returning()

  if (!updated.length) {
    return { success: false, error: 'CONDOMINIUM_NOT_FOUND' }
  }

  return {
    success: true,
    error: null,
    data: {
      message: 'Condominium updated successfully.',
      condominium: updated[0],
    },
  }
}

export async function deleteCondominium(
  id: string
): Promise<GlobalResponse<DeleteCondominiumResponse>> {
  const db = getDb()

  const deleted = await db.delete(condominiums).where(eq(condominiums.id, id)).returning()

  if (!deleted.length) {
    return { success: false, error: 'CONDOMINIUM_NOT_FOUND' }
  }

  return {
    success: true,
    error: null,
    data: {
      message: 'Condominium deleted successfully.',
    },
  }
}

export async function listCondominiums(): Promise<
  GlobalResponse<ListCondominiumsResponse>
> {
  const db = getDb()

  const rows = await db.select.bind(condominiums)

  return {
    success: true,
    error: null,
    data: { items: rows },
  }
}

export async function getCondominiumById(
  id: string
): Promise<GlobalResponse<GetCondominiumResponse>> {
  const db = getDb()

  const condo = await db.query.condominiums.findFirst({
    where: eq(condominiums.id, id),
  })

  if (!condo) return { success: false, error: 'CONDOMINIUM_NOT_FOUND' }

  return {
    success: true,
    error: null,
    data: { condominium: condo },
  }
}

export async function createCondominiumEntity(
  dto: CreateEntityDto
): Promise<GlobalResponse<CondominiumEntityData>> {
  const db = getDb()

  const result = await db.insert(condominiumEntities).values(dto).returning()

  return {
    success: true,
    error: null,
    data: {
      message: 'Success create condominium entity.',
      condominium_entitie: result[0],
    },
  }
}

export async function updateCondominiumEntity(
  dto: UpdateEntityDto
): Promise<GlobalResponse<CondominiumEntityData>> {
  const db = getDb()

  const { id, ...fields } = dto

  const updated = await db
    .update(condominiumEntities)
    .set({
      ...fields,
      updatedAt: new Date(),
    })
    .where(eq(condominiumEntities.id, id))
    .returning()

  if (!updated.length) {
    return {
      success: false,
      error: 'ENTITY_NOT_FOUND',
    }
  }

  return {
    success: true,
    error: null,
    data: {
      message: 'Entity updated successfully.',
      condominium_entitie: updated[0],
    },
  }
}

export async function removeCondominiumEntity(
  id: string
): Promise<GlobalResponse<{ message: string; id: string; title: string }>> {
  const db = getDb()

  const deleted = await db
    .delete(condominiumEntities)
    .where(eq(condominiumEntities.id, id))
    .returning()

  if (!deleted.length) {
    return {
      success: false,
      error: 'ENTITY_NOT_FOUND',
    }
  }

  return {
    success: true,
    error: null,
    data: {
      message: 'Entity deleted successfully.',
      id: deleted[0].id,
      title: deleted[0].title,
    },
  }
}
