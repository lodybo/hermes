window.hermes = (function () {
    var channels = [];

  // Register channels and topics
  // The `name` parameter can stand for two things, based on the presence of a backslash (/):
  // * no backslash: only a channel ("testChannel")
  // * backslash: channel with a topic ("testChannel/testTopic")
  function register(name) {
    var channel = new hermes.channel(name);
    channels.push(channel);
  }

  // Returns wether a channel has been registered
  function registered (name) {
    for (var i=0; i<channels.length; i++) {
      if (channels[i].channelName === name) {
        return true;
      }
    }

    return false;
  }

  // Throw a given error for this library
  function throwError(message) {
    throw("[Hermes] " + message);
  }

  // Return interface
  return {
    register: register,
    registered: registered,
    throw: throwError
  }
})();