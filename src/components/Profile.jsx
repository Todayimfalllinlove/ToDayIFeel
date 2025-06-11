import { useState, useEffect } from 'react';
import { supabase } from '../js/supabaseClient'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser'; 
import UserProfile from '../components/UserProfile'

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null); 
    const [error, setError] = useState(null);

    const user = useUser(); 
    const navigate = useNavigate();

    // Effect for loading when user changed
    useEffect(() => {
        async function fetchUserProfile() {
            setLoading(true);
            setError(null);

            if (!user || !user.id) {
                navigate('/auth'); /
                setLoading(false);
                return;
            }

            try {
                // pull all data from 'profiles'table
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url') 
                    .eq('id', user.id)
                    .single();

                if (error && status !== 406) { 
                    throw error;
                }

                if (data) {
                    setProfile(data); // Stored all data to state profile
                } else {
                    setProfile({ full_name: '', avatar_url: null });
                }
            } catch (err) {
                console.error('Error fetching profile:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUserProfile();
    }, [user, navigate]); 

    return (
        <div className="profile-page flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-6">Your Profile Page</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <p>Loading profile...</p>
            ) : (
                profile && ( 
                    <UserProfile
                        user={user}
                        profile={profile}
                        setProfile={setProfile} 
                    />
                )
            )}
        </div>
    );
}