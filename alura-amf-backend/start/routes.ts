/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AdminController = () => import('#controllers/admin_controller')
const ProfessorsController = () => import('#controllers/professors_controller')
const StudentsController = () => import('#controllers/students_controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router
  .group(() => {
    router.post('/login', [AdminController, 'login'])
    router.post('/forgot-password', [AdminController, 'forgotPassword'])
    router.put('/:id/set-password/:code', [AdminController, 'setPassword'])
    router
      .group(() => {
        router.post('/create/:type', [AdminController, 'store'])
        router.get('/', [AdminController, 'list'])
        router.get('/:id', [AdminController, 'show']).use(middleware.isUser())
        router.put('/:id', [AdminController, 'update']).use(middleware.isUser())
        router
          .put('/:id/update-password', [AdminController, 'updatePassword'])
          .use(middleware.isUser())
        router.put('/:id/restore', [AdminController, 'restore'])
        router.delete('/logout', [AdminController, 'logout'])
        router.delete('/:id/soft-delete/:type', [AdminController, 'delete'])
        router.delete('/:id/hard-delete/:type', [AdminController, 'destroy'])
      })
      .use(
        middleware.auth({
          guards: ['adminAuth'],
        })
      )
  })
  .prefix('/admin')
router
  .group(() => {
    router.post('/login', [ProfessorsController, 'login'])
    router.post('/forgot-password', [ProfessorsController, 'forgotPassword'])
    router.put('/:id/set-password/:code', [ProfessorsController, 'setPassword'])
    router
      .group(() => {
        router.get('/', [ProfessorsController, 'list'])
        router.get('/:id', [ProfessorsController, 'show'])
        router.put('/:id', [ProfessorsController, 'update'])
        router
          .put('/:id/update-password', [ProfessorsController, 'updatePassword'])
          .use(middleware.isUser())
        router.delete('/logout', [ProfessorsController, 'logout'])
      })
      .use(middleware.auth({ guards: ['professorAuth', 'adminAuth'] }))
    router.group(() => {})
  })
  .prefix('/professor')

router
  .group(() => {
    router.post('/login', [StudentsController, 'login'])
    router.post('/forgot-password', [StudentsController, 'forgotPassword'])
    router.put('/:id/set-password/:code', [StudentsController, 'setPassword'])
    router
      .group(() => {
        router.get('/', [StudentsController, 'list'])
        router.get('/:id', [StudentsController, 'show'])
        router.put('/:id', [StudentsController, 'update'])
        router
          .put('/:id/update-password', [StudentsController, 'updatePassword'])
          .use(middleware.isUser())
        router.delete('/logout', [StudentsController, 'logout'])
      })
      .use(middleware.auth({ guards: ['studentAuth', 'professorAuth', 'adminAuth'] }))
  })
  .prefix('/student')
