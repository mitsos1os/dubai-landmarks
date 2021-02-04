import { Parse } from '../parse';

export class Landmark extends Parse.Object {
  constructor(attrs: object) {
    super('Landmark', attrs);
  }
}

// Register class to Parse
Parse.Object.registerSubclass('Landmark', Landmark);
