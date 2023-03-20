import {
  calculateComplexity,
  OtherStringUtils,
  toUpperCaseWithCb,
} from "../../app/doubles/OtherUtils";

describe("OtherUtils 테스트", () => {
  test("Calculate complexity(Stubs)", () => {
    const someInfo = {
      length: 5,
      extraInfo: {
        field1: "someInfo",
        field2: "someOtherInfo",
      },
    };

    const actual = calculateComplexity(someInfo);
    expect(actual).toBe(10);
  });

  test("toUpperCase - calls callback for valid argument", () => {
    const actual = toUpperCaseWithCb("abc", () => {});
    expect(actual).toBe("ABC");
  });

  describe("Tracking callbacks", () => {
    let cbArgs = [];
    let timesCalled = 0;
    function callbackMock(arg: string) {
      cbArgs.push(arg);
      timesCalled++;
    }

    afterEach(() => {
      // clearing tracking fields
      cbArgs = [];
      timesCalled = 0;
    });

    test("calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCb("", callbackMock);
      expect(actual).toBeUndefined();
      expect(cbArgs).toContain("Invalid argument!");
      expect(timesCalled).toBe(1);
    });

    test("calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCb("abc", callbackMock);
      expect(actual).toBe("ABC");
      expect(cbArgs).toContain("called function with abc");
      expect(timesCalled).toBe(1);
    });
  });

  describe("Tracking callbacks with Jest Mocks", () => {
    const callbackMock = jest.fn();

    afterEach(() => {
      // clearing tracking fields
      jest.clearAllMocks();
    });

    test("calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCb("", callbackMock);
      expect(actual).toBeUndefined();
      expect(callbackMock).toHaveBeenCalledWith("Invalid argument!");
      expect(callbackMock).toBeCalledTimes(1);
    });

    test("calls callback for invalid argument - track calls", () => {
      const actual = toUpperCaseWithCb("abc", callbackMock);
      expect(actual).toBe("ABC");
      expect(callbackMock).toHaveBeenCalledWith("called function with abc");
      expect(callbackMock).toBeCalledTimes(1);
    });
  });

  describe.only("OtherSTringUtils test with spies", () => {
    let suite: OtherStringUtils;
    beforeEach(() => {
      suite = new OtherStringUtils();
    });

    test("Use a spy to track calls", () => {
      const toUpperCaseSpy = jest.spyOn(suite, "toUpperCase");
      suite.toUpperCase("asa");
      expect(toUpperCaseSpy).toBeCalledWith("asa");
    });

    test("Use a spy to track calls to other module", () => {
      const consoleLogSpy = jest.spyOn(console, "log");
      suite.logString("asa");
      expect(consoleLogSpy).toBeCalledWith("asa");
    });

    test("Use a spy to replace the implementation of a method", () => {
      jest.spyOn(suite, "callExternalService").mockImplementation(() => {
        console.log("calling mocked implementation!");
      });
      suite.callExternalService();
    });
  });
});
