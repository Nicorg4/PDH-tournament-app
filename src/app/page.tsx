'use client'

import React, { useEffect } from 'react';
import Image from 'next/image';

import LoginForm from './components/LoginForm';
import Logo from '../../public/logo.png'
import Background from '../../public/background.jpg'
import Background2 from '../../public/background2.jpg'

const Login: React.FC = () => {

  return (
      <main className="flex min-h-screen items-center justify-center bg-gray-800" style={{ backgroundImage: `url(${Background2.src})`, backgroundSize: 'cover', backgroundPosition: 'right' }}>
        <div className="lg:flex hidden w-1/2 bg-[#231f20] items-center justify-center min-h-screen rounded-br-[300px]" style={{ backgroundImage: `url(${Background.src})`, backgroundSize: 'cover', backgroundPosition: 'right', boxShadow: "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"}}>
          <Image
            src={Logo}
            alt="Descripción de la imagen"
            width={500}
            height={300}
          />
        </div>
        <div className="w-1/2 flex min-h-screen items-center justify-center">
          <LoginForm />
        </div>
      </main>
  );
};

export default Login;
