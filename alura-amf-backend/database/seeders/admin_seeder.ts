import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Profile from '#models/profile'
import Admin from '#models/admin'
export default class extends BaseSeeder {
  async run() {
    const profile = await Profile.create({
      name: 'marco',
      type: 'admin',
      lastName: 'costa',
      phone: '991187716,',
    })

    await Admin.create({
      email: 'marco@gmail.com',
      password: '123456',
      profileId: profile.id,
      cpf: '111.111.111-11',
    })
  }
}
