import React, { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useRouter } from 'next/router';
import { getAllAnalytics } from '../../../services/analyticsService';

const Reports = () => {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState('user_activity');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const reportTypes = [
    { id: 'user_activity', name: 'User Activity Report', description: 'Detailed user engagement and activity metrics' },
    { id: 'system_performance', name: 'System Performance Report', description: 'Server metrics, response times, and error rates' },
    { id: 'business_metrics', name: 'Business Metrics Report', description: 'Revenue, transactions, and conversion rates' },
    { id: 'content_analytics', name: 'Content Analytics Report', description: 'Content engagement and performance metrics' },
    { id: 'geographic_distribution', name: 'Geographic Distribution Report', description: 'User distribution by geographic region' },
  ];

  const dateRanges = [
    { id: 'last_7_days', name: 'Last 7 Days' },
    { id: 'last_30_days', name: 'Last 30 Days' },
    { id: 'last_90_days', name: 'Last 90 Days' },
    { id: 'year_to_date', name: 'Year to Date' },
    { id: 'custom', name: 'Custom Range' },
  ];

  const exportFormats = [
    { id: 'pdf', name: 'PDF Document' },
    { id: 'csv', name: 'CSV Spreadsheet' },
    { id: 'excel', name: 'Excel Spreadsheet' },
    { id: 'json', name: 'JSON Data' },
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call a backend API to generate the report
      // For demo purposes, we'll simulate a delay and then show success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, we'll pretend we got a download URL from the server
      setGeneratedReport({
        id: `report-${Date.now()}`,
        name: reportTypes.find(r => r.id === selectedReport).name,
        format: format,
        dateRange: dateRanges.find(r => r.id === dateRange).name,
        url: '#', // This would be a real download URL in production
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head></Head>
        <title>Analytics Reports | EHB Admin</title>
      </Head><DashboardLayout></DashboardLayout>Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Analytics Reports</h1>
            <p className="text-muted-foreground">Generate and export detailed analytics reports</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-card rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Report Configuration</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Report Type
                    </label>
                    <select
                      value={selectedReport}
                      onChange={(e) => setSelectedReport(e.target.value)}
                      className="block w-full rounded-md border border-input shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                    >
                      {(reportTypes || []).map((report) => (
                        <option key={report.id} value={report.id}>
                          {report.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {reportTypes.find(r => r.id === selectedReport)?.description}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Date Range
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="block w-full rounded-md border border-input shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                    >
               (dateRanges || []).map((ges || []).map((range) => (
                        <option key={range.id} value={range.id}>
                          {range.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="block w-full rounded-md border border-input shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="block w-full rounded-md border border-input shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Export Format
                    </label>
                    <div className="flex flex-wrap gap-3">
       (exportFormats || (portFormats || []).map((ats || []).map((exportFormat) => (
                        <div key={exportFormat.id} className="flex items-center">
                          <input
                            id={`format-${exportFormat.id}`}
                            type="radio"
                            name="format"
                            value={exportFormat.id}
                            checked={format === exportFormat.id}
                            onChange={() => setFormat(exportFormat.id)}
                            className="h-4 w-4 text-primary border-input focus:ring-primary"
                          />
                          <label
                            htmlFor={`format-${exportFormat.id}`}
                            className="ml-2 block text-sm text-foreground"
                          >
                            {exportFormat.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Report...
                        </>
                      ) : (
                        'Generate Report'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {generatedReport && (
                <div className="mt-6 bg-card rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Report Ready</h2>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Ready to download
                    </span>
                  </div>
                  
                  <div className="border-t border-b border-muted py-4 my-4">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Report Name</dt>
                        <dd className="mt-1 text-sm text-foreground">{generatedReport.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Date Range</dt>
                        <dd className="mt-1 text-sm text-foreground">{generatedReport.dateRange}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Format</dt>
                        <dd className="mt-1 text-sm text-foreground uppercase">{generatedReport.format}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {new Date(generatedReport.createdAt).toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => alert('In a real implementation, this would download the report file')}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Report
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Your recently generated reports will appear here.</p>
                  
                  <div className="border-t border-muted pt-4">
                    <ul className="divide-y divide-gray-200">
                      {generatedReport && (
                        <li className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-foreground">{generatedReport.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(generatedReport.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => alert('In a real implementation, this would download the report file')}
                              className="text-primary hover:text-primary/80"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      )}
                      
                      {!generatedReport && (
                        <li className="py-3 text-sm text-muted-foreground italic">
                          No recent reports
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-card rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Schedule Reports</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Set up recurring reports to be automatically generated and sent to your email.
                </p>
                <button
                  onClick={() => alert('Coming soon: Schedule recurring reports')}
                  className="inline-flex items-center justify-center w-full px-4 py-2 border border-input shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Schedule a Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Reports;