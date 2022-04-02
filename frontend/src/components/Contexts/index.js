import { createContext } from "react";

const GroupContext = createContext( null );
const RoomContext = createContext( null );
const SocketContext = createContext( null );
const UserContext = createContext( { nick: null, email: null } );

export { GroupContext, RoomContext, SocketContext, UserContext };
