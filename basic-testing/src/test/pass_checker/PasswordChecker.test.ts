import { PasswordChecker } from "../../app/pass_checker/PasswordChecker";

describe("PasswordChecker test suite", () => {
  let suite: PasswordChecker;
  beforeEach(() => {
    suite = new PasswordChecker();
  });

  test("Should do nothing for the moment", () => {
    suite.checkPassword();
  });
});
