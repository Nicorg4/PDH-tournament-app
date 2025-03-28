
'use client'

import MainButton from '../components/mainButton'
import Background from '../../../public/background2.jpg';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function AccessDenied() {
    const navigate = useRouter();
    const user= useSelector((state: RootState) => state.user);
    const handleRedirect = () => {
        if(user.user?.role === 'user'){
            navigate.push('/home');
        }else{
            navigate.push('/admin');
        }
    }
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-gray-800"
      style={{
        backgroundImage: `url(${Background.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right',
      }}
    >
    <div className=' bg-slate-800 bg-opacity-70 border-none items-center rounded-md p-10' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      <h1 className="text-4xl font-bold mb-4">Acceso denegado</h1>
      <p className="text-xl mb-4">No tenes acceso para visitar esa página.</p>
      <MainButton onClick={handleRedirect} text={'Volver'} isLoading={false} />
    </div>
    </main>
  )
}
