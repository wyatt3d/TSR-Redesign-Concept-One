"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Grid3X3, Settings } from "lucide-react"

const navItems = [
  { label: "Search", href: "/" },
  { label: "Auctions", href: "/auctions" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Alerts", href: "/alerts" },
]

export function Header() {
  const pathname = usePathname()

  const getActiveItem = () => {
    if (pathname === "/") return "Search"
    if (pathname.startsWith("/auctions")) return "Auctions"
    if (pathname.startsWith("/dashboard")) return "Dashboard"
    if (pathname.startsWith("/alerts")) return "Alerts"
    return "Search"
  }

  const activeItem = getActiveItem()

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/tsr-logo.png"
            alt="TaxSale Resources"
            width={160}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <nav className="flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeItem === item.label
                  ? "bg-[#2a7de1] text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/onboarding"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md ml-2"
        >
          <Settings className="w-5 h-5" />
        </Link>

        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
          <Grid3X3 className="w-5 h-5" />
        </button>

        <div className="relative ml-2">
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            186
          </span>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            MC
          </div>
        </div>

        <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 ml-2">
          <span>Mike Castillo (Manager)</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
