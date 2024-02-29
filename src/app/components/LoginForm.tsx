'use client'
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setUser, UserData } from '../../redux/Features/user/userSlice';
import endpoint from '../../../endpoint'

const LoginForm: React.FC = () => {

  const [errorMessagge, setErrorMessagge] = useState('')

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
  
    const form = event.currentTarget as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;
  
    await loginUser(username, password);
  };

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await fetch(endpoint + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const { token } = await response.json();
        const decodedToken = jwt_decode(token) as UserData;
        dispatch(setUser(decodedToken));
        router.push('/home');
      } else {
        console.error('Error de autenticación');
        setErrorMessagge('Error al iniciar sesion')
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-96 bg-slate-50 bg-opacity-50 p-10 rounded-[30px]" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
      {errorMessagge && (
        <h2 className='text-[#c25454] font-bold'>
          {errorMessagge}
        </h2>
      )}
      <div className='flex flex-col text-[#02124a]'>
        <label htmlFor="username">Nombre de usuario</label>
        <input
          type="text"
          id="username"
          name="username"
          className="border p-3 rounded-[15px] text-[#02124a] bg-slate-50 bg-opacity-20 border-none"
          placeholder="Usuario.."
        />
      </div>
      <div className='flex flex-col text-[#02124a]'>
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          className="border p-3 rounded-[15px] text-black bg-slate-50 bg-opacity-20 border-none"
          placeholder="Contraseña.."
        />
      </div>
        <button type="submit" className="bg-[#02124a] text-white p-2 mt-4 rounded-[15px] hover:bg-opacity-80 transition-all duration-300" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
          Iniciar sesión
        </button>
    </form>
  );
};

export default LoginForm;
