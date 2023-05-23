import { environment } from './../../environments/environment';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  @ViewChild('map') mapRef: ElementRef;
  map: GoogleMap;
  listaEnderecos: google.maps.places.AutocompletePrediction[] = [];

  private autocomplete = new google.maps.places.AutocompleteService();
  private directions = new google.maps.DirectionsService();
  private directionsRender = new google.maps.DirectionsRenderer();

  constructor(private ngZone: NgZone) {}

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
        lng: coordinates.coords.longitude,
      },
      zoom: 15,
    });
    this.setMarker(coordinates);
  }

  async setMarker(coordinates: Position) {
    const markerId = await this.map.addMarker({
      coordinate: {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      },
    });
  }

  buscarEndereco(valorBusca: any) {
    const busca = valorBusca.target.value as string;

    if (!busca.trim().length) {
      this.listaEnderecos = [];
      return false;
    }

    this.autocomplete.getPlacePredictions(
      { input: busca },
      (arrayLocais, status) => {
        if (status == 'OK') {
          this.ngZone.run(() => {
            this.listaEnderecos = arrayLocais ? arrayLocais : [];
            console.log(this.listaEnderecos);
          });
        } else {
          this.listaEnderecos = [];
        }
      }
    );
    return true;
  }

  public tracarRota(local: google.maps.places.AutocompletePrediction) {
    this.listaEnderecos = [];
    new google.maps.Geocoder().geocode({ address: local.description }, (resultado) => {

      const marker = new google.maps.Marker({
        position: resultado![0].geometry.location,
        title: resultado![0].formatted_address,
        animation: google.maps.Animation.DROP,
        map: this.map as unknown as google.maps.Map // tentei
      });

      const rota: google.maps.DirectionsRequest = {
        origin: this.minhaPosicao,
        destination: resultado![0].geometry.location,
        unitSystem: google.maps.UnitSystem.METRIC,
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directions.route(rota, (result, status) => {
        if (status == 'OK') {
          this.directionsRender.setMap(this.map);
          this.directionsRender.setOptions({ suppressMarkers: true });
          this.directionsRender.setDirections(result);
        }
      });
    });
  }
}
