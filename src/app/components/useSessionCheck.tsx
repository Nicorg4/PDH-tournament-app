// hooks/useSessionCheck.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../redux/Features/user/userSlice';
import { RootState } from '../../redux/store';

const useSessionCheck = (isLoggingOut: boolean) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);

  if (typeof window === "undefined") return;

  if (isLoggingOut) {
    return;
  }

  if (!token || !user) {
    router.push('/?sessionExpired=true');
  }

  if (user && token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        dispatch(setLogout());
        router.push('/?sessionExpired=true');
      }
    } catch (error) {
      dispatch(setLogout());
      router.push('/?sessionExpired=true');
    }
  }
};
export default useSessionCheck;
