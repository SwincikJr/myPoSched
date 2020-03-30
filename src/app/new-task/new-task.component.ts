import { Component, OnInit, ViewChild } from '@angular/core';
import { PoModalComponent, PoDynamicFormField, PoModalAction, PoNotificationService } from '@portinari/portinari-ui';
import { CategoryService } from '../category.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  @ViewChild(PoModalComponent, {static: true}) poModal: PoModalComponent;

  formFields: PoDynamicFormField[] = [];

  newTask: any;

  poModalPrimaryAction: PoModalAction = {
    label: 'Salvar',
    action: this.create.bind(this)
  }

  constructor(public categoryService: CategoryService, public taskService: TaskService, private notificationService: PoNotificationService) { }

  ngOnInit() {
    this.categoryService.getCategories(() => {
      let date = (new Date()).toLocaleDateString().split('/');
      this.formFields = [{ 
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
          minValue: date[2] + '-' + date[1] + '-' + date[0]  
        },
        { 
          label: 'Descrição', 
          property: 'description',
          optional: true,
          rows: 5,
          gridColumns: 12
        }
      ];
      this.restoreForm();
    })
  }

  restoreForm() {
    this.newTask = {
      name: '',
      category_id: 1,
      date: '',
      description: ''
    }
    this.newTask.category_id = this.categoryService.categories[0].id;
  }

  openForm() {
    this.poModal.open();
  }

  create() {
    if(this.validTask())
    {
      this.poModalPrimaryAction.loading = true;
      let task = { ...this.newTask }
      this.taskService.createTask(task, resp => {
        this.taskService.getTasks();
        this.poModal.close();
        this.notificationService.success('Tarefa criada com sucesso!');
        this.poModalPrimaryAction.loading = false;
        this.restoreForm();
      });
    }
  }

  validTask() {

    let valid = true;
    let date = (new Date()).toLocaleDateString().split('/');

    let today = date[2] + '-' + date[1] + '-' + date[0]; 

    if(this.newTask.name == undefined || this.newTask.name == null || this.newTask.name == "")
    {
      this.notificationService.error('Escolha um Nome para a Tarefa.');
      valid = false;
    }

    if(this.newTask.date == undefined || this.newTask.date == null || this.newTask.date == '' || this.newTask.date < today)
    {
      this.notificationService.error('Data Limite inválida.');
      valid = false;
    }

    return valid;
  }

}
