
import { useState } from "react";
import JoinRoomForm from "../JoinRoomForm";
import PublicRoomsList from "../PublicRoomsList";
import CreateRoomForm from "../CreateRoomForm";

export const RoomTabs = () => {
  const [tabActive, setTabActive] = useState<string>("create");

  const tabs = [
    { id: "create", label: "Criar Sala" },
    { id: "join", label: "Entrar" },
    { id: "public", label: "Salas Públicas" }
  ];

  return (
    <div className="container mt-5">
      <ul className="nav nav-tabs">
        {tabs.map((tab) => (
          <li key={tab.id} className="nav-item">
            <button className={`nav-link ${tabActive === tab.id ? 'active' : 'text-light'}`} id={tab.str_id} data-bs-toggle="tab" data-bs-target={tab.target} type="button" role="tab" onClick={() => setTabActive(tab.id)}>{tab.label}</button>
          </li>
        ))}
      </ul>

      <div className="tab-content mt-3">
        {tabActive === "create" && <CreateRoomForm />}
        {tabActive === "join" && <JoinRoomForm />}
        {tabActive === "public" && <PublicRoomsList />}
      </div>
    </div>
  );
}