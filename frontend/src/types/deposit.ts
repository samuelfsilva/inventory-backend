export interface Deposit {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface NewDeposit {
  name: string
  description: string
}

export interface PutDeposit {
  name: string
  description: string
  isActive: boolean
}

export interface DepositReview {
  name?: string
  description?: string
  isActive?: string
}

export interface DepositResponse {
  error: DepositReview
}
