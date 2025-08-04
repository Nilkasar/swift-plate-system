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
import bruschetta from '@/assets/bruschetta.jpg';
import wagyuSteak from '@/assets/wagyu-steak.jpg';
import seafoodPaella from '@/assets/seafood-paella.jpg';
import tiramisu from '@/assets/tiramisu.jpg';
import craftCocktail from '@/assets/craft-cocktail.jpg';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  prepTime: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface MenuDisplayProps {
  tableNumber: string;
  onProceedToOrder: (cart: CartItem[]) => void;
}

const menuItems: MenuItem[] = [
  // Starters
  {
    id: '1',
    name: 'Bruschetta Classica',
    description: 'Toasted artisan bread with fresh tomatoes, basil, and balsamic glaze',
    price: 14,
    images: [bruschetta, caesarSalad],
    category: 'Starters',
    rating: 4.6,
    prepTime: '8 min',
    isVegetarian: true
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine, parmesan, croutons, house-made dressing',
    price: 16,
    images: [caesarSalad, bruschetta],
    category: 'Starters',
    rating: 4.5,
    prepTime: '10 min',
    isVegetarian: true
  },
  {
    id: '3',
    name: 'Seafood Paella',
    description: 'Traditional Spanish paella with fresh seafood and saffron rice',
    price: 24,
    images: [seafoodPaella, grilledSalmon],
    category: 'Starters',
    rating: 4.8,
    prepTime: '15 min',
    isPopular: true
  },

  // Mains
  {
    id: '4',
    name: 'Truffle Risotto',
    description: 'Creamy arborio rice with black truffle, parmesan, and fresh herbs',
    price: 28,
    images: [truffleRisotto, seafoodPaella],
    category: 'Mains',
    rating: 4.8,
    prepTime: '25 min',
    isPopular: true,
    isVegetarian: true
  },
  {
    id: '5',
    name: 'Grilled Atlantic Salmon',
    description: 'Fresh Atlantic salmon with lemon butter, seasonal vegetables',
    price: 32,
    images: [grilledSalmon, truffleRisotto],
    category: 'Mains',
    rating: 4.7,
    prepTime: '20 min'
  },
  {
    id: '6',
    name: 'Wagyu Beef Steak',
    description: 'Premium wagyu beef with herb butter and roasted potatoes',
    price: 65,
    images: [wagyuSteak, grilledSalmon],
    category: 'Mains',
    rating: 4.9,
    prepTime: '30 min',
    isPopular: true
  },

  // Desserts
  {
    id: '7',
    name: 'Chocolate Soufflé',
    description: 'Warm chocolate soufflé with vanilla bean ice cream',
    price: 14,
    images: [chocolateSouffle, tiramisu],
    category: 'Desserts',
    rating: 4.9,
    prepTime: '30 min',
    isPopular: true
  },
  {
    id: '8',
    name: 'Tiramisu',
    description: 'Classic Italian tiramisu with espresso and mascarpone',
    price: 12,
    images: [tiramisu, chocolateSouffle],
    category: 'Desserts',
    rating: 4.7,
    prepTime: '5 min',
    isVegetarian: true
  },

  // Beverages
  {
    id: '9',
    name: 'Craft Cocktail',
    description: 'House specialty cocktail with premium spirits and fresh ingredients',
    price: 16,
    images: [craftCocktail],
    category: 'Beverages',
    rating: 4.8,
    prepTime: '5 min'
  },
  
  // More Starters
  {
    id: '10',
    name: 'Mushroom Soup',
    description: 'Creamy wild mushroom soup with truffle oil and herbs',
    price: 12,
    images: [bruschetta],
    category: 'Starters',
    rating: 4.4,
    prepTime: '8 min',
    isVegetarian: true
  },
  
  // More Mains
  {
    id: '11',
    name: 'Lamb Rack',
    description: 'Herb-crusted lamb rack with rosemary jus and roasted vegetables',
    price: 42,
    images: [wagyuSteak],
    category: 'Mains',
    rating: 4.9,
    prepTime: '35 min'
  },
  {
    id: '12',
    name: 'Vegetarian Pasta',
    description: 'Fresh pasta with seasonal vegetables and pesto sauce',
    price: 22,
    images: [truffleRisotto],
    category: 'Mains',
    rating: 4.6,
    prepTime: '18 min',
    isVegetarian: true,
    isPopular: true
  }
];

const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages'];
const dietaryFilters = ['All', 'Vegetarian', 'Non-Vegetarian'];

const MenuDisplay = ({ tableNumber, onProceedToOrder }: MenuDisplayProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const dietaryMatch = selectedDietary === 'All' || 
      (selectedDietary === 'Vegetarian' && item.isVegetarian) ||
      (selectedDietary === 'Non-Vegetarian' && !item.isVegetarian);
    return categoryMatch && dietaryMatch;
  });

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

  const currentImage = (itemId: string) => {
    return selectedImageIndex[itemId] || 0;
  };

  const nextImage = (itemId: string, totalImages: number) => {
    setSelectedImageIndex(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 py-6">
        {/* Enhanced Header with Branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg animate-float">
              <ShoppingCart className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-playfair font-bold text-foreground">Bella Vista</h1>
              <p className="text-muted-foreground">Fine Dining Experience</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-primary font-semibold">Table {tableNumber}</p>
              <p className="text-sm text-muted-foreground">Explore our curated menu</p>
            </div>
            <Button
              onClick={() => cart.length > 0 && onProceedToOrder(cart)}
              className="btn-primary relative"
              disabled={cart.length === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground animate-gentle-bounce">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className="space-y-4 mb-8 animate-slide-up">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-300 ${
                  selectedCategory === category 
                    ? "btn-primary scale-105" 
                    : "btn-outline hover:scale-105"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {dietaryFilters.map(filter => (
              <Button
                key={filter}
                variant={selectedDietary === filter ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedDietary(filter)}
                className={`transition-all duration-300 ${
                  selectedDietary === filter 
                    ? "btn-secondary scale-105" 
                    : "btn-outline hover:scale-105"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Enhanced Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredItems.map(item => {
            const cartItem = cart.find(cartItem => cartItem.id === item.id);
            const imgIndex = currentImage(item.id);
            
            return (
              <Card key={item.id} className="card-premium hover:scale-105 transition-all duration-300 animate-scale-in overflow-hidden">
                <div className="relative group">
                  <img
                    src={item.images[imgIndex]}
                    alt={item.name}
                    className="w-full h-56 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                    onClick={() => nextImage(item.id, item.images.length)}
                  />
                  {item.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {item.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === imgIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.isPopular && (
                      <Badge className="bg-primary text-primary-foreground">
                        Popular
                      </Badge>
                    )}
                    {item.isVegetarian && (
                      <Badge className="bg-green-500 text-white">
                        Vegetarian
                      </Badge>
                    )}
                    {item.isSpicy && (
                      <Badge className="bg-red-500 text-white">
                        Spicy
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-xl font-playfair text-foreground">
                      {item.name}
                    </CardTitle>
                    <span className="text-2xl font-bold text-primary">${item.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.prepTime}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                  
                  {cartItem ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-9 h-9 p-0 rounded-full"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold text-foreground min-w-[2rem] text-center bg-secondary px-3 py-1 rounded-lg">
                          {cartItem.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-9 h-9 p-0 rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <span className="font-bold text-primary text-lg">
                        ${(item.price * cartItem.quantity).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(item)}
                      className="w-full btn-primary animate-order-success"
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

        {/* Enhanced Cart Summary */}
        {cart.length > 0 && (
          <Card className="card-premium animate-slide-up-bounce sticky bottom-4 border-primary/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground text-lg">Order Summary</p>
                  <p className="text-muted-foreground">{getTotalItems()} items selected</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">${getTotalPrice().toFixed(2)}</p>
                  <Button 
                    onClick={() => onProceedToOrder(cart)} 
                    className="btn-primary mt-3 px-8 py-2 text-lg animate-status-pulse"
                  >
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