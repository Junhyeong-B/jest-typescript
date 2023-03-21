import { v4 } from "uuid";

export type StringInfo = {
  lowerCase: string;
  upperCase: string;
  characters: string[];
  length: number;
  extraInfo: Object | undefined;
};

type LoggerServiceCallback = (arg: string) => void;

/** Stub */
export function calculateComplexity(
  stringInfo: Pick<StringInfo, "length" | "extraInfo">
) {
  return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

export function toUpperCaseWithCb(
  arg: string,
  callback: LoggerServiceCallback
) {
  if (!arg) {
    callback("Invalid argument!");
    return;
  }

  callback(`called function with ${arg}`);
  return arg.toUpperCase();
}

export class OtherStringUtils {
  public callExternalService() {
    console.log("Calling external service!!!");
  }

  public toUpperCase(arg: string) {
    return arg.toUpperCase();
  }

  public logString(arg: string) {
    console.log(arg);
  }
}

export function toUpperCase(arg: string) {
  return arg.toUpperCase();
}

export function toLowerCaseWithId(arg: string) {
  return arg.toLowerCase() + v4();
}
