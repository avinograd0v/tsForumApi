/**
 * Created by andreivinogradov on 13.03.17.
 */

import { Router, Request, Response, NextFunction } from 'express'
const { db, pgp } = require('../db')
import {isUndefined} from 'util'

export class ForumRouter {
  router: Router

  constructor () {
    this.router = Router()
    this.init()
  }

  public createForum (req: Request, res: Response, next: NextFunction): void {
    db.forums.checkAuthorExistance(req.body.user)
      .then((user: any) =>
        db.forums.create({
          slug: req.body.slug,
          title: req.body.title,
          userID: user.id,
          name: user.nickname
        }))
      .then((data: any) => {
        res.status(data.action === 'updated' ? 409 : 201)
          .json({
            slug: data.slug,
            title: data.title,
            user: data.user
          })
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(404)
          .end()
      })
  }

  public createThread (req: Request, res: Response, next: NextFunction): void {
    db.threads.checkAuthorOrForumExistance(req.body.author, req.params.slug)
      .then((fu: any) =>
        db.threads.create({
          authorId: fu[0].id,
          forumId: fu[1].id,
          created: req.body.created,
          message: req.body.message,
          slug: req.body.slug,
          title: req.body.title
        }))
      .then((data: any) => {
        res.status(data.action === 'updated' ? 409 : 201)
          .json({
            slug: data.slug,
            title: data.title,
            author: data.author,
            id: data.id,
            message: data.message,
            forum: data.forum,
            created: data.created
          })
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(404)
          .end()
      })
  }

  public getForumDetails (req: Request, res: Response, next: NextFunction): void {
    db.forums.details(req.params.slug)
      .then((data: any) => {
        res.status(200)
          .json(data)
      })
      .catch((e: Error) => {
        res.status(404)
          .end()
      })
  }

  public getForumThreads (req: Request, res: Response, next: NextFunction): void {
    console.log(req.query)
    db.forums.checkForumExistance(req.params.slug)
      .then((fm: any) =>
        db.forums.threads({
          slug: fm.slug,
          fID: fm.id,
          conditionalLimit: req.query.limit === undefined ? '' : `limit ${req.query.limit}`,
          conditionalSince: req.query.since === undefined ? '' : `and t.created 
          ${req.query.desc === 'true' ? '<=' : '>='} '${req.query.since}'`,
          orderCondition: req.query.desc === 'true' ? 'desc' : 'asc'
        }))
      .then((data: any) => {
        res.status(200)
          .json(data)
          .end()
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(404)
          .end()
      })
  }

  public getForumUsers (req: Request, res: Response, next: NextFunction): void {
    db.forums.checkForumExistance(req.params.slug)
      .then((fm: any) =>
        db.forums.users({
          fID: fm.id,
          conditionalLimit: req.query.limit === undefined ? '' : `limit ${req.query.limit}`,
          conditionalSince: req.query.since === undefined ? '' : `
             and lower(u.nickname) ${req.query.desc === 'true' ? '<' : '>'}
             lower('${req.query.since}')
          `,
          orderCondition: req.query.desc === 'true' ? 'desc' : 'asc'
        })
      )
      .then((data: any) => {
        data.forEach((user: any) => { delete user.nick })
        res.status(200)
          .json(data)
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(404)
          .end()
      })
  }

  init (): void {
    this.router.post('/create', this.createForum)
    this.router.post('/:slug/create', this.createThread)
    this.router.get('/:slug/details', this.getForumDetails)
    this.router.get('/:slug/threads', this.getForumThreads)
    this.router.get('/:slug/users', this.getForumUsers)
  }

}

const forumRoutes = new ForumRouter()
forumRoutes.init()

export default forumRoutes.router
