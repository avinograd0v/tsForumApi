/**
 * Created by andreivinogradov on 13.03.17.
 */

import { Router, Request, Response, NextFunction } from 'express'
const { db, pgp } = require('../db')

export class ServiceRouter {
  router: Router

  constructor () {
    this.router = Router()
    this.init()
  }

  public clearUserData (req: Request, res: Response, next: NextFunction): void {
    db.services.clear()
      .then(() => {
        res.status(200)
          .end()
      })
  }

  public getDatabaseInfo (req: Request, res: Response, next: NextFunction): void {
    db.services.status()
      .then((data: any) => {
        res.status(200)
          .json(data)
      })
  }

  init () {
    this.router.post('/clear', this.clearUserData)
    this.router.get('/status', this.getDatabaseInfo)
  }

}

const serviceRoutes = new ServiceRouter()
serviceRoutes.init()

export default serviceRoutes.router
