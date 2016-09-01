/**
 * <p>An implementation of a message bus system (a.k.a event bus) for Kadaster.</p>
 * <p>This implementation supports the use of channels and topics for a broader communication spectrum and performance.</p>
 * <p>It also provides you with the possibility of sending an event to those that have already subscribed ("standard" functionality) and to events that will describe in the future</p>
 * @name Bus
 * @namespace {object} Kadaster.Bus
 * @memberof Kadaster
 * @type {object}
 */

if (typeof Kadaster === "undefined") {
	var Kadaster = {};
}

Kadaster.bus = (function () {
	"use strict";

	// *** VARS
	var channels = []; // Collection of channels

	/**
	 * This function checks if a channel with name <name> is already present in the channel collection
	 * @method channelExists
	 * @param {string} name - name of the channel we want to check
	 * @returns {boolean|number} Returns the position if the channel is found, false otherwise
	 * @memberof Kadaster.Bus
	 * @instance
	 * @private
	 */
	function channelExists(name) {
		// Cycle through the channel collection and compare names
		for (var i = 0; i < channels.length; i++) {
			var channelName = channels[i].getName();
			if (channelName === name) {
				// Yes it exists, return true
				return i;
			}
		}

		// We looped through the lot and nothing returned, so we can return false.
		return false;
	} // channelExists

	/**
	 * This function returns a channel object with the name from the parameter, creating the channel if it doesn't exist.
	 * @method channel
	 * @param {string} name - name of the channel that you seek.
	 * @returns {Channel} The channel that you want
	 * @memberof Kadaster.Bus
	 * @instance
	 * @public
	 */
	function channel(name) {
		// Is our channel in the list with channels?
		var presence = channelExists(name);

		// Not present
		if (presence === false) {
			registerChannel(name);
			presence = channels.length - 1;
		}

		// Present! Return the channel itself
		return channels[presence];
	} // channel

	/**
	 * Registers a new channel to the Event bus. If the channel is already present, no action will be taken.
	 * @method registerChannel
	 * @param {string} name - name of the new channel
	 * @memberof Kadaster.Bus
	 * @instance
	 * @private
	 */
	function registerChannel(name) {
		// No it's not present, so we'll create a new channel
		var tempChannel = new Channel(name);
		channels.push(tempChannel);
	} // registerChannel

	/**
	 * Removes the given channel from the channel collection.
	 * @method removeChannel
	 * @param {string} name - the name of the channel
	 * @returns {boolean} True if success, false otherwise.
	 * @memberof Kadaster.Bus
	 * @instance
	 * @public
	 */
	function removeChannel(name) {
		// Get the index
		var index = channelExists(name);

		// Index is a location to the channel in the collection.
		// We'll remove it from the channel list
		channels.splice(index, 1);

		// Success
		return true;
	}

	/**
	 * <p>This function strips out the channel and topic name, and registers a function on that topic. If no topic is defined, an error is thrown.</p>
	 * <p>Shortcut for {@link Topic.when}</p>
	 * @see Topic#when
	 * @method when
	 * @param {string} direction - the channel and event. Will be created if it doesn't exist
	 * @param {function} func - the function to use when fire()'d.
	 * @throws "No topic defined"
	 * @memberof Kadaster.Bus
	 * @instance
	 * @public
	 */
	function when(direction, func) {
		var split = direction.split("/");
		var chnl = split[0];
		var tpc = split [1];

		if (tpc === undefined) {
			throw new Error("No topic defined for event '" + direction + "'.");
		}

		channel(chnl).topic(tpc).whenFired(func);
	}

	/**
	 * <p>Fires an event on a given channel, to all registered listeners. If no topic is defined, an error will be thrown.</p>
	 * <p>If a duplicate function with the same direction (channel/topic) already is defined, then this function will return without adding the function again. This can be overruled by setting <strong>forced</strong> to true</p>
	 * <p>Shortcut for {@link Kadaster.Bus.Channel.Topic#fire}.</p>
	 * @method fire
	 * @param {string} direction - the channel and topic. Will be created if it doesn't exist
	 * @param {object|string|number|boolean} data - a data object that will be passed to the listeners
	 * @param {boolean} [forced] - add this function even if it's already defined in the collection of listeners
	 * @memberof Kadaster.Bus
	 * @instance
	 * @public
	 */
	function fire(direction, data, forced) {
		var split = direction.split("/");
		var chnl = split[0];
		var tpc = split [1];

		if (tpc === undefined) {
			throw new Error("No topic defined for event '" + direction + "'.");
		}

		channel(chnl).topic(tpc).fire(data, forced);
	}

	/**
	 * Fire a message through the bus to all the current listeners and listeners that will be added in the future (that are delayed).
	 * @method fireDelayed
	 * @param {string} direction - channel and topic name, will be created if they do not already exist. An error will be thrown if only a channel is defined.
	 * @param {object|string|number|boolean} data - a data object that will be passed to the listeners
	 * @memberof Kadaster.Bus
	 * @instance
	 * @public
	 */
	function fireDelayed(direction, data) {
		var split = direction.split("/");
		var chnl = split[0];
		var tpc = split [1];

		if (tpc === undefined) {
			throw new Error("No topic defined for event '" + direction + "'.");
		}

		channel(chnl).topic(tpc).fireDelayed(data);
	}

	/**
	 * Accepts a message from the Bus, even if this listeners has registered after the event fire()'d (it is delayed).
	 * @method whenFiredDelayed
	 * @param {string} direction - channel and topic name. Will be created if they don't exist and it will throw an error if only a channel has been defined
	 * @param {function} func - the function to execute when the event has been fire()'d
	 * @param {boolean} [forced] - add this listener to the collection even if it's already been defined
	 * @memberof Kadaster.Bus
	 * @instance
	 * @public
	 */

	function whenFiredDelayed(direction, func, forced) {
		var split = direction.split("/");
		var chnl = split[0];
		var tpc = split [1];

		if (tpc === undefined) {
			throw new Error("No topic defined for event '" + direction + "'.");
		}

		channel(chnl).topic(tpc).whenFiredDelayed(func, forced);
	}

	// *** CLASSES
	/**
	 * This class forms the boilerplate of every Channel object.
	 * @class Channel
	 * @param {type} argName
	 * @returns {Channel}
	 * @memberof Kadaster.Bus
	 * @private
	 */
	var Channel = function (argName) {
		var name = argName;
		var topics = [];

		/**
		 * Checks if the topic exists in the topic collection
		 * @method topicExists
		 * @param {type} name -  the name of the topic
		 * @returns {boolean|number} Returns false if the topic isn't listed in the topic collection, returns its position if it is
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		function topicExists(name) {
			// Cycle through the channel collection and compare names
			for (var i = 0; i < topics.length; i++) {
				var topicsName = topics[i].getName();
				if (topicsName === name) {
					// Yes it exists, return true
					return i;
				}
			}

			// We looped through the lot and nothing returned, so we can return false.
			return false;
		}

		/**
		 * Registers a new topic to the Event bus. If the topic is already present, no action will be taken.
		 * @method registerTopic
		 * @param {string} name - name of the new topic
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		function registerTopic(name) {
			// No it's not present, so we'll create a new topic
			var tempTopic = new Topic(name);
			topics.push(tempTopic);
		} // registerTopic

		/**
		 * removeTopic
		 * Removes the given topic from the topic collection.
		 * @method removeTopic
		 * @param {string} name - the name of the topic
		 * @returns {Boolean} True if success, false otherwise.
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		this.removeTopic = function (name) {
			// Is the topic present in the collection?
			var index = topicExists(name);

			// Index is a location to the topic in the collection.
			// We'll remove it from the topic list
			topics.splice(index, 1);

			// Success
			return true;
		};

		/**
		 * This function returns a topic object with the name from the parameter, creating it if it doesn't exist.
		 * @method topic
		 * @param {string} name - name of the topic that you seek.
		 * @returns {Topic} The topic that you want.
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		this.topic = function (name) {
			// Is our topic in the list with topics?
			var presence = topicExists(name);

			// Not present
			if (presence === false) {
				registerTopic(name);
				presence = topics.length - 1;
			}

			// Present! Return the topic itself
			return topics[presence];
		}; // topic

		/**
		 * Registers listener in topic. Shortcut for {@link Topic#whenFired}
		 * @method when
		 * @param {string} tpc - the topic to use. Will be created if it doesn't exist
		 * @param {function} func - the function to be executed
		 * @param {boolean} [forced] - If set to true, the listener will be registered even if they already have been registered
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		this.when = function (tpc, func, forced) {
			this.topic(tpc).whenFired(func, forced);
		};

		/**
		 * Registers listener in topic, and sends an already fire()'d message to the listener if there is one. Shortcut for {@link Topic#whenFiredDelayed}
		 * @method whenFiredDelayed
		 * @param {string} tpc - the topic name
		 * @param {function} func - the function to execute
		 * @param {boolean} forced - registers the listener even if it's already been registered
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		this.whenFiredDelayed = function (tpc, func, forced) {
			this.topic(tpc).whenFiredDelayed(func, forced);
		};

		/**
		 * Fires event in topic. Shortcut for {@link Topic#fire}
		 * @method fire
		 * @param {string} tpc - the topic that you want to use, will be created if it doesn't exist.
		 * @param data {Object|string|number|Boolean} a data object that will be passed to the listeners
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		this.fire = function (tpc, data) {
			this.topic(tpc).fire(data);
		};

		/**
		 * @method fireDelayed
		 * @param {string} tpc - the name of the topic
		 * @param {object|string|number} data - data to be passed to the listeners
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		this.fireDelayed = function (tpc, data) {
			this.topic(tpc).fireDelayed(data);
		};

		/**
		 * Sets the name of the channel. Can also be set using new Channel(name).
		 * @method setName
		 * @param {string} argName - name of the channel
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		this.setName = function (argName) {
			name = argName;
		};

		/**
		 * Returns the name of the current channel
		 * @method getName
		 * @returns {string} the name of the channel
		 * @memberof Kadaster.Bus.Channel
		 * @instance
		 * @private
		 */
		this.getName = function () {
			return name;
		};
	};

	/**
	 * Boilerplate for the topics
	 * @class Topic
	 * @param {type} argName
	 * @returns {Topic}
	 * @memberof Kadaster.Bus
	 * @private
	 */
	var Topic = function (argName) {
		/**
		 * Topic name
		 * @member name
		 * @memberof Kadaster.Bus.Topic
		 * @type {string}
		 * @private
		 * @instance
		 */
		var name = argName;

		/**
		 * Listener collection
		 * @member listeners
		 * @memberof Kadaster.Bus.Topic
		 * @type {array}
		 * @private
		 * @instance
		 */
		var listeners = []; // Collection of listeners

		/**
		 * Delayed listener collection, these listeners will get a message upon registering even if it has already been fired
		 * @member delayedListeners
		 * @memberof Kadaster.Bus.Topic
		 * @type {array}
		 * @private
		 * @instance
		 */
		var delayedListeners = [];

		/**
		 * History of calls for delayed listeners, every delayedFire()'d call is logged here for newly registered listeners to call upon
		 * @member delayedCallHistory
		 * @memberof Kadaster.Bus.Topic
		 * @type {object}
		 * @private
		 * @instance
		 */
		var delayedCallHistory = {}; // The history of the delayed event. Will be filled with data if the event has been called.

		/**
		 * This function gets called when the event gets fired. It registers the listener in the collection
		 * @method whenFired
		 * @param {function} func - the function to be executed
		 * @param {boolean} forced - register the listener even if it already has been registered
		 * @memberof Kadaster.Bus.Topic
		 * @instance
		 * @private
		 */
		this.whenFired = function (func, forced) {
			forced = forced ? forced : false;

			// Keeper of the gate of the Duplicate Functions
			var same = false;

			// First, lets loop through the currently stored listener functions, so that this function will only be added if it's not already present
			for (var l = 0; l < listeners.length; l++) {
				if (listeners[l].toString() === func.toString()) {
					// SAME!!
					same = true;
				}
			}

			// By specifying "force", we can force the addition of a duplicate function in our listener collection.
			// This is mainly for debugging functions or situations where different named functions have the same body, for instance functions that will be expanded upon later.
			if (forced)
			{
				// We can override our blockage simply by setting the same var to false if it's been set to true.
				if (same) {
					same = false;
				}
			}

			if (!same) {
				// No same functions found, we can safely add this one..
				listeners.push(func);
			}
		};

		/**
		 * fires the event, causing all listener functions to be executed
		 * @method fire
		 * @param {object|string|number|boolean} data - a data object that will be passed to the listeners
		 * @memberof Kadaster.Bus.Topic
		 * @instance
		 * @private
		 */
		this.fire = function (data) {
			// Walk through the listeners collection
			for (var i = 0; i < listeners.length; i++) {
				listeners[i].call(undefined, data);
			}
		};

		/**
		 * This function gets called when the event get fired, and subsequently when new listeners have registered.
		 * @method whenFiredDelayed
		 * @param {function} func - The function to be executed
		 * @param {boolean} [forced] - Add the listener even if it's already been defined
		 * @memberof Kadaster.Bus.Topic
		 * @instance
		 * @private
		 */
		this.whenFiredDelayed = function (func, forced) {
			// Check if the history is empty, if not, fire the event
			if (delayedCallHistory) {
				func.call(undefined, delayedCallHistory.data);
			}

			forced = forced ? forced : false;

			// Keeper of the gate against duplicate functions!
			var same = false;

			// Store the function in our Listeners Collection, but only if it's not already present
			for (var l = 0; l < delayedListeners.length; l++) {
				if (delayedListeners[l].toString() === func.toString()) {
					// Same function found
					same = true;
				}
			}

			// By specifying "force", we can force the addition of a duplicate function in our listener collection.
			// This is mainly for debugging functions or situations where different named functions have the same body, for instance functions that will be expanded upon later.
			if (forced)
			{
				// We can override our blockage simply by setting the same var to false if it's been set to true.
				if (same) {
					same = false;
				}
			}

			if (!same) {
				// No duplicates, we can safely add this function!
				delayedListeners.push(func);
			}
		};

		/**
		 * Fires the event causing all registered listeners to be executed.
		 * Then saves the data in history
		 * @method fireDelayed
		 * @param {object|string|number|boolean} data - a data object that will be passed to the delayed listeners
		 * @memberof Kadaster.Bus.Topic
		 * @instance
		 * @private
		 */
		this.fireDelayed = function (data) {
			// Walk through the delayed listeners collection
			for (var i = 0; i < delayedListeners.length; i++) {
				delayedListeners[i].call(undefined, data);
			}

			// Add to history
			delayedCallHistory.data = data;
		};

		/**
		 * Sets the name of the topic. Can also be set using new topic(name).
		 * @method setNme
		 * @param {string} argName - name of the topic
		 * @memberof Kadaster.Bus.Topic
		 * @instance
		 * @private
		 */
		this.setName = function (argName) {
			name = argName;
		};

		/**
		 * Returns the name of the current topic
		 * @method getName
		 * @returns {string} the name of the topic
		 * @memberof Kadaster.Bus.Topic
		 * @instance
		 * @private
		 */
		this.getName = function () {
			return name;
		};

		this.getListenerCount = function () {
			return {
				listeners: listeners.length,
				delayedListeners: delayedListeners.length
			};
		};
	};
	return {
		channel: channel,
		removeChannel: removeChannel,
		when: when,
		fire: fire,
		fireDelayed: fireDelayed,
		whenFiredDelayed: whenFiredDelayed
	};
})();