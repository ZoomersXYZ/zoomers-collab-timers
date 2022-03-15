// Core React
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Libraries
// import { useDocumentData } from 'react-firebase-hooks/firestore';
import { formatRelative, sub } from 'date-fns';
import { collection, onSnapshot, limit, query, where, orderBy } from "firebase/firestore";

import db from './../../config/firebase';

// Own components
import ForcedInput from './../ForcedInput';
import Users from './../Users';
import ActivityLog from './../ActivityLog';

import Room from './../Room/Room';
import Add from './../Room/Add';
import Delete from './../Room/Delete';

import './styles.scss';
import l from './../../config/winston';
import { isEmpty } from './../../ancillary/helpers/general';

// Specific for this file
import io from 'socket.io-client';
import { getData, getLocal, setLocal } from './utilities';

// Main component
const RoomsGroup = ( { name } ) => {
  const urlPath = window.location.pathname;
  const lastDirectory = urlPath.split( '/' ).pop();

  const socket = io( process.env.REACT_APP_SOCKET + urlPath );

  // const socket = io( urlPath );

  // Regularly/User changing state
  const [ rooms, setRooms ] = useState( [] );
  // user handle
  const [ nickName, setNickName ] = useState( null );
  const [ email, setEmail ] = useState( null );
  // Activity log. Meant for global/group and room
  const [ log, setLog ] = useState( [] );

  ////
  // useEffect primarily. Assumed just for mount
  ////

  const [ showForced, setForced ] = useState( false );

  useEffect( () => {
    // Core
    const d = new Date();
    const oneDayAgo = sub( d, {
      days: 7 
    } ).getTime();

    const rootRef = collection( db, 'groups', lastDirectory, 'log' );
    const ref = query( rootRef, where( 'timestamp', '>', oneDayAgo ), orderBy( 'timestamp', 'desc' ), limit( 50 ) );

    const stream = onSnapshot( 
      ref, 
      doc => {
        const arr = [];
        const current = new Date();
        doc.forEach( solo => { 
          const data = solo.data();
          data.formattedTime = formatRelative( data.timestamp, current );
          arr.push( data );
        } );
        arr.reverse();
        setLog( arr );
      }, 
      err => {
        console.log( err );
        // setErr( err );
      } 
    );
    return () => stream();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

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
        const confirmInitialPing = id => {
          if ( isEmpty( id ) ) return false;
          socket.emit( CONFIRM_INITIAL_PONG );
        };
        socket.emit( ADD_USER, nickName, email );
        socket.on( CONFIRM_INITIAL_PING, confirmInitialPing );
      };

      // Users

      const listUsers = ( e ) => {
        setUsers( e.nsUsers );
      };

      const userLeft = ( e ) => {
        setUsers( e.nsUsers );
      };


      // Based

      const onConnect = () => {
        handleNewUser();
      };

      const onError = err => {
        console.error( ERROR, err );
        l.gen.error( ERROR, err );
      };

      const onDisconnect = reason => {
        l.gen.error( 'l reason', reason );
        console.error( 'reason', reason );
        if ( reason === 'io server disconnect' ) {
          // the disconnection was initiated by the server, you need to reconnect manually
          socket.connect();
        } else {
          return;
        };
        // else the socket will automatically try to reconnect
      };

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
    fetchData( name );
    ownSocketInitial( name );

    return () => {
      console.log( 'returning to disconnect' );
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ name, nickName, email ] );

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
  // @TODO ugly! Should be refactored.
  ///

  const [ users, setUsers ] = useState( [] );
  // @TODO ugly, refactor
  const [ userEnabled, setUserEnabled ] = useState( false );

  // Deleting room
  const [ roomDeleted, setRoomDeleted ] = useState( false );
  useEffect( () => { 
    const TIMER_REMOVED = 'timer removed';
    if ( roomDeleted ) {
      socket.emit( TIMER_REMOVED, roomDeleted );
    };
    setRoomDeleted( false );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ roomDeleted ] );

  ////
  // Render
  ////
  
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
        groupName={ name } 
        data={ users } 
      />

      <div>
        { rooms && Array.isArray( rooms ) && rooms.length > 0 && 
        <>
          <h3 className="group__pre-listing">All timers in this group:</h3>
          <ul className="group__listing">
            { rooms.map( arrival => 
              <li key={ `room-toc-list-${ arrival.name }` }>
                { arrival.name }
                <Delete 
                  doc={ name } 
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
          doc={ name } 
          setRooms={ setRooms } 

        />
      </div>

      <hr className="rooms-borderbottom" />

      <ActivityLog 
        log={ log } 
        userEnabled={ userEnabled } 
        group={ name } 
      />

      <>
        { rooms && Array.isArray( rooms ) && rooms.length > 0 && 
          <div id="all-timers">
          { rooms.map( arrival => 
              <Room 
                key={ `room-${ arrival.name }` } 
                roomie={ arrival } 

                socket={ socket } 
                group={ name } 

                log={ log } 
                userEnabled={ userEnabled }         
              />
            )
          }
          </div>
        }
      </>      
    </>
  );
};

RoomsGroup.propTypes = {
  name: PropTypes.string.isRequired 
};

export default RoomsGroup;