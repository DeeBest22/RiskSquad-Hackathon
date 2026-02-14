import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InsuranceType } from '@/types/insurance';
import { ArrowLeft, Car, Building2, Smartphone, Plane } from 'lucide-react';

interface AssetDetailsProps {
  productType: InsuranceType;
  assetDetails: Record<string, any>;
  onUpdate: (details: Record<string, any>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const AssetDetails: React.FC<AssetDetailsProps> = ({
  productType,
  assetDetails,
  onUpdate,
  onBack,
  onContinue,
}) => {
  const handleUpdate = (key: string, value: any) => {
    onUpdate({ ...assetDetails, [key]: value });
  };

  const renderMotorForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Vehicle Type</Label>
        <Select
          value={assetDetails.vehicleType || ''}
          onValueChange={(v) => handleUpdate('vehicleType', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select vehicle type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="truck">Truck/Pickup</SelectItem>
            <SelectItem value="motorcycle">Motorcycle</SelectItem>
            <SelectItem value="commercial">Commercial Vehicle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vehicle Make</Label>
          <Input
            placeholder="e.g., Toyota"
            value={assetDetails.make || ''}
            onChange={(e) => handleUpdate('make', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Model</Label>
          <Input
            placeholder="e.g., Camry"
            value={assetDetails.model || ''}
            onChange={(e) => handleUpdate('model', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Year</Label>
          <Input
            type="number"
            placeholder="e.g., 2020"
            value={assetDetails.year || ''}
            onChange={(e) => handleUpdate('year', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Estimated Value (₦)</Label>
          <Input
            type="number"
            placeholder="e.g., 5000000"
            value={assetDetails.value || ''}
            onChange={(e) => handleUpdate('value', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>License Plate Number</Label>
        <Input
          placeholder="e.g., ABC-123-XY"
          value={assetDetails.plate || ''}
          onChange={(e) => handleUpdate('plate', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Primary Usage</Label>
        <Select
          value={assetDetails.usage || ''}
          onValueChange={(v) => handleUpdate('usage', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="How do you use this vehicle?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal/Family Use</SelectItem>
            <SelectItem value="commute">Daily Commute</SelectItem>
            <SelectItem value="business">Business Use</SelectItem>
            <SelectItem value="rideshare">Ride-sharing</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPropertyForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Property Type</Label>
        <Select
          value={assetDetails.propertyType || ''}
          onValueChange={(v) => handleUpdate('propertyType', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="house">House/Bungalow</SelectItem>
            <SelectItem value="apartment">Apartment/Flat</SelectItem>
            <SelectItem value="duplex">Duplex</SelectItem>
            <SelectItem value="commercial">Commercial Building</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Property Address</Label>
        <Input
          placeholder="Full property address"
          value={assetDetails.address || ''}
          onChange={(e) => handleUpdate('address', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Estimated Value (₦)</Label>
          <Input
            type="number"
            placeholder="Property value"
            value={assetDetails.value || ''}
            onChange={(e) => handleUpdate('value', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Year Built</Label>
          <Input
            type="number"
            placeholder="e.g., 2010"
            value={assetDetails.yearBuilt || ''}
            onChange={(e) => handleUpdate('yearBuilt', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Security Features</Label>
        <Select
          value={assetDetails.security || ''}
          onValueChange={(v) => handleUpdate('security', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select security level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic (Locks only)</SelectItem>
            <SelectItem value="moderate">Moderate (Fence + Locks)</SelectItem>
            <SelectItem value="good">Good (Security Guard/CCTV)</SelectItem>
            <SelectItem value="excellent">Excellent (Alarm + Guard + CCTV)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderGadgetForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Device Type</Label>
        <Select
          value={assetDetails.deviceType || ''}
          onValueChange={(v) => handleUpdate('deviceType', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select device type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="smartphone">Smartphone</SelectItem>
            <SelectItem value="laptop">Laptop</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
            <SelectItem value="camera">Camera</SelectItem>
            <SelectItem value="console">Gaming Console</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Brand</Label>
          <Input
            placeholder="e.g., Apple"
            value={assetDetails.brand || ''}
            onChange={(e) => handleUpdate('brand', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Model</Label>
          <Input
            placeholder="e.g., iPhone 15"
            value={assetDetails.model || ''}
            onChange={(e) => handleUpdate('model', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Purchase Date</Label>
          <Input
            type="date"
            value={assetDetails.purchaseDate || ''}
            onChange={(e) => handleUpdate('purchaseDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Purchase Price (₦)</Label>
          <Input
            type="number"
            placeholder="e.g., 500000"
            value={assetDetails.value || ''}
            onChange={(e) => handleUpdate('value', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>IMEI/Serial Number (optional)</Label>
        <Input
          placeholder="Device identifier"
          value={assetDetails.serialNumber || ''}
          onChange={(e) => handleUpdate('serialNumber', e.target.value)}
        />
      </div>
    </div>
  );

  const renderTravelForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Destination</Label>
        <Input
          placeholder="Where are you traveling to?"
          value={assetDetails.destination || ''}
          onChange={(e) => handleUpdate('destination', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Departure Date</Label>
          <Input
            type="date"
            value={assetDetails.departureDate || ''}
            onChange={(e) => handleUpdate('departureDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Return Date</Label>
          <Input
            type="date"
            value={assetDetails.returnDate || ''}
            onChange={(e) => handleUpdate('returnDate', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Number of Travelers</Label>
        <Select
          value={assetDetails.travelers || ''}
          onValueChange={(v) => handleUpdate('travelers', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="How many people?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 (Just me)</SelectItem>
            <SelectItem value="2">2 (Couple)</SelectItem>
            <SelectItem value="3-4">3-4 (Small group)</SelectItem>
            <SelectItem value="5+">5+ (Large group)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Trip Purpose</Label>
        <Select
          value={assetDetails.purpose || ''}
          onValueChange={(v) => handleUpdate('purpose', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Why are you traveling?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leisure">Leisure/Vacation</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="study">Education/Study</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderForm = () => {
    switch (productType) {
      case 'motor':
        return renderMotorForm();
      case 'property':
        return renderPropertyForm();
      case 'gadget':
        return renderGadgetForm();
      case 'travel':
        return renderTravelForm();
      default:
        return renderMotorForm();
    }
  };

  const getIcon = () => {
    switch (productType) {
      case 'motor':
        return Car;
      case 'property':
        return Building2;
      case 'gadget':
        return Smartphone;
      case 'travel':
        return Plane;
      default:
        return Car;
    }
  };

  const Icon = getIcon();

  const productNames: Record<InsuranceType, string> = {
    motor: 'Vehicle',
    property: 'Property',
    sme: 'Business',
    gadget: 'Device',
    travel: 'Trip',
    micro: 'Coverage',
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-lg text-foreground">
              {productNames[productType]} Details
            </h1>
            <p className="text-sm text-muted-foreground">Tell us about what you want to insure</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-6 overflow-auto">
        <Card variant="glass" className="mb-4">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Providing accurate information helps us give you the best
              price. You won't be blocked for missing optional details.
            </p>
          </CardContent>
        </Card>

        {renderForm()}
      </div>

      {/* Continue Button */}
      <div className="p-4 bg-gradient-to-t from-background to-transparent">
        <Button variant="hero" size="lg" className="w-full" onClick={onContinue}>
          Get My Quote
        </Button>
      </div>
    </div>
  );
};
