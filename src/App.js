import './App.css';
import InputText from './componentes/InputText';
import Navbar from './componentes/Navbar';


import { useState } from "react";

function App() {
  const [roomType, setRoomType] = useState("public");
  const [tabActive, setTabActive] = useState(0);

  const tabs = [
    { id: 0, label: "Create", target: "#create", str_id: "create-tab"},
    { id: 1, label: "Join", target: "#join", str_id: "join-tab"},
    { id: 2, label: "Public", target: "#public", str_id: "public-tab"},
  ];

  const handleTabClick = (id) => {
    setTabActive(id);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <main className="App-main">
        <div className="container d-grid gap-2 w-75 p-3 mt-2">
          <p>Lobby</p>
        </div>
        <div className="container w-75 p-0 mt-4">
          <div className="container mt-5">
              <ul className="nav nav-tabs" id="roomTabs" role="tablist">
                {tabs.map((tab) => (
                    <li key={tab.id} className="nav-item" role="presentation">
                        <button className={`nav-link ${tab.id === tabActive ? 'active' : 'text-light'}`} id={tab.str_id} data-bs-toggle="tab" data-bs-target={tab.target} type="button" role="tab" onClick={() => handleTabClick(tab.id)}>{tab.label}</button>
                    </li>
                ))}
              </ul>
              
              <div className="tab-content mt-3" id="roomTabsContent">
                  {/* Create Tab */}
                  <div className="tab-pane fade show active" id="create" role="tabpanel">
                      <form>
                          <div className="mb-3">
                              <label className="form-label">Nome da Sala</label>
                              <input type="text" className="form-control" required />
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Imagem</label>
                              <input type="file" className="form-control" />
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Tipo</label>
                              <select className="form-select" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                                  <option value="public">Pública</option>
                                  <option value="private">Privada</option>
                              </select>
                          </div>
                          {roomType === "private" && (
                              <div className="mb-3">
                                  <label className="form-label">Senha</label>
                                  <input type="password" className="form-control" />
                              </div>
                          )}
                          <button type="submit" className="btn btn-primary">Criar Sala</button>
                      </form>
                  </div>
                  
                  {/* Join Tab */}
                  <div className="tab-pane fade" id="join" role="tabpanel">
                      <form>
                          <div className="mb-3">
                              <label className="form-label">Código da Sala</label>
                              <input type="text" className="form-control" required />
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Senha</label>
                              <input type="password" className="form-control" />
                          </div>
                          <button type="submit" className="btn btn-success">Entrar</button>
                      </form>
                  </div>
                  
                  {/* Public Tab */}
                  <div className="tab-pane fade" id="public" role="tabpanel">
                      <div className="list-group">
                          {["Sala Pública 1", "Sala Pública 2", "Sala Pública 3"].map((room, index) => (
                              <div key={index} className="list-group-item bg-dark text-light d-flex align-items-center">
                                  <img src="https://placehold.co/50" className="rounded me-3" alt="Room" />
                                  <span>{room}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
