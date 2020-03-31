import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { PoModalComponent, PoModalAction } from '@portinari/portinari-ui';
import { CategoryService } from '../category.service';
import { TaskService } from '../task.service';
import { UpdateTaskComponent } from '../update-task/update-task.component';
import { DateService } from '../date.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @ViewChild(PoModalComponent, {static: true}) poModal: PoModalComponent;
  @ViewChild(UpdateTaskComponent, {static: true}) updateTaskComponent: UpdateTaskComponent;

  taskTitle: string;
  taskName: string;
  taskDescription: string;
  taskDate: string;
  taskId: Number;
  taskCategory: Number;

  poModalAction: PoModalAction = {
    label: 'Concluir Tarefa',
    action: this.conclude.bind(this)
  }

  poModalSecondaryAction: PoModalAction = {
    label: 'Modificar Tarefa',
    action: this.update.bind(this),
    danger: true
  }

  constructor(public categoryService: CategoryService, public taskService: TaskService, public dateService: DateService) { }

  ngOnInit() {
    this.taskService.getTasks();
  }

  checkExpiring(task) {
    if (this.dateService.today() >= task.date) return 'expiring';
  }

  clickedTask(id) {

    const task = this.taskService.tasks.find(t => t.id == id);
    const category = this.categoryService.getNameById(task.category_id);

    this.taskName = task.name;
    this.taskTitle = category + ": " + task.name;
    this.taskDescription = task.description;
    this.taskCategory = task.category_id;
    this.taskDate = this.dateService.convert(task.date, false);
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

  update() {
    this.updateTaskComponent.taskId = this.taskId;
    this.updateTaskComponent.taskName = this.taskName;
    this.updateTaskComponent.taskCategory = this.taskCategory;
    this.updateTaskComponent.taskDate = this.dateService.convert(this.taskDate);
    this.updateTaskComponent.taskDescription = this.taskDescription;
    this.updateTaskComponent.loadForm();
    this.poModal.close();
    this.updateTaskComponent.poModal.open();
  }

  reopenModal() {
    this.poModal.open();
  }

  updateInfoCard(task) {
    this.taskName = task.name;
    this.taskCategory = task.category_id;
    this.taskDate = this.dateService.convert(task.date, false);
    this.taskDescription = task.description;
    this.taskTitle = this.categoryService.getNameById(this.taskCategory) + ': ' + this.taskName;
    this.poModal.open();
  }
}
