import { createContext } from "react";

const AnalyticsContext = createContext( null );
const GroupContext = createContext( null );
const RoomContext = createContext( null );
const SocketContext = createContext( null );
const UserContext = createContext( { nick: null, email: null } );
const RoomHookishContext = createContext( null );

export { AnalyticsContext, GroupContext, RoomContext, SocketContext, RoomHookishContext, UserContext };
