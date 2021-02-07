import { Parse } from '../parse';

export interface LandmarkInterface {
  title: string;
  location?: number[];
  url?: string;
  short_info: string;
  description?: string;
  order: number;
  photo?: Parse.File;
  photo_thumb?: Parse.File;
}

export class Landmark extends Parse.Object {
  attributes!: LandmarkInterface;
  constructor(attrs: object) {
    super('Landmark', attrs);
  }
}

// Register class to Parse
Parse.Object.registerSubclass('Landmark', Landmark);
