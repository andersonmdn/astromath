
export const JoinRoomForm = () => {
    return (
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
    );
  }
  