import { Entity } from "dexie";
import { SessionDB } from "./sessiondb";

export default class Session extends Entity<SessionDB> {
    id!: number
    sessionName!: string
    icon!: string
    urls!: string[]
    active!: boolean
}
