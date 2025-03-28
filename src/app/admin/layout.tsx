'use client'

import React, { ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname  } from 'next/navigation';
import { RootState } from '../../redux/store';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import { RiLogoutCircleLine } from "react-icons/ri";
import Background2 from '../../../public/background2.jpg'
import Background3 from '../../../public/background3.jpg'
import { setLogout } from '@/redux/Features/user/userSlice';
import { LiaDiceSolid } from "react-icons/lia";
import { LuUserPlus, LuUserMinus } from "react-icons/lu";
import { GoTrophy } from "react-icons/go";
import { BsShieldPlus } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi2";
import useSessionCheck from '../components/useSessionCheck';
import ProtectedRoute from '../components/protectedRoute';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    useSessionCheck(isLoggingOut);
    
    const handleLogout = () => {
      setIsLoggingOut(true);
      dispatch(setLogout());
      router.push('/');
    };
  
    return (
      <ProtectedRoute roles={["admin"]}>
      <div className="flex h-screen">
        <aside className={`flex flex-col ${isExpanded ? 'w-64' : 'w-20'} p-4 bg-gray-800 text-white transition-all duration-300`} style={{ backgroundImage: `url(${Background3.src})`, backgroundSize: 'cover', backgroundPosition: 'right' }}>
          <div className="flex justify-center flex-col items-center">
            {user.user && (
            <Image
              src={URL_IMG + user.user.picture}
              alt="Imagen de perfil"
              width={isExpanded ? 100 : 50}
              height={isExpanded ? 100 : 50}
              className="rounded-full mb-2 mt-5 object-cover object-center"
              style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", aspectRatio: "1/1"}}
            />
          )}
            {isExpanded && (
              <>
                <h1 className="text-xl font-bold mb-4 text-center">{user.user?.username}</h1>
              </>
            )}
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="mb-4 p-2 rounded-md bg-[#05113b] bg-opacity-70 hover:bg-gray-400"
              style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
            >
              {isExpanded ? (
                <FaAngleDoubleLeft className="text-md" />
              ) : (
                <FaAngleDoubleRight className="text-md" />
              )}
            </button>
          </div>
          <nav>
          <ul className='flex flex-col'>
              <Link href="/admin">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/admin' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <FaHome className="text-xl" />
                  {isExpanded && <span className="ml-3">Inicio</span>}
                </li>
              </Link>
              <Link href="/admin/createUser">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/admin/createUser' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <LuUserPlus className="text-xl" />
                  {isExpanded && <span className="ml-3">Crear usuario</span>}
                </li>
              </Link>
              <Link href="/admin/deleteUser">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/admin/deleteUser' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <LuUserMinus className="text-xl" />
                  {isExpanded && <span className="ml-3">Borrar usuario</span>}
                </li>
              </Link>
              <Link href="/admin/createTeam">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/admin/createTeam' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <BsShieldPlus className="text-xl" />
                  {isExpanded && <span className="ml-3">Crear equipo</span>}
                </li>
              </Link>
              <Link href="/admin/teamRaffle">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/admin/teamRaffle' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <LiaDiceSolid className="text-xl" />
                  {isExpanded && <span className="ml-3">Sorteo</span>}
                </li>
              </Link>
              <Link href="/admin/groups">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/admin/groups' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <HiOutlineUserGroup  className="text-xl" />
                  {isExpanded && <span className="ml-3">Grupos</span>}
                </li>
              </Link>
              <Link href="/admin/results">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/admin/results' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <GoTrophy  className="text-xl" />
                  {isExpanded && <span className="ml-3">Resultados</span>}
                </li>
              </Link>
            </ul>
          </nav>
  
          <button onClick={handleLogout} className="mt-auto bg-[#ed6f6f] text-white p-3 rounded-[10px] hover:bg-gray-400 hover:bg-opacity-70 flex items-center justify-center" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease"}}>
            {isExpanded ? 'Cerrar sesión' : <RiLogoutCircleLine className="text-xl" />}
          </button>
        </aside>
        <main className="flex w-full p-4 h-screen justify-center items-center" style={{ backgroundImage: `url(${Background2.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {children}
        </main>
      </div>
      </ProtectedRoute>
    );
  };
  
  export default Layout;