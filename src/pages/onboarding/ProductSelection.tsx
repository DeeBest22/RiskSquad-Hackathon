import React from 'react';
import { Button } from '@/components/ui/button';
import { InsuranceProductCard } from '../components/InsuranceProductCard';
import { insuranceProducts } from '../data/insuranceProducts';
import { InsuranceType } from '../types/insurance';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProductSelectionProps {
  selectedProduct?: InsuranceType;
  onSelect: (product: InsuranceType) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const ProductSelection: React.FC<ProductSelectionProps> = ({
  selectedProduct,
  onSelect,
  onBack,
  onContinue,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredProducts = insuranceProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display font-semibold text-lg text-foreground">
            Choose Insurance Type
          </h1>
          <p className="text-sm text-muted-foreground">What would you like to protect?</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search insurance types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 px-4 pb-6 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <InsuranceProductCard
                product={product}
                isSelected={selectedProduct === product.id}
                onClick={() => onSelect(product.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-4 bg-gradient-to-t from-background to-transparent">
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          disabled={!selectedProduct}
          onClick={onContinue}
        >
          Continue with{' '}
          {selectedProduct
            ? insuranceProducts.find((p) => p.id === selectedProduct)?.name
            : 'Selection'}
        </Button>
      </div>
    </div>
  );
};
