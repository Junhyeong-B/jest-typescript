import { generateRandomId } from "./IdGenerator";

type ValueOf<T> = T[keyof T];

type ObjectWithId = {
  id: string;
};

export class DataBase<T extends ObjectWithId> {
  private elements = new Array<T>();

  public async insert(arg: T) {
    arg.id = generateRandomId();
    this.elements.push(arg);
    return arg.id;
  }

  public async getBy(argName: keyof T, argValue: T[keyof T]) {
    return this.elements.find((x) => x[argName] === argValue);
  }

  public async findAllBy(argName: keyof T, argValue: T[keyof T]) {
    return this.elements.filter((x) => x[argName] === argValue);
  }

  public async update(id: string, argName: keyof T, argValue: T[keyof T]) {
    const index = this.elements.findIndex((x) => x.id === id);
    this.elements[index][argName] = argValue;
  }

  public async delete(id: string) {
    const index = this.elements.findIndex((x) => x.id === id);
    this.elements.splice(index, 1);
  }

  public async getAllElements() {
    return this.elements;
  }
}
