import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { Account } from "../../../app/server_app/model/AuthModel";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("RegisterHandler test suite", () => {
  let suite: RegisterHandler;

  const request = {
    method: undefined,
  };

  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };

  const authorizerMock = {
    registerUser: jest.fn(),
  };

  const someAccount: Account = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
  };

  const someId = "1234";

  beforeEach(() => {
    suite = new RegisterHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should register valid accounts in requests", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.registerUser.mockResolvedValueOnce(someId);

    await suite.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify({
        userId: someId,
      })
    );
  });

  test("should not response invalid accounts in requests", async () => {
    request.method = HTTP_METHODS.POST;

    getRequestBodyMock.mockResolvedValueOnce({});

    await suite.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("userName and password required")
    );
  });

  test("should do nothing for not supported http methods", async () => {
    request.method = HTTP_METHODS.GET;

    await suite.handleRequest();

    expect(responseMock.write).not.toBeCalled();
    expect(responseMock.writeHead).not.toBeCalled();
    expect(getRequestBodyMock).not.toBeCalled();
  });
});
