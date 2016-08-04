describe("Hermes ==> Channels Test Suite", function () {
  it("should be able to create a channel", function () {
    // First make sure the test channel is not created
    expect(hermes.channels.registered("testChannel")).toBe(false);

    // Create a new channel
    hermes.channels.create("testChannel");

    // Verify the newly created test channel
    expect(typeof hermes.channels.registered("testChannel")).toBe("object");
  });

  it("should throw an error if no name is given to the create function", function () {
    expect(function () {
      hermes.channels.create()
    }).toThrow("[Hermes] Error: no name is given when creating a channel!");
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

  it ("should throw an error if you try to delete a channel that doesn't exist", function () {
    expect(function () {
      hermes.channels.delete("testChannel")
    }).toThrow("[Hermes] Error: Cannot delete 'testChannel', it does not exist.");
  });

  it ("should throw an error if you try to delete a channel without giving a name", function () {
    // Create test channel
    hermes.channels.create("testChannel");

    expect(function () {
      hermes.channels.delete("testChannel")
    }).toThrow("[Hermes] Error: no name is given for deleting a channel!");
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