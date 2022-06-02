const cryptographicHash = require("../src/utils/cryptographicHash.js");

describe("cryptographicHash()", () => {
  it("generates a SHA-256 hash from its arguments", () => {
    // echo -n test hash function | sha256sum
    const hashTestResult =
      "f0b2698f54fb59b946da18d7926c15bf3bcca5da3396314fcf1ef4d5272cd49a";

    expect(cryptographicHash("test hash function")).toEqual(hashTestResult);
  });

  it("produces the same hash regardless of the arguments order", () => {
    expect(cryptographicHash("foo", "bar", "baz")).toEqual(
      cryptographicHash("bar", "foo", "baz")
    );
  });
});
