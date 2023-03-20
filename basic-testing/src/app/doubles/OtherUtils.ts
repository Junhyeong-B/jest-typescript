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
