

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

export interface Evidence {
  id: number,
  reportId: number,
  uploadedBy: number,
  url: string
  type: string
  createdAt: Date | null 
}