export interface Batch {
  id: string
  description: string
  expirationDate: Date
  product: {
    id: string
    name: string
  }
}

export interface NewBatch {
  description: string
  expirationDate: Date
  product: {
    id: string
    name: string
  }
}

export interface PutBatch {
  description: string
  expirationDate: Date
  product: {
    id: string
    name: string
  }
}

export interface BatchReview {
  description?: string
  expirationDate?: string
  productId?: string
}

export interface BatchResponse {
  error: BatchReview
}
