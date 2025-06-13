
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, Shield } from 'lucide-react';
import { CreditPackage, PaymentData } from '@/hooks/useCreditsPurchase';

interface PaymentFormProps {
  selectedPackage: CreditPackage;
  onPayment: (paymentData: PaymentData) => Promise<void>;
  loading: boolean;
}

interface PaymentFormData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
  email: string;
}

interface PaymentErrors {
  [key: string]: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedPackage,
  onPayment,
  loading
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<PaymentErrors>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: PaymentErrors = {};
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Please enter expiry as MM/YY';
    }
    
    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'Please enter CVC code';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter cardholder name';
    }
    
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onPayment({
        package: selectedPackage,
        cardNumber: formData.cardNumber,
        expiry: formData.expiry,
        cvc: formData.cvc,
        name: formData.name,
        email: formData.email
      });
    } catch (error) {
      console.error('Payment failed:', error);
      setErrors({ submit: 'Payment failed. Please try again.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Package Summary */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Package:</span>
              <span className="text-white font-medium capitalize">{selectedPackage.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Credits:</span>
              <span className="text-cyan-400 font-bold">{selectedPackage.credits.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Total:</span>
              <span className="text-white text-xl font-bold">${selectedPackage.price}</span>
            </div>
            {selectedPackage.originalPrice && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">You save:</span>
                <span className="text-emerald-400 font-medium">
                  ${(selectedPackage.originalPrice - selectedPackage.price).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Secure Payment
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Lock className="w-4 h-4" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-slate-300">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className={`bg-gray-700 border-gray-600 text-white ${
                  errors.cardNumber ? 'border-red-500' : 'focus:border-cyan-400'
                }`}
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="text-sm text-red-400">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-slate-300">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={(e) => handleInputChange('expiry', e.target.value)}
                  className={`bg-gray-700 border-gray-600 text-white ${
                    errors.expiry ? 'border-red-500' : 'focus:border-cyan-400'
                  }`}
                  maxLength={5}
                />
                {errors.expiry && (
                  <p className="text-sm text-red-400">{errors.expiry}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc" className="text-slate-300">CVC</Label>
                <Input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  value={formData.cvc}
                  onChange={(e) => handleInputChange('cvc', e.target.value)}
                  className={`bg-gray-700 border-gray-600 text-white ${
                    errors.cvc ? 'border-red-500' : 'focus:border-cyan-400'
                  }`}
                  maxLength={4}
                />
                {errors.cvc && (
                  <p className="text-sm text-red-400">{errors.cvc}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Cardholder Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`bg-gray-700 border-gray-600 text-white ${
                  errors.name ? 'border-red-500' : 'focus:border-cyan-400'
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`bg-gray-700 border-gray-600 text-white ${
                  errors.email ? 'border-red-500' : 'focus:border-cyan-400'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium h-12 text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Pay ${selectedPackage.price} Securely
                </div>
              )}
            </Button>

            <div className="text-center text-xs text-slate-400">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentForm;
