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
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: process.env.ADMIN_EMAIL || 'admin@thcplus.com' },
  })

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists, skipping seed')
    return
  }

  // Hash password
  const password = process.env.ADMIN_PASSWORD || 'changeme123'
  const passwordHash = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.admin.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@thcplus.com',
      passwordHash,
      name: 'Admin',
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
