import { UserCredentialsDataAccess } from "./../../../app/server_app/data/UserCredentialsDataAccess";
import { SessionTokenDataAccess } from "./../../../app/server_app/data/SessionTokenDataAccess";
import { Authorizer } from "./../../../app/server_app/auth/Authorizer";

const isValidTokenMock = jest.fn();
const generateTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();
jest.mock("../../../app/server_app/data/SessionTokenDataAccess", () => {
  return {
    SessionTokenDataAccess: jest.fn().mockImplementation(() => {
      return {
        isValidToken: isValidTokenMock,
        generateToken: generateTokenMock,
        invalidateToken: invalidateTokenMock,
      };
    }),
  };
});

const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();
jest.mock("../../../app/server_app/data/UserCredentialsDataAccess", () => {
  return {
    UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
      return {
        addUser: addUserMock,
        getUserByUserName: getUserByUserNameMock,
      };
    }),
  };
});

describe("Authorizer test suite", () => {
  let suite: Authorizer;
  const someId = "1234";
  const someUserName = "someUserName";
  const somePassword = "somePassword";
  const someAccount = {
    id: "",
    userName: someUserName,
    password: somePassword,
  };

  beforeEach(() => {
    suite = new Authorizer();
    expect(SessionTokenDataAccess).toBeCalledTimes(1);
    expect(UserCredentialsDataAccess).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("validateToken test", async () => {
    isValidTokenMock.mockResolvedValueOnce(true);

    const result = await suite.validateToken(someId);

    expect(result).toBe(true);
    expect(isValidTokenMock).toBeCalledWith(someId);
  });

  test("registerUser test", async () => {
    addUserMock.mockResolvedValueOnce(someId);

    const result = await suite.registerUser(someUserName, somePassword);

    expect(result).toBe(someId);
    expect(addUserMock).toBeCalledWith({
      id: "",
      password: somePassword,
      userName: someUserName,
    });
  });

  describe("login test", () => {
    test("has user", async () => {
      getUserByUserNameMock.mockResolvedValueOnce(someAccount);
      generateTokenMock.mockResolvedValueOnce(someId);

      const result = await suite.login(someUserName, somePassword);

      expect(result).toBe(someId);
      expect(getUserByUserNameMock).toBeCalledWith(someUserName);
      expect(generateTokenMock).toBeCalledWith(someAccount);
    });

    test("no user", async () => {
      getUserByUserNameMock.mockResolvedValueOnce(undefined);

      const result = await suite.login(someUserName, somePassword);

      expect(result).toBeUndefined();
      expect(getUserByUserNameMock).toBeCalledWith(someUserName);
      expect(generateTokenMock).toBeCalledTimes(0);
    });
  });

  test("logout test", async () => {
    await suite.logout(someId);

    expect(invalidateTokenMock).toBeCalledWith(someId);
  });
});
