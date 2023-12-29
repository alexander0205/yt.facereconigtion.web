import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from '../_models/Breadcrumb';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumService {

  public readonly _breadcrumb$ = new BehaviorSubject<Breadcrumb>(new Breadcrumb());

  readonly breadcrumb$ = this._breadcrumb$.asObservable();

  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(event => {
      // Construct the breadcrumb hierarchy
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs: Breadcrumb[] = [];
      this.addBreadcrumb(root, breadcrumbs);
      this._breadcrumbs$.next(breadcrumbs);

      const breadcrumb: Breadcrumb = new Breadcrumb;
      this.addSingleBreadcrumb(root, breadcrumb);

      // Emit the new hierarchy 
      this._breadcrumb$.next(breadcrumb);
    });
  }

  private addSingleBreadcrumb(
    route: ActivatedRouteSnapshot,
    breadcrumbs: Breadcrumb
  ) {
    if (route) {
      // Add an element for the current route part 
      if (route.data.breadcrumb) {
        const breadcrumb = {
          label: this.getSingleLabel(route.data),
        };

        breadcrumbs.label = breadcrumb.label;
      }
      // Add another element for the next route part 
      this.addSingleBreadcrumb(route.firstChild, breadcrumbs);
    }
  }

  private getSingleLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data 
    return typeof data.breadcrumb === 'function'
      ? data.breadcrumb(data)
      : data.breadcrumb;
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot, breadcrumbs: Breadcrumb[]) {
    if (route) {
      // Add an element for the current route part
      if (route.data.breadcrumb) {
        const breadcrumb = {
          label: this.getLabel(route.data)
        };
        breadcrumbs.push(breadcrumb);
      }
      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data.breadcrumb === 'function' ? data.breadcrumb(data) : data.breadcrumb;
  }
}
