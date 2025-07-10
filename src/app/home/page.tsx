'use client'

import React, { useEffect, useState } from 'react';
import Card from '../components/ManagerCard'
import SoccerLoadingAnimation from '../components/loadingAnimation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ManagerData {
  id: number,
  username: string,
  picture: string,
  team_name: string,
  team_logo: string,
}

const Home: React.FC = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isLoading, setIsLoading] = useState(true);
  const [cardsData, setCardsData] = useState<ManagerData[]>([])
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const loggedUser = useSelector((state: RootState) => state.user);

  const fetchCardsData = async () => {
    try {
      const response = await fetch(`${URL_SERVER}users/get-all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loggedUser.token}`,
          'ngrok-skip-browser-warning': 'true'
        }

      });
      if (!response.ok) {
        throw new Error("Error al obtener los managers");
      }
      const data = await response.json();
      setCardsData(data);

    } catch (error) {
      console.error('Error al obtener los managers:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCardsData();
  }, [])


  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const handlePrev = () => {
    const step = width > 800 ? 4 : 3;
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - step : 0))
  };

  const handleNext = () => {
    const step = width > 800 ? 4 : 3;
    setCurrentIndex((prevIndex) => (prevIndex < cardsData.length - step ? prevIndex + step : prevIndex));
  }

  if (isLoading) {
    return (
      <SoccerLoadingAnimation />
    );
  }
  return (
    <div className={`flex flex-col gap-4 mt-[80px] sm:mt-0 justify-center`} style={{ animation: 'moveTopToBottom 0.3s ease' }}>
      <div className='flex flex-col md:grid grid-cols-2 gap-4 justify-center'>
        {cardsData.slice(currentIndex, currentIndex + (width > 800 ? 4 : 3)).map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
      <div className="col-span-2 flex justify-center mt-4 gap-4">
        <button className={`flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold ${!(currentIndex > 0) ? "bg-slate-500 hover:bg-slate-500 pointer-events-none" : ""}`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }} onClick={handlePrev}>Anterior</button>
        <button className={`flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold ${!(currentIndex < cardsData.length - (width > 800 ? 6 : 3)) ? "bg-slate-500 hover:bg-slate-500 pointer-events-none" : ""}`} style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }} onClick={handleNext}>Siguiente</button>
      </div>
      <style jsx>{`
        @keyframes moveTopToBottom {
          from {
            transform: translateY(-5%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;