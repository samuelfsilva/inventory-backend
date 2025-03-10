export interface Category {
  id: string
  description: string
  status: boolean
}

export interface NewCategory {
  description: string
}

export interface PutCategory {
  description: string
  status: boolean
}

export interface CategoryReview {
  description?: string
  status?: string
}

export interface CategoryResponse {
  error: CategoryReview
}
