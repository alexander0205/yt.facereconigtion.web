import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as L from 'leaflet';
import { latLng, tileLayer } from 'leaflet';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
import { location } from './location';
declare var ol: any;
export const DEFAULT_HEIGHT = '500px';
export const DEFAULT_WIDTH = '500px';

export const DEFAULT_LAT = -34.603490361131385;
export const DEFAULT_LON = -58.382037891217465;
@Component({
  selector: 'Map-location',
  templateUrl: './Map.component.html',
  styleUrls: ['./Map.component.css']
})
export class MapComponent implements AfterViewInit {
  @Input() location: location;
  @Input() geoInfo: any;
  @Input() title: string;
  private map;
  private initMap(geoInfo): void {


    this.map = L.map('map').setView([geoInfo.lat, geoInfo.lon], 18);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 13,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    if (geoInfo.geojson) {

      L.popup()
        .setLatLng([geoInfo.lat, geoInfo.lon])
        .setContent(`'<p>${geoInfo.display_name}</p>'`)
        .openOn(this.map);

      switch (geoInfo.geojson.type) {
        case 'Point':
          const cor = geoInfo.geojson.coordinates;


          const icon = L.icon({
            iconUrl: '../../../../../../assets/icons/marker-icon.png',
            shadowUrl: '../../../../../../assets/icons/marker-shadow.png',

            iconSize: [25, 41],
            shadowSize: [41, 41],
            iconAnchor: [13, 41]

          });
          L.marker([cor[1], cor[0]], { icon: icon }).addTo(this.map)
          break;

        case 'Polygon':

          let latlng = this.converCordenates(geoInfo.geojson.coordinates[0]) as L.LatLngExpression[];
          const polygon = L.polygon(latlng, { color: 'red' }).addTo(this.map);
          this.map.fitBounds(polygon.getBounds());
          break;

        case 'LineString':
          let latlngLyne = this.converCordenates(geoInfo.geojson.coordinates) as L.LatLngExpression[];

          const polyline = L.polyline(latlngLyne, { color: 'red' }).addTo(this.map);

          this.map.fitBounds(polyline.getBounds());
          break;
      }

    }

  }

  constructor(public ngbActiveModal: NgbActiveModal, private http: HttpClient) { }
  async ngOnInit() {

    this.initMap(this.geoInfo[0]);
  }
  ngAfterViewInit(): void {

  }


  converCordenates(cor: Array<number[]>) {
    return cor.map(v => { return [v[1], v[0]] })
  }
}