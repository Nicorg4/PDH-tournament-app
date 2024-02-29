'use client'

import React, { useState } from 'react';

import Card from '../components/ManagerCard'
import Bayern from '../../../public/bayern.png'
import Liverpool from '../../../public/liverpool.png'
import RealMadrid from '../../../public/real.png'
import ManCity from '../../../public/city.png'
import PSG from '../../../public/PSG.png'
import Chelsea from '../../../public/chelsea.png'
import Barcelona from '../../../public/barsa.png'
import Juve from '../../../public/juve.png'
import Owner from '../../../public/default.png'

const cardsData = [
    {
      "id": 1,
      "ownerName": "Nico",
      "ownerPhoto": Owner,
      "teamName": "Los Tigres",
      "teamPhoto": Bayern
    },
    {
      "id": 2,
      "ownerName": "Facu",
      "ownerPhoto": Owner,
      "teamName": "Los Leones",
      "teamPhoto": Liverpool
    },
    {
      "id": 3,
      "ownerName": "Seba",
      "ownerPhoto": Owner,
      "teamName": "Los Halcones",
      "teamPhoto": RealMadrid
    },
    {
      "id": 4,
      "ownerName": "Kolnis",
      "ownerPhoto": Owner,
      "teamName": "Los Lobos",
      "teamPhoto": ManCity
    },
    {
      "id": 5,
      "ownerName": "Mati",
      "ownerPhoto": Owner,
      "teamName": "Los Osos",
      "teamPhoto": PSG
    },
    {
      "id": 6,
      "ownerName": "Ayrton",
      "ownerPhoto": Owner,
      "teamName": "Los Dragones",
      "teamPhoto": Chelsea
    },
    {
      "id": 7,
      "ownerName": "Juanse",
      "ownerPhoto": Owner,
      "teamName": "Los Águilas",
      "teamPhoto": Barcelona
    },
    {
      "id": 8,
      "ownerName": "Campany",
      "ownerPhoto": Owner,
      "teamName": "Los Panthers",
      "teamPhoto": Juve,
    },
]

const Home: React.FC = () => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 4 : 0))
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < cardsData.length -4 ? prevIndex + 4 : prevIndex)); 
    }

  return (
    <div className="grid grid-cols-2 gap-4 w-1/2 m-auto justify-center mt-64" style={{animation: 'moveTopToBottom 0.3s ease'}}>
      {cardsData.slice(currentIndex, currentIndex + 4).map((card) => (
        <Card key={card.id} {...card} />
      ))}
      <div className="col-span-2 flex justify-between">
        <div className='bg-[#05113b] bg-opacity-80 rounded-md hover:bg-gray-400 hover:bg-opacity-70 text-white' style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
            <button className="p-3" onClick={handlePrev}>&lt; Anterior</button>
        </div>
        <div className='bg-[#05113b] bg-opacity-80 rounded-md hover:bg-gray-400 hover:bg-opacity-70 text-white' style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
            <button className="p-3" onClick={handleNext}>Siguiente &gt;</button>
        </div>
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