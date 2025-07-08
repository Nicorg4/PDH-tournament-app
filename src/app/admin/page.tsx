'use client'

import React, { useEffect, useState } from 'react';
import Card from '../components/ManagerCard'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SoccerLoadingAnimation from '../components/loadingAnimation';

interface ManagerData {
    id: number,
    username: string,
    picture: string,
    team_name: string,
    team_logo: string,
}

const Home: React.FC = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [cardsData, setCardsData] = useState<ManagerData[]>([])
    const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
    const loggedUser = useSelector((state: RootState) => state.user);

    const fetchCardsData = async () => {
      try {
        if (!loggedUser.token) {
          throw new Error("No hay token de usuario.");
        }
        const response = await fetch(`${URL_SERVER}users/get-all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loggedUser.token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (!response.ok) {
          const text = await response.text();
          console.error("Respuesta del servidor:", text);
          throw new Error("Error al obtener los managers");
        }
        const data = await response.json();
        setCardsData(data);
      } catch (error) {
        console.error("Error al obtener los managers:", error);
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
        const step = width > 800 ? 4 : 2;
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - step : 0))
    };

    const handleNext = () => {
        const step = width > 800 ? 4 : 2;
        setCurrentIndex((prevIndex) => (prevIndex < cardsData.length - step ? prevIndex + step : prevIndex)); 
    }
  
  if (isLoading) {
    return (
      <SoccerLoadingAnimation />
    );
  }

  return (
    <div className={`${width > 800 ? 'grid grid-cols-2' : 'flex flex-col'} gap-4 m-auto justify-center`} style={{animation: 'moveTopToBottom 0.3s ease'}}>
      {cardsData.slice(currentIndex, currentIndex + (width > 800 ? 4 : 2)).map((card) => (
        <Card key={card.id} {...card} />
      ))}
      <div className="col-span-2 flex justify-center mt-4 gap-4">
        {currentIndex > 0 && (
          <div className='flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold' style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
            <button className="" onClick={handlePrev}>Anterior</button>
        </div>
        )}
        {currentIndex < cardsData.length - (width > 800 ? 6 : 3) && (
        <div className='flex bg-gray-200 bg-opacity-70 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold' style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
            <button className="" onClick={handleNext}>Siguiente</button>
        </div>
        )}
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