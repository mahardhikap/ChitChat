export function ListRooms({ username,getRoomId }) {
  return <div className="p-3 border-b font-bold truncate" onClick={()=>{getRoomId}}>{username}</div>;
}
