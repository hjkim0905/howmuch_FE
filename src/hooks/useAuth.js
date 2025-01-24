import { useRecoilState } from 'recoil';
import { userState } from '../recoil/atoms';

export const useAuth = () => {
    const [user, setUser] = useRecoilState(userState);

    const login = async (userData) => {
        console.log('Setting user state:', userData);
        setUser(userData);
        console.log('User state after update:', userData);
    };

    const logout = () => {
        setUser(null);
    };

    return {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };
};
