import { generateRandomId } from "../../../app/server_app/data/IdGenerator";

const randomBytesMock = {
  toString: jest.fn(),
};

jest.mock("crypto", () => ({
  randomBytes: () => {
    randomBytesMock.toString();
    return "1234";
  },
}));

describe("IdGenerator test suite", () => {
  const someId = "1234";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return random string id", () => {
    const actual = generateRandomId();

    expect(actual).toBe(someId);
    expect(randomBytesMock.toString).toBeCalledTimes(1);
  });
});
