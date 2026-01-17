

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

export interface EvidenceWithReportAndUser {
  id: number;
  reportId: number;
  reportTitle: string;
  reportType: string;
  uploadedBy: number;
  userName: string;
  userPhone?: string;
  url: string;
  type: 'image' | 'video';
  createdAt: Date | null;
}

// export interface Evidence {
//   id: number;
//   reportId: number;
//   uploadedBy: number;
//   url: string;
//   type: 'image' | 'video'; // stricter than string
//   createdAt: Date | null;
// }
