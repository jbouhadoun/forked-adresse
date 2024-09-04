export type Revision = {
  _id: string
  codeCommune: string
  client: {
    _id: string
    nom: string
    mandataire: string
  }
  status: string
  ready: any
  validation: {
    valid: boolean
    validatorVersion: string
    errors: any[]
    warnings: any[]
    infos: any[]
    rowsCount: number
  }
  context: {
    extras: any
  }
  publishedAt: string
  createdAt: string
  updatedAt: string
  __v: number
  current: boolean
  habilitation: {
    _id: string
    codeCommune: string
    emailCommune: string
    strategy: any
    createdAt: string
    updatedAt: string
    expiresAt: string
  }
}
