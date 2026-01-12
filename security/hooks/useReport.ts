import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from "@/lib/api"
import { Report } from '@/types';


const report = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['reports'],
        queryFn: async () => {
            const { data } = await api.get<Report[]>(`/reports/view`);
            return data
        }
    })

    const createReportMutation = useMutation({
        mutationFn: async (newReport: Omit<Report, "id">) => {
            const { data } = await api.post<Report>(`/report/create`, newReport);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });

    return {
    reports: data ?? [],
    isLoading,
    isError,
    createReport: createReportMutation.mutate,
    isCreating: createReportMutation.isPending,
  };

}

export default report