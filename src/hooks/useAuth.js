import { useRecoilState } from 'recoil';
import { userState } from '../recoil/atoms/userAtom';

export const useAuth = () => {
    const [user, setUser] = useRecoilState(userState);

    const login = (userData) => {
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
