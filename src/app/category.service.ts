import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: any;

  constructor(private httpClient: HttpClient) { }

  getCategories(callback) {
    if(this.categories == null || this.categories == undefined) {
      this.httpClient.get(`http://localhost:3000/categories?_sort=name`).subscribe(resp => {
        this.categories = resp;
        callback();
      })
    } else {
      callback();
    }
  }

  getNameById(id) {
    let category = this.categories.find(c => c.id == id);
    return category.name;
  }
}
