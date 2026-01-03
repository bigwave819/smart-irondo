import axiosInstance from './axios'

export const useUsers = {
    create: async (formdata) => {
        const { data } = await axiosInstance.post(`/admin/create`, formdata)
        return data
    },

    getAllUsers: async () => {
        const { data } = await axiosInstance.get(`/admin/users`)
        return data
    },

    deactivateUser: async () => {
        const { data } = await axiosInstance.patch(`/admin/users/:id/deactivate`)
    }
}

export const useEvidence = {
    getAllEvidences: async () => {
        const { data } = await axiosInstance('/admin/evidence')
        return data
    },

    updateEvidence: async () => {
        const { data } = await axiosInstance.patch('/admin/evidence/:id/status')
        return data
    }   
}

export const useReports = {
    getAllReports: async () => {
        const { data } = await axiosInstance.get('/admin/reports')
        return data
    },
}