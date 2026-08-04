import type { IShop } from '@/types/shop.types';
import { Star } from 'lucide-react'



interface PortfolioOverviewProps {
  shops: IShop[];
}


const PortfolioOverview = ({ shops }: PortfolioOverviewProps) => {



  return (
    <>
     {/* Portfolio Overview */}
                <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm mb-3">
                  <h2 className="text-base font-bold text-slate-900 mb-4">
                    Portfolio Overview
                  </h2>
    
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Total Shops</span>
                      <span className="text-sm font-bold text-slate-900">{shops.length}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600">
                        Total Orders Today
                      </span>
                      <span className="text-sm font-bold text-slate-900">120</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Avg Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-slate-900">
                          4.5
                        </span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>
    </>
  )
}

export default PortfolioOverview