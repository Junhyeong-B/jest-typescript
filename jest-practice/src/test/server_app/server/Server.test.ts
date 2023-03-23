import { ReservationsDataAccess } from "./../../../app/server_app/data/ReservationsDataAccess";
import { Authorizer } from "./../../../app/server_app/auth/Authorizer";
import { Server } from "./../../../app/server_app/server/Server";

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
});
