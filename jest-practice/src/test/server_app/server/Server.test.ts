import { ReservationsDataAccess } from "./../../../app/server_app/data/ReservationsDataAccess";
import { Authorizer } from "./../../../app/server_app/auth/Authorizer";
import { Server } from "./../../../app/server_app/server/Server";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { HTTP_CODES } from "../../../app/server_app/model/ServerModel";

jest.mock("./../../../app/server_app/handlers/ReservationsHandler");
jest.mock("./../../../app/server_app/handlers/LoginHandler");
jest.mock("./../../../app/server_app/handlers/RegisterHandler");
jest.mock("./../../../app/server_app/data/ReservationsDataAccess");
jest.mock("./../../../app/server_app/auth/Authorizer");

const requestMock = {
  url: "",
  headers: {
    "user-agent": "jest-test",
  },
};
const responseMock = {
  end: jest.fn(),
  writeHead: jest.fn(),
};
const serverMock = {
  listen: jest.fn(),
  close: jest.fn(),
};

jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestMock, responseMock);
    return serverMock;
  },
}));

describe("Server test suite", () => {
  let suite: Server;
  beforeEach(() => {
    suite = new Server();
    expect(Authorizer).toBeCalledTimes(1);
    expect(ReservationsDataAccess).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should start server on port 8080 and end the request", async () => {
    await suite.startServer();

    expect(serverMock.listen).toBeCalledWith(8080);
    expect(responseMock.end).toBeCalled();
  });

  test("should handle register requests", async () => {
    requestMock.url = "localhost:8080/register";
    const handleRequestSpy = jest.spyOn(
      RegisterHandler.prototype,
      "handleRequest"
    );

    await suite.startServer();

    expect(handleRequestSpy).toBeCalledTimes(1);
    expect(RegisterHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  test("should handle login requests", async () => {
    requestMock.url = "localhost:8080/login";
    const handleRequestSpy = jest.spyOn(
      LoginHandler.prototype,
      "handleRequest"
    );

    await suite.startServer();

    expect(handleRequestSpy).toBeCalledTimes(1);
    expect(LoginHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  test("should handle reservation requests", async () => {
    requestMock.url = "localhost:8080/reservation";
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );

    await suite.startServer();

    expect(handleRequestSpy).toBeCalledTimes(1);
    expect(ReservationsHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer),
      expect.any(ReservationsDataAccess)
    );
  });

  test("should do nothing for not supported routes", async () => {
    requestMock.url = "localhost:8080/someUrl";
    const validateTokenSpy = jest.spyOn(Authorizer.prototype, "validateToken");

    await suite.startServer();

    expect(validateTokenSpy).not.toBeCalled();
  });

  test("should handle errors in serving requests", async () => {
    requestMock.url = "localhost:8080/reservation";
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );
    handleRequestSpy.mockRejectedValueOnce(new Error("Some error"));

    await suite.startServer();

    expect(responseMock.writeHead).toBeCalledWith(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      JSON.stringify(`Internal server error: Some error`)
    );
  });

  test("should stop the server if started", async () => {
    await suite.startServer();
    await suite.stopServer();

    expect(serverMock.close).toBeCalledTimes(1);
  });
});
