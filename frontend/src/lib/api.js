import axiosInstance from './axios'

export const useUsers = {
    create: async () => {
        const { data } = await axiosInstance(`//`)
        return data
    }
}