'use client'

import React, { ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '../../redux/store';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaUsers, FaExchangeAlt, FaTrophy, FaBars, FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import { RiLogoutCircleLine } from "react-icons/ri";
import ProfileImage from '../../../public/default.webp'
import Background2 from '../../../public/background.jpg'
import Background3 from '../../../public/background3.jpg'
import { setLogout } from '@/redux/Features/user/userSlice';
import { RiHistoryFill } from "react-icons/ri";
import useSessionCheck from '../components/useSessionCheck';
import ProtectedRoute from '../components/protectedRoute';
import { PiTreeStructureFill } from "react-icons/pi";


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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useSessionCheck(isLoggingOut);

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(setLogout());
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <ProtectedRoute roles={["user"]}>
      <div className="flex min-h-screen">
        <aside className={`flex flex-col ${isExpanded ? 'w-64' : 'w-20'} p-4 bg-gray-800 text-white transition-all duration-300 hidden sm:flex`} style={{ backgroundImage: `url(${Background3.src})`, backgroundSize: 'cover', backgroundPosition: 'right' }}>
          <div className="flex justify-center flex-col items-center">
            <Image
              src={user.user?.picture ? URL_IMG + user.user.picture : ProfileImage}
              alt="Imagen de perfil"
              width={isExpanded ? 100 : 50}
              height={isExpanded ? 100 : 50}
              className="rounded-full mb-2 mt-5 object-cover object-center"
              style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", aspectRatio: "1/1" }}
            />
            {isExpanded && (
              <>
                <h1 className="text-xl font-bold mb-2 text-center">{user.user?.username}</h1>
                {user.user?.team && (
                  <>
                    <Image src={URL_IMG + user.user.team.logo} alt={`Foto del equipo ${user.user.team.name}`} width={40} height={40} className="rounded-full object-fit:cover object-center mb-2" style={{ aspectRatio: "1/1" }} />
                    <p className="text-center mb-2">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(user.user.money)}</p>
                  </>
                )}
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
              <Link href="/home">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <FaHome className="text-xl" />
                  {isExpanded && <span className="ml-3">Inicio</span>}
                </li>
              </Link>
              {user?.user?.team && (
                <>
                  <Link href="/home/myTeam">
                    <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/myTeam' ? 'bg-gray-400  text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                      <FaUsers className="text-xl" />
                      {isExpanded && <span className="ml-3">Mi equipo</span>}
                    </li>
                  </Link>
                  <Link href="/home/transferMarket">
                    <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/transferMarket' ? 'bg-gray-400 text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                      <FaExchangeAlt className="text-xl" />
                      {isExpanded && <span className="ml-3">Traspasos</span>}
                    </li>
                  </Link>
                  <Link href="/home/transferHistory">
                    <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/transferHistory' ? 'bg-gray-400 text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                      <RiHistoryFill className="text-xl" />
                      {isExpanded && <span className="ml-3">Historial</span>}
                    </li>
                  </Link>
                </>
              )}
              <Link href="/home/groupStage">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/groupStage' ? 'bg-gray-400 text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <FaTrophy className="text-xl" />
                  {isExpanded && <span className="ml-3">Fase de grupos</span>}
                </li>
              </Link>
              <Link href="/home/finalStage">
                <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/finalStage' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                  <PiTreeStructureFill className="text-xl transform scale-x-[-1]" />
                  {isExpanded && <span className="ml-3">Fase eliminatoria</span>}
                </li>
              </Link>
            </ul>
          </nav>

          <button onClick={handleLogout} className="mt-auto bg-[#ed6f6f] text-white p-3 rounded-[10px] hover:bg-gray-400 hover:bg-opacity-70 flex items-center justify-center" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease" }}>
            {isExpanded ? 'Cerrar sesión' : <RiLogoutCircleLine className="text-xl" />}
          </button>
        </aside>
        {/* Mobile topbar */}
        <div className="fixed flex h-[70px] w-full sm:hidden justify-end align-middle" style={{ backgroundImage: `url(${Background3.src})`, backgroundSize: 'cover', backgroundPosition: 'right' }}>
          <button onClick={toggleMobileMenu}>
            <Image
              src={user.user?.picture ? URL_IMG + user.user.picture : ProfileImage}
              alt="Imagen de perfil"
              width={isExpanded ? 100 : 50}
              height={isExpanded ? 100 : 50}
              className="rounded-full object-cover object-center mr-5"
              style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", aspectRatio: "1/1" }}
            />
          </button>
        </div>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-end sm:hidden">
            <div className="w-full bg-gray-800 text-white h-full flex flex-col p-6 relative" style={{ backgroundImage: `url(${Background3.src})`, backgroundSize: 'cover', backgroundPosition: 'right' }}>
              <button
                className="absolute top-4 right-4 text-2xl"
                onClick={() => setIsMenuOpen(false)}
              >
                &times;
              </button>
              <div className="flex flex-col items-center mt-8 mb-6">
                <Image
                  src={user.user?.picture ? URL_IMG + user.user.picture : ProfileImage}
                  alt="Imagen de perfil"
                  width={100}
                  height={100}
                  className="rounded-full object-cover object-center mb-2 border-4 border-white"
                />
                <h2 className="text-xl font-bold mb-2">{user.user?.username}</h2>
                {user.user?.team && (
                  <Image src={URL_IMG + user.user.team.logo} alt={`Foto del equipo ${user.user.team.name}`} width={40} height={40} className="rounded-full object-cover object-center mb-2" />
                )}
              </div>
              <ul className="flex flex-col gap-2">
                <Link href="/home" onClick={() => setIsMenuOpen(false)}>
                  <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                    <FaHome className="text-xl" />
                    <span className="ml-3">Inicio</span>
                  </li>
                </Link>
                {user?.user?.team && (
                  <>
                    <Link href="/home/myTeam" onClick={() => setIsMenuOpen(false)}>
                      <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/myTeam' ? 'bg-gray-400  text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                        <FaUsers className="text-xl" />
                        <span className="ml-3">Mi equipo</span>
                      </li>
                    </Link>
                    <Link href="/home/transferMarket" onClick={() => setIsMenuOpen(false)}>
                      <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/transferMarket' ? 'bg-gray-400 text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                        <FaExchangeAlt className="text-xl" />
                        <span className="ml-3">Traspasos</span>
                      </li>
                    </Link>
                    <Link href="/home/transferHistory" onClick={() => setIsMenuOpen(false)}>
                      <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/transferHistory' ? 'bg-gray-400 text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                        <RiHistoryFill className="text-xl" />
                        <span className="ml-3">Historial</span>
                      </li>
                    </Link>
                  </>
                )}
                <Link href="/home/groupStage" onClick={() => setIsMenuOpen(false)}>
                  <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/groupStage' ? 'bg-gray-400 text-[#02124a]' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                    <FaTrophy className="text-xl" />
                    <span className="ml-3">Fase de grupos</span>
                  </li>
                </Link>
                <Link href="/home/finalStage" onClick={() => setIsMenuOpen(false)}>
                  <li className={`mb-2 p-3 rounded-[10px] font-bold bg-[#05113b] bg-opacity-90 ${pathname === '/home/finalStage' ? 'bg-gray-400 text-[#02124a] ' : ''} hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a] flex items-center`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", cursor: "pointer", transition: "0.5s ease" }}>
                    <PiTreeStructureFill className="text-xl transform scale-x-[-1]" />
                    <span className="ml-3">Fase eliminatoria</span>
                  </li>
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="mt-auto bg-[#ed6f6f] text-white p-3 rounded-[10px] hover:bg-gray-400 hover:bg-opacity-70 flex items-center justify-center"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease" }}
                >
                  Cerrar sesión
                </button>
              </ul>
            </div>
            <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
          </div>
        )}
        <main
          className="flex w-full min-h-screen p-4 justify-center items-center sm:mt-0"
          style={{
            backgroundImage: `url(${Background2.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};
export default Layout;