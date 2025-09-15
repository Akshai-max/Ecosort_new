'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Reports from '../components/Reports';

interface ManagerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  zoneId?: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [manager, setManager] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        console.log('Fetching manager profile...');
        const response = await fetch('/api/manager/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, redirecting to login');
            router.push('/manager/login');
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch manager data');
        }
        
        const data = await response.json();
        console.log('Manager data received:', data);
        setManager(data.manager);
      } catch (err: any) {
        console.error('Error fetching manager data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => router.push('/manager/login')} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Reports managerId={manager?.id} />
    </div>
  );
}

