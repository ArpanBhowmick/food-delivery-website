import { Plus } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const GrowBusinessCard = () => {
  return (
    <Link
      to="/owner/shop/create"
      className="bg-white rounded-xl border-2 border-dashed border-[#581c87] overflow-hidden shadow-sm flex flex-col h-[340px]"
    >
      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-purple-50 border border-[#581c87] flex items-center justify-center">
          <Plus className="w-8 h-8 text-[#581c87]" />
        </div>

        <h3 className="mt-4 text-2xl font-bold text-[#581c87]">
          Add New Shop
        </h3>
      </div>
    </Link>
  )
}

export default GrowBusinessCard