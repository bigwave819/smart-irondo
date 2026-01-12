

export interface Report {
  id: string;
    reportedBy: string;
    reportType: string;
    incidentType: string;
    title: string;
    description: string;
    location?: {
    village: string;
    cell: string;
    sector: string;
    district: string;
  };
}