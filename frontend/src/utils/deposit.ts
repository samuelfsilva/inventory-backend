import { Deposit, DepositResponse, NewDeposit } from '@/types/deposit'
import { UnknownResponse } from '@/types/response'
import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getDeposits = async (): Promise<Deposit[]> => {
  const response = await axios.get(`${API_URL}/deposit`)
  return response.data as Deposit[]
}

export const getActiveDeposits = async (): Promise<Deposit[]> => {
  const response = await axios.get(`${API_URL}/deposit/active`)
  return response.data as Deposit[]
}

export const getDeposit = async (id: string): Promise<Deposit> => {
  const response = await axios.get(`${API_URL}/deposit/${id}`)
  return response.data as Deposit
}

export const createDeposit = async (
  deposit: NewDeposit,
): Promise<axios.AxiosResponse<Deposit | DepositResponse>> => {
  try {
    const response = await axios.post(`${API_URL}/deposit`, deposit)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<DepositResponse>
  }
}

export const updateDeposit = async (
  id: string,
  deposit: NewDeposit,
): Promise<axios.AxiosResponse<Deposit | DepositResponse>> => {
  try {
    const response = await axios.put(`${API_URL}/deposit/${id}`, deposit)
    return response
  } catch (error) {
    const axiosError = error as AxiosError<UnknownResponse>
    return axiosError?.response as unknown as axios.AxiosResponse<DepositResponse>
  }
}

export const deleteDeposit = async (
  id: string,
): Promise<axios.AxiosResponse<string | DepositResponse>> => {
  try {
    const response = await axios.delete(`${API_URL}/deposit/${id}`)
    return response as axios.AxiosResponse<string>
  } catch (error) {
    const axiosError = error as AxiosError<UnknownResponse>
    return axiosError.response as unknown as axios.AxiosResponse<DepositResponse>
  }
}
