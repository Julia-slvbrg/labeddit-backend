import { knex } from "knex";
import dotenv from "dotenv"

dotenv.config()

export abstract class BaseDatabase{

    protected static connection = knex({
        client: "sqlite3",
        connection: {
            filename: process.env.DB_FB_PATH as string,
        },
        useNullAsDefault: true,
        pool: {
            min: 0,
            max: 1,
            afterCreate: (conn: any, cb: any) => {
                conn.run("PRAGMA foreign_keys = ON", cb)
            }
        }
    });

    abstract TABLE_NAME: string;

    protected async findAll():Promise<any>{
        return await BaseDatabase.connection(this.TABLE_NAME)
    };

    protected async findById (id:string):Promise<any>{
        return await BaseDatabase.connection(this.TABLE_NAME).where({id})
    }
}