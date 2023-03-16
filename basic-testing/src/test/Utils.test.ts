import { getStringInfo, toUpperCase } from "../app/Utils";

describe("Utils test suite", () => {
  it("should return uppercase of valid string", () => {
    // arrange
    const suite = toUpperCase;
    const expected = "ABC";

    // act
    const actual = suite("abc");

    // assert
    expect(actual).toBe(expected);
  });

  it("should return info for valid string", () => {
    const actual = getStringInfo("My-String");

    expect(actual.lowerCase).toBe("my-string");
    expect(actual.upperCase).toBe("MY-STRING");

    expect(actual.length).toBe(9);
    expect(actual.characters).toHaveLength(9);

    // prettier-ignore
    expect(actual.characters).toEqual(["M", "y", "-", "S", "t", "r", "i", "n", "g"]);
    expect(actual.characters).toContain("M");
    // prettier-ignore
    expect(actual.characters).toEqual(
      expect.arrayContaining(["S", "t", "r", "i", "n", "g", "M", "y", "-"])
    );

    expect(actual.extraInfo).toEqual({});
    expect(actual.extraInfo).not.toBe(undefined);
    expect(actual.extraInfo).not.toBeUndefined();
    expect(actual.extraInfo).toBeDefined();
    expect(actual.extraInfo).toBeTruthy();
  });
});
