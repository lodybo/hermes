window.hermes = (function (hermes) {
  "use strict";

  /// *** Main class for channels ***
  function Channels () {
    // Collection of channels
    var channels = [];

    // Create a new channel
    function create(name) {
      // Create a new channel
      var newChannel = new Channel(name);
      channels.push(newChannel);

      // Return newly created channel
      return newChannel;
    }

    // Loop through all the channels and see if we can find a name for the given match
    function registered(name) {
      for (var i=0; i<channels.length; i++) {
        if (channels[i].channelName === name) {
          // Found a match, let's return the channel!
          return channels[i];
        }
      }

      // No match, return false
      return false;
    }

    // Return interface
    return {
      create: create,
      registered: registered
    }
  }

  /// *** Class for a single Channel ***
  function Channel(channelName) {
    this.channelName = channelName;
  }

  // Add Channels to Hermes
  hermes.channels = Channels();

  return hermes;
})(window.hermes);