import { DataBase } from "../../../app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";

const insertMock = jest.fn();
const getByMock = jest.fn();

/**
 * jest.mock 시 참조 에러가 발생. 이를 해결하기 위해 doMock으로 변경하거나 jest.fn().mockImplementation을 사용.
 * ReferenceError: Cannot access 'insertMock' before initialization
 *
 * mock은 함수 모듈을 모킹할 때 사용하고,
 * doMock은 동적으로 모듈을 모킹할 때 사용한다. doMock이 일반적으로 mock 보다 더 나중에 호출된다.
 * implementation은 fest.fn()으로 생성된 함수가 호출될 때 모킹한다.
 */
jest.mock("../../../app/server_app/data/DataBase", () => ({
  DataBase: jest.fn().mockImplementation(() => ({
    insert: insertMock,
    getBy: getByMock,
  })),
}));

describe("UserCredentialsDataAccess test suite", () => {
  const someAccount: Account = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
  };
  const someId = "1234";

  let suite: UserCredentialsDataAccess;
  beforeEach(() => {
    suite = new UserCredentialsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should add user and return the id", async () => {
    insertMock.mockReturnValue(someId);

    const actualId = await suite.addUser(someAccount);

    expect(actualId).toBe(someId);
    expect(insertMock).toHaveBeenCalledWith(someAccount);
  });

  test("should get user by id", async () => {
    getByMock.mockReturnValue(someAccount);

    const actualUser = await suite.getUserById(someId);

    expect(actualUser).toBe(someAccount);
    expect(getByMock).toHaveBeenCalledWith("id", someId);
  });
  test("should get user by userName", async () => {
    getByMock.mockReturnValue(someAccount);
    const { userName } = someAccount;

    const actualUser = await suite.getUserByUserName(userName);

    expect(actualUser).toBe(someAccount);
    expect(getByMock).toHaveBeenCalledWith("userName", userName);
  });
});
