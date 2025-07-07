'use client'
import React, { useEffect, useState } from 'react';
import MyAuctions from './components/myAuctions';
import Market from './components/Market';
import PublishForm from './components/PublishForm';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import SoccerLoadingAnimation from '@/app/components/loadingAnimation';
import Notification from '@/app/components/notification';
import PopUpNotification from '@/app/components/popUpNotification';
import MainButton from '@/app/components/mainButton';
import { setMoney } from '@/redux/Features/user/userSlice';

interface Auction {
  id: number;
  player: Player;
  team: Team;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Player {
  id: number;
  name: string;
  team?: Team;
  price: number;
}

const TransferMarket: React.FC = () => {
  const [players, setPlayers] = useState([]);
  const [playersOnAuction, setPlayersOnAuction] = useState([]);
  const [publishFormVisible, setPublishFormVisible] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPublishPopUpNotification, setShowPublishPopUpNotification] = useState(false);
  const [showRemovePopUpNotification, setShowRemovePopUpNotification] = useState(false);
  const [showPurchasePopUpNotification, setShowPurchasePopUpNotification] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [price, setPrice] = useState<number>(0);
  const URL_SERVER = process.env.NEXT_PUBLIC_URL_SERVER;
  const loggedUser = useSelector((state: RootState) => state.user);
  const teamId = loggedUser.user?.team.id;
  const router = useRouter();
  const dispatch = useDispatch();
  const money = useSelector((state: RootState) => state.user.user?.money) || 0; 

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const fetchMyPlayers = async (teamId: number) => {
    try {
      const response = await fetch(`${URL_SERVER}players/not-on-sale-by/${teamId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`
          },
        }
      );
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayersOnAuction = async (teamId: number) => {
    try {
      const response = await fetch(`${URL_SERVER}players/on-sale-by/${teamId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`
          },
        }
      );
      const data = await response.json();
      setPlayersOnAuction(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuctions = async () => {
    try {
      const response = await fetch(`${URL_SERVER}auctions/get-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`
        },
      });
      const data = await response.json();
      setAuctions(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedUser?.user) {
      setTimeout(() => {
        router.push('/');
      }, 100);
    } else if (!loggedUser?.user?.team) {
      router.push('/home');
    } else {
      fetchMyPlayers(loggedUser.user.team.id);
      fetchPlayersOnAuction(loggedUser.user.team.id);
      fetchAuctions();
    }
  }, [loggedUser, router]);

  if (isLoading) {
    return <SoccerLoadingAnimation />;
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  const handleShowPublishPopupNotification = (player: Player, price: number) => {
    setSelectedPlayer(player);
    setPrice(price);
    setShowPublishPopUpNotification(true);
  };

  const handleShowRemovePopupNotification = (player: Player) => {
    setSelectedPlayer(player);
    setShowRemovePopUpNotification(true);
  };

  const handleShowPurchasePopupNotification = (auction: Auction) => {
    setSelectedAuction(auction);
    setShowPurchasePopUpNotification(true);
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      if (!selectedPlayer || price <= 0 || !teamId) {
        showNotification('Por favor, selecciona un jugador y un precio válido.', 'error');
        return;
      }

      const response = await fetch(`${URL_SERVER}auctions/publish-player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`
        },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          teamId: teamId,
          price: price,
        }),
      });

      if (!response.ok) {
        showNotification('Error al publicar el jugador.', 'error');
        throw new Error('Error al publicar el jugador.');
      }

      await fetchMyPlayers(teamId);
      await fetchPlayersOnAuction(teamId);
      await fetchAuctions();

      setSelectedPlayer(null);
      setPrice(0);
      showNotification('Jugador publicado correctamente.', 'success');
    } catch (error) {
      console.error('Error al publicar el jugador:', error);
    } finally {
      setIsLoading(false);
      setShowPublishPopUpNotification(false);
    }
  };

  const handleRemovePlayerFromAuction = async () => {
    setIsLoading(true);
      if (!teamId) {
        return;
      }
      const playerId = selectedPlayer?.id;
      try{
        const response = await fetch(`${URL_SERVER}auctions/unpublish-player`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`
          },
          body: JSON.stringify({
            playerId: playerId,
          }),
        });
  
        if(!response.ok){
          showNotification('Error al eliminar el jugador de la venta.', 'error');
          throw new Error('Error al eliminar el jugador de la venta');
        }
  
        await fetchMyPlayers(teamId);
        await fetchPlayersOnAuction(teamId);
        await fetchAuctions();

        showNotification('El jugador ya no está a la venta.', 'success');
      }catch(error){
        console.error('Error al eliminar el jugador de la venta:', error);
      } finally{
        setIsLoading(false);
        setShowRemovePopUpNotification(false);
      }
    };

    const handlePlayerPurchase = async () => {
      const auction = selectedAuction;
      try{
        const response = await fetch(`${URL_SERVER}auctions/purchase-player`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loggedUser.token}`
          },
          body: JSON.stringify({
            auctionId: auction?.id,
            fromTeamId: auction?.team.id,
            toTeamId: loggedUser.user?.team.id,
          }),
        });
        if(!response.ok){
          showNotification('Error al realizar la compra.', 'error');
          throw new Error('Error al realizar la compra');
        }
        if (auction?.player.price) {
          const newMoney = money - auction.player.price;
          dispatch(setMoney(newMoney));
          showNotification('Compra realizada con éxito.', 'success');
        }
      }catch(error){
          console.error('Error al realizar la compra:', error);
      }finally{
          fetchAuctions();
          setIsLoading(false);
          setShowPurchasePopUpNotification(false);
      }
  
    }
  return (
    <div className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full">
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          timer={5000}
          closeNotification={() => setNotification({ ...notification, show: false })}
        />
      )}
      {showPublishPopUpNotification && (
        <PopUpNotification closeNotification={() => setShowPublishPopUpNotification(false)}>
          <div className='flex flex-col justify-center align-middle items-center gap-5 w-full h-full'>
            <p className='text-slate-800 text-2xl text-center'>
              Estás seguro que querés publicar a <span className="text-slate-900 font-bold">{selectedPlayer?.name}</span> por <span className="text-green-600 font-bold">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price || 0)}</span>?
            </p>
            <div className='flex flex-row justify-center align-middle items-center gap-5'>
              <MainButton text={'Publicar'} isLoading={false} onClick={handlePublish}/>
              <MainButton text={'Cancelar'} isLoading={false} isCancel={true} onClick={() => setShowPublishPopUpNotification(false)} />
            </div>
          </div>
        </PopUpNotification>
      )}
      {showRemovePopUpNotification && (
        <PopUpNotification closeNotification={() => setShowRemovePopUpNotification(false)}>
          <div className='flex flex-col justify-center align-middle items-center gap-5 w-4/5 h-full'>
            <p className='text-slate-800 text-2xl text-center'>
              Estás seguro que querés eliminar la publicación a <span className="text-slate-900 font-bold">{selectedPlayer?.name}</span> del mercado?
            </p>
            <div className='flex flex-row justify-center align-middle items-center gap-5'>
              <MainButton text={'Eliminar'} isLoading={false} onClick={handleRemovePlayerFromAuction}/>
              <MainButton text={'Cancelar'} isLoading={false} isCancel={true} onClick={() => setShowRemovePopUpNotification(false)} />
            </div>
          </div>
        </PopUpNotification>
      )}
      {showPurchasePopUpNotification && (
        <PopUpNotification closeNotification={() => setShowPurchasePopUpNotification(false)}>
          <div className='flex flex-col justify-center align-middle items-center gap-5 w-4/5 h-full'>
            <p className='text-slate-800 text-2xl text-center'>
              Estás seguro que querés comprar a <span className="text-slate-900 font-bold">{selectedAuction?.player.name}</span> por <span className="text-green-600 font-bold">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(selectedAuction?.player.price || 0)}</span>?
            </p>
            <div className='flex flex-row justify-center align-middle items-center gap-5'>
              <MainButton text={'Comprar'} isLoading={false} onClick={handlePlayerPurchase}/>
              <MainButton text={'Cancelar'} isLoading={false} isCancel={true} onClick={() => setShowPurchasePopUpNotification(false)} />
            </div>
          </div>
        </PopUpNotification>
      )}
      {publishFormVisible ? (
        <div
          className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full"
          style={{ animation: 'moveTopToBottom 0.3s ease' }}
        >
          <div>
            <button
              onClick={() => setPublishFormVisible(!publishFormVisible)}
              className="flex bg-gray-200 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
            >
              Comprar
              <FaArrowRight />
            </button>
          </div>
          {loggedUser?.user?.team && (
            <div className="flex flex-col md:flex-row gap-5 w-full justify-center align-middle items-center h-4/5">
              <PublishForm
                players={players}
                handleShowPopupNotification={handleShowPublishPopupNotification}
                isLoading={isLoading}
              />
              <MyAuctions
                players={playersOnAuction}
                handleShowPopupNotification={handleShowRemovePopupNotification}
                isLoading={isLoading}
              />
            </div>
          )}
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
        <div
          className="flex flex-col justify-center align-middle items-center gap-5 w-full h-full"
          style={{ animation: 'moveTopToBottom 0.3s ease' }}
        >
          <div>
            <button
              onClick={() => setPublishFormVisible(!publishFormVisible)}
              className="flex bg-gray-200 bg-opacity-50 p-3 border-none rounded-[15px] gap-2 items-center hover:bg-[white] hover:bg-opacity-70 text-slate-800 font-bold"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', transition: '0.5s ease' }}
            >
              <FaArrowLeft />
              Vender
            </button>
          </div>
          <Market 
            auctions={auctions} 
            handleShowPopupNotification={handleShowPurchasePopupNotification}
            isLoading={isLoading}
          />
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
};export default TransferMarket;