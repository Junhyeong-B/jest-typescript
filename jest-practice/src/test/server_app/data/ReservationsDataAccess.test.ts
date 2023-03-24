import { Reservation } from "./../../../app/server_app/model/ReservationModel";
import { ReservationsDataAccess } from "./../../../app/server_app/data/ReservationsDataAccess";

const generateRandomIdMock = jest.fn();

jest.mock("../../../app/server_app/data/IdGenerator", () => ({
  generateRandomId: () => generateRandomIdMock(),
}));

describe("ReservationsDataAccess test suite", () => {
  let suite: ReservationsDataAccess;
  const someId = "1234";
  const someReservation: Reservation = {
    endDate: "someEndDate",
    id: someId,
    room: "someRoom",
    startDate: "someStartDate",
    user: "someUser",
  };

  const someReservation2: Reservation = {
    endDate: "someEndDate2",
    id: someId,
    room: "someRoom2",
    startDate: "someStartDate2",
    user: "someUser2",
  };

  beforeEach(() => {
    suite = new ReservationsDataAccess();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createReservation test", async () => {
    generateRandomIdMock.mockResolvedValueOnce(someId);

    const actualId = await suite.createReservation(someReservation);

    expect(actualId).toBe(someId);
    expect(generateRandomIdMock).toBeCalledTimes(1);
  });

  test("updateReservation test", async () => {
    const reservationId = await suite.createReservation(someReservation);
    await suite.updateReservation(reservationId, "endDate", "updatedEndDate");

    const updatedReservation = {
      ...someReservation,
      endDate: "updatedEndDate",
    };

    expect(someReservation).toEqual(updatedReservation);
  });

  test("deleteReservation test", async () => {
    const reservationId = await suite.createReservation(someReservation);
    await suite.deleteReservation(reservationId);

    const reservation = await suite.getReservation(reservationId);

    expect(reservation).toBeUndefined();
  });

  test("getReservation test", async () => {
    const reservationId = await suite.createReservation(someReservation);
    const reservation = await suite.getReservation(reservationId);

    expect(someReservation).toEqual(reservation);
  });

  test("getAllReservations test", async () => {
    await suite.createReservation(someReservation);
    await suite.createReservation(someReservation2);
    const reservations = await suite.getAllReservations();

    expect(reservations).toStrictEqual([someReservation, someReservation2]);
  });
});
