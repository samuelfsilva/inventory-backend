export interface Group {
  id: string
  description: string
}

export interface NewGroup {
  description: string
}

export interface GroupReview {
  description?: string
}

export interface GroupResponse {
  error: GroupReview
}
