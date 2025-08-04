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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-[var(--shadow-primary)] animate-float">
            <UtensilsCrossed className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-playfair font-bold text-foreground mb-2">
            Bella Vista
          </h1>
          <p className="text-neutral-600 text-lg">Premium Dining Experience</p>
        </div>

        <Card className="card-premium animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-playfair text-foreground">
              <Users className="w-6 h-6 text-primary" />
              Welcome to Your Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Table Number
                </label>
                <Input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Enter your table number"
                  className="h-12 text-center text-lg font-medium"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 btn-primary text-lg font-medium animate-gentle-bounce"
                disabled={!tableNumber.trim()}
              >
                View Menu
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-neutral-500">
          <p>Scan the QR code at your table to get started</p>
        </div>
      </div>
    </div>
  );
};

export default TableEntry;