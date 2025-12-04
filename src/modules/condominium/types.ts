export interface CondominiumEntityData {
  message: string
  condominium_entitie: {
    id: string
    condominiumId: string
    title: string
    address?: string | null
    whatsapp?: string | null
    phone?: string | null
    email?: string | null
    createdAt: Date
    updatedAt: Date
  }
}

export interface CondominiumData {
  id: string
  name: string
  address: string
  cnpj: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateCondominiumResponse {
  message: string
  condominium: CondominiumData
}

export interface UpdateCondominiumResponse {
  message: string
  condominium: CondominiumData
}

export interface DeleteCondominiumResponse {
  message: string
}

export interface ListCondominiumsResponse {
  items: CondominiumData[]
}

export interface GetCondominiumResponse {
  condominium: CondominiumData
}

export interface getCondominiumEntitiesResponse {
  condominium_entities: {
    id: string
    condominiumId: string
    title: string
    address: string
    whatsapp: string
    phone: string
    email: string
    order: number
    createdAt: string
    updatedAt: string
  }[]
}
