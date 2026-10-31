import { Injectable } from "@angular/core"
import { db } from "./task-db"
import Task from "./task"

@Injectable({ providedIn: 'root' })
export class TaskService {

    addTask(task: string) {
        return db.taskDB.add({ task, done: false })
    }

    async updateTask(id: number, task: Partial<Task>) {
        await db.taskDB.update(id, { ...task })
    }

    async deleteTask(id: number) {
        await db.taskDB.delete(id)
    }

    async clearCompleted() {
        const done = (await db.taskDB.toArray()).filter(t => t.done).map(t => t.id)
        await db.taskDB.bulkDelete(done)
    }

    getTasks() {
        return db.taskDB.toArray()
    }
}
