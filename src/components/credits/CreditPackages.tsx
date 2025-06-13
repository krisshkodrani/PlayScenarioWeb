
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap } from 'lucide-react';
import { CreditPackage } from '@/hooks/useCreditsPurchase';

interface CreditPackagesProps {
  packages: CreditPackage[];
  selectedPackage: string | null;
  onSelectPackage: (packageId: string) => void;
}

const CreditPackages: React.FC<CreditPackagesProps> = ({
  packages,
  selectedPackage,
  onSelectPackage
}) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Credit Package</h2>
        <p className="text-slate-400">Select the package that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {packages.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;
          const isPopular = pkg.popular;
          
          return (
            <Card
              key={pkg.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-800 border-cyan-400 shadow-lg shadow-cyan-400/20 scale-105'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750'
              }`}
              onClick={() => onSelectPackage(pkg.id)}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-cyan-400 mr-2" />
                  <CardTitle className="text-lg text-white capitalize">
                    {pkg.id}
                  </CardTitle>
                </div>
                
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-cyan-400">
                    {pkg.credits.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">credits</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-white">
                      ${pkg.price}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        ${pkg.originalPrice}
                      </span>
                    )}
                  </div>
                  {pkg.savings && (
                    <div className="text-sm font-medium text-emerald-400">
                      {pkg.savings}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-slate-300 text-center">
                  {pkg.description}
                </p>

                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-slate-900'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pkg.id);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Package'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CreditPackages;
