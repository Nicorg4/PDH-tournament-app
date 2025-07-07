'use client'
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setToken, setUser, UserData } from '../../redux/Features/user/userSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MainButton from './mainButton';
import { RootState } from '@/redux/store';

const LoginForm: React.FC = () => {

  const [errorMessagge, setErrorMessagge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const loggedUser = useSelector((state: RootState) => state.user);

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
    setIsLoading(true);
    try {
      const response = await fetch(`${URL_SERVER}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar sesion');
      }
      const { token } = await response.json();
      const decodedToken = jwt_decode(token) as UserData;
      dispatch(setUser(decodedToken));
      dispatch(setToken(token));
      decodedToken.role === 'admin' ? router.push('/admin') : router.push('/home');
    } catch (error) {
      setErrorMessagge('Error al iniciar sesion')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-96 bg-slate-50 bg-opacity-70 p-10 rounded-[30px]" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      {errorMessagge && (
        <h2 className='text-[#c25454] font-bold'>
          {errorMessagge}
        </h2>
      )}
      <div className='flex flex-col text-slate-800'>
        <label htmlFor="username">Nombre de usuario</label>
        <input
          type="text"
          id="username"
          name="username"
          className="border p-3 rounded-[15px] text-slate-800 bg-slate-50 bg-opacity-50 border-none"
          placeholder="Usuario.."
        />
      </div>
      <div className='flex flex-col text-slate-800'>
        <label htmlFor="password">Contraseña</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="border p-3 rounded-[15px] text-black bg-slate-50 bg-opacity-50 border-none w-full"
            placeholder="Contraseña.."
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-800"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      </div>
      <MainButton type='submit' text='Iniciar sesion' isLoading={isLoading} />
    </form>
  );
};

export default LoginForm;
