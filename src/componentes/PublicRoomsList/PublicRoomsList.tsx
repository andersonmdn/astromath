import RoomCard from "../RoomCard";

export const PublicRoomsList = () => {
  const publicRooms = ["Sala Pública 1", "Sala Pública 2", "Sala Pública 3"];

  return (
    <div className="list-group">
      {publicRooms.map((room, index) => (
        <RoomCard key={index} name={room} />
      ))}
    </div>
  );
}
