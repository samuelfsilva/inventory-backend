import { Group, GroupResponse, NewGroup } from '@/types/group'
import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getGroups = async (): Promise<Group[]> => {
  const response = await axios.get(`${API_URL}/group`)
  return response.data as Group[]
}

export const getGroup = async (id: string): Promise<Group> => {
  const response = await axios.get(`${API_URL}/group/${id}`)
  return response.data as Group
}

export const createGroup = async (
  group: NewGroup,
): Promise<axios.AxiosResponse<Group | GroupResponse>> => {
  try {
    const response = await axios.post(`${API_URL}/group`, group)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<GroupResponse>
  }
}

export const updateGroup = async (
  id: string,
  group: NewGroup,
): Promise<axios.AxiosResponse<Group | GroupResponse>> => {
  try {
    const response = await axios.put(`${API_URL}/group/${id}`, group)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<GroupResponse>
  }
}

export const deleteGroup = async (
  id: string,
): Promise<axios.AxiosResponse<Group | GroupResponse>> => {
  try {
    const response = await axios.delete(`${API_URL}/group/${id}`)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response as unknown as axios.AxiosResponse<GroupResponse>
  }
}
