import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { PoModalComponent, PoModalAction, PoDynamicFormField, PoNotificationService } from '@portinari/portinari-ui';
import { CategoryService } from '../category.service';
import { DateService } from '../date.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {

  @ViewChild(PoModalComponent, {static: true}) poModal: PoModalComponent;

  @Output() closed = new EventEmitter();
  @Output() modified = new EventEmitter<any>();

  taskId: Number;
  taskName: String;
  taskCategory: Number;
  taskDate: string;
  taskDescription: String;

  poModalAction: PoModalAction = {
    label: 'Salvar',
    action: this.save.bind(this)
  }

  poModalSecondaryAction: PoModalAction = {
    label: 'Cancelar',
    action: this.cancel.bind(this),
    danger: true
  }

  formFields: PoDynamicFormField[] = [];

  task: any;

  constructor(public categoryService: CategoryService, public dateService: DateService, public notificationService: PoNotificationService, public taskService: TaskService) { }

  ngOnInit() {
    this.categoryService.getCategories(() => {
      this.formFields = [
        {
          label: 'Nome',
          property: 'name',
          required: true,
          gridColumns: 12
        },
        { 
          label: 'Categoria', 
          property: 'category_id', 
          required: true,
          gridColumns: 12,
          options: this.categoryService.categories.map(c => {
            return {
              label: c.name,
              value: c.id
            }
          })
        },
        { 
          label: 'Data Limite', 
          property: 'date', 
          required: true,
          gridColumns: 12,
          type: 'date',
          minValue: this.dateService.today() 
        },
        { 
          label: 'Descrição', 
          property: 'description',
          optional: true,
          rows: 5,
          gridColumns: 12
        }
      ];
    })
  }

  loadForm() {
    this.task = {
      id: this.taskId,
      name: this.taskName,
      category_id: this.taskCategory,
      date: this.taskDate,
      description: this.taskDescription,
      done: false
    };
  }

  save() {
    if(this.validTask()) {
      this.poModalAction.loading = true;
      this.poModalSecondaryAction.disabled = true;
      this.taskService.updateTask(this.task, () => {
        this.notificationService.success('Alteração realizada com sucesso!');
        this.taskService.getTasks();
        this.poModal.close();
        this.poModalAction.loading = false;
        this.poModalSecondaryAction.disabled = false;
        this.modified.emit(this.task);
      })
    }
  }

  cancel() {
    this.poModal.close();
    this.closed.emit();
  }

  validTask() {

    let valid = true;
    let today = this.dateService.today(); 

    if(this.task.name == undefined || this.task.name == null || this.task.name == "")
    {
      this.notificationService.error('Escolha um Nome para a Tarefa.');
      valid = false;
    }

    if(this.task.date == undefined || this.task.date == null || this.task.date == '' || this.task.date < today)
    {
      this.notificationService.error('Data Limite inválida.');
      valid = false;
    }

    return valid;
  }
}
