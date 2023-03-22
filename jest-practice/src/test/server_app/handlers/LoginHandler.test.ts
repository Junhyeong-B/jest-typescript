import {
  HTTP_CODES,
  HTTP_METHODS,
} from "./../../../app/server_app/model/ServerModel";
import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { Account } from "../../../app/server_app/model/AuthModel";
import { LoginHandler } from "./../../../app/server_app/handlers/LoginHandler";

const getRequestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("LoginHandler test suite", () => {
  let suite: LoginHandler;

  const request = { method: undefined };
  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };
  const authorizerMock = {
    login: jest.fn(),
  };

  const someAccount: Account = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
  };
  const someId = "1234";
  const someToken = "token";

  beforeEach(() => {
    suite = new LoginHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return token for valid accounts in requests", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(someToken);

    await suite.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify({ token: someToken })
    );
  });

  test("should return not found for invalid accounts in requests", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(undefined);

    await suite.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(responseMock.writeHead).not.toBeCalled();
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("wrong username or password")
    );
  });

  test("should return bad request for invalid requests", async () => {
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

    expect(responseMock.writeHead).not.toBeCalled();
    expect(responseMock.write).not.toBeCalled();
    expect(getRequestBodyMock).not.toBeCalled();
  });
});
