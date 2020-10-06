const typeOrFalse = ( props, propName, componentName, type ) => {
  componentName = componentName || 'ANONYMOUS';
  const err = new Error( propName + ' in ' + componentName + ' is not false or ' + type );
  // Not sure why if the initial part check isn't true, to still return null. But...
  return props[ propName ] 
    ? ( ( typeof props[ propName ] === type ) || false ? null : err ) 
    : null;
}
const stringOrFalse = ( props, propName, componentName ) => typeOrFalse( props, propName, componentName, 'string' );
const numberOrFalse = ( props, propName, componentName ) => typeOrFalse( props, propName, componentName, 'number' );

export { typeOrFalse, stringOrFalse, numberOrFalse };
