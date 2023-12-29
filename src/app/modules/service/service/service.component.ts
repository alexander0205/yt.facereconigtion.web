import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  showLoadingIndicator = true;
  constructor(public router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.showLoadingIndicator = true
      }
      if (routerEvent instanceof NavigationEnd) {
        this.showLoadingIndicator = false
      }
    })
  }
  forms: any[] = []
  selection: number;
  async ngOnInit() {
    if (this.selectedForm() && !localStorage.getItem('lastUrl')) {
      this.routeInto(this.selectedForm());

    }
  }
  routeToRecords() {
    if ((this.router.url).search('creacionRecord') !== -1) {
    } else {
      return './creacionRecord';
    }
  }

  selectedForm(): number {
    return Number(localStorage.getItem('typeFormId'));
  }

  routeInto(id) {

    let { alternateField } = this.forms?.find(x => x.value == Number(id))

    switch (alternateField) {
      case "ORDSE":
        this.router.navigate(['creacionRecord/ordenServicio'], { relativeTo: this.route })
        break;

      case "PROGI":
        this.router.navigate(['creacionRecord/programaInspeccion'], { relativeTo: this.route })
        break;

      case "SERVU":
        this.router.navigate(['creacionRecord/ServicioUsuario'], { relativeTo: this.route })
        break;

      case null:

        this.router.navigate(['/creacionRecord'], { relativeTo: this.route })
        break;

      default:
        break;
    }

  }

  active() {
    return (this.router.url).search('creacionRecord') !== -1 ? true : false;
  }
}
