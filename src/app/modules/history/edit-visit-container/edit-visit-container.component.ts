import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'ns-edit-visit-container',
  templateUrl: './edit-visit-container.component.html',
  styleUrls: ['./edit-visit-container.component.scss']
})
export class EditVisitContainerComponent implements OnInit {

  @ViewChild('outlet', { static: true }) outlet: RouterOutlet;

  constructor(private routerExtension: RouterExtensions, private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.routerExtension.navigate([{ outlets: { editVisitRouterOutlet: ['edit-check-in-time'] } }],
    { relativeTo: this.activeRoute });
  }

  prepareRouteTransitions() {
    const animation = this.outlet.activatedRouteData['animation'] || {};
    return { value: animation['value'], params: { screenWidth: 400 } } || null;
  }
}
