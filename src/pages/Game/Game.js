import './Game.css';
import RoomTabs from "../../componentes/RoomTabs";

export const Game = () => {
  return (
    <div className="Game">
        <div className="container d-grid gap-2 w-75 p-3 mt-2">
            <p className="Game-title">Game</p>
        </div>
        <div className="container w-75 p-0 mt-4">
            <RoomTabs />
        </div>
    </div>
  )
};