import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardService } from "@/services/api";
import { format, formatDistanceToNow } from "date-fns";
import { Bell, Calendar } from "lucide-react";

const RenewalsPage = () => {
  const [loading, setLoading] = useState(true);
  const [renewals, setRenewals] = useState([]);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchRenewals();
  }, [days]);

  const fetchRenewals = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getUpcomingRenewals(days);
      setRenewals(response.data.data.subscriptions || []);
    } catch (error) {
      console.error("Error fetching renewals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Upcoming Renewals</h1>
          <p className="text-gray-700">Track when your subscriptions renew</p>
        </div>
        <div className="flex space-x-2">
          {[7, 14, 30, 60].map((d) => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              onClick={() => setDays(d)}
            >
              {d} Days
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : renewals.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No upcoming renewals in the next {days} days
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {renewals.map((sub) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-300 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{sub.serviceName}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(sub.renewalDate), "MMMM dd, yyyy")}
                        {" • "}
                        {formatDistanceToNow(new Date(sub.renewalDate), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${sub.price}</p>
                    <p className="text-xs text-gray-500">{sub.billingCycle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RenewalsPage;
