const db = require( './../config/firebase' );
const l = require( './../config/winston' );
const { isEmpty, isObject } = require( './../utilities/general' );
const { initNsp } = require( './InitNsp' );

// ## h2. Initializing
// @TODO can initialize with the keys immediately
let simpSock = null;
let nspace = null;
let nspName = null;
let ref = null;
// shortening
const v = process.env;

let core = null;
let seshie = null;
let sassy = null;
let gCore = null;

// ## h2. Socket
l.struct.info( '-- -- Pre-SOCKET -- --' );
const group = socket => {
  // #### h4. Initialization
  // @TODO put these variables in a func to limit func global scope
  const { client, id, nsp, emit, join, on } = socket;
  const simpSock = { client, id, nsp, emit, join, on };

  nspace ??= socket.nsp;
  nspName ??= nspace.name.substring( 7 );
};
l.struct.info( '-- -- Post-SOCKET -- --' );

module.exports = group;
