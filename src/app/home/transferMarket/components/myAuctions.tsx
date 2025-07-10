import React from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";

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
  handleShowPopupNotification: (player: Player) => void;
  isLoading: boolean;
}

const myAuctions: React.FC<MyAuctionsProps> = ({ players, handleShowPopupNotification, isLoading }) => {
  const handlePlayerRemove = (player: Player) => {
    if (player) {
      handleShowPopupNotification(player);
    }
  };

  return (
    <div className='md:w-auto w-full lg:min-w-[600px] max-w-[95%] bg-gray-200 bg-opacity-70 border-none flex flex-col items-center rounded-md h-[500px]' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
      <h2 className='text-center w-full p-3 bg-transparent text-slate-800 font-bold' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>Mis jugadores en venta</h2>
      {players.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-center text-xl text-slate-800">No hay jugadores en venta.</p>
        </div>
      ) : (
        <div className="w-11/12 h-full flex flex-col mt-2 ">
          <table className="w-full">
            <thead className="sticky top-0 bg-opacity-90 z-10">
              <tr className='text-xl'>
                <th className="p-3 text-center text-slate-800 text-[18px]">Nombre</th>
                <th className="p-3 text-center text-slate-800 text-[18px]">Precio</th>
                <th className="p-3 text-center text-slate-800 text-[18px]">Acciones</th>
              </tr>
            </thead>
          </table>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: 320, scrollBehavior: 'smooth' }}
            id="my-auctions-scrollable"
          >
            <table className="w-full">
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-[white] hover:bg-opacity-10">
                    <td className="border-b border-white border-opacity-30 p-3 text-center text-slate-800 text-[15px]">{player.name}</td>
                    <td className="border-b border-white border-opacity-30 p-3 text-center text-slate-800 text-[15px]">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(player.price)}</td>
                    <td className="border-b border-white border-opacity-30 p-3 text-center">
                      <button onClick={() => handlePlayerRemove(player)} className='bg-slate-800 text-white p-2 rounded-[15px] hover:bg-opacity-70 transition-all duration-300 shadow-md'>
                        <RiDeleteBin6Line className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ScrollToBottomButton />
        </div>
      )
      }

    </div >
  )
}

export default myAuctions

function ScrollToBottomButton() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const el = document.getElementById('my-auctions-scrollable');
    if (!el) return;
    const checkOverflow = () => {
      setShow(el.scrollHeight > el.clientHeight);
    };
    checkOverflow();
    el.addEventListener('scroll', checkOverflow);
    window.addEventListener('resize', checkOverflow);
    return () => {
      el.removeEventListener('scroll', checkOverflow);
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  if (!show) return null;

  return (
    <button
      className="flex mt-2 mb-2 bg-slate-800 text-white px-2 py-1 rounded-xl hover:bg-opacity-70 transition-all duration-300 shadow-md justify-center items-center"
      onClick={() => {
        const el = document.getElementById('my-auctions-scrollable');
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }}
      type="button"
    >
      <MdKeyboardArrowDown className="text-2xl" />
    </button>
  );
}