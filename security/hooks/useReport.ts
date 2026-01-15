import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from "@/lib/api";
import { Report } from '@/types';

type CreateReportPayload = Omit<Report, "id" | "reportedBy" | "status" | "createdAt">;

const useReport = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const response = await api.get<{ reports: Report[] }>(`/reports`);
        return response.data.reports;
      } catch (err) {
        console.error("📡 API FETCH ERROR:", err);
        throw err;
      }    
    },
  });

  const createReportMutation = useMutation<Report, any, CreateReportPayload>({
    mutationFn: async (newReport: CreateReportPayload) => {
      const { data } = await api.post<Report>(`/reports/create`, newReport);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error) => {
      console.error("❌ Error creating report:", error);
    }
  });

  return {
    reports: data ?? [],
    isLoading,
    isError,
    createReport: createReportMutation.mutate,
    isCreating: createReportMutation.isPending,
  };
};

export default useReport;
