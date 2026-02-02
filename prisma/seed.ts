/**
 * Prisma Database Seed Script
 *
 * Creates initial admin user for accessing the dashboard.
 * Run with: npx prisma db seed
 *
 * IMPORTANT: Change the default password after first login!
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Check if admin already exists
  const superAdminEmail = process.env.ADMIN_EMAIL || 'c.hatfield309@gmail.com'
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: superAdminEmail },
  })

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists, skipping seed')
    // If exists but not super_admin, upgrade them
    if (existingAdmin.role !== 'super_admin') {
      await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: { role: 'super_admin' },
      })
      console.log('✅ Upgraded existing admin to super_admin')
    }
    return
  }

  // Hash password
  const password = process.env.ADMIN_PASSWORD || 'Smoke2026!'
  const passwordHash = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.admin.create({
    data: {
      email: superAdminEmail,
      passwordHash,
      name: 'Chris Hatfield',
      role: 'super_admin',
    },
  })

  console.log('✅ Admin user created:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Password: ${password}`)
  console.log('')
  console.log('⚠️  IMPORTANT: Change this password after first login!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
