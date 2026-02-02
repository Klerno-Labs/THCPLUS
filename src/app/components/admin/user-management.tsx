'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { toast } from 'sonner'
import { Shield, ShieldCheck, Trash2, UserPlus, X } from 'lucide-react'
import { createAdminUser, updateAdminUser, deleteAdminUser } from '@/app/actions/admin-users'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'super_admin'
  isActive: boolean
  createdAt: Date
  lastLoginAt: Date | null
}

interface UserManagementProps {
  initialUsers: AdminUser[]
  currentUserEmail: string
  currentUserRole: 'admin' | 'super_admin'
}

export function UserManagement({
  initialUsers,
  currentUserEmail,
  currentUserRole,
}: UserManagementProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const isSuperAdmin = currentUserRole === 'super_admin'

  async function handleAddUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      role: formData.get('role') as 'admin' | 'super_admin',
    }

    const result = await createAdminUser(data)

    if (result.success) {
      if (!result.data) {
        toast.error('User created but no data returned')
        setLoading(false)
        return
      }
      toast.success('Admin user created successfully')
      setShowAddDialog(false)
      setUsers([...users, result.data as AdminUser])
    } else {
      toast.error(result.error || 'Failed to create user')
    }

    setLoading(false)
  }

  async function handleToggleActive(userId: string, currentActive: boolean) {
    setLoading(true)

    const result = await updateAdminUser(userId, { isActive: !currentActive })

    if (result.success) {
      if (!result.data) {
        toast.error('User updated but no data returned')
        setLoading(false)
        return
      }
      toast.success(currentActive ? 'User deactivated successfully' : 'User activated successfully')
      setUsers(users.map((u) => (u.id === userId ? { ...u, isActive: result.data.isActive } : u)))
    } else {
      toast.error(result.error || 'Failed to update user')
    }

    setLoading(false)
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this admin user?')) {
      return
    }

    setLoading(true)

    const result = await deleteAdminUser(userId)

    if (result.success) {
      toast.success('User deleted successfully')
      setUsers(users.filter((u) => u.id !== userId))
    } else {
      toast.error(result.error || 'Failed to delete user')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
          <p className="text-sm text-gray-500">
            {isSuperAdmin
              ? 'Manage admin accounts and permissions'
              : 'View admin accounts (Contact super admin to manage users)'}
          </p>
        </div>
        {isSuperAdmin && (
          <Button
            onClick={() => setShowAddDialog(true)}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Admin
          </Button>
        )}
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {/* Role Icon */}
                <div
                  className={`p-2 rounded-lg ${
                    user.role === 'super_admin'
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {user.role === 'super_admin' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                </div>

                {/* User Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    {user.email === currentUserEmail && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        You
                      </span>
                    )}
                    {user.role === 'super_admin' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                        Super Admin
                      </span>
                    )}
                    {!user.isActive && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created {new Date(user.createdAt).toLocaleDateString()}
                    {user.lastLoginAt &&
                      ` · Last login ${new Date(user.lastLoginAt).toLocaleDateString()}`}
                  </p>
                </div>
              </div>

              {/* Actions (Super Admin Only) */}
              {isSuperAdmin && user.role !== 'super_admin' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(user.id, user.isActive)}
                    disabled={loading}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Super Admin Protection Notice */}
              {user.role === 'super_admin' && (
                <div className="text-sm text-gray-500 italic">
                  Protected - Cannot be deactivated or removed
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add User Dialog */}
      {showAddDialog && isSuperAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Admin User</h3>
              <button
                onClick={() => setShowAddDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Minimum 8 characters"
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="admin">Admin (95% access, cannot manage users)</option>
                  <option value="super_admin">Super Admin (Full control)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Regular admins can do everything except add/remove users
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Admin'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
