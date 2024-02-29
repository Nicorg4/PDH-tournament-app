import Image, { StaticImageData } from 'next/image'

interface CardProps {
    ownerName: string, 
    ownerPhoto: StaticImageData, 
    teamName: string, 
    teamPhoto: StaticImageData
}

const Card: React.FC<CardProps> = ({ ownerName, ownerPhoto, teamName, teamPhoto }) => {
    return (
      <div className="bg-slate-800 bg-opacity-50 p-3 flex hover:bg-opacity-60" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
          <div className='w-1/2 flex justify-center items-center border-r border-solid border-white border-opacity-30'>
              <Image src={teamPhoto} alt={`Foto del equipo ${teamName}`} width={120} height={120} className="rounded-full object-fit:cover object-center " style={{aspectRatio: "1/1"}}/>
          </div>
          <div className='w-1/2 p-3 flex justify-center items-center'>
              <Image src={ownerPhoto} alt={`Foto del equipo ${ownerName}`} width={120} height={120} className="rounded-full object-fit:cover object-center " style={{aspectRatio: "1/1"}}/>
          </div>
      </div>
    );
};

export default Card