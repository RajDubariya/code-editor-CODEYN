import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ACTIONS from "../Action";
import Client from "../components/Client";
import EditorComp from "../components/EditorComp";
import { initSocket } from "../socket";
const EditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { roomid } = useParams();
  const username = location.state?.username;

  const socketRef = useRef(null);
  const [clients, setClients] = useState([]);
  const [code, setCode] = useState("/* CODEYN */");

  function handleErrors(e) {
    console.log("socket error", e);
    toast.error("Socket connection failed, try again later.");
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      socketRef.current.emit(ACTIONS.JOIN, {
        roomid,
        username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
        }
        setClients(clients);
      });
      // Listen for code updates from the server
      socketRef.current.on(ACTIONS.SYNC_CODE, (newCode) => {
        setCode(newCode);
      });
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.off(ACTIONS.SYNC_CODE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCodeChange = (newCode) => {
    // Update local code state
    setCode(newCode);
    // Emit the updated code to the server
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomid,
      code: newCode,
    });
  };

  const copyRoomId = () => {
    try {
      navigator.clipboard.writeText(roomid);
      toast.success("ROOM ID copied");
    } catch (error) {
      console.log(error);
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="w-full h-screen text-white flex items-center">
      <div className="bg-slate-950 border-r border-slate-600/40 w-1/6 h-full p-3 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl tracking-widest font-semibold inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-violet-500 to-90%">
            CODEYN
          </h1>
          <div className="py-2 mt-4">
            <p className="text-lg text-gray-400">Connected</p>

            <div className=" flex flex-wrap gap-3 mt-4">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="rounded-md w-full my-1.5 bg-slate-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 float-end"
            onClick={copyRoomId}
          >
            Copy ROOM ID
          </button>
          <button
            type="button"
            className="rounded-md w-full my-1.5 bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 float-end"
            onClick={leaveRoom}
          >
            Leave
          </button>
        </div>
      </div>
      <div className="w-full">
        <EditorComp code={code} handleCodeChange={handleCodeChange} />
      </div>
    </div>
  );
};

export default EditorPage;
