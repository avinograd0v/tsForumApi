/**
 * Created by andreivinogradov on 13.03.17.
 */

import { Router, Request, Response, NextFunction } from 'express'
const { db, pgp } = require('../db')

// let resus: number[] = []
// const source = (arr: number[], identifier: any) => (index: any, data: any, delay: any) => {
//   console.log(index, data, delay)
//   if (data !== undefined) {
//     resus.push(data[0])
//   }
//   if (index < arr.length) {
//     return db.query(`with tuple as (
//      select u.id as uid, u.nickname, f.id as fid, f.slug from "user" u, forum f
//      where lower(f.slug)=lower($(forum))
//      and lower(u.nickname) = lower($(nickname))
//      )
//
//      insert into post as ci (author_id, created, forum_id, isedited, message,
//      parent_id, thread_id) select uid, $(created), fid, false,
//      $(message), $(parentID), $(threadID) from tuple
//      returning (select nickname from tuple) as author, ci.created,
//      (select slug from tuple) as forum, ci.id, ci.isedited as isEdited,
//      ci.message, ci.parent_id as parent, ci.thread_id as thread`,
//       (Object as any).assign({identifier}, arr[index]))
//   }
// }

export class ThreadRouter {
  router: Router

  constructor () {
    this.router = Router()
    this.init()
  }

  public getThreadDetails (req: Request, res: Response, next: NextFunction): void {
    const identifier = isNaN(req.params.identifier) ? `t.slug = '${req.params.identifier}'::citext`
      : `t.id = ${+req.params.identifier}`
    db.threads.details(identifier)
      .then((data: any) => {
        res.status(200)
          .json(data)
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(404)
          .end()
      })
  }

  public changeThreadDetails (req: Request, res: Response, next: NextFunction): void {
    const identifier = isNaN(req.params.identifier) ? `slug = '${req.params.identifier}'::citext`
      : `id = ${+req.params.identifier}`
    db.threads.update({
      message: req.body.message,
      title: req.body.title,
      identifier
    })
      .then((data: any) => {
        res.status(200)
          .json(data)
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(404)
          .end()
      })
  }

  public changeVotes (req: Request, res: Response, next: NextFunction): void {
    const identifier = isNaN(req.params.identifier) ? `t.slug = '${req.params.identifier}'::citext`
      : `t.id = ${+req.params.identifier}`
    db.threads.vote({
      nickname: req.body.nickname,
      voice: req.body.voice,
      identifier
    })
      .then((data: any) => {
        res.status(200)
          .json(data)
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(404)
          .end()
      })
  }

  public addPosts (req: Request, res: Response, next: NextFunction): void {
    const identifier = isNaN(req.params.identifier) ? `slug = '${req.params.identifier}'::citext`
      : `id = ${+req.params.identifier}`
    let fId: any
    db.task((t: any) => {
      return t.posts.getForumAndThread(identifier, t)
        .then((info: any) => {
          fId = info.forumid
          return t.posts.create(req.body, info, t)
        }
      )
        .then((data: any) => {
          return t.forums.addToPostsCounter(req.body.length, fId, t)
            .then(() => {
              res.status(201)
                .json(data)
            })
        })
    })
      .catch((e: Error) => {
        console.log(e)
        res.status(e.message === 'notfound' ? 404 : 409)
          .end()
      })
  }

  public getThreadPosts (req: Request, res: Response, next: NextFunction): void {
    const identifier2 = isNaN(req.params.identifier) ? `slug = '${req.params.identifier}'::citext`
      : `id = ${+req.params.identifier}`
    let marker = req.query.marker === undefined ? 0 : +req.query.marker
    db.task((t: any) => {
      return t.threads.exists(identifier2)
        .then((info: any) => {
          if (info.id) {
            return t.threads.posts({
              identifier: info.id,
              marker,
              conditionalLimit: req.query.limit === undefined ? '' : `limit ${req.query.limit}`,
              sort: req.query.sort === undefined ? 'flat' : req.query.sort,
              orderCondition: req.query.desc === 'true' ? 'desc' : 'asc'
            })
          } else {
            throw new Error('notfound')
          }
        })
    })
      .then((data: any) => {
        marker += (data.length === 0) ? 0 : +req.query.limit
        data.forEach((post: any) => { if (post.parent === 0) { delete post.parent }})
        const result: any = {marker: '' + marker, posts: data}
        res.status(200)
          .json(result)
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(404)
          .end()
      })
  }

  init () {
    this.router.post('/:identifier/create', this.addPosts)
    this.router.get('/:identifier/details', this.getThreadDetails)
    this.router.post('/:identifier/details', this.changeThreadDetails)
    this.router.get('/:identifier/posts', this.getThreadPosts)
    this.router.post('/:identifier/vote', this.changeVotes)
  }

}

const threadRoutes = new ThreadRouter()
threadRoutes.init()

export default threadRoutes.router
