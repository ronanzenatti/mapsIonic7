import { environment } from './../../environments/environment';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('map') mapRef: ElementRef;
  map: GoogleMap;

  constructor() { }

  ionViewWillEnter() {
    this.showMap();
  }

  async showMap() {
    this.map = await GoogleMap.create({
      id: 'my-map',
      element: this.mapRef.nativeElement,
      apiKey: environment.apiKey,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 1,
      },
    });
    this.getLocation();
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.setLocation(coordinates);
  }

  setLocation(coordinates: Position) {
    this.map.setCamera({
      animate: true,
      coordinate: {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      },
      zoom: 15
    });
    this.setMarker(coordinates);
  }

  async setMarker(coordinates: Position) {
    const markerId = await this.map.addMarker({
      coordinate: {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      }
    });
  }

}
