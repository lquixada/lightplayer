
// Running on node.js enviroment
if (typeof module === 'object') {
	var o = require('./js/lib/o.min.js');
}

o.Event = o.Class({
	fire: function (eventName, data) {
		data = data || {};

		if (arguments.length === 0) {
			this._fireAll(data);
		} else {
			this._fireOnly(eventName, data);
		}
	},

	off: function (eventName, fn) {
		var events = this._getEvents(),
			listeners = events[eventName];

		switch (arguments.length) {
			case 0: this._resetEvents(); break;
			case 1: delete events[eventName]; break;
			case 2:
				for (var i = 0; i < listeners.length; i++) {
					if (listeners[i] === fn) {
						listeners.splice(i, 1);
						break;
					}
				}
		}
	},

	on: function (eventName, fn) {
		var that = this,
			events = this._getEvents();
		
		if (!events[eventName]) {
			events[eventName] = [];
		}

		events[eventName].push(fn);

		return {
			eventName: eventName,
			callback: fn,
			unsub: function () {
				that.off(this.eventName, this.callback);
			}
		};
	},

	// private

	_getEvents: function () {
		if (!this._events) {
			this._resetEvents();
		}

		return this._events;
	},

	_resetEvents: function () {
		this._events = {};
	},

	_fireAll: function (data) {
		var events = this._getEvents();

		for (var eventName in events) {
			this._fireOnly(eventName, data);
		}
	},

	_fireOnly: function (eventName, data) {
		var events = this._getEvents();
		var callbacks = events[eventName] || [];

		for (var i = 0; i < callbacks.length; i++) {
			callbacks[i](eventName, data);
		}
	}
});

// aliases
o.Event.prototype.sub	= o.Event.prototype.on;
o.Event.prototype.unsub = o.Event.prototype.off;
o.Event.prototype.pub	= o.Event.prototype.fire;

if (typeof module === 'object') {
	module.exports = o;
}

