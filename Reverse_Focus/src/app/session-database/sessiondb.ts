import Dexie, { EntityTable } from "dexie"
import Session from "./session"



export class SessionDB extends Dexie {
    sessionDB!: EntityTable<Session, "id">

    constructor() {
        super("SessionDB")
        this.version(1).stores({
            sessionDB: "++id, sessionName, icon, urls, active",
        })
        this.sessionDB.mapToClass(Session)
    }
} 