describe("Hermes ==> Channels", function () {
  it("should register a channel", function () {
    expect(hermes.channels.registered("testChannel")).toBe(false);

    hermes.channels.create("testChannel");

    expect(hermes.channels.registered("testChannel")).not.toBe(false);
  });
});