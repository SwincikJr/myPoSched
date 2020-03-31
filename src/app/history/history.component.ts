import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../category.service';
import { PoModalAction, PoModalComponent } from '@portinari/portinari-ui';
import { TaskService } from '../task.service';
import { DateService } from '../date.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  @ViewChild(PoModalComponent, {static: true}) poModal: PoModalComponent;

  taskTitle: String;
  taskDescription: String;
  taskDate: String;
  concludedDate: String;
  taskId: Number;

  poModalAction: PoModalAction = {
    label: 'Excluir do Histórico',
    action: this.delete.bind(this)
  }

  constructor(public categoryService: CategoryService, public taskService: TaskService, public dateService: DateService) { }

  ngOnInit() {
    this.taskService.getHistory();
  }

  clickedTask(id) {

    const task = this.taskService.history.find(t => t.id == id);
    const category = this.categoryService.getNameById(task.category_id);

    this.taskTitle = category + ": " + task.name;
    this.taskDescription = task.description;
    this.taskDate = this.dateService.convert(task.date, false);
    this.concludedDate = this.dateService.convert(task.concluded_in, false);
    this.taskId = id;
    this.poModal.open();

  }

  delete() {
    if(confirm('Confirma a exclusão desta Tarefa? Esta ação não poderá ser desfeita.')) {
      this.poModalAction.loading = true;
      this.taskService.deleteTask(this.taskId, () => {
        this.poModal.close();
        this.poModalAction.loading = false;
        this.taskService.getHistory();
      });
    }
  }

}
