module.exports = function ( app, db ) {
    var module = {};

    module.auth = function ( req, res ) {
        // This will be available 'outside'.
        // Authy stuff that can be used outside...
    };

    // Other stuff...
    module.pickle = function( cucumber, herbs, vinegar ) {
        // This will be available 'outside'.
        // Pickling stuff...
    };

    function jarThemPickles( pickle, jar ) {
        // This will be NOT available 'outside'.
        // Pickling stuff...

        return pickleJar;
    };

    return module;
};

// Or?

const thisOne = function ( app, db ) {
    var module = {};

    module.auth = function ( req, res ) {
        // This will be available 'outside'.
        // Authy stuff that can be used outside...
    };

    // Other stuff...
    module.pickle = function( cucumber, herbs, vinegar ) {
        // This will be available 'outside'.
        // Pickling stuff...
    };

    function jarThemPickles( pickle, jar ) {
        // This will be NOT available 'outside'.
        // Pickling stuff...

        return pickleJar;
    };

    return module;
};

module.exports = thisOne;
