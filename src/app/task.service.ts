import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: any;
  history: any;

  constructor(private httpClient: HttpClient, public loginService: LoginService) { }

  sortTasks() { }

  getTasks() {
    this.httpClient.get(`http://localhost:3000/tasks?_sort=date&done=false&user_id=${this.loginService.getUser_id()}`).subscribe(resp => {
      this.tasks = resp;
    })
  }

  getTasksWithFilter(property, value, context) {
    let done = context == 'tasks' ? false : true;
    let sort = context == 'tasks' ? 'date' : 'concluded_in'; 
    this.httpClient.get(`http://localhost:3000/tasks?${property}=${value}&_sort=${sort}&done=${done}&user_id=${this.loginService.getUser_id()}`).subscribe(resp => {
      this[context] = resp;
    })
  }

  createTask(task, callback) {
    task.user_id = parseInt(this.loginService.getUser_id().toString());
    task.done = false;
    this.httpClient.post(`http://localhost:3000/tasks`, task).subscribe(resp => {
      callback(resp);
    })
  }

  concludeTask(id, callback) {
    let task = this.tasks.find(t => t.id == id);
    let date = (new Date()).toLocaleDateString().split('/');
    task.concluded_in = date[2] + '-' + date[1] + '-' + date[0];
    task.done = true;
    this.httpClient.put(`http://localhost:3000/tasks/${id}`, task).subscribe(resp => {
      callback();
    })
  }

  getHistory() {
    this.httpClient.get(`http://localhost:3000/tasks?_sort=concluded_in&done=true&user_id=${this.loginService.getUser_id()}`).subscribe(resp => {
      this.history = resp;
    })
  }

  deleteTask(id, callback) {
    this.httpClient.delete(`http://localhost:3000/tasks/${id}`).subscribe(resp => {
      callback();
    })
  }

  updateTask(task, callback) {
    task.user_id = parseInt(this.loginService.getUser_id().toString());
    this.httpClient.put(`http://localhost:3000/tasks/${task.id}`, task).subscribe(resp => {
      callback();
    })
  }
}
