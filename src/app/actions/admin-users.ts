'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

/**
 * Get all admin users
 */
export async function getAdminUsers() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthorized' }
    }

    const users = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: [{ role: 'desc' }, { createdAt: 'asc' }],
    })

    return { success: true, data: users }
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return { success: false, error: 'Failed to fetch admin users' }
  }
}

/**
 * Create a new admin user
 * Only super admins can create users
 */
export async function createAdminUser(data: {
  email: string
  password: string
  name: string
  role: 'admin' | 'super_admin'
}) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get current user's role
    const currentUser = await prisma.admin.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })

    // Only super admins can create users
    if (currentUser?.role !== 'super_admin') {
      return { success: false, error: 'Only super admins can create new users' }
    }

    // Check if user already exists
    const existingUser = await prisma.admin.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

    // Create user
    const newUser = await prisma.admin.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    revalidatePath('/admin/settings')
    return { success: true, data: newUser }
  } catch (error) {
    console.error('Error creating admin user:', error)
    return { success: false, error: 'Failed to create admin user' }
  }
}

/**
 * Update admin user
 * Super admins can update anyone
 * Regular admins can only update themselves (except role)
 */
export async function updateAdminUser(
  userId: string,
  data: {
    name?: string
    email?: string
    role?: 'admin' | 'super_admin'
    isActive?: boolean
  }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get current user's role
    const currentUser = await prisma.admin.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!currentUser) {
      return { success: false, error: 'Current user not found' }
    }

    // Get target user
    const targetUser = await prisma.admin.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    })

    if (!targetUser) {
      return { success: false, error: 'User not found' }
    }

    // PROTECTION: Cannot deactivate or change role of super admins
    if (targetUser.role === 'super_admin') {
      if (data.isActive === false) {
        return {
          success: false,
          error: 'Cannot deactivate super admin accounts',
        }
      }
      if (data.role && data.role !== 'super_admin') {
        return {
          success: false,
          error: 'Cannot change super admin role',
        }
      }
    }

    // Regular admins can only update themselves (and not their role)
    if (currentUser.role !== 'super_admin') {
      if (currentUser.id !== userId) {
        return { success: false, error: 'You can only update your own account' }
      }
      if (data.role) {
        return { success: false, error: 'You cannot change your own role' }
      }
    }

    // Update user
    const updatedUser = await prisma.admin.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    })

    revalidatePath('/admin/settings')
    return { success: true, data: updatedUser }
  } catch (error) {
    console.error('Error updating admin user:', error)
    return { success: false, error: 'Failed to update admin user' }
  }
}

/**
 * Delete admin user
 * Only super admins can delete users
 * Cannot delete super admin accounts
 */
export async function deleteAdminUser(userId: string) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get current user's role
    const currentUser = await prisma.admin.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })

    // Only super admins can delete users
    if (currentUser?.role !== 'super_admin') {
      return { success: false, error: 'Only super admins can delete users' }
    }

    // Get target user
    const targetUser = await prisma.admin.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!targetUser) {
      return { success: false, error: 'User not found' }
    }

    // PROTECTION: Cannot delete super admins
    if (targetUser.role === 'super_admin') {
      return {
        success: false,
        error: 'Cannot delete super admin accounts. This ensures you can never be locked out.',
      }
    }

    // Delete user
    await prisma.admin.delete({
      where: { id: userId },
    })

    revalidatePath('/admin/settings')
    return { success: true }
  } catch (error) {
    console.error('Error deleting admin user:', error)
    return { success: false, error: 'Failed to delete admin user' }
  }
}

/**
 * Change admin password
 * Users can change their own password
 * Super admins can change anyone's password
 */
export async function changeAdminPassword(
  userId: string,
  newPassword: string,
  currentPassword?: string
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get current user
    const currentUser = await prisma.admin.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, passwordHash: true },
    })

    if (!currentUser) {
      return { success: false, error: 'Current user not found' }
    }

    // If changing own password, verify current password
    if (currentUser.id === userId && currentPassword) {
      const isValid = await bcrypt.compare(currentPassword, currentUser.passwordHash)
      if (!isValid) {
        return { success: false, error: 'Current password is incorrect' }
      }
    }

    // Regular admins can only change their own password
    if (currentUser.role !== 'super_admin' && currentUser.id !== userId) {
      return { success: false, error: 'You can only change your own password' }
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.admin.update({
      where: { id: userId },
      data: { passwordHash },
    })

    return { success: true }
  } catch (error) {
    console.error('Error changing password:', error)
    return { success: false, error: 'Failed to change password' }
  }
}
