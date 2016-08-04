window.hermes = (function (hermes) {
  "use strict";

  /// *** Main class for channels ***
  function Channels () {
    // Collection of channels
    var channels = [];

    // Create a new channel
    function createChannel(name) {
      // Only proceed if a name is given
      if (!name) {
        hermes.throw("Error: no name is given when creating a channel!");
        return;
      }

      // Check if our new channel already exists
      var channel = registered(name);

      if (!channel) {
        // Create a new channel
        var newChannel = new Channel(name);
        channels.push(newChannel);

        // Return newly created channel
        return newChannel;
      }

      // Channel already exists, so we can just return that one
      return channel;
    }

    // Loop through all the channels and see if we can find a name for the given match
    function registered(name) {
      for (var i=0; i<channels.length; i++) {
        if (channels[i].getName() === name) {
          // Found a match, let's return the channel!
          return channels[i];
        }
      }

      // No match, return false
      return false;
    }

    // Delete a given channel
    function deleteChannel(name) {
      // Only proceed if a name is given
      if (!name) {
        hermes.throw("Error: no name is given for deleting a channel!");
        return;
      }

      // Loop through every channel, and if we get a match then delete it
      for (var i=0; i<channels.length; i++) {
        if (channels[i].getName() === name) {
          // Match! Empty the channel
          channels[i] = null;

          // Delete the key
          channels.splice(i, 1);
        }
      }

      // No channel found, throw an error
      hermes.throw("Error: Cannot delete 'testChannel', it does not exist.");
    }

    // Rename a channel
    function rename(channelName, newName) {
      // Get the channel
      var channel = registered(channelName);

      // Rename it
      channel.rename(newName);
    }

    // Return interface
    return {
      create: createChannel,
      registered: registered,
      rename: rename,
      delete: deleteChannel
    }
  }

  /// *** Class for a single Channel ***
  function Channel(channelName) {
    var channelName = channelName;

    // Return the name of this channel
    function name() {
      return channelName;
    }
    // Rename this channel to the given new name
    function rename(newName) {
      channelName = newName;
    }

    // Return interface
    return {
      getName: name,
      rename: rename
    }
  }

  // Add Channels to Hermes
  hermes.channels = Channels();

  return hermes;
})(window.hermes);