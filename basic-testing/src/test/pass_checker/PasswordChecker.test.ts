import {
  PasswordChecker,
  passwordErrors,
} from "../../app/pass_checker/PasswordChecker";

describe("PasswordChecker test suite", () => {
  let suite: PasswordChecker;
  beforeEach(() => {
    suite = new PasswordChecker();
  });

  test("Password with less than 8 chars is invalid", () => {
    const actual = suite.checkPassword("1234567");
    expect(actual.valid).toEqual(false);
    expect(actual.reasons).toContain(passwordErrors.SHORT);
  });

  test("Password with more than 8 chars is valid", () => {
    const actual = suite.checkPassword("12345678");
    expect(actual.reasons).not.toContain(passwordErrors.SHORT);
  });

  test("Password with no upper case is invalid", () => {
    const actual = suite.checkPassword("abcd");
    expect(actual.reasons).toContain(passwordErrors.NO_UPPER_CASE);
  });

  test("Password with upper case is valid", () => {
    const actual = suite.checkPassword("ABcd");
    expect(actual.reasons).not.toContain(passwordErrors.NO_UPPER_CASE);
  });

  test("Password with no lower case is invalid", () => {
    const actual = suite.checkPassword("ABCD");
    expect(actual.reasons).toContain(passwordErrors.NO_LOWER_CASE);
  });

  test("Password with lower case is valid", () => {
    const actual = suite.checkPassword("abCD");
    expect(actual.reasons).not.toContain(passwordErrors.NO_LOWER_CASE);
  });

  test("Complex password is valid", () => {
    const actual = suite.checkPassword("1234abcD");
    expect(actual.reasons).toHaveLength(0);
    expect(actual.valid).toBe(true);
  });
});
