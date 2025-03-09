import { Batch, BatchResponse, NewBatch } from '@/types/batch'
import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getBatches = async (): Promise<Batch[]> => {
  const response = await axios.get(`${API_URL}/batch`)
  return response.data as Batch[]
}

export const getBatch = async (id: string): Promise<Batch> => {
  const response = await axios.get(`${API_URL}/batch/${id}`)
  return response.data as Batch
}

export const createBatch = async (
  batch: NewBatch,
): Promise<axios.AxiosResponse<Batch | BatchResponse>> => {
  try {
    const response = await axios.post(`${API_URL}/batch`, batch)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<BatchResponse>
  }
}

export const updateBatch = async (
  id: string,
  batch: NewBatch,
): Promise<axios.AxiosResponse<Batch | BatchResponse>> => {
  try {
    const response = await axios.put(`${API_URL}/batch/${id}`, batch)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<BatchResponse>
  }
}

export const deleteBatch = async (
  id: string,
): Promise<axios.AxiosResponse<Batch | BatchResponse>> => {
  try {
    const response = await axios.delete(`${API_URL}/batch/${id}`)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<BatchResponse>
  }
}
