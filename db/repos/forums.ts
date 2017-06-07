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
    return this.db.any(sql.users, params)
  }

  addToCounter = (id: any) => {
    return this.db.none(`update forum set threads_count = threads_count + 1 where id = $(id)`, { id })
  }

  addToPostsCounter = (length: number, id: number, task: any) => {
    return task.none(`update forum set posts_count = posts_count + $(length) where id = $(id)`, { length, id })
  }

  checkAuthorExistance = (nickname: string): Promise<any> =>
    this.db.oneOrNone(`select id, nickname from "user" where nickname=$(nickname)::citext`,
      {nickname}, (userObj: any) => {
        if (userObj === null) {
          throw new Error('Author not found!')
        }
        return userObj
      })

  checkForumExistance = (slug: string): Promise<any> =>
    this.db.oneOrNone('select id, slug from forum where slug=${slug}::citext', {slug},
      (forumObj: any) => {
        if (forumObj === null) {
          throw new Error('Forum not found!')
        }
        return forumObj
      })
}
