/**
 * Created by andreivinogradov on 13.03.17.
 */

import {IDatabase, IMain} from 'pg-promise'
import sqlProvider = require('../sql')

const sql = sqlProvider.forums

interface Forum {
  readonly posts?: number,
  slug: string,
  readonly threads?: number,
  title: string,
  userID: number,
  name: string
}

interface NewForumResponse {
  action: string,
  slug: string,
  title: string,
  name: string
}

export class Repository {
  private db: IDatabase<any>

  private pgp: IMain

  constructor (db: any, pgp: IMain) {
    this.db = db
    this.pgp = pgp
  }

  create = (info: Forum): Promise<NewForumResponse> =>
    this.db.one(sql.create, info)

  details = (slug: string) =>
    this.db.oneOrNone(sql.details, {slug}, (forumObj: any) => {
      if (forumObj === null) {
        throw new Error('Forum not found')
      }
      return forumObj
    })

  threads = (params: any) =>
    this.db.any(sql.threads, params)

  users = (params: any) => {
    return this.db.result(sql.users, params, (allUsers: any) => {
      // console.log(allUsers.rows)
      return allUsers.rows
    })
  }

  checkAuthorExistance = (nickname: string): Promise<any> =>
    this.db.oneOrNone('select id, nickname from "user" where lower(nickname)=lower(${nickname})',
      {nickname}, (userObj: any) => {
        if (userObj === null) {
          throw new Error('Author not found!')
        }
        return userObj
      })

  checkForumExistance = (slug: string): Promise<any> =>
    this.db.oneOrNone('select id, slug from forum where lower(slug)=lower(${slug})', {slug},
      (forumObj: any) => {
        if (forumObj === null) {
          throw new Error('Forum not found!')
        }
        return forumObj
      })
}
