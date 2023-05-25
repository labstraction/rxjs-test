import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { Pokemon } from '../model/pokemon';
import { Ability } from '../model/ability';
import { BaseData } from '../model/base-data';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  readonly DITTO_URL = 'https://pokeapi.co/api/v2/pokemon/ditto'

  readonly ALL_POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon'

  constructor(private http: HttpClient) {
    // this.getDittoWithPromise();
    // this.getDittoWithObservable();
  }


  getDittoWithPromise(): Promise<any>{
    // fetch(this.DITTO_URL)
    //   .then(resp => resp.json())
    //   .then(ditto => console.log('ditto fetch', ditto))
    //   .catch(err => console.log(err));

    return fetch(this.DITTO_URL).then(resp => resp.json());
  }


  getDittoWithObservable(): Observable<Pokemon>{
    // this.http.get(this.DITTO_URL)
    // .subscribe(ditto => console.log('ditto fetch', ditto))

    // this.http.get(this.DITTO_URL)
    //   .subscribe({
    //     next: ditto => console.log('ditto fetch', ditto),
    //     error: err => console.log(err)
    //   });

    return this.http.get<Pokemon>(this.DITTO_URL);
  }


  getFirst20PokemonWithPromise(): Promise<any[]>{
    const fetchArray = [];

    for (let i = 1; i < 21; i++) {
      const url = this.ALL_POKEMON_URL + '/' + i + '/'
      console.log(url);
      const request = fetch(url).then(resp => resp.json());
      fetchArray.push(request);
    }

    return Promise.all(fetchArray);
  }


  getFirst20PokemonWithObservable(): Observable<Pokemon[]>{
    const getArray = [];

    for (let i = 1; i < 21; i++) {
      const url = this.ALL_POKEMON_URL + '/' + i + '/'
      console.log(url);
      const request = this.http.get<Pokemon>(url);
      getArray.push(request);
    }

    return forkJoin(getArray);

  }


  getFirstAbilityPromise(): Promise<any>{

    return fetch(this.DITTO_URL)
    .then(resp => resp.json())
    .then(ditto => {
      const abilities = ditto.abilities;
      const firstAbilityInfo = abilities[0];
      const ability = firstAbilityInfo.ability;
      const abilityUrl = ability.url;
      return fetch(abilityUrl).then(resp => resp.json());
    })


  }

  getFirstAbilityObservable(): Observable<Ability>{

    return this.http.get<Pokemon>(this.DITTO_URL).pipe(
      switchMap((ditto) => {
        const abilities = ditto.abilities;
        const firstAbilityInfo = abilities[0];
        const ability = firstAbilityInfo.ability;
        const abilityUrl = ability.url;
        return this.http.get<Ability>(abilityUrl);
      })
    )



  }


  getAllPokemonsWithPromise(){
    return fetch(this.ALL_POKEMON_URL)
    .then(res => res.json())
    .then(pokemons => {
      const results = pokemons.results;
      const fetchArray = [];
      for (const result of results) {
        const request = fetch(result.url).then(res => res.json());
        fetchArray.push(request);
      }
      return Promise.all(fetchArray);
    })
  }

  getAllPokemonsWithObservable(): Observable<Pokemon[]>{

    return this.http.get<BaseData>(this.ALL_POKEMON_URL).pipe(
      switchMap(pokemons => {
        const results = pokemons.results;
        const getArray = [];
        for (const result of results) {
          const request = this.http.get<Pokemon>(result.url);
          getArray.push(request);
        }
        return forkJoin(getArray);
      })
    )
  }

}
