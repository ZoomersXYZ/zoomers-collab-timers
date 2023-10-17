import { useEffect, useRef } from "react";
import io from "socket.io-client";

const useSocket = (url) => {
  const { current: socket } = useRef(io(url));
  // const { current: socket } = useRef(io(url,{
  //   autoConnect: false
  // }));
  useEffect(() => {
    return () => {
      socket && socket.removeAllListeners();
      socket && socket.close();
    };
  }, [socket]);
  return [socket];
};

export default useSocket;
