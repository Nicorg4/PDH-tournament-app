import Image, { StaticImageData } from 'next/image'
import ProfileImage from '../../../public/default.webp'

interface CardProps {
    id: number,
    username: string,
    picture: string,
    team_name: string,
    team_logo: string,
}

const Card: React.FC<CardProps> = ({ username, picture, team_name, team_logo }) => {
    const URL_IMG = process.env.NEXT_PUBLIC_URL_IMG;
    return (
      <div className="bg-slate-800 bg-opacity-70 rounded-md p-8 flex hover:bg-opacity-60" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
          <div className='w-1/2 flex pr-5 justify-center items-center border-r border-solid border-white border-opacity-30'>
              <Image src={URL_IMG + (team_logo ? team_logo : 'images/default_team.png')} alt={`Foto del equipo ${team_name}`} width={120} height={120} className="rounded-full object-fit:cover object-center " style={{aspectRatio: "1/1"}}/>
          </div>
          <div className='w-1/2 pl-5 flex justify-center items-center'>
              <Image src={URL_IMG + picture} alt={`Foto del equipo ${username}`} width={120} height={120} className="rounded-full object-cover object-center" style={{aspectRatio: "1/1"}}/>
          </div>
      </div>
    );
};

export default Card