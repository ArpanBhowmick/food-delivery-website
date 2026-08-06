import { BarChart3, ClipboardList, LayoutDashboard, Settings, Store } from 'lucide-react';
import React from 'react'


const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: false },
  { icon: Store, label: 'My Shops', active: true },
  { icon: ClipboardList, label: 'Orders', active: false },
  
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const OwnerSidebar = () => {
  return (
    
    <>
    {/* Sidebar */}
      <aside className="w-16 lg:w-64 bg-white border-r border-gray-300 flex-shrink-0">
        <nav className="p-2 lg:p-4 space-y-1">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href="#"
                title={item.label}
                className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  item.active 
                    ? 'bg-[#581c87]/10 text-[#581c87]' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={`shrink-0 ${item.active ? 'text-[#581c87]' : 'text-gray-500'}`} />
                <span className="hidden lg:inline">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
    

  )
}

export default OwnerSidebar