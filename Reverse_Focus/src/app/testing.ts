import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { icons, LucideAngularModule } from 'lucide-angular';
import { SessionService } from './session-database/session-service';
import { TaskService } from './task-database/task-service';

/** In-memory stand-ins: IndexedDB is not available in the test runtime. */
const sessionServiceStub = {
  getSessions: async () => [],
  hasActiveSession: async () => false,
  addSession: async () => 1,
  updateSession: async () => { },
  deleteSession: async () => { },
};
const taskServiceStub = {
  getTasks: async () => [],
  addTask: async () => 1,
  updateTask: async () => { },
  deleteTask: async () => { },
  clearCompleted: async () => { },
};

/** Providers most components need: router, HttpClient, Lucide icons and DB-free services. */
export const commonTestProviders = [
  provideRouter([]),
  provideHttpClient(),
  importProvidersFrom(LucideAngularModule.pick(icons)),
  { provide: SessionService, useValue: sessionServiceStub },
  { provide: TaskService, useValue: taskServiceStub },
];
