import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PoModalComponent, PoModalAction, PoRadioGroupOption, PoRadioGroupComponent, PoSelectOption } from '@portinari/portinari-ui';
import { CategoryService } from '../category.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css']
})
export class TaskFilterComponent implements OnInit {

  @Input() context: String;

  @ViewChild(PoModalComponent, {static: true}) poModal: PoModalComponent;
  @ViewChild(PoRadioGroupComponent, {static: true}) radio: PoRadioGroupComponent;

  pColumnsValue = this.context == 'tasks' ? "3" : "4";

  radioOption: String = '';

  poModalPrimaryAction: PoModalAction = {
    label: "Aplicar", 
    action: this.applyFilter.bind(this),
    disabled: true
  }

  poModalSecondaryAction: PoModalAction = {
    label: "Limpar Filtro",
    action: this.restoreFilter.bind(this),
    disabled: true
  }

  poRadioGroupOptions: PoRadioGroupOption[] = [
    {label: 'Nome', value: "name"},
    {label: 'Categoria', value: "category_id"},
    {label: 'Data Limite', value: "date"}
  ]

  poSelectOptions: PoSelectOption[] = []

  filterValue: any;

  constructor(public categoryService: CategoryService, public taskService: TaskService) { }

  ngOnInit() {

    if(this.context == 'history') {
      this.poRadioGroupOptions.push({label: 'Data de Conclusão', value: "concluded_in"})
    }

    this.categoryService.getCategories(() => {
      this.poSelectOptions = this.categoryService.categories.map(c => {
        return {
          label: c.name,
          value: c.id
        }
      })
    })
  }

  openFilter() {
    this.poModal.open();
  }

  applyFilter() {
    this.taskService.getTasksWithFilter(this.radioOption, this.filterValue, this.context);
    this.poModalSecondaryAction.disabled = false;
    this.poModal.close();
  }

  restoreFilter() {

    this.context == 'tasks' ? this.taskService.getTasks() : this.taskService.getHistory();
    this.radio.changeValue('');
    this.poModal.close();
    this.poModalSecondaryAction.disabled = true;
  }

  changeFilterMethod(method) {
    this.filterValue = null;
    this.radioOption = method;
    this.poModalPrimaryAction.disabled = true;
  }

  changeValue(value) {
    this.filterValue = value;
    this.poModalPrimaryAction.disabled = false;
  }

  changeDateValue(value) {
    let date = value.split('/');
    this.filterValue = date[2] + '-' + date[1] + '-' + date[0];
    this.poModalPrimaryAction.disabled = false;
  }

}
