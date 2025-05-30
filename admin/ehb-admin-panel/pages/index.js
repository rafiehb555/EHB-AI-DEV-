import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to home page
    router.replace('/home');
  }, [router]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      color: '#6b7280' 
    }}>
      Redirecting to Home...
    </div>
  );
}