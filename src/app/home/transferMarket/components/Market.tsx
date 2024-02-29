import React from 'react'

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


interface MyAuctionsProps {
  players: Player[];
}

const myAuctions: React.FC<MyAuctionsProps> = ({ players }) => {
  return (
    <div className='w-3/5 h-4/5 bg-slate-800 bg-opacity-50 pb-10 border-none flex flex-col items-center' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <h2 className='mb-5 text-center w-full p-3 bg-transparent' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Mis jugadores en venta</h2>
          <table className="w-11/12">
            <thead>
              <tr className='text-xl'>
                <th className="p-3 text-center">Nombre</th>
                <th className="p-3 text-center">Equipo</th>
                <th className="p-3 text-center">Precio</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-[white] hover:bg-opacity-10">
                  <td className="border-b border-white border-opacity-30 p-3 text-center">{player.name}</td>
                  <td className="border-b border-white border-opacity-30 p-3 text-center">{player.team.name}</td>
                  <td className="border-b border-white border-opacity-30 p-3 text-center">${player.price}</td>
                  <td className="border-b border-white border-opacity-30 p-3 text-center">
                    <button className="bg-[#02124a] text-white p-2 rounded-md bg-opacity-80 hover:bg-gray-400 hover:bg-opacity-70 hover:text-[#02124a]" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px", transition: "0.5s ease"}}>Comprar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  )
}

export default myAuctions