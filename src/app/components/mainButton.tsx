import React from 'react'

interface MainButtonProps {
  text: string
  isLoading: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

const LoadingAnimation = () => {
  return (
    <div className='flex items-center justify-center'>
      <div className='w-6 h-6 border-2 border-t-0 border-white rounded-full animate-spin' />
    </div>
  )

}

const MainButton = ({text, isLoading, type = 'button', onClick}: MainButtonProps) => {
  return (
    <button 
      type={type} 
      onClick={onClick}
      className="bg-[#02124a] text-white p-2 mt-4 rounded-[15px] hover:bg-opacity-80 transition-all duration-300" 
      style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
    >
      {isLoading ? <LoadingAnimation/> : text}
    </button>
    
  )
}

export default MainButton