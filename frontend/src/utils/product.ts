import { NewProduct, Product, ProductResponse } from '@/types/product'
import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/product`)
  return response.data as Product[]
}

export const getProduct = async (id: string): Promise<Product> => {
  const response = await axios.get(`${API_URL}/product/${id}`)
  return response.data as Product
}

export const createProduct = async (
  product: NewProduct,
): Promise<axios.AxiosResponse<Product | ProductResponse>> => {
  try {
    const response = await axios.post(`${API_URL}/product`, product)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<ProductResponse>
  }
}

export const updateProduct = async (
  id: string,
  product: NewProduct,
): Promise<axios.AxiosResponse<Product | ProductResponse>> => {
  try {
    const response = await axios.put(`${API_URL}/product/${id}`, product)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<ProductResponse>
  }
}

export const deleteProduct = async (
  id: string,
): Promise<axios.AxiosResponse<Product | ProductResponse>> => {
  try {
    const response = await axios.delete(`${API_URL}/product/${id}`)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<ProductResponse>
  }
}
