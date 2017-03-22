/**
 * Created by andreivinogradov on 13.03.17.
 */

import {IMain, IDatabase, IOptions} from 'pg-promise'
import users = require('./repos/users')
import forums = require('./repos/forums')
import threads = require('./repos/threads')
import posts = require('./repos/posts')
import services = require('./repos/services')
import * as pgPromise from 'pg-promise'
import diag = require('./diagnostics')

interface IExtensions {
  users: users.Repository,
  forums: forums.Repository,
  threads: threads.Repository,
  posts: posts.Repository
  services: services.Repository
}

const options: IOptions<IExtensions> = {
  extend: (obj: IExtensions) => {
    obj.users = new users.Repository(obj, pgp)
    obj.forums = new forums.Repository(obj, pgp)
    obj.threads = new threads.Repository(obj, pgp)
    obj.posts = new posts.Repository(obj, pgp)
    obj.services = new services.Repository(obj, pgp)
  }

}

const config = {
  host: 'localhost',
  port: 5432,
  database: 'docker',
  user: 'docker',
  password: 'docker'
}

const pgp: IMain = pgPromise(options)

const db = pgp(config) as IDatabase<IExtensions>&IExtensions

diag.init(options)

export = { db, pgp }
