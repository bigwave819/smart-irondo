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
      const { data } = await api.get<Report[]>(`/reports/view`);
      return data;
    }
  });

  const createReportMutation = useMutation<Report, any, CreateReportPayload>({
    mutationFn: async (newReport: CreateReportPayload) => {
      // Log the full URL being used
      const fullUrl = `${api.defaults.baseURL}/reports/create`;
      console.log(`🚀 Request URL: ${fullUrl}`);
      console.log("📤 Sending report payload:", newReport);
      const { data } = await api.post<Report>(`/reports/create`, newReport);
      console.log("📥 Response from backend:", data); // ✅ log
      return data;
    },
    onSuccess: (data) => {
      console.log("✅ Report created successfully:", data);
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
