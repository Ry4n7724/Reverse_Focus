import Dexie, { EntityTable } from "dexie"
import Session from "./session"



export class SessionDB extends Dexie {
    sessionDB!: EntityTable<Session, "id">

    constructor() {
        super("SessionDB")
        this.version(1).stores({
            sessionDB: "++id, sessionName, icon, urls, active",
        })
        // Booleans are not valid IndexedDB keys and `urls` was never a multiEntry index,
        // so only the primary key is indexed; sessions are filtered in memory.
        this.version(2).stores({
            sessionDB: "++id",
        })
        this.sessionDB.mapToClass(Session)
    }
} 