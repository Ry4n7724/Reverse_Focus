import { Injectable } from "@angular/core";
import { db } from "./session-db";

@Injectable({ providedIn: 'root' })
export class SessionService {

    addSession(sessionName: string, icon: string, urls: string[], active: boolean) {
        return db.sessionDB.add({ sessionName, icon, urls, active })
    }

    async updateSession(id: number, session: Partial<{ sessionName: string, icon: string, urls: string[], active: boolean }>) {
        await db.sessionDB.update(id, { ...session })
    }

    async deleteSession(id: number) {
        await db.sessionDB.delete(id)
    }

    getSessions() {
        return db.sessionDB.toArray()
    }

}