import { useApi } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'


export const useNotifications = () => {
    const api = useApi()
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await api.get('/notifications')
            return data
        }
    })

    const createNotification = useMutation({
        mutationFn: async () => {
            const { data } = await api.post('/send')
            return data
        }
    });

    return {
        notifications: data ?? [],
        isError,
        isLoading,
        createNotification: createNotification.mutate,
        isSendingNotifications: createNotification.isPending
    }
}