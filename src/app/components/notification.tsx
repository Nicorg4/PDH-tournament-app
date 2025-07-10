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
    <div className='absolute bottom-5 right-5 h-28 bg-slate-800 p-8 pt-5 pr-20 rounded-md text-white'>
        <button onClick={closeNotification} className='absolute top-2 right-2 text-slate-500 text-2xl'><MdClose /></button>
        <p className='text-zinc-200 text-16'>
            {message}
        </p>
        <div className='absolute bottom-5 w-5/6 h-1 bg-gray-700 rounded-full overflow-hidden'>
            <div  
                className={`h-full ${type === 'success' ? 'bg-green-400' : 'bg-red-400'}`}
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