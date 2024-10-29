import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'
const ProfessorsController = () => import('#controllers/professors_controller')

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
