import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Landmark } from '../common/models/Landmark';
import { LandmarkService } from './landmark.service';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LandmarkDetailResolverService implements Resolve<Landmark> {
  constructor(
    private landmarkService: LandmarkService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Landmark> | Observable<never> {
    const landmarkId = route.paramMap.get('id');
    return this.landmarkService.getLandmark(landmarkId).pipe(
      mergeMap((landmark) => {
        if (landmark) {
          return of(landmark);
        } else {
          this.router.navigate(['/404']);
          return EMPTY;
        }
      })
    );
  }
}
