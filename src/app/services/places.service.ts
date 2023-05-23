import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  urlPlaces= 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';

  constructor(private http: HttpClient) {}

  buscarEndereco(valorDaBusca: string) {
    let newUrl = this.urlPlaces;
    newUrl += `?input=${valorDaBusca}`;
    newUrl += `&inputtype=textquery`;
    newUrl += `&fields=formatted_address`;
    newUrl += `&key=${environment.apiKey}`;
    return this.http.get(newUrl);
  }
}
