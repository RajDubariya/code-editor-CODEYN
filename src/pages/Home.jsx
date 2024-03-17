import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoomId = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success(`Created A New Room !!`);
  };

  const handleJoinClick = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & USERNAME is required !!");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: { username },
    });
  };

  return (
    <>
      <div className="text-white h-screen w-full flex items-center justify-center">
        <div className="border border-slate-700/70 rounded-lg p-5 w-1/4 bg-slate-800/50">
          <h1 className="text-3xl tracking-widest font-semibold inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-violet-500 to-90%">
            CODEYN
          </h1>
          <input
            className="flex h-10 w-full rounded-md border border-slate-500/30 bg-slate-700 px-3 py-2  placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 my-3"
            type="text"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            className="flex h-10 w-full rounded-md border border-slate-500/30 bg-slate-700 px-3 py-2  placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 my-3"
            type="text"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="flex justify-end">
            <button
              onClick={handleJoinClick}
              type="button"
              className="rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 float-end"
            >
              Join
            </button>
          </div>
          <div className="flex justify-end">
            <p className="capitalize text-sm flex pt-2">
              Don't have an invitation ?
              <span
                onClick={createNewRoomId}
                className="text-green-500 underline ml-1 cursor-pointer"
              >
                Create new room
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
