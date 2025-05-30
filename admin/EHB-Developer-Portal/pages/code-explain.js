import React from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import CodeExplainComponent from '../components/codeExplain/CodeExplainComponent';

export default function CodeExplainPage() {
  return (
    <>
      <Head>
        <title>AI Code Explanation | EHB Developer Portal</title>
        <meta name="description" content="Get AI-powered explanations of code snippets" />
      </Head>
      
      <DashboardLayout activeItem="code-explain">
        <div style={{ padding: '16px' }}>
          <CodeExplainComponent />
        </div>
      </DashboardLayout>
    </>
  );
}