import React from 'react'

interface MainButtonProps {
  text: string
  isLoading: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  isCancel?: boolean
}

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-transparent border-t-white rounded-full animate-spin" />
    </div>
  );
};

const MainButton = ({ text, isLoading, type = 'button', onClick, isCancel }: MainButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${
        isCancel ? 'bg-gray-400 text-slate-800' : 'bg-slate-800 text-white'
      } p-2 rounded-[15px] hover:bg-opacity-70 transition-all duration-300 min-w-24 shadow-md`}
    >
      {isLoading ? <LoadingAnimation /> : text}
    </button>
  );
};

export default MainButton;