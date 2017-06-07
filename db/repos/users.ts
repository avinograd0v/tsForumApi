/**
 * Created by andreivinogradov on 13.03.17.
 */
import {IDatabase, IMain} from 'pg-promise'
import sqlProvider = require('../sql')

const sql = sqlProvider.users

export class Repository {
  private db: IDatabase<any>

  private pgp: IMain

  constructor (db: any, pgp: IMain) {
    this.db = db
    this.pgp = pgp
  }

  create = (info: any): Promise<any> =>
    this.db.many(sql.create, info)

  profile = (nickname: string): Promise<any> =>
    this.db.oneOrNone(sql.profile, {nickname})

  update = (info: any): Promise<any> =>
    this.db.oneOrNone(sql.update, info, (userProf: any) => {
      if (userProf === null) {
        throw new Error('User not found')
      }
      return userProf
    })

  checkExistanceErrors = (nickname: string, email: string): Promise<any> => {
    return this.db.one(`select case when (select id from "user" where
     nickname<>$<nickname>::citext and email=$<email>::citext)
     is not null then true else false end as "conflict", case when (select id from "user" where
     nickname=$<nickname>::citext) is not null then false else true end as "notfound"`,
      {nickname, email}, (errors: any) => {
        if (errors.notfound) {
          throw new Error('notfound')
        } else if (errors.conflict) {
          throw new Error('conflict')
        }
      })
  }
}
