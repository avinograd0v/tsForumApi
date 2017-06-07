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
    const isForum = req.query.related !== undefined && req.query.related.includes('forum')
    const isUser = req.query.related !== undefined && req.query.related.includes('user')
    const isThread = req.query.related !== undefined && req.query.related.includes('thread')
    db.posts.details({
      id: +req.params.id,
      conditionalForum: isForum ? `
        json_build_object(
          'posts', f.posts_count,
          'slug', p.forum_slug,
          'threads', f.threads_count,
          'title', f.title,
          'user', f.user_nickname) as forum,
      ` : '',
      conditionalAuthor: isUser ? `
        json_build_object(
          'about', u.about,
          'email', u.email,
          'fullname', u.fullname,
          'nickname', p.author_nickname) as author,
      ` : '',
      // Поправить счетчики голосов постов и веток
      conditionalThread: isThread ? `,
        json_build_object(
          'author', t.author_nickname,
          'forum', p.forum_slug,
          'id', p.thread_id,
          'message', t.message,
          'slug', p.thread_slug,
          'title', t.title,
          'votes', t.votes
           ) as thread, t.created as threadcreated
      ` : '',
      conditionalJoinThread: isThread ? `
        inner join thread t on p.thread_id=t.id
      ` : '',
      conditionalJoinAuthor: isUser ? `
        inner join "user" u on p.author_id=u.id
      ` : '',
      conditionalJoinForum: isForum ? `
        inner join forum f on p.forum_id=f.id
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
