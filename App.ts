/**
 * Created by andreivinogradov on 13.03.17.
 */
import * as path from 'path'
import ForumRouter from './routes/forumRouter'
import PostRouter from './routes/postRouter'
import ServiceRouter from './routes/serviceRouter'
import ThreadRouter from './routes/threadRouter'
import UserRouter from './routes/userRouter'
import * as express from 'express'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'

class App {

  public express: express.Application

  constructor () {
    this.express = express()
    this.middleware()
    this.routes()
  }

  private middleware (): void {
    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({extended: false}))
  }

  private routes (): void {
    this.express.use('/forum', ForumRouter)
    this.express.use('/post', PostRouter)
    this.express.use('/service', ServiceRouter)
    this.express.use('/thread', ThreadRouter)
    this.express.use('/user', UserRouter)
  }

}

export default new App().express
