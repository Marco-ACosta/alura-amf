import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'

const StudentsController = () => import('#controllers/students_controller')

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
