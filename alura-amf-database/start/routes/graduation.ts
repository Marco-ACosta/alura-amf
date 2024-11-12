import router from '@adonisjs/core/services/router'
const GraduationsController = () => import('#controllers/graduations_controller')

router
  .group(() => {
    router.post('/create', [GraduationsController, 'store'])
    router.get('/', [GraduationsController, 'list'])
    router.get('/:id', [GraduationsController, 'show'])
    router.get('/:id/icon', [GraduationsController, 'downloadIcon'])
    router.put('/:id', [GraduationsController, 'update'])
    router.delete('/:id', [GraduationsController, 'delete'])
    router.put('/:id/restore', [GraduationsController, 'restore'])
    router.delete('/:id/hard-delete', [GraduationsController, 'destroy'])
  })
  .prefix('/api/graduation')
