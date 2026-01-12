

export interface Report {
  id: number;
  reportedBy: string;
  reportType: string;
  incidentType: string;
  title: string;
  status: "Submitted" | "Pending" | string;
  description: string;
  location?: {
    village: string;
    cell: string;
    sector: string;
    district: string;
  };
  reportDate: Date
}