describe("Hermes ==> Channels", function () {
  it("should register a channel", function () {
    expect(hermes.channel("testChannel")).toBe(undefined);

    hermes.channel.register("testChannel");

    expect(hermes.channel("testChannel")).not.toBe(undefined);
  });
});