import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { TuiIcon } from "@taiga-ui/core";
import { TuiCheckbox, TuiTile, TuiTilesComponent } from "@taiga-ui/kit";
import Task from '../task-database/task';
import { TaskService } from '../task-database/task-service';
import { FieldConfig } from '../template-form/field-config';
import { TemplateForm } from "../template-form/template-form";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  imports: [TemplateForm, TuiTile, TuiIcon, FormsModule, CommonModule, TuiTilesComponent, TuiCheckbox],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {

  formTitle = 'To Do'
  fields: FieldConfig[] = [{
    name: 'task', label: 'Task', type: 'textfield'
  }]
  taskService = inject(TaskService)
  protected order = new Map<number, number>()
  tasks: Task[] = []
  cdr = inject(ChangeDetectorRef)

  ngOnInit() {
    this.loadTasks()
  }

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
    this.tasks.reverse();
    this.cdr.detectChanges()
  }

  toggleTaskDone(id: number, state: boolean) {
    this.taskService.updateTask(id, { done: !state });
    this.loadTasks()
  }
  saveTask = (form: FormGroup) => {
    if (form.value.task.trim() !== '') {
      this.taskService.addTask(form.value.task);
      form.reset();
      this.loadTasks()
    }
  };


  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId);
    this.loadTasks();
  }

}
