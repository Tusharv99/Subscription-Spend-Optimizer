import React from 'react';
import { 
  BarChart3, 
  Bell, 
  Clock, 
  CreditCard, 
  PieChart, 
  Search, 
  Shield, 
  Zap 
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const features = [
  {
    icon: BarChart3,
    title: 'Spending Analytics',
    description: 'Visualize your subscription spending with beautiful charts and insights.'
  },
  {
    icon: Bell,
    title: 'Renewal Alerts',
    description: 'Never miss a renewal with smart notifications and reminders.'
  },
  {
    icon: Clock,
    title: 'Unused Detection',
    description: 'Automatically detect subscriptions you haven\'t used in months.'
  },
  {
    icon: PieChart,
    title: 'Category Breakdown',
    description: 'See exactly where your money goes with category-wise analysis.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We never share your information.'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Get instant updates on your subscription status and spending.'
  },
  {
    icon: CreditCard,
    title: 'Multi-Currency Support',
    description: 'Track subscriptions in any currency with automatic conversion.'
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find any subscription quickly with powerful search and filters.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Manage Subscriptions
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to help you take control of your subscription spending
            and save money.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;