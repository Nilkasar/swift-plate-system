import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, Star, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import truffleRisotto from '@/assets/truffle-risotto.jpg';
import grilledSalmon from '@/assets/grilled-salmon.jpg';
import caesarSalad from '@/assets/caesar-salad.jpg';
import chocolateSouffle from '@/assets/chocolate-souffle.jpg';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  prepTime: string;
  isPopular?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface MenuDisplayProps {
  tableNumber: string;
  onProceedToOrder: (cart: CartItem[]) => void;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Risotto',
    description: 'Creamy arborio rice with black truffle, parmesan, and fresh herbs',
    price: 28,
    image: truffleRisotto,
    category: 'Mains',
    rating: 4.8,
    prepTime: '25 min',
    isPopular: true
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon butter, roasted vegetables',
    price: 32,
    image: grilledSalmon,
    category: 'Mains',
    rating: 4.7,
    prepTime: '20 min'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Crisp romaine, parmesan, croutons, house-made dressing',
    price: 16,
    image: caesarSalad,
    category: 'Starters',
    rating: 4.5,
    prepTime: '10 min'
  },
  {
    id: '4',
    name: 'Chocolate Soufflé',
    description: 'Warm chocolate soufflé with vanilla bean ice cream',
    price: 14,
    image: chocolateSouffle,
    category: 'Desserts',
    rating: 4.9,
    prepTime: '30 min',
    isPopular: true
  }
];

const categories = ['All', 'Starters', 'Mains', 'Desserts'];

const MenuDisplay = ({ tableNumber, onProceedToOrder }: MenuDisplayProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${item.name} added to your order`,
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-cosmic-accent to-cosmic-dark">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-cosmic-light bg-gradient-to-r from-neon-purple to-golden-glow bg-clip-text text-transparent">Cosmic Menu</h1>
            <p className="text-cosmic-light/70">Table {tableNumber}</p>
          </div>
          <Button
            onClick={() => cart.length > 0 && onProceedToOrder(cart)}
            className="btn-neon relative animate-pulse-glow"
            disabled={cart.length === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-golden-glow text-cosmic-dark animate-order-accepted">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 animate-slide-up">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "btn-neon" : "btn-elegant"}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredItems.map(item => {
            const cartItem = cart.find(cartItem => cartItem.id === item.id);
            
            return (
              <Card key={item.id} className="card-premium hover:scale-105 transition-transform animate-scale-in">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {item.isPopular && (
                    <Badge className="absolute top-3 left-3 bg-gold-accent text-deep-brown">
                      Popular
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-playfair text-cosmic-light">
                      {item.name}
                    </CardTitle>
                    <span className="text-2xl font-bold text-golden-glow">${item.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-cosmic-light/70">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-golden-glow text-golden-glow" />
                      {item.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.prepTime}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-cosmic-light/80 mb-4">{item.description}</p>
                  
                  {cartItem ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium text-cosmic-light min-w-[2rem] text-center">
                          {cartItem.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <span className="font-bold text-neon-purple">
                        ${(item.price * cartItem.quantity).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(item)}
                      className="w-full btn-cyber animate-order-placed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="card-neon animate-bounce-in sticky bottom-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-deep-brown">Order Total</p>
                  <p className="text-sm text-warm-grey">{getTotalItems()} items</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-wine-primary">${getTotalPrice().toFixed(2)}</p>
                  <Button onClick={() => onProceedToOrder(cart)} className="btn-wine mt-2">
                    Place Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MenuDisplay;