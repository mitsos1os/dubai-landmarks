import { Injectable } from '@angular/core';
import { Landmark } from '../models/Landmark';
import { Parse } from '../parse';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LandmarkService {
  constructor() {}

  /**
   * Retrieve all landmarks with only required fields to display in list
   * ordered by the `order` field
   */
  getLandMarksList(): Observable<Landmark[]> {
    const query = new Parse.Query<Landmark>(Landmark);
    query
      .select('id', 'title', 'short_info', 'photo_thumb', 'order')
      .ascending('order');
    return from(query.find());
  }
}
