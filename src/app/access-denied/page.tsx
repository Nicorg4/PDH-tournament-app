
'use client'

import MainButton from '../components/mainButton'
import Background from '../../../public/background.jpg';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import MessiEnojado from '../../../public/messiEnojado.png';
import Image from 'next/image';

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
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${Background.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right',
      }}
    >
    <div className=' bg-gray-200 bg-opacity-70 border-none items-center rounded-md p-10 flex flex-col justify-center' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      <h1 className="text-4xl font-bold mb-4 text-slate-800">Acceso denegado</h1>
      <p className="text-xl mb-4 text-slate-800">No tenés acceso para ver esa página.</p>
      <Image className="mb-5" src={MessiEnojado} alt="background" width={400} height={400}/>
      <MainButton onClick={handleRedirect} text={'Volver'} isLoading={false} />
    </div>
    </main>
  )
}
