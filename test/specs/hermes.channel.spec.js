describe("Hermes ==> Single Channel Test Suite", function () {
    it("should be able to rename a channel", function () {
      // Create new channel
      var channel = hermes.channels.create("testChannel");

      // Verify!
      expect(typeof hermes.channels.registered("testChannel")).toBe("object");

      // Rename the test channel
      channel.rename("anotherTestChannel");

      // Verify!
    expect(typeof hermes.channels.registered("anotherTestChannel")).toBe("object");
    expect(hermes.channels.registered("testChannel")).toBe(false);
    });
  });