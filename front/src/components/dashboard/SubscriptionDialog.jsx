import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subscriptionService } from '@/services/api';

const SubscriptionDialog = ({ open, onOpenChange, subscription, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    provider: '',
    category: 'Entertainment',
    price: '',
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: '',
    lastUsedDate: '',
    status: 'Active',
    autoRenew: true,
    description: ''
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        serviceName: subscription.serviceName || '',
        provider: subscription.provider || '',
        category: subscription.category || 'Entertainment',
        price: subscription.price || '',
        currency: subscription.currency || 'USD',
        billingCycle: subscription.billingCycle || 'Monthly',
        renewalDate: subscription.renewalDate ? new Date(subscription.renewalDate).toISOString().split('T')[0] : '',
        lastUsedDate: subscription.lastUsedDate ? new Date(subscription.lastUsedDate).toISOString().split('T')[0] : '',
        status: subscription.status || 'Active',
        autoRenew: subscription.autoRenew !== undefined ? subscription.autoRenew : true,
        description: subscription.description || ''
      });
    } else {
      setFormData({
        serviceName: '',
        provider: '',
        category: 'Entertainment',
        price: '',
        currency: 'USD',
        billingCycle: 'Monthly',
        renewalDate: '',
        lastUsedDate: '',
        status: 'Active',
        autoRenew: true,
        description: ''
      });
    }
  }, [subscription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (subscription) {
        await subscriptionService.update(subscription._id, data);
      } else {
        await subscriptionService.create(data);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('Error saving subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{subscription ? 'Edit Subscription' : 'Add Subscription'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Service Name *</Label>
              <Input
                required
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                placeholder="e.g., Netflix"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Provider</Label>
              <Input
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., Netflix Inc."
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Productivity">Productivity</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Cloud">Cloud</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Price *</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Currency</Label>
              <Input
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                placeholder="USD"
                maxLength={3}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Billing Cycle *</Label>
              <Select
                value={formData.billingCycle}
                onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}
              >
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Renewal Date *</Label>
              <Input
                required
                type="date"
                value={formData.renewalDate}
                onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Last Used Date</Label>
              <Input
                type="date"
                value={formData.lastUsedDate}
                onChange={(e) => setFormData({ ...formData, lastUsedDate: e.target.value })}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Auto Renew</Label>
              <Select
                value={formData.autoRenew.toString()}
                onValueChange={(value) => setFormData({ ...formData, autoRenew: value === 'true' })}
              >
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Description</Label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any notes about this subscription..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gray-900 hover:bg-gray-800 text-white">
              {loading ? 'Saving...' : subscription ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;