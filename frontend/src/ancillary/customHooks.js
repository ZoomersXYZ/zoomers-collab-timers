import React, { useState, useCallback, useReducer } from 'react';

function useUpdate() {
  const [ , setF ] = useState( 0 );
  const handleF = useCallback( () => setF( k => k + 1 ), [ setF ] );
  return handleF;
};

// 
function useRUpdate() {
  const [ , setF ] = useReducer( k => k + 1, 0 );
  return () => setF();
};

export { useUpdate, useRUpdate };
