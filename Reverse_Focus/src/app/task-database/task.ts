import { Entity } from "dexie";
import { TaskDB } from "./taskdb";

export default class Task extends Entity<TaskDB> {
    id!: number
    task!: string
    done!: boolean
}
