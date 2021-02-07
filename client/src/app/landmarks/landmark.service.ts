import { Injectable } from '@angular/core';
import { Landmark } from '../common/models/Landmark';
import { Parse } from '../common/parse';
import { Observable } from 'rxjs';
import { ParseService } from '../common/parse.service';

@Injectable({
  providedIn: 'root',
})
export class LandmarkService {
  constructor(private parseService: ParseService) {}

  /**
   * Retrieve all landmarks with only required fields to display in list
   * ordered by the `order` field
   */
  getLandMarksList(): Observable<Landmark[]> {
    const query = new Parse.Query(Landmark);
    query
      .select('id', 'title', 'short_info', 'photo_thumb', 'order')
      .ascending('order');
    return this.parseService.sendParseRequest(query.find());
  }

  /**
   * Accept a landmark id and retrieve its full information
   * @param {string} id
   */
  getLandmark(id: string | null): Observable<Landmark> {
    if (!id) {
      throw new Error('Cannot get landmark without id provided');
    }
    const query = new Parse.Query(Landmark);
    return this.parseService.sendParseRequest(query.get(id));
  }

  /**
   * Accept a landmark and save it using the parse service interceptors for
   * error handling
   * @param {Landmark} landmarkToSave
   */
  saveLandmark(landmarkToSave: Landmark): Observable<Landmark> {
    return this.parseService.sendParseRequest(landmarkToSave.save());
  }
}
