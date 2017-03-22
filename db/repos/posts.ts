/**
 * Created by andreivinogradov on 13.03.17.
 */

import {IDatabase, IMain} from 'pg-promise'
import sqlProvider = require('../sql')

const sql = sqlProvider.posts

export class Repository {
  private db: IDatabase<any>

  private pgp: IMain

  constructor (db: any, pgp: IMain) {
    this.db = db
    this.pgp = pgp
  }

  create = (posts: any, info: any) => {
    return this.db.tx((t: any) => {
      const queries = (Object as any).values(posts).map((post: any) => {
        return t.oneOrNone(sql.create, (Object as any).assign(info, {
          author: post.author,
          created: post.created,
          isEdited: post.isEdited === true ? true : false,
          message: post.message,
          parent: (post.parent === 0 || post.parent === undefined) ? 0 : `
            case when exists(select id from post where id = ${post.parent} and thread_id = ${info.threadid})
            then ${post.parent} else null end
          `
        }), (data: any) => {
          if (data === null) {
            throw new Error('notfound')
          }
          return data
        })
      })

      return t.batch(queries)
    })
  }

  getForumAndThread = (identifier: any) => {
    return this.db.oneOrNone(`
     select t.id as threadID, t.slug as threadSlug, f.id as forumID,
     f.slug as forumSlug from thread t inner
     join forum f on t.forum_id=f.id where $(identifier:raw)`,
      {identifier}, (result: any) => {
        if (result === null) {
          throw new Error('notfound')
        }
        return result
      })
  }

  details = (params: any) =>
    this.db.oneOrNone(sql.details, params, (postObj: any) => {
      if (postObj === null) {
        throw new Error('Post not found')
      }
      return postObj
    })

  update = (message: string, id: number) =>
    this.db.oneOrNone(sql.update, {message, id}, (postObj: any) => {
      if (postObj === null) {
        throw new Error('Post not found')
      }
      return postObj
    })
}
