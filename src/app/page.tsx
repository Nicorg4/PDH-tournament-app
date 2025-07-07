'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import LoginForm from './components/LoginForm';
import Logo from '../../public/logo2.png';
import Background from '../../public/background.jpg';
import Background2 from '../../public/background2.jpg';
import Notification from './components/notification';

const LoginClient: React.FC = () => {
  const { useEffect, useState } = React;
  const { useDispatch } = require('react-redux');
  const { setLogout } = require('../redux/Features/user/userSlice');
  const { useSearchParams } = require('next/navigation');

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get('sessionExpired');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (sessionExpired) {
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      dispatch(setLogout());
    }
  }, [sessionExpired, dispatch]);

  return (
    <>
      <div className="w-1/2 flex min-h-screen items-center justify-center">
        <LoginForm />
      </div>
      {showNotification && <Notification type="error" message="La sesión ha finalizado." timer={5000} closeNotification={() => setShowNotification(false)}/>}
    </>
  );
};

const Login: React.FC = () => {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-slate-800"
      style={{
        backgroundImage: `url(${Background2.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right',
      }}
    >
      <div
        className="lg:flex hidden w-1/2 bg-[#231f20] items-center justify-center min-h-screen rounded-br-[300px]"
        style={{
          backgroundImage: `url(${Background.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right',
          boxShadow:
            'rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px',
        }}
      >
        <Image src={Logo} alt="Logo" width={500} height={300} />
      </div>
      <Suspense fallback={<div className="w-1/2 flex min-h-screen items-center justify-center"></div>}>
        <LoginClient />
      </Suspense>
    </main>
  );
};

export default Login;
