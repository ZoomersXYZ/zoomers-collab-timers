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
    // Group 1c
  } else if ( process.env.NODE_ENV === 'development' ) {
    ioUrl = window.location.hostname + ':' + process.env.REACT_APP_SOCKET_PORT;
  };

  const socket = io( ioUrl + urlPath );
  // Group 1b
  const { emit } = socket;

  // Global, Contexts
  const { gName } = useContext( GroupContext );

  // Regularly/User changing state
  const [ rooms, setRooms ] = useState( [] );
  // user handle
  const [ nick, setNick ] = useState( null );
  const [ email, setEmail ] = useState( null );
  const [ aUser, setAUser ] = useState( { nick, email } );e

  ////
  // useEffect primarily. 
  ////

  useEffect( () => { 
    setAUser( { nick, email } );
  }, [ nick, email ] );

  const [ showForced, setForced ] = useState( false );

  // Assumed only for mount
  useEffect( () => {
    const CONNECT = 'connect';
    const DISCONNECT = 'disconnect';
    const ERROR = 'error';
    const LIST_USERS = 'list users';
    const USER_LEFT = 'user left';
    const ADD_USER = 'add user'

    const ownSocketInitial = ( name ) => {
      const handleNewUser = () => {
        const confirmInitialPing = id => {
          console.log( 'confirmInitialPing 1' );
          if ( isEmpty( id ) ) return false;
          emit( 'confirm initial pong' );
          console.log( 'confirmInitialPing 2' );
        };
        emit( ADD_USER, nick, email );
        console.log( 'handleNewUser 3' );
        socket.on( 'confirm initial ping', confirmInitialPing );
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

      // #docs Group 1a
      const onDisconnect = reason => {
        l.gen.error( 'l reason', reason );
        if ( reason === 'io server disconnect' ) {
          // the disconnection was initiated by the server, reconnect attempt here
          socket.connect();
        } else {
          return;
        };
        // else the socket will automatically try to reconnect - wat?
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
      setNick( nick );
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
  }, [ gName, nick, email ] );

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

  const [ users, setUsers ] = useState( [] );
  // @TODO ugly, refactor
  const [ userEnabled, setUserEnabled ] = useState( false );
  useEffect( () => { 
    ReactGA.initialize( 'G-MZDK05NDHT', {
      debug: true,
      titleCase: false,
      gaOptions: {
        userId: socket.id, 
        usernameId: nick, 
        emailId: email 
      }
    } );
    ReactGA.pageview( window.location.pathname );    
  }, [ userEnabled, socket.id, nick, email ] );

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
