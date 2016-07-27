(function (window) {
  "use strict";

  function Channel(channelName) {
    this.channelName = channelName;
  }

  window.hermes.channel = Channel;
})(window);