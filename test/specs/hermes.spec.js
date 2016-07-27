describe("Hermes test suite", function () {
  xit("should be able to register a channel via the shorthand method", function () {
    hermes.register("testChannel");

    expect(hermes.registered("testChannel")).toBe(true);
  });
});