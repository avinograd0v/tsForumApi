/**
 * Created by andreivinogradov on 13.03.17.
 */

import {IDatabase, IMain} from 'pg-promise'
import sqlProvider = require('../sql')

const sql = sqlProvider.threads

interface Thread {
  author?: string,
  authorId: number,
  forumId: number,
  created?: string,
  readonly forum?: string
  readonly id?: number,
  message: string,
  readonly slug?: string,
  title: string,
  readonly votes?: number
}

interface NewThreadResponse {
  author: string,
  created?: string,
  readonly forum?: string
  readonly id?: number,
  message: string,
  readonly slug?: string,
  title: string,
  readonly votes?: number
}

export class Repository {
  private db: IDatabase<any>

  private pgp: IMain

  constructor (db: any, pgp: IMain) {
    this.db = db
    this.pgp = pgp
  }

  create = (info: Thread): Promise<NewThreadResponse> =>
    this.db.one(sql.create, info)

  details = (identifier: string): Promise<any> =>
    this.db.oneOrNone(sql.details, {identifier}, (threadObj: any) => {
      if (threadObj === null) {
        throw new Error('Ветка не найдена!')
      }
      return threadObj
    })

  update = (params: any) =>
    this.db.oneOrNone(sql.update, params, (threadObj: any) => {
      if (threadObj === null) {
        throw new Error('Thread not found')
      }
      return threadObj
    })

  preselectAffected = (params: any) =>
    this.db.one(`select count(p.id)::integer as marker from post p inner join thread t on t.id=p.thread_id
      where p.parent_id = 0 and $(identifier:raw) $(conditionalLimit:raw) offset $(marker)
      `, params)

  posts = (params: any, affected: any) => {
    if (params.sort === 'flat') {
      return this.db.any(sql.posts, params)
    } else if (params.sort === 'tree') {
      return this.db.any(sql.tree, params)
    } else if (params.sort === 'parent_tree') {
      return this.db.any(`select p.id as marker from post p inner join thread t on t.id=p.thread_id
      where p.parent_id = 0 and $(identifier:raw) $(conditionalLimit:raw) offset $(marker)
      `, params)
        .then((result: any) => {
          affected.marker = result.length
          return this.db.any(sql.parentTree, params)
        })
    }
  }

  vote = (params: any) =>
    this.db.one(sql.vote, params)
      .then((data: any) => {return this.db.one(sql.details, params)})

  checkAuthorOrForumExistance = (nickname: string, forum: string): Promise<any> =>
    this.db.result('' +
      ' with author as (select id, nickname from "user" where lower(nickname)=lower(${nickname})),' +
      '      fm as (select id, slug from "forum" where lower(slug)=lower(${forum}))' +
      ' select id, nickname as title from author union all select id, slug from fm',
      {nickname, forum}, (fu: any) => {
        if (fu.rows.length !== 2) {
          throw new Error('Author or forum not found!')
        }
        return fu.rows
      })
}
