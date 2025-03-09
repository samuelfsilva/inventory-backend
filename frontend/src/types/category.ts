export interface Category {
  id: string
  description: string
  isActive: boolean
}

export interface NewCategory {
  description: string
}

export interface PutCategory {
  description: string
  isActive: boolean
}

export interface CategoryReview {
  description?: string
  isActive?: string
}

export interface CategoryResponse {
  error: CategoryReview
}
