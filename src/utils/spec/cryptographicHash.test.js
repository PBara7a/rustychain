const cryptographicHash = require("../cryptographicHash.js");

describe("cryptographicHash()", () => {
  it("generates a SHA-256 hash from its arguments", () => {
    // echo -n test hash function | sha256sum
    const hashTestResult =
      "b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b";

    expect(cryptographicHash("foo")).toEqual(hashTestResult);
  });

  it("produces the same hash regardless of the arguments order", () => {
    expect(cryptographicHash("foo", "bar", "baz")).toEqual(
      cryptographicHash("bar", "foo", "baz")
    );
  });

  it("produces a unique hash when the properties have changed on an input", () => {
    const foo = {};
    originalHash = cryptographicHash(foo);
    foo["bar"] = "bar";

    expect(cryptographicHash(foo)).not.toEqual(originalHash);
  });
});
