import { Plus, UtensilsCrossed } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';


interface firstItemProps {
  shopId: string;
}

export const AddFirstItem = ({ shopId }: firstItemProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[260px]">
      <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
        <UtensilsCrossed className="w-7 h-7 text-[#581c87]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        Add Your Food Item
      </h3>

      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        Add your first menu item to start showcasing your dishes and accepting
        customer orders.
      </p>

      <Button asChild className="mt-6 bg-[#581c87] hover:bg-[#4c1775] cursor-pointer">
        <Link to={`/owner/shop/${shopId}`}>
          <Plus className="w-4 h-4 mr-2" />
          Add First Menu Item
        </Link>
      </Button>
    </div>
  );
};


