import {Component, OnInit} from '@angular/core';
import {ToDo} from './todo.interface';
import {delay} from 'rxjs/operators';
import {TodosService} from './todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  todos: ToDo[] = [];
  todoTitle = '';
  loading;
  loader = 'Loading...';
  error = '';

  constructor(private todosService: TodosService) {
  }

  ngOnInit(): void {
    this.fetchTodos();
  }
  addTodo(): void {
    if (!this.todoTitle.trim()){
      return;
    }
    this.todosService.addTodo({
      completed: false,
      title: this.todoTitle
    })
      .subscribe(response => {
      this.todos.unshift(response);
      this.todoTitle = '';
    }, error => {
        this.error = error.message;
      });
  }

  fetchTodos(): void {
    this.loading = true;
    this.todosService.fetchTodos()
      .pipe(delay(500))
      .subscribe(response => {
        this.todos = response;
        this.loading = false;
      }, error => {
        this.error = error.message;
      });
  }

  completed(id: number): void {
    this.todosService.complete(id)
      .subscribe(response => {
        console.log('response from put request: ', response);
        this.todos.find( t => t.id === response.id).completed = response.completed;
      }, error => {
        this.error = error.message;
      });
  }

  remove(id: number): void {
    this.todosService.remove(id)
      .subscribe(() => {
        this.todos = this.todos.filter(t => t.id !== id);
      }, error => {
        this.error = error.message;
      });
  }
}
