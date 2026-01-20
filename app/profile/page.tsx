'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Guard } from '../components/Guard';
import ProfileCard from '../components/ProfileCard';
import { useHasRole } from '../hooks/useRole';

function ProfileContent() {
    const router = useRouter();
    const { user, isLoading, uploadProfilePhoto, updateProfile, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <ProfileCard
                        user={user}
                        onUploadPhoto={uploadProfilePhoto}
                        onUpdateProfile={updateProfile}
                        onLogout={handleLogout}
                        goBacktoAdminPanel={useHasRole('agent')}
                    />
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Guard>
            <ProfileContent />
        </Guard>
    );
}
