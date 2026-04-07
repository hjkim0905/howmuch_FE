import { useRecoilState } from 'recoil';
import { userState } from '../recoil/atoms';

export const useAuth = () => {
    const [user, setUser] = useRecoilState(userState);

    const login = async (userData) => {
        setUser(userData);
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
