import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Folder, List, Star } from 'lucide-react'

export const MenuOverview = () => {
  return (
    <>
    <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-bold uppercase tracking-wide">
                  Menu Overview
                </CardTitle>
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="text-slate-600 border-slate-300 bg-blue-50/50 cursor-pointer"
                >
                  Edit Menu
                </Button> */}
              </CardHeader>
              <CardContent className="flex justify-between items-start mt-2">
                <div className="space-y-3 text-sm text-slate-800">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">Total Categories: 6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">Total Items: 48</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 mt-0.5" />
                    <div>
                      <span className="font-medium">Most Popular Dishes:</span>
                      <div className="font-bold mt-1">
                        Margherita Pizza , Truffle Risotto , Lasagna
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-lg p-4 flex flex-col items-center justify-center min-w-[120px]">
                  <span className="text-xl font-bold text-slate-900">$24.5k</span>
                  <span className="text-xs text-slate-500 font-medium">
                    Total orders
                  </span>
                </div>
              </CardContent>
            </Card>
    </>
  )
}

