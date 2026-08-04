import { ImageIcon, TrendingUp } from 'lucide-react'
import React from 'react'

const PortfolioTips = () => {
  return (
    <>
    {/* Portfolio Tips */}
                <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm">
                  <h2 className="text-base font-bold text-slate-900 mb-4">
                    Portfolio Tips
                  </h2>
    
                  <div className="space-y-5">
                    <div className="flex gap-3">
                      <div className="mt-0.5 bg-purple-50 p-1.5 rounded-lg text-[#581c87] h-fit shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Optimize multi-shop delivery routes
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Choose a multi-shop delivery routes and represent routes
                          efficiently.
                        </p>
                      </div>
                    </div>
    
                    <div className="flex gap-3">
                      <div className="mt-0.5 bg-purple-50 p-1.5 rounded-lg text-[#581c87] h-fit shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Provide accurate details
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Upload a clear image or images and a concise text
                          description.Ensure details are accurate to
                          represent your business.
                          {/* Upload clear shop images and logo and add a concise text
                          description. Ensure details are accurate to present and
                          represent your business. */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
    </>
  )
}

export default PortfolioTips