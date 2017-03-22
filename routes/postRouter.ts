/**
 * Created by andreivinogradov on 13.03.17.
 */

import { Router, Request, Response, NextFunction } from 'express'
const { db, pgp } = require('../db')

export class PostRouter {
  router: Router

  constructor () {
    this.router = Router()
    this.init()
  }

  public changePostDetails (req: Request, res: Response, next: NextFunction): void {
    db.posts.update(req.body.message, req.params.id)
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

  public getPostDetails (req: Request, res: Response, next: NextFunction): void {
    db.posts.details({
      id: +req.params.id,
      conditionalForum: req.query.related !== undefined && req.query.related.includes('forum') ? `
        json_build_object(
          'posts', (select count(id) from post where forum_id=f.id),
          'slug', f.slug,
          'threads', (select count(id) from thread where forum_id=f.id),
          'title', f.title,
          'user', (select nickname from "user" where id=f.user_id)) as forum,
      ` : '',
      conditionalAuthor: req.query.related !== undefined && req.query.related.includes('user') ? `
        json_build_object(
          'about', u.about,
          'email', u.email,
          'fullname', u.fullname,
          'nickname', u.nickname) as author,
      ` : '',
      conditionalThread: req.query.related !== undefined && req.query.related.includes('thread') ? `,
        json_build_object(
          'author', (select nickname from "user" where id=t.author_id),
          'forum', f.slug,
          'id', t.id,
          'message', t.message,
          'slug', t.slug,
          'title', t.title,
          'votes', COALESCE((select sum(vote) from vote where thread_id=t.id), 0)::integer
           ) as thread, t.created as threadcreated
      ` : '',
      conditionalJoinThread: req.query.related !== undefined && req.query.related.includes('thread') ? `
        inner join thread t on p.thread_id=t.id
      ` : ''
    })
      .then((data: any) => {
        data.post.created = data.postcreated
        delete data.postcreated
        if (data.thread !== undefined) {
          data.thread.created = data.threadcreated
          delete data.threadcreated
        }
        res.status(200)
          .json(data)
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(404)
          .end()
      })
  }

  init () {
    this.router.post('/:id/details', this.changePostDetails)
    this.router.get('/:id/details', this.getPostDetails)
  }

}

const postRoutes = new PostRouter()
postRoutes.init()

export default postRoutes.router
