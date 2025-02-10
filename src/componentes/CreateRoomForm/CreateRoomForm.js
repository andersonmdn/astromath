import "./CreateRoomForm.css";

import { useState } from "react";

export const CreateRoomForm = () => {
  const [roomType, setRoomType] = useState("public");

  return (
    <form className="CreateRoomForm">
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
        <select
          className="form-select"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        >
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
  );
}
