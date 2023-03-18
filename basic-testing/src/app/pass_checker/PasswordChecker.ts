export type ValueOf<T> = T[keyof T];

export type PasswordErrors = {
  SHORT: "Password is too short!";
  NO_UPPER_CASE: "Upper case letter required!";
  NO_LOWER_CASE: "Lower case letter required!";
};

export type PasswordErrorString = ValueOf<PasswordErrors>;

export const passwordErrors: Record<keyof PasswordErrors, PasswordErrorString> =
  {
    SHORT: "Password is too short!",
    NO_UPPER_CASE: "Upper case letter required!",
    NO_LOWER_CASE: "Lower case letter required!",
  };

export interface CheckResult {
  valid: boolean;
  reasons: PasswordErrorString[];
}

export class PasswordChecker {
  public checkPassword(password: string): CheckResult {
    const reasons: PasswordErrorString[] = [];
    if (password.length < 8) {
      reasons.push(passwordErrors.SHORT);
    }

    if (password === password.toLowerCase()) {
      reasons.push(passwordErrors.NO_UPPER_CASE);
    }

    if (password === password.toUpperCase()) {
      reasons.push(passwordErrors.NO_LOWER_CASE);
    }

    return {
      valid: reasons.length === 0,
      reasons,
    };
  }
}
