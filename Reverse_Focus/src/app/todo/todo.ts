import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiTextfield } from "@taiga-ui/core";
import { TuiCheckbox } from "@taiga-ui/kit";
import Task from '../task-database/task';
import { TaskService } from '../task-database/task-service';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule, TuiButton, TuiTextfield, TuiCheckbox],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {
  private readonly taskService = inject(TaskService);

  readonly newTask = new FormControl('', { nonNullable: true });
  readonly tasks = signal<Task[]>([]);
  readonly doneCount = computed(() => this.tasks().filter(t => t.done).length);

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    // newest first, without mutating the fetched array in place
    this.tasks.set([...(await this.taskService.getTasks())].reverse());
  }

  async addTask() {
    const text = this.newTask.value.trim();
    if (!text) {
      return;
    }
    await this.taskService.addTask(text);
    this.newTask.reset();
    await this.loadTasks();
  }

  async toggleTaskDone(task: Task) {
    await this.taskService.updateTask(task.id, { done: !task.done });
    await this.loadTasks();
  }

  async deleteTask(id: number) {
    await this.taskService.deleteTask(id);
    await this.loadTasks();
  }

  async clearCompleted() {
    await this.taskService.clearCompleted();
    await this.loadTasks();
  }
}
