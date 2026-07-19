import React from 'react';
import { Card, CardContent } from '../ui/card';
import { DollarSign, Users, TrendingUp, Clock } from 'lucide-react';

const stats = [
  {
    icon: DollarSign,
    value: '$2.4M',
    label: 'Total Savings',
    description: 'Saved by our users'
  },
  {
    icon: Users,
    value: '10K+',
    label: 'Active Users',
    description: 'Managing their subscriptions'
  },
  {
    icon: TrendingUp,
    value: '32%',
    label: 'Average Savings',
    description: 'Per user per year'
  },
  {
    icon: Clock,
    value: '15K+',
    label: 'Renewals Tracked',
    description: 'Never miss a payment'
  }
];

const Stats = () => {
  return (
    <section id="stats" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="font-semibold mt-2">{stat.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;