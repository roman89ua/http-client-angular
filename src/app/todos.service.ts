import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ToDo} from './todo.interface';
import {catchError, delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private http: HttpClient) { }

  addTodo(todo: ToDo): Observable<ToDo>{
    return this.http.post<ToDo>('https://jsonplaceholder.typicode.com/todos', todo, {
      headers: new HttpHeaders({
        MyNewCustomHeader: 'Some value', // first way to add headers
      }),
    })
      .pipe(catchError(error => {
        console.log(error.message);
        return throwError(error);
      })
    );
  }

  fetchTodos(): Observable<ToDo[]> {

    let params = new HttpParams();  // syntax for bunch of parameters
    params = params.append('_limit', '6');
    params = params.append('custom_parameter', 'anything');
    return this.http.get<ToDo[]>('https://jsonplaceholder.typicode.com/todos', {
      // params: new HttpParams().set('_limit', '5') // syntax for one parameter
      params
    })
      .pipe(delay(500),
        catchError(error => {
          console.log(error.message);
          return throwError(error);
        })
      );
  }

  remove(id: number): Observable<void> {
    const headers = new HttpHeaders({
      theSecondOneHeader: 'the value of the second header',
    });
    return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      headers, // the second way to add headers
    })
      .pipe(catchError(error => {
          console.log(error.message);
          return throwError(error);
        })
      );
  }

  complete(id: number): Observable<ToDo>{
    return this.http.put<ToDo>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      completed: true
    }).pipe(catchError(error => {
          console.log(error.message);
          return throwError(error);
        })
      );
  }
}
