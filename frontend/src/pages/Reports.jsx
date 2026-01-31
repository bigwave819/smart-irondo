import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useReports } from "../lib/api";
import { Download, Search, Filter, FileText, Calendar, MapPin, AlertCircle } from 'lucide-react';

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  const {
    data: reports,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: useReports.getAllReports,
    select: (data) => data.reports,
  });

  // Filter reports based on search and filters
  const filteredReports = reports?.filter((report) => {
    const matchesSearch = report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.location?.district?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || report.status === statusFilter;
    const matchesType = !typeFilter || report.reportType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Get unique statuses and types from reports
  const statuses = [...new Set(reports?.map(r => r.status) || [])];
  const types = [...new Set(reports?.map(r => r.reportType) || [])];

  // Status color helper
  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
      'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
      'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
      'Pending': 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return colors[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredReports || filteredReports.length === 0) return;

    const headers = ['Title', 'Type', 'District', 'Sector', 'Status', 'Date'];
    const csvData = filteredReports.map(report => [
      report.title,
      report.reportType,
      report.location?.district || 'N/A',
      report.location?.sector || 'N/A',
      report.status,
      new Date(report.reportDate || report.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Download PDF report from backend
  const handleDownloadPDF = async (reportId) => {
    try {
      setDownloadingId(reportId);

      const token = localStorage.getItem("token")
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/reports/${reportId}/download`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setTypeFilter("");
  };

  const hasActiveFilters = searchQuery || statusFilter || typeFilter;

  return (
    <DashboardLayout activeMenu="Reports">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Reports
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {filteredReports?.length || 0} {filteredReports?.length === 1 ? 'report' : 'reports'} found
                </p>
              </div>
              
              {/* Export Button - Desktop */}
              <button
                onClick={handleExportCSV}
                disabled={!filteredReports || filteredReports.length === 0}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-4 sm:p-5 mb-6 shadow-lg shadow-slate-900/5">
            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                {/* Reset & Export Buttons */}
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="flex-1 sm:flex-none px-5 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
                    >
                      Clear Filters
                    </button>
                  )}
                  
                  {/* Export Button - Mobile */}
                  <button
                    onClick={handleExportCSV}
                    disabled={!filteredReports || filteredReports.length === 0}
                    className="flex sm:hidden flex-1 items-center justify-center gap-2 px-5 py-3 text-sm font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden shadow-xl shadow-slate-900/5">
            {isLoading && (
              <div className="flex items-center justify-center py-24 sm:py-32">
                <div className="text-center">
                  <div className="relative w-12 h-12 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm font-medium text-slate-600">Loading reports...</p>
                </div>
              </div>
            )}

            {isError && (
              <div className="flex items-center justify-center py-24 sm:py-32">
                <div className="text-center max-w-md px-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-red-600 font-semibold text-lg">Failed to load reports</p>
                  <p className="text-sm text-slate-500 mt-2">Please try refreshing the page</p>
                </div>
              </div>
            )}

            {!isLoading && !isError && filteredReports?.length === 0 && (
              <div className="flex items-center justify-center py-24 sm:py-32">
                <div className="text-center max-w-md px-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-700 font-semibold text-lg">No reports found</p>
                  <p className="text-sm text-slate-500 mt-2">
                    {hasActiveFilters ? 'Try adjusting your filters to see more results' : 'No reports are currently available'}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !isError && filteredReports?.length > 0 && (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {report.title}
                              </p>
                              {report.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {report.description}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-slate-700">{report.reportType}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-slate-900">
                                  {report.location?.district || 'N/A'}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {report.location?.sector || ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-slate-700">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {new Date(report.reportDate || report.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="px-3.5 py-2 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200">
                                View
                              </button>
                              <button
                                onClick={() => handleDownloadPDF(report.id)}
                                disabled={downloadingId === report.id}
                                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {downloadingId === report.id ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-3.5 h-3.5" />
                                    PDF
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">
                              {report.title}
                            </h3>
                            {report.description && (
                              <p className="text-xs text-slate-500 line-clamp-2">
                                {report.description}
                              </p>
                            )}
                          </div>
                          <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-500 font-medium">Type</span>
                            <p className="text-slate-900 mt-0.5">{report.reportType}</p>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Date</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <p className="text-slate-900">
                                {new Date(report.reportDate || report.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-slate-900 font-medium">
                              {report.location?.district || 'N/A'}
                            </span>
                            {report.location?.sector && (
                              <span className="text-slate-500"> • {report.location.sector}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <button className="flex-1 px-3.5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            View Details
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(report.id)}
                            disabled={downloadingId === report.id}
                            className="flex-1 px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {downloadingId === report.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                <span>Downloading...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                <span>Download PDF</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;