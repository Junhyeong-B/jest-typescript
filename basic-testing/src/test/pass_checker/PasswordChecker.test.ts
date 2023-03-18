import { PasswordChecker } from "../../app/pass_checker/PasswordChecker";

describe("PasswordChecker test suite", () => {
  let suite: PasswordChecker;
  beforeEach(() => {
    suite = new PasswordChecker();
  });

  test("Password with less than 8 chars is invalid", () => {
    const actual = suite.checkPassword("1234567");
    expect(actual).toBe(false);
  });

  test("Password with more than 8 chars is valid", () => {
    const actual = suite.checkPassword("12345678Aa");
    expect(actual).toBe(true);
  });

  test("Password with no upper case is invalid", () => {
    const actual = suite.checkPassword("1234abcd");
    expect(actual).toBe(false);
  });

  test("Password with upper case is valid", () => {
    const actual = suite.checkPassword("1234ABcd");
    expect(actual).toBe(true);
  });

  test("Password with no lower case is invalid", () => {
    const actual = suite.checkPassword("1234ABCD");
    expect(actual).toBe(false);
  });

  test("Password with lower case is valid", () => {
    const actual = suite.checkPassword("1234abCD");
    expect(actual).toBe(true);
  });
});
