export interface Deposit {
  id: string
  name: string
  description: string
  status: boolean
}

export interface NewDeposit {
  name: string
  description: string
}

export interface PutDeposit {
  name: string
  description: string
  status: boolean
}

export interface DepositReview {
  name?: string
  description?: string
  status?: string
}

export interface DepositResponse {
  error: DepositReview
}
