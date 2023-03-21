import { DataBase } from "../../../app/server_app/data/DataBase";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";

type DataBaseType = {
  id: string;
  name: string;
  color: string;
};

describe("DataBase test suite", () => {
  const fakeId = "1234";
  const someObject1 = {
    id: "",
    name: "name",
    color: "red",
  };
  const someObject2 = {
    id: "",
    name: "other",
    color: "red",
  };
  let suite: DataBase<DataBaseType>;
  beforeEach(() => {
    suite = new DataBase();
    jest.spyOn(IdGenerator, "generateRandomId").mockReturnValue(fakeId);
  });

  test("should return id after inset", async () => {
    const result = await suite.insert(someObject1);

    expect(result).toBe(fakeId);
  });

  test("should get element after inset", async () => {
    const id = await suite.insert(someObject1);
    const element = await suite.getBy("id", id);

    expect(element).toBe(someObject1);
  });

  test("should find all elements with the same property", async () => {
    await suite.insert(someObject1);
    await suite.insert(someObject2);
    const expectedArray = [someObject1, someObject2];

    const elements = await suite.findAllBy("color", "red");

    expect(elements).toContain(someObject1);
    expect(elements).toContain(someObject2);
    expect(elements).toEqual(expectedArray);
  });

  test("should change color on object", async () => {
    const id = await suite.insert(someObject1);
    const expectedColor = "black";

    await suite.update(id, "color", expectedColor);
    const object = await suite.getBy("id", id);
    const actualClolor = object.color;

    expect(actualClolor).toBe(expectedColor);
  });

  test("should delete object", async () => {
    const id = await suite.insert(someObject1);
    await suite.delete(id);

    const object = await suite.getBy("id", id);

    expect(object).toBeUndefined();
  });

  test("should return all elements", async () => {
    await suite.insert(someObject1);
    await suite.insert(someObject2);
    const expectedArray = [someObject1, someObject2];

    const elements = await suite.getAllElements();

    expect(elements).toEqual(expectedArray);
  });
});
