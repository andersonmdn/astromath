import './App.css';
import Navbar from './componentes/Navbar';
import RoomTabs from './componentes/RoomTabs';

function App() {
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
          <RoomTabs />
        </div>
      </main>
    </div>
  );
}

export default App;
