import { Injectable } from "@angular/core"
import { db } from "./db"
import Task from "./task"

@Injectable({ providedIn: 'root' })
export class TaskService {

    addTask(task: string) {
        db.taskDB.add({ task, done: false })
    }

    async updateTask(id: number, task: Partial<Task>) {
        await db.taskDB.update(id, { ...task })
    }

    async deleteTask(id: number) {
        await db.taskDB.delete(id)
    }

    getTasks() {
        return db.taskDB.toArray()
    }
}