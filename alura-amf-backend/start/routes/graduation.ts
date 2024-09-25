import router from '@adonisjs/core/services/router'
const GraduationsController = () => import('#controllers/graduations_controller')

router
  .group(() => {
    router.post('/create', [GraduationsController, 'store'])
    router.get('/', [GraduationsController, 'list'])
    router.get('/:id', [GraduationsController, 'show'])
    router.get('/:id/icon', [GraduationsController, 'downloadIcon'])
  })
  .prefix('/graduation')
