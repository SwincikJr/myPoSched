import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { PoModalComponent, PoModalAction } from '@portinari/portinari-ui';
import { CategoryService } from '../category.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @ViewChild(PoModalComponent, {static: true}) poModal: PoModalComponent;

  taskTitle: String;
  taskDescription: String;
  taskDate: String;
  taskId: Number;

  poModalAction: PoModalAction = {
    label: 'Concluir Tarefa',
    action: this.conclude.bind(this)
  }

  constructor(public categoryService: CategoryService, public taskService: TaskService) { }

  ngOnInit() {
    this.taskService.getTasks();
  }

  checkExpiring(task) {
    let today = (new Date()).toLocaleDateString().split('/')
    if (today[2] + '-' + today[1] + '-' + today[0] >= task.date) return 'expiring'
  }

  clickedTask(id) {

    const task = this.taskService.tasks.find(t => t.id == id);
    const category = this.categoryService.getNameById(task.category_id);

    this.taskTitle = category + ": " + task.name;
    this.taskDescription = task.description;
    this.taskDate = this.taskService.getFormatedDate(task.date);
    this.taskId = id;
    this.poModal.open();
  }

  conclude() {
    if(confirm('Confirma a conclusão desta Tarefa? Esta ação não poderá ser desfeita.')) {
      this.poModalAction.loading = true;
      this.taskService.concludeTask(this.taskId, () => {
        this.poModal.close();
        this.poModalAction.loading = false;
        this.taskService.getTasks();
      });
    }
  }
}
