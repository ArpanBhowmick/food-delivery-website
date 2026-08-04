import { CheckCircle2, ImageIcon, Info } from 'lucide-react'
import React from 'react'

const TipsCard = () => {
  return (
    <>
    {/* Tips for Success Card */}
            <div className="bg-white rounded-xl border border-slate-400 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                Tips for Success
              </h2>

              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="mt-0.5 bg-purple-50 p-1.5 rounded-lg text-[#581c87] h-fit">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Use a clear restaurant name
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Choose a name that's easy to remember and represents your
                      cuisine.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 bg-purple-50 p-1.5 rounded-lg text-[#581c87] h-fit">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Add a high-quality image
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Upload a clear logo or image to attract more customers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 bg-purple-50 p-1.5 rounded-lg text-[#581c87] h-fit">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Provide accurate details
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Double-check your address and contact information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
    </>
  )
}

export default React.memo(TipsCard);