
var o = {
	version: '0.3.2',

	extend: function (target, source) {
		for (var key in source) {
			if (source.hasOwnProperty(key)) {
				target[key] = source[key];
			}
		}

		return target;
	},

	extendClass: function (Class, source) {
		this.extend(Class, source);
	},

	extendInstances: function (Class, source) {
		this.extend(Class.prototype, source);
	}
};

o.Object = function () {
	this.Class = o.Object;
};

o.Object.prototype = {
	init: function (options) {
		o.extend(this, options);
	},

	_super: function () {
		var result, fn,
			that = this,
			args = arguments,
			// who called the _super() method???
			caller = arguments.callee.caller;

		// for every property of every prototype, check if the caller is present
		this._climbPrototypeChain(function (proto, prop) {
			if (proto[prop] === caller) {
				// now let the javascript find the upper method from that point on.
				fn = proto.Class.prototype[prop];

				if (typeof fn === 'function') {
					result = fn.apply(that, args);

					// break the loop
					return true;
				} else {
					throw 'not implemented error';
				}
			}
		});

		return result;
	},

	_climbPrototypeChain: function (fn) {
		var proto = this;

		// iterate through the prototype chain
		while (proto) {
			// iterate through the properties of this prototype
			for (var prop in proto) {
				if (proto.hasOwnProperty(prop)) {
					if (fn(proto, prop)) {
						return;
					}
				} // end if
			} // enf for

			proto = proto.Class.prototype;
		} // end while
	} // end function
};

// this is a wrapper for the constructor function
o.Class = function (options) {
	var Superclass;
	
	options = options || {};

	// let's build the constructor function
	function Constructor() {
		var options, Superclass;

		this.Class = Constructor;

		// if not instatiating from the o.Class function
		if (this.Class.caller !== o.Class) {
			this.init.apply(this, arguments);
		}
	}

	Superclass = options.extend || o.Object;

	// Constructor prototype will be an instance of superclass
	// with the properties provided.
	Constructor.prototype = o.extend(new Superclass(), options);

	return Constructor;
};

if (typeof module === 'object') {
	module.exports = o;
}
