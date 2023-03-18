export type ValueOf<T> = T[keyof T];

export type PasswordErrors = {
  SHORT: "Password is too short!";
  NO_UPPER_CASE: "Upper case letter required!";
  NO_LOWER_CASE: "Lower case letter required!";
  NO_NUMBER: "At least one number required!";
};

export type PasswordErrorString = ValueOf<PasswordErrors>;

export const passwordErrors: Record<keyof PasswordErrors, PasswordErrorString> =
  {
    SHORT: "Password is too short!",
    NO_UPPER_CASE: "Upper case letter required!",
    NO_LOWER_CASE: "Lower case letter required!",
    NO_NUMBER: "At least one number required!",
  };

export interface CheckResult {
  valid: boolean;
  reasons: PasswordErrorString[];
}

export class PasswordChecker {
  public checkPassword(password: string): CheckResult {
    const reasons: PasswordErrorString[] = [];

    this.checkForLength(password, reasons);
    this.checkForUpperCase(password, reasons);
    this.checkForLowerCase(password, reasons);

    return {
      valid: reasons.length === 0,
      reasons,
    };
  }

  public checkAdminPassword(password: string): CheckResult {
    const basicCheck = this.checkPassword(password);
    this.checkForNumber(password, basicCheck.reasons);
    return {
      valid: basicCheck.reasons.length === 0,
      reasons: basicCheck.reasons,
    };
  }

  private checkForLength(password: string, reasons: PasswordErrorString[]) {
    if (password.length < 8) {
      reasons.push(passwordErrors.SHORT);
    }
  }

  private checkForUpperCase(password: string, reasons: PasswordErrorString[]) {
    if (password === password.toLowerCase()) {
      reasons.push(passwordErrors.NO_UPPER_CASE);
    }
  }

  private checkForLowerCase(password: string, reasons: PasswordErrorString[]) {
    if (password === password.toUpperCase()) {
      reasons.push(passwordErrors.NO_LOWER_CASE);
    }
  }

  private checkForNumber(password: string, reasons: PasswordErrorString[]) {
    const hasNumber = /\d/;
    if (!hasNumber.test(password)) {
      reasons.push(passwordErrors.NO_NUMBER);
    }
  }
}
