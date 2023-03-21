import { StringUtils } from "./../app/Utils";
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

  describe("toUpperCase examples", () => {
    it.each([
      { input: "abc", expected: "ABC" },
      { input: "My-String", expected: "MY-STRING" },
      { input: "def", expected: "DEF" },
    ])("$input toUpperCase should be $expected", ({ input, expected }) => {
      const actual = toUpperCase(input);
      expect(actual).toBe(expected);
    });
  });

  describe("getStringInfo for arg My-String should", () => {
    test("return right length", () => {
      const actual = getStringInfo("My-String");
      expect(actual.characters).toHaveLength(9);
    });
    test("return right lower case", () => {
      const actual = getStringInfo("My-String");
      expect(actual.lowerCase).toBe("my-string");
    });
    test("return right upper case", () => {
      const actual = getStringInfo("My-String");
      expect(actual.upperCase).toBe("MY-STRING");
    });
    test("return right characters", () => {
      const actual = getStringInfo("My-String");
      // prettier-ignore
      expect(actual.characters).toEqual(["M", "y", "-", "S", "t", "r", "i", "n", "g"]);
      expect(actual.characters).toContain("M");
      // prettier-ignore
      expect(actual.characters).toEqual(
        expect.arrayContaining(["S", "t", "r", "i", "n", "g", "M", "y", "-"])
      );
    });
    test("return right extra info", () => {
      const actual = getStringInfo("My-String");
      expect(actual.extraInfo).toEqual({});
    });
  });

  describe("StringUtils tests", () => {
    let suite: StringUtils;

    beforeEach(() => {
      suite = new StringUtils();
    });

    it("should return correct upper case", () => {
      const actual = suite.toUpperCase("abc");
      expect(actual).toBe("ABC");
    });

    it("should throw error on invalid argument - function", () => {
      function expectError() {
        const actual = suite.toUpperCase("");
      }

      expect(expectError).toThrow();
      expect(expectError).toThrowError("Invalid argument!");
    });

    it("should throw error on invalid argument - arrow function", () => {
      expect(() => {
        suite.toUpperCase("");
      }).toThrow();
    });

    it("should throw error on invalid argument - try catch block", (done) => {
      try {
        suite.toUpperCase("");
        done("GetStringInfo should throw error for invalid arg!");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty("message", "Invalid argument!");
        done();
      }
    });
  });
});
