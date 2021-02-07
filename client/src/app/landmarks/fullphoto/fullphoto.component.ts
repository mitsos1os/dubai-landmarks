import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fullphoto',
  templateUrl: './fullphoto.component.html',
  styleUrls: ['./fullphoto.component.css'],
})
export class FullphotoComponent {
  @Input() title = '';
  @Input() photo_url = '';
  constructor() {}
}
