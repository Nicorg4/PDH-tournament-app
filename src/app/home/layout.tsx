'use client'

import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname  } from 'next/navigation';
import { RootState } from '../../redux/store';
import Link from 'next/link';
import Image from 'next/image';

import ProfileImage from '../../../public/default.webp'
import Background2 from '../../../public/background2.jpg'
import Background3 from '../../../public/background3.jpg'
import { setLogout } from '@/redux/Features/user/userSlice';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
      dispatch(setLogout());
      router.push('/');
    };
  
    return (
      <div className="flex h-screen">
        <aside className="flex flex-col w-64 p-4 bg-gray-800 text-white" style={{ backgroundImage: `url(${Background3.src})`, backgroundSize: 'cover', backgroundPosition: 'right' }}>
          <div className="mb-4 flex align-middle justify-center">
            <Image
              src={ProfileImage}
              alt="Imagen de perfil"
              width={100}
              height={100}
              className="rounded-full mb-10 mt-5 object-cover object-center"
              style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", aspectRatio: "1/1"}}
            />
          </div>
          <nav>
          <ul className='flex flex-col'>
              <Link href="/home">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-70 ${pathname === '/home' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a]`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  Inicio
                </li>
              </Link>
              <Link href="/home/myTeam">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-70 ${pathname === '/home/myTeam' ? 'bg-gray-400  text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a]`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  Mi equipo
                </li>
              </Link>
              <Link href="/home/transferMarket">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-70 ${pathname === '/home/transferMarket' ? 'bg-gray-400 text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a]`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease"}}>
                  Traspasos
                </li>
              </Link>
              <Link href="/home/results">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-70 ${pathname === '/home/results' ? 'bg-gray-400 text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a]`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease"}}>
                  Resultados
                </li>
              </Link>
            </ul>
          </nav>
  
          <button onClick={handleLogout} className="mt-auto bg-[#ed6f6f] text-white p-3 rounded-[10px] hover:bg-gray-400 hover:bg-opacity-70" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease"}}>
            Cerrar sesión
          </button>
        </aside>
        <main className="flex w-full p-4 h-screen justify-center items-center" style={{ backgroundImage: `url(${Background2.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {children}
        </main>
      </div>
    );
  };
  
  export default Layout;