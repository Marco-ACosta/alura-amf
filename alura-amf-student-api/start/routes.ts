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

router
  .group(() => {
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
  })
  .prefix('/api')
