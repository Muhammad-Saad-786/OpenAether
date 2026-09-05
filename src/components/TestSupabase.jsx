// src/components/TestSupabase.jsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function TestSupabase() {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) throw error;
        setStatus('✅ Supabase connected successfully!');
      } catch (error) {
        setStatus(`❌ Connection failed: ${error.message}`);
      }
    }
    testConnection();
  }, []);

  return <div className="p-4 text-center">{status}</div>;
}
