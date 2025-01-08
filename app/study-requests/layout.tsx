"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Study Request", href: "/study-requests" },
    { label: "My Requests", href: "/study-requests/my-requests" },
    { label: "My Requests to Teach", href: "/study-requests/my-requests-to-teach" },
    { label: "Add Request", href: "/study-requests/add-request" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-gray-950 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-blue-500">
              Study Platform
            </h1>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content Section */}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
