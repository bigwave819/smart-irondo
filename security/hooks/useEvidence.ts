import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Evidence } from "@/types";

export const useEvidence = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // Fetch all evidence
  const { data, isLoading, isError } = useQuery<Evidence[]>({
    queryKey: ['evidences'],
    queryFn: async () => {
      const response = await api.get('/evidences');
      return response.data;
    }
  });

  const createEvidenceMutation = useMutation({
    mutationFn: async ({ reportId, fileUrl }: { reportId: number; fileUrl: string }) => {
      const fileName = fileUrl.split('/').pop() || 'evidence.jpg';
      const ext = fileName.split('.').pop()?.toLowerCase();
      let type = 'image/jpeg';
      if (ext === 'png') type = 'image/png';
      else if (ext === 'webp') type = 'image/webp';

      const formData = new FormData();
      formData.append('reportId', reportId.toString());

      // Send file as "url" for backend
      formData.append('url', {
        uri: fileUrl,
        name: fileName,
        type,
      } as any);

      const { data } = await api.post('/evidence/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidences'] });
    }
  });

  return {
    evidences: data ?? [],
    isLoading,
    isError,
    createEvidence: createEvidenceMutation.mutate,
    isCreating: createEvidenceMutation.isPending
  };
};