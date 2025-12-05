import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface SidebarProps {
  newReviewCount?: number
  onLogout: () => void
}

interface NavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export function Sidebar({ newReviewCount = 0, onLogout }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: HomeIcon, badge: newReviewCount },
    { path: '/settings', label: 'Settings', icon: Cog6ToothIcon },
  ]

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center space-x-3 px-4 py-6">
        <div className="w-10 h-10 bg-sentri-blue rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <span className="font-bold text-xl text-white tracking-tight-brand">Sentri</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                transition-all duration-200 ease-in-out
                ${isActive
                  ? 'bg-sentri-blue/30 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>

              {item.badge && item.badge > 0 && (
                <span className="bg-warning text-guardian-navy text-xs font-bold px-2 py-1 rounded-full animate-pulse-subtle">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 min-w-[44px] min-h-[44px] bg-guardian-navy rounded-lg text-white hover:bg-sentri-blue active:scale-[0.98] transition-all duration-micro"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      <div
        className={`
          lg:hidden fixed inset-0 z-40 bg-black/50
          transition-opacity duration-medium
          ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-guardian-navy
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-3 min-w-[44px] min-h-[44px] text-white/70 hover:text-white hover:bg-white/10 active:scale-[0.98] rounded-lg transition-all duration-micro"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <div className="flex flex-col h-full">
          <NavContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-guardian-navy">
        <NavContent />
      </div>
    </>
  )
}
