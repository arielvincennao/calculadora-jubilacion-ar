import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type Profile = {
  id: string;
  name: string;
  role: 'Invitado' | 'Verificado';
  created_at: string;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const supabase = createClient();
        
        // Intentar obtener el perfil existente
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

          console.log('Profile loaded successfully:', data);
          setProfile(data);
        
        
      } catch (err) {
        console.error('Error in useProfile:', err);
        
        let errorMessage = 'Error al cargar el perfil';
        
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'object' && err !== null) {
          if ('message' in err) {
            errorMessage = String(err.message);
          } else if ('details' in err) {
            errorMessage = String(err.details);
          } else {
            errorMessage = JSON.stringify(err);
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
} 