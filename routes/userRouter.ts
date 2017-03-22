/**
 * Created by andreivinogradov on 13.03.17.
 */

import { Router, Request, Response, NextFunction } from 'express'
const { db, pgp } = require('../db')

export class UserRouter {
  router: Router

  constructor () {
    this.router = Router()
    this.init()
  }

  public createUser (req: Request, res: Response, next: NextFunction): void {
    db.users.create({
      nickname: req.params.nickname,
      email: req.body.email,
      fullname: req.body.fullname,
      about: req.body.about
    })
      .then((data: any) => {
        if (data[0].action === 'updated') {
          delete data[0].action
          res.status(409)
            .json(data)
        } else {
          delete data[0].action
          res.status(201)
            .json(data[0])
        }
        // res.status(data.action === 'updated' ? 409 : 201)
        //   .json(data)
      })
  }

  public getProfile (req: Request, res: Response, next: NextFunction): void {
    db.users.profile(req.params.nickname)
      .then((data: any) => {
        res.status(200)
          .json(data)
      })
      .catch((e: Error) => {
        res.status(404)
          .end()
      })
  }

  public changeProfile (req: Request, res: Response, next: NextFunction): void {
    db.task(t => {
        return t.users.checkExistanceErrors(req.params.nickname, req.body.email)
          .then(() =>
          return t.users.update({
            nickname: req.params.nickname,
            about: req.body.about,
            email: req.body.email,
            fullname: req.body.fullname
          }))      
    })
      .then((data: any) => {
        res.status(200)
          .json(data)
      })
      .catch((e: Error) => {
        console.log(e)
        res.status(e.message === 'notfound' ? 404 : 409)
          .end()
      })
  }

  init () {
    this.router.post('/:nickname/create', this.createUser)
    this.router.get('/:nickname/profile', this.getProfile)
    this.router.post('/:nickname/profile', this.changeProfile)
  }

}

const userRoutes = new UserRouter()
userRoutes.init()

export default userRoutes.router
