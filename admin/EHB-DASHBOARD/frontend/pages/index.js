import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * Index Page
 * Redirects to the dashboard
 */
export default function Home() {
  const router = useRouter();
  
  // Redirect to dashboard on mount
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>EHB System</title>
        <meta name="description" content="Enterprise Hybrid Blockchain System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <h2 className="mt-6 text-xl font-semibold text-gray-900">
          Loading EHB System...
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we redirect you to the dashboard.
        </p>
      </div>
    </div>
  );
}