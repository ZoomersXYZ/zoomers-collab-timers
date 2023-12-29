// Core React
import React, { useEffect, useState, useContext } from 'react';

import ReactGA from 'react-ga';

// Own components
import { GroupContext, UserContext } from '../Contexts';

import ForcedInput from './../ForcedInput';
import Users from './../Users';
import ActivityLog from './../ActivityLog';

import GroupOfTimers from './../GroupOfTimers';
import Add from './../Room/Add';
import Delete from './../Room/Delete';

import './styles.scss';
import { delay, isEmpty } from './../../ancillary/helpers/general';

// Specific for this file
import useSocket from '../Contexts/useSocket';
import { getData, getLocal, setLocal } from './utilities';
import GroupNotifications from './notifications';

// Main component
const RoomsGroup = () => {
  const urlPath = window.location.pathname;
  const hostName = window.location.hostname;
  let ioUrl = null;

  if ( hostName.includes( 'ci' ) ) {
    ioUrl = 'https://ci.default.collab-timers-z.uc.r.appspot.com';
  } else if ( import.meta.env.PROD ) { 
    // ioUrl = 'https://mtimers.zoomers.xyz';
    ioUrl = ''
    // Group 1c
  } else if ( import.meta.env.DEV ) {
    const socketPort = import.meta.env.VITE_SOCKET_PORT ? import.meta.env.VITE_SOCKET_PORT : 8080;
    if ( hostName.includes( '.loca.lt' ) ) {
      // local tunneling with localtunnel -- broken. connection refused
      ioUrl = 'http://ztimer' + '.loca.lt' + ':' + socketPort;
    } else if ( hostName.includes( 'atextbooksituation' ) ) {
      // for Cloudflare tunneling
      ioUrl = import.meta.env.CF_SOCKET_DOMAIN ? import.meta.env.CF_SOCKET_DOMAIN : 'https://timer-dev.atextbooksituation.com';
    } else {
      // normal local dev
      // ioUrl = '';
      ioUrl = window.location.hostname + ':' + socketPort;
    };
  };

  const [socket] = useSocket(ioUrl + urlPath);
    
  // Group 1b
  const emit = ( ...restoros ) => socket.emit( ...restoros );

  // Global, Contexts
  const { gName } = useContext( GroupContext );

  // Regularly/User changing state
  const [ rooms, setRooms ] = useState( [] );
  // user handle
  const [ nickname, setNick ] = useState( null );
  const [ mail, setEmail ] = useState( null );
  const [ aUser, setAUser ] = useState( { nickname, mail } );

  ////
  // useEffect primarily. 
  ////

  useEffect( () => { 
    if ( !nickname || !mail ) {
      return;
    };
    const ADD_USER = 'add user';
    // if ( nick && email ) {
      // setAUser( { nick, email } );
      // emit( ADD_USER, nick, email );
    // } else {
      setAUser( { nickname, mail } );

      emit( ADD_USER, nickname, mail );
    // };
  }, [ nickname, mail ] );

  const [ showForced, setForced ] = useState( false );

  // Assumed only for mount
  useEffect( () => {
    const CONNECT = 'connect';
    const DISCONNECT = 'disconnect';
    const ERROR = 'error';
    const LIST_USERS = 'list users';
    const USER_LEFT = 'user left';

    let { nick, email } = getLocal();
    if ( !nick || !email ) {
      setForced( true );
    } else {
      setNick( nick );
      setEmail( email );
      setUserEnabled( true );
    };

    const ownSocketInitial = ( name ) => {
      // const handleNewUser = () => {
      //   const confirmInitialPing = id => {
      //     if ( isEmpty( id ) ) return false;
      //     emit( 'confirm initial pong' );
      //     console.log( 'confirmInitialPing 2nd + 3rd' );
      //   };
      //   // console.log('nick', nick);
      //   // if ( nick && email ) {
      //   //   emit( ADD_USER, nick, email );
      //   // };
      //   socket.on( 'confirm initial ping', confirmInitialPing );
      // };

      const listUsers = ( e ) => {
        console.log('got user list');
        setUsers( e.users );
      };

      const userLeft = ( e ) => {
        setUsers( e.users );
      };

      const onConnect = () => {
        // console.log('check')
        emit( 'group entered' );
        delay( 500 );
        // handleNewUser();
      };

      const onError = err => {
        console.error( ERROR, err );
      };

      // #docs Group 1a
      const onDisconnect = reason => {
        console.error( 'l reason', reason );
        if ( reason === 'io server disconnect' ) {
          // the disconnection was initiated by the server, reconnect attempt here
          socket.connect();
        } else {
          // useSocket takes care of disconnecting now
        };
        // else the socket will automatically try to reconnect
      };

      // Sockets
      socket.on( CONNECT, onConnect );
      socket.on( DISCONNECT, onDisconnect );
      socket.on( ERROR, onError );
      socket.on( LIST_USERS, listUsers );
      socket.on( USER_LEFT, userLeft );      
    };
    fetchData( gName );
    ownSocketInitial( gName );

    // return () => {
      // console.log( 'returning to disconnect' );
      // socket.disconnect();
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );
  // }, [ gName, nick, email ] );

  const fetchData = async ( name ) => {
    const data = await getData( name );
    setRooms( data );
  };

  const handleForcedInput = ( nick, email ) => {
    setLocal( nick, email );

    setNick( nick );
    setEmail( email );
    setUserEnabled( true );

    setForced( false );
    return true;
  };

  
  ////
  // useEffects primarily. Meant for child components.
  // @TODO ugly. Should be refactored.
  ///

  const [ users, setUsers ] = useState( {} );
  // @TODO ugly, refactor
  const [ userEnabled, setUserEnabled ] = useState( false );
  useEffect( () => { 
    ReactGA.initialize( 'G-MZDK05NDHT', {
      debug: false,
      titleCase: false,
      gaOptions: {
        userId: socket.id, 
        usernameId: nickname, 
        emailId: mail 
      }
    } );
    ReactGA.pageview( window.location.pathname );    
  }, [ userEnabled, socket.id, nickname, mail ] );

  const [ roomDeleted, setRoomDeleted ] = useState( false );
  useEffect( () => { 
    const TIMER_REMOVED = 'timer removed';
    if ( roomDeleted ) {
      emit( TIMER_REMOVED, roomDeleted, aUser );
    };
    setRoomDeleted( false );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ roomDeleted ] );

  const roomsCheck = rooms && Array.isArray( rooms ) && rooms.length > 0;

  const resetErrors = ( setErrors, timeOut = 2500 ) => {
    setTimeout( () => setErrors( {} ), timeOut );
  };

  //// Render
  return (
    <UserContext.Provider value={ aUser }>
      { showForced && 
        <div>
          <ForcedInput 
            show={ showForced } 
            handler={ handleForcedInput } 
            resetErrors={ resetErrors } 
          />
        </div>
      }

      <Users 
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
                  thisRoom={ arrival.name } 
                  setDelete={ setRoomDeleted } 
                  { ...{ setRooms, resetErrors } } 
                />
              </li>
            ) } 
          </ul>
        </>
        }
        <Add           
          { ...{ setRooms, resetErrors } } 
        />
      </div>

      <hr className="rooms-borderbottom" />

      <ActivityLog 
        userEnabled={ userEnabled } 
      />

      <GroupNotifications 
        gName={ gName } 
      />
      
      <GroupOfTimers 
        check={ roomsCheck } 
        { ...{ 
          socket, 
          rooms, 
          userEnabled 
        } } 
      />
    </UserContext.Provider>
  );
};

// RoomsGroup.propTypes = {};

export default RoomsGroup;
