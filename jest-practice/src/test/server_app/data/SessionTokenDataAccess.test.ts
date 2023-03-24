import { DataBase } from "./../../../app/server_app/data/DataBase";
import { Account } from "./../../../app/server_app/model/AuthModel";
import { SessionTokenDataAccess } from "./../../../app/server_app/data/SessionTokenDataAccess";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";

const insertMock = jest.fn();
const getByMock = jest.fn();
const updateMock = jest.fn();

jest.mock("./../../../app/server_app/data/DataBase", () => ({
  DataBase: jest.fn().mockImplementation(() => ({
    insert: insertMock,
    getBy: getByMock,
    update: updateMock,
  })),
}));

describe("SessionTokenDataAccess test suite", () => {
  let suite: SessionTokenDataAccess;
  const someAccount: Account = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
  };
  const someId = "1234";

  beforeEach(() => {
    suite = new SessionTokenDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
    jest.spyOn(global.Date, "now").mockReturnValue(0);
    jest.spyOn(IdGenerator, "generateRandomId").mockReturnValueOnce(someId);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("generateToken test", async () => {
    insertMock.mockResolvedValueOnce(someId);

    const actual = await suite.generateToken(someAccount);

    expect(actual).toBe(someId);
    expect(insertMock).toBeCalledWith({
      id: "",
      userName: someAccount.userName,
      valid: true,
      expirationDate: new Date(60 * 60 * 1000),
    });
  });

  test("invalidateToken test", async () => {
    await suite.invalidateToken(someId);

    expect(updateMock).toBeCalledWith(someId, "valid", false);
  });

  describe("isValidateToken test", () => {
    test("valid token", async () => {
      getByMock.mockResolvedValueOnce({ ...someAccount, valid: true });

      const result = await suite.isValidToken(someId);

      expect(result).toBe(true);
      expect(getByMock).toBeCalledWith("id", someId);
    });

    test("invalid token", async () => {
      getByMock.mockResolvedValueOnce({ ...someAccount, valid: false });

      const result = await suite.isValidToken(someId);

      expect(result).toBe(false);
      expect(getByMock).toBeCalledWith("id", someId);
    });

    test("not found", async () => {
      getByMock.mockResolvedValueOnce(undefined);

      const result = await suite.isValidToken(someId);

      expect(result).toBe(false);
      expect(getByMock).toBeCalledWith("id", someId);
    });
  });
});
