import { Reservation } from "./../../../app/server_app/model/ReservationModel";
import {
  HTTP_CODES,
  HTTP_METHODS,
} from "./../../../app/server_app/model/ServerModel";
import { Account } from "./../../../app/server_app/model/AuthModel";
import { ReservationsDataAccess } from "./../../../app/server_app/data/ReservationsDataAccess";
import { Authorizer } from "./../../../app/server_app/auth/Authorizer";
import { ServerResponse } from "http";
import { IncomingMessage } from "http";
import { ReservationsHandler } from "./../../../app/server_app/handlers/ReservationsHandler";
import { getRequestBody } from "../../../app/server_app/utils/Utils";

const getRequestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("ReservationHandler test suite", () => {
  let suite: ReservationsHandler;

  // const request: IncomingMessage;
  // const response: ServerResponse;
  // const authorizer: Authorizer;
  // const reservationsDataAccess: ReservationsDataAccess;
  const request = {
    method: undefined,
    headers: {
      authorization: "",
    },
    url: "",
  };
  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };
  const authorizerMock = {
    validateToken: jest.fn(),
  };
  const reservationsDataAccessMock = {
    createReservation: jest.fn(),
    getAllReservations: jest.fn(),
    getReservation: jest.fn(),
    updateReservation: jest.fn(),
    deleteReservation: jest.fn(),
  };

  const someAccount: Account = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
  };
  const someId = "1234";
  const someToken = "token";
  const someReservation: Reservation = {
    id: "",
    room: "someRoom",
    endDate: "someEndDate",
    startDate: "someStartDate",
    user: "someUser",
  };

  beforeEach(() => {
    suite = new ReservationsHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer,
      reservationsDataAccessMock as any as ReservationsDataAccess
    );
    request.headers.authorization = someToken;
    authorizerMock.validateToken.mockResolvedValueOnce(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    request.url = "";
    responseMock.statusCode = 0;
  });

  describe("Post requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.POST;
    });

    test("POST success", async () => {
      getRequestBodyMock.mockResolvedValueOnce(someReservation);
      reservationsDataAccessMock.createReservation.mockResolvedValueOnce(
        someId
      );

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
      expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify({ reservationId: someId })
      );
    });

    test("Post failed - empty reservation", async () => {
      getRequestBodyMock.mockResolvedValueOnce({});

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Incomplete reservation!")
      );
    });

    test("Post failed - invalid reservation", async () => {
      const invalidReservation = { ...someReservation, invalid: "abc" };
      getRequestBodyMock.mockResolvedValueOnce(invalidReservation);

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Incomplete reservation!")
      );
    });
  });

  describe("GET requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.GET;
    });

    test("GET all reservation success", async () => {
      request.url = "/reservation/all";
      reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([
        someReservation,
      ]);
      authorizerMock.validateToken.mockResolvedValueOnce(true);

      await suite.handleRequest();

      expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify([someReservation])
      );
    });

    test("GET reservation success", async () => {
      request.url = "/reservation/abc";
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );

      await suite.handleRequest();

      expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify(someReservation)
      );
    });

    test("GET reservation failed - not found", async () => {
      request.url = `/reservation/${someId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        undefined
      );

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify(`Reservation with id ${someId} not found`)
      );
    });

    test("GET reservation failed - invalid id", async () => {
      request.url = "/reservation/";

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide an ID!")
      );
    });
  });

  describe("PUT requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.PUT;
    });

    test("PUT reservation success", async () => {
      request.url = `/reservation/${someId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );
      const updateObject = {
        startDate: "someStartDate2",
        endDate: "someEndDate2",
      };
      getRequestBodyMock.mockResolvedValueOnce(updateObject);

      await suite.handleRequest();

      expect(reservationsDataAccessMock.updateReservation).toBeCalledTimes(2);
      expect(reservationsDataAccessMock.updateReservation).toBeCalledWith(
        someId,
        "startDate",
        updateObject.startDate
      );
      expect(reservationsDataAccessMock.updateReservation).toBeCalledWith(
        someId,
        "endDate",
        updateObject.endDate
      );
      expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify(
          `Updated ${Object.keys(updateObject)} of reservation ${someId}`
        )
      );
    });

    test("PUT reservation failed - invalid fileds", async () => {
      request.url = `/reservation/${someId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );
      const invalidObject = {
        invalid: "object",
      };
      getRequestBodyMock.mockResolvedValueOnce(invalidObject);

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide valid fields to update!")
      );
    });

    test("PUT reservation failed - empty request body", async () => {
      request.url = `/reservation/${someId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );
      getRequestBodyMock.mockResolvedValueOnce({});

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide valid fields to update!")
      );
    });

    test("PUT reservation failed - not found reservation", async () => {
      request.url = `/reservation/${someId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        undefined
      );

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify(`Reservation with id ${someId} not found`)
      );
    });

    test("PUT reservation failed - no id", async () => {
      request.url = "/reservation/";

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide an ID!")
      );
    });
  });

  describe("DELETE requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.DELETE;
    });

    test("Delete reservation success", async () => {
      request.url = `/reservation/${someId}`;

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.OK);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify(`Deleted reservation with id ${someId}`)
      );
    });

    test("Delete reservation failed - no id", async () => {
      request.url = "/reservation/";

      await suite.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide an ID!")
      );
    });
  });

  test("request failed - is not authorized", async () => {
    request.headers.authorization = undefined;

    await suite.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("Unauthorized operation!")
    );
  });

  test("request failed - invalid method", async () => {
    request.method = undefined;

    await suite.handleRequest();

    expect(responseMock.write).not.toBeCalled();
    expect(responseMock.writeHead).not.toBeCalled();
  });
});
