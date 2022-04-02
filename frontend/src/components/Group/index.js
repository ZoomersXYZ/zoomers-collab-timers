// Core React
import React, { useEffect, useState, useContext } from 'react';

import ReactGA from 'react-ga';

// Own components
import { GroupContext } from '../Contexts';

import ForcedInput from './../ForcedInput';
import Users from './../Users';
import ActivityLog from './../ActivityLog';

import GroupOfTimers from './../GroupOfTimers';
import Add from './../Room/Add';
import Delete from './../Room/Delete';

import './styles.scss';
import l from './../../config/winston';
import { isEmpty } from './../../ancillary/helpers/general';

// Specific for this file
import io from 'socket.io-client';
import { getData, getLocal, setLocal } from './utilities';

// Main component
const RoomsGroup = () => {
  const urlPath = window.location.pathname;
  const hostName = window.location.hostname;
  let ioUrl = null;

  if ( hostName.includes( 'ci' ) ) {
    ioUrl = 'https://ci.default.collab-timers-k.uc.r.appspot.com';
  } else if ( process.env.NODE_ENV === 'production' ) { 
    ioUrl = 'https://ktimers.zoomers.xyz';
    // ioUrl = 'https://api.timers.zoomers.xyz';
    // ioUrl = 'https://collab-timers-k.uc.r.appspot.com';
  } else if ( process.env.NODE_ENV === 'development' ) {
    ioUrl = window.location.hostname + ':' + process.env.REACT_APP_SOCKET_PORT;
  };

  const socket = io( ioUrl + urlPath );

  // Global, Contexts
  const { gName } = useContext( GroupContext );

  // Regularly/User changing state
  const [ rooms, setRooms ] = useState( [] );
  // user handle
  const [ nickName, setNickName ] = useState( null );
  const [ email, setEmail ] = useState( null );

  ////
  // useEffect primarily. 
  ////

  const [ showForced, setForced ] = useState( false );

  // Assumed only for mount
  useEffect( () => {
    const ownSocketInitial = ( name ) => {
      const CONNECT = 'connect';
      const DISCONNECT = 'disconnect';
      const ERROR = 'error';

      const LIST_USERS = 'list users';
      const USER_LEFT = 'user left';

      const handleNewUser = () => {
        const CONFIRM_INITIAL_PING = 'confirm initial ping';
        const CONFIRM_INITIAL_PONG = 'confirm initial pong';
        const ADD_USER = 'add user';
        // console.log( 'handleNewUser 1' );
        const confirmInitialPing = id => {
          console.log( 'confirmInitialPing 1' );
          if ( isEmpty( id ) ) return false;
          socket.emit( CONFIRM_INITIAL_PONG );
          console.log( 'confirmInitialPing 3 + handleNewUser 2' );
        };
        socket.emit( ADD_USER, nickName, email );
        console.log( 'handleNewUser 3 after ADD_USER' );
        socket.on( CONFIRM_INITIAL_PING, confirmInitialPing );
      };

      const listUsers = ( e ) => {
        setUsers( e.users );
      };

      const userLeft = ( e ) => {
        setUsers( e.users );
      };

      const onConnect = () => {
        handleNewUser();
      };

      const onError = err => {
        console.error( ERROR, err );
        l.gen.error( ERROR, err );
      };

      // @@TODO erm. this was causing disconnecting to happen 5x instead of just 1x when refreshing browser.
      // Maybe this was for older sockets.io versions? Like V2?
      // @TOLOOKUP later. Likely this is looking for the server initiating the disconnect.
      // If there is no "io client disconnect" recently, then it's likelier it began from the server
      // @UPDATE - this stuff is messy. have a possible interim solution in backend.
      const onDisconnect = reason => {
        l.gen.error( 'l reason', reason );
        console.error( 'reason', reason );
        if ( reason === 'io server disconnect' ) {
          // the disconnection was initiated by the server, reconnect attempt here
          socket.connect();
        } else {
          return;
        };
        // else the socket will automatically try to reconnect -- wat??
      };

      // Sockets
      socket.on( CONNECT, onConnect );
      socket.on( DISCONNECT, onDisconnect );
      socket.on( ERROR, onError );
      socket.on( LIST_USERS, listUsers );
      socket.on( USER_LEFT, userLeft );      
    };

    const { nick, email } = getLocal();
    if ( !nick || !email ) {
      setForced( true );
    } else {
      setNickName( nick );
      setEmail( email );
      setUserEnabled( true );
    };
    fetchData( gName );
    ownSocketInitial( gName );

    return () => {
      console.log( 'returning to disconnect' );
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ gName, nickName, email ] );

  const fetchData = async ( name ) => {
    const data = await getData( name );
    setRooms( data );
  };

  const handleForcedInput = ( nick, email ) => {
    setLocal( nick, email );

    setNickName( nick );
    setEmail( email );
    setUserEnabled( true );

    setForced( false );
    return true;
  };

  
  ////
  // useEffects primarily. Meant for child components.
  // @TODO ugly. Should be refactored.
  ///

  const [ users, setUsers ] = useState( [] );
  // @TODO ugly, refactor
  const [ userEnabled, setUserEnabled ] = useState( false );
  useEffect( () => { 
    ReactGA.initialize( 'G-MZDK05NDHT', {
      debug: true,
      titleCase: false,
      gaOptions: {
        // userId: socket.id, 
        usernameId: nickName, 
        emailId: email 
      }
    } );
    ReactGA.pageview( window.location.pathname );    
  }, [ userEnabled, socket.id, nickName, email ] );

  const [ roomDeleted, setRoomDeleted ] = useState( false );
  useEffect( () => { 
    const TIMER_REMOVED = 'timer removed';
    if ( roomDeleted ) {
      socket.emit( TIMER_REMOVED, roomDeleted );
    };
    setRoomDeleted( false );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ roomDeleted ] );

  const roomsCheck = rooms && Array.isArray( rooms ) && rooms.length > 0;
  

  //// Render
  return (
    <>
      { showForced && 
        <div>
          <ForcedInput 
            show={ showForced } 
            handler={ handleForcedInput } 
          />
        </div>
      }

      <Users 
        // groupName={ name } @KBJ
        data={ users } 
      />

      <div id="upper-rooms">
        { roomsCheck && 
        <>
          <h3 className="group__pre-listing">
            All timers in this group:
          </h3>
          <ul className="group__listing">
            { rooms.map( arrival => 
              <li key={ `room-toc-list-${ arrival.name }` }>
                { arrival.name } 
                <Delete 
                  group={ gName } 
                  setRooms={ setRooms } 
                  thisRoom={ arrival.name } 
                  setDelete={ setRoomDeleted } 
                />
              </li>
            ) } 
          </ul>
        </>
        }
        <Add 
          group={ gName } 
          { ...{ setRooms } } 
        />
      </div>

      <hr className="rooms-borderbottom" />

      <ActivityLog 
        userEnabled={ userEnabled } 
        // group={ name } @KBJ
      />
      
      <GroupOfTimers 
        check={ roomsCheck } 
        { ...{ 
          socket, 
          rooms, 
          userEnabled 
        } } 
      />
    </>
  );
};

// RoomsGroup.propTypes = {};

export default RoomsGroup;
