'use client'
import React, { useState } from 'react';
import MyAuctions from './components/myAuctions'
import Market from './components/Market'
import PublishForm from './components/PublishForm'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Player {
  id: number;
  name: string;
  team: Team;
  price: number;
}

const testTeam: Team = {
  id: 1,
  name: "Equipo de Prueba",
  logo: "",
};

const TransferMarket: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    {"id": 1, "name": "Lionel Messi", "team": testTeam, "price": 10000},
    {"id": 1,"name": "Cristiano Ronaldo", "team": testTeam, "price": 10000},
    {"id": 1,"name": "Neymar Jr.", "team": testTeam, "price": 10000},
    {"id": 1,"name": "Kevin De Bruyne", "team": testTeam, "price": 10000},
  ]);
  const [publishFormVisible, setPublishFormVisible] = useState(true);
  
  return (
    <div className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full">
      {publishFormVisible ? (
      <div className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full" style={{animation: 'moveTopToBottom 0.3s ease'}}>
        <div>
          <button onClick={() => {setPublishFormVisible(!publishFormVisible)}} className="flex bg-slate-800 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-10" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease"}}>
            Comprar
            <FaArrowRight/>
          </button>
        </div>
      <div className='flex gap-5 w-full justify-center align-middle items-center h-4/5'>
        <PublishForm players={players} setPlayers={setPlayers}/>
        <MyAuctions players={players}/>
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
      ) : (
      <div className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full" style={{animation: 'moveTopToBottom 0.3s ease'}}>
        <div>
          <button onClick={() => {setPublishFormVisible(!publishFormVisible)}} className="flex bg-slate-800 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-10" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease"}}>
            <FaArrowLeft />
            Vender
          </button>
        </div>
        <Market players={players}/>
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
      )}
    </div>
  );
};

export default TransferMarket;
