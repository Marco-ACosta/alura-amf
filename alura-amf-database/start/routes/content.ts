import router from '@adonisjs/core/services/router'
import { middleware } from '../kernel.js'
const ContentsController = () => import('#controllers/contents_controller')

router
  .group(() => {
    router.post('/:type', [ContentsController, 'store'])
  })
  .prefix('/api/content')
  .use(
    middleware.auth({
      guards: ['adminAuth'],
    })
  )
