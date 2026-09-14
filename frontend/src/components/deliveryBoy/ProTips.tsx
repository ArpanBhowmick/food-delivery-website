import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle } from "lucide-react";

const ProTips = () => {
  return (
    <div>
      <Card className="bg-slate-900 text-white border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-slate-300 space-y-3">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <p>Maintain your 3-order capacity to maximize hourly earnings.</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <p>
                Rain is expected in 45 mins. Rain surge pricing will activate
                automatically.
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProTips;
