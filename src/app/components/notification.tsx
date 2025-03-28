import React from 'react'
import { MdClose } from "react-icons/md";


interface NotificationProps {
  type: string;
  message: string;
  timer: number;
  closeNotification: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, timer, closeNotification }) => {
  return (
    <div className='absolute bottom-5 left-5 w-2/12 h-32 bg-slate-800 bg-opacity-70 p-5 rounded-md text-white'>
        <button onClick={closeNotification} className='absolute top-2 right-2 text-slate-500 text-2xl'><MdClose /></button>
        <p className='text-zinc-400 text-16'>
            {message}
        </p>
        <div className='absolute bottom-5 w-5/6 h-1 bg-gray-700 rounded-full overflow-hidden'>
            <div  
                className={`h-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                style={{
                    width: '100%',
                    animation: `fillProgress ${timer}ms linear`
                }}
            />
        </div>
        <style jsx>{`
            @keyframes fillProgress {
                from { width: 0%; }
                to { width: 100%; }
            }
        `}</style>    
        </div>
  )
}

export default Notification