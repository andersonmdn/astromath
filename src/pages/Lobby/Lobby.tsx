import './Lobby.css';
import RoomTabs from "../../componentes/RoomTabs";
import Navbar from 'componentes/Navbar';

export const Lobby = () => {
  return (
    <div className="Lobby">
        <header className="App-header">
          <Navbar />
        </header>
        <div className="container d-grid gap-2 w-75 p-3 mt-2">
            <p className="lobby-title">Lobby</p>
        </div>
        <div className="container w-75 p-0 mt-4">
            <RoomTabs />
        </div>
    </div>
  )
};