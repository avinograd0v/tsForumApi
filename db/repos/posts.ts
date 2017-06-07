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

  create = (posts: any, info: any, task: any) => {
    return task.tx((t: any) => {
      const chObj = posts.reduce((prev: any, curr: any) => {
        prev.parents.push(curr.parent || 0)
        prev.messages.push(curr.message)
        prev.authors.push(curr.author)
        return prev
      }, { parents: [], messages: [], authors: [] })

      const query = t.any(sql.create, (Object as any).assign(info, chObj))
        .then((data: any) => {
          if (data.length !== posts.length) {
            throw new Error('notfound')
          }
          if (data.some((p: any) => p.parent === null)) {
            throw new Error('wrong parent id')
          }
          t.posts.addToUserForumRelations({forumID: info.forumid, authors: chObj.authors})
          return data
        })

      return query
    })
  }

  addToUserForumRelations (info: any) {
    this.db.none(sql.addToUserForumRelation, info)
  }

  getForumAndThread = (identifier: any, task: any) => {
    return task.oneOrNone(`
     select id as threadID, slug as threadSlug, forum_id as forumID,
     forum_slug as forumSlug from thread where $(identifier:raw)`,
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
