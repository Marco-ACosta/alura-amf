/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from './kernel.js'
import router from '@adonisjs/core/services/router'

const studentsController = () => import('#controllers/students_controller')
const videosController = () => import('#controllers/contents_controller')
const playlistsController = () => import('#controllers/playlists_controller')

router
  .group(() => {
    router.get('/', () => 'Hello world')
    router
      .group(() => {
        router.post('/login', [studentsController, 'login'])
        router
          .group(() => {
            router.post('/logout', [studentsController, 'logout'])
            router.get('/:id', [studentsController, 'get'])
            router.put('/:id', [studentsController, 'update'])
            router.put('/:id/update-password', [studentsController, 'updatePassword'])
            router.delete('/logout', [studentsController, 'logout'])
          })
          .use(middleware.auth({ guards: ['api'] }))
        router.post('/forgot-password', [studentsController, 'forgotPassword'])
        router.put('/:id/set-password/:code', [studentsController, 'setPassword'])
      })
      .prefix('/student')
    router
      .group(() => {
        router.get('', [videosController, 'index'])
        router.get('/:id', [videosController, 'show'])
        router.get('/download/:type/:fileName', [videosController, 'download'])
      })
      .prefix('content')
      .use(middleware.auth({ guards: ['api'] }))
    router
      .group(() => {
        router.post('/', [playlistsController, 'store'])
        router.get('/:userId', [playlistsController, 'index'])
        router.get('/:userId/:id', [playlistsController, 'show'])
        router.put('/:userId/:id', [playlistsController, 'update'])
        router.post('/:userId/:id/add-content', [playlistsController, 'addContent'])
        router.post('/:userId/:id/remove-content', [playlistsController, 'removeContent'])
        router.delete('/:userId/:id', [playlistsController, 'destroy'])
      })
      .prefix('playlists')
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api')
