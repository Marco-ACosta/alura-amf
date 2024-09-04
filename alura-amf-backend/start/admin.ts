import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AdminController = () => import('#controllers/admin_controller')

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
