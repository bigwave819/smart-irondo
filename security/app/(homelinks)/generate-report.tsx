import useReport from '@/hooks/useReport';
import GenerateReport from '@/components/GenerateReport';

export default function ReportsScreen() {
  const { reports, isLoading, isError } = useReport();

  return (
    <GenerateReport 
      reports={reports} 
      isLoading={isLoading} 
      isError={isError} 
    />
  );
}