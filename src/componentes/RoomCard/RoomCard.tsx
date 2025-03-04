export const RoomCard = ({ name }) => {
  return (
    <div className="list-group-item bg-dark text-light d-flex align-items-center">
      <img src="https://placehold.co/50" className="rounded me-3" alt="Room" />
      <span>{name}</span>
    </div>
  );
}
