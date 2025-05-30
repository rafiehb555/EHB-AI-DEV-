import React from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import SimplifiedDashboard from '../components/dashboard/SimplifiedDashboard';

export default function Dashboard() {
  const siteConfig = useSiteConfig();

  return (
    <DashboardLayout activeItem="dashboard">
      <Head>
        <title>{`${siteConfig.title} | Dashboard`}</title>
      </Head>
      
      <SimplifiedDashboard />
    </DashboardLayout>
  );
}