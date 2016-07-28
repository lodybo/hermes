describe("Hermes ==> Channels Test Suite", function () {
  it("should register a channel", function () {
    // First make sure the test channel is not created
    expect(hermes.channels.registered("testChannel")).toBe(false);

    // Create a new channel
    hermes.channels.create("testChannel");

    // Verify the newly created test channel
    expect(typeof hermes.channels.registered("testChannel")).toBe("object");
  });

  it("should delete a channel", function () {
    // Create test channel
    hermes.channels.create("testChannel");

    // Verify that it's created
    expect(typeof hermes.channels.registered("testChannel")).toBe("object");

    // Delete test channel
    hermes.channels.delete("testChannel");

    // Verify that it's deleted
    expect(hermes.channels.registered("testChannel")).toBe(false);
  });

  it("should rename a channel", function () {
    // First we'll register a testChannel
    hermes.channels.create("testChannel");

    // Verify!
    expect(typeof hermes.channels.registered("testChannel")).toBe("object");

    // Rename that channel
    hermes.channels.rename("testChannel", "anotherTestChannel");

    // Verify!
    expect(typeof hermes.channels.registered("anotherTestChannel")).toBe("object");
    expect(hermes.channels.registered("testChannel")).toBe(false);
  });
});