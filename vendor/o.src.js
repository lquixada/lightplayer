
var o = {};

o.Object = function () {};

o.Object.prototype = {
	init: function (options) {
		o.add(this, options);
	},

	_super: function () {
		// Get the caller function reference
		var caller = arguments.callee.caller,
			// Go to the bottom of the prototype chain
			proto  = this.constructor.prototype;
		
		// Iterate through the prototype chain
		while (proto) {
			// Iterate through the properties of this prototype
			for (var prop in proto) {
				// Check if the caller is right in this prototype
				if (proto.hasOwnProperty(prop)) {
					if (proto[prop] === caller) {
						// If it is, we've found the prototype.
						// Now go to the next prototype in the chain and
						//call the method with the same name from
						return proto.constructor.prototype[prop].apply(this, arguments);
					}
				}
			}
			
			proto = proto.constructor.prototype;
		}
	}
};

// This is a wrapper for the constructor function
o.Class = function (options) {
	var Superclass;
	
	options = options || {};
	Superclass = options.extend;

	// Let's build the constructor function
	var constructor = function () {
		this.constructor = constructor;

		// if extending class (need better work here)
		if (arguments[0] === o) {
			return;
		}

		this.init.apply(this, arguments);
	};
	
	// Use Superclass as prototype, otherwise use the default: o.Object
	constructor.prototype = Superclass
			? new Superclass(o)
			: new o.Object();

	// Add all properties and methods to the prototype.
	// This way, they can be shadowed on subclasses
	for (var prop in options) {
		constructor.prototype[prop] = options[prop];
	}

	return constructor;
};

o.add = function (target, source) {
	for (var key in source) {
		target[key] = source[key];
	}
};

if (typeof module === 'object') {
	module.exports = o;
}
