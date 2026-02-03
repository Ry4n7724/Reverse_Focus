import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiIcon } from '@taiga-ui/core';
import { TemplateForm } from "../template-form/template-form";
import { FieldConfig } from '../template-form/field-config';
import { TaskService } from '../database/task-service';
import Task from '../database/task';
import { TuiCheckbox, TuiTile, TuiTilesComponent } from "@taiga-ui/kit";

@Component({
  selector: 'app-starter-page',
  imports: [TuiIcon, ReactiveFormsModule, CommonModule, TemplateForm, TuiTile, TuiTilesComponent, TuiCheckbox, FormsModule],
  templateUrl: './starter-page.html',
  styleUrl: './starter-page.css'
})
export class StarterPage implements OnInit {
  formTitle = 'To Do'
  fields: FieldConfig[] = [{
    name: 'task', label: 'Task', type: 'textfield', validator: Validators.required,
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
    if (form.valid) {
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
