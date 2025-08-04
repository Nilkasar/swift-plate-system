import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Users } from 'lucide-react';

interface TableEntryProps {
  onTableSubmit: (tableNumber: string) => void;
}

const TableEntry = ({ onTableSubmit }: TableEntryProps) => {
  const [tableNumber, setTableNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableNumber.trim()) {
      onTableSubmit(tableNumber.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-base to-warm-grey flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-wine-primary to-wine-light rounded-full mb-6 shadow-[var(--shadow-premium)]">
            <UtensilsCrossed className="w-10 h-10 text-cream-base" />
          </div>
          <h1 className="text-4xl font-playfair font-bold text-deep-brown mb-2">
            Bella Vista
          </h1>
          <p className="text-warm-grey text-lg">Premium Dining Experience</p>
        </div>

        <Card className="card-premium animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-playfair text-deep-brown">
              <Users className="w-6 h-6 text-wine-primary" />
              Welcome to Your Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-deep-brown mb-2">
                  Table Number
                </label>
                <Input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Enter your table number"
                  className="h-12 text-center text-lg font-medium border-warm-grey focus:border-gold-accent focus:ring-gold-accent"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 btn-wine text-lg font-medium animate-bounce-in"
                disabled={!tableNumber.trim()}
              >
                View Menu
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-warm-grey">
          <p>Scan the QR code at your table to get started</p>
        </div>
      </div>
    </div>
  );
};

export default TableEntry;