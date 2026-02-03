import { Injectable, OnInit } from "@angular/core";
import Dexie, { EntityTable } from "dexie"
import Task from "./task";



export class TaskDB extends Dexie {
    taskDB!: EntityTable<Task, "id">

    constructor() {
        super("TaskDB")
        this.version(1).stores({
            taskDB: "++id, task, done",
        })
        this.taskDB.mapToClass(Task)
    }
}