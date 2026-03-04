import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                // Standard user object for the app
                const userData = {
                    name: fbUser.displayName || fbUser.email.split('@')[0],
                    email: fbUser.email,
                    uid: fbUser.uid,
                    photoURL: fbUser.photoURL
                };
                setUser(userData);
                localStorage.setItem('skill_academy_user', JSON.stringify(userData));
                // You can also get the ID token if needed for API calls
                // const token = await fbUser.getIdToken();
            } else {
                setUser(null);
                localStorage.removeItem('skill_academy_user');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const value = {
        user,
        loading,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
