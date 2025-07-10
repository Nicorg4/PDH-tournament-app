import React from 'react'
import { MdClose } from "react-icons/md";

interface PopUpNotificationProps {
  children: React.ReactNode
  closeNotification: () => void;
}

const PopUpNotification = ({ children, closeNotification } : PopUpNotificationProps) => {
  return (
    <div  className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10'>
      <div className='relative bg-white border-none sm:max-w-[500px] max-w-[90%] rounded-md flex justify-center p-10'>
      <button onClick={closeNotification} className='absolute top-5 right-5 text-slate-500 text-3xl'><MdClose /></button>
        {children}
      </div>
    </div>
  )
}

export default PopUpNotification