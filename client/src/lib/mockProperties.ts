// Mock properties for real estate agents to select from
export interface Property {
  id: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  price: number;
  type: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family';
  image?: string;
}

export const properties: Property[] = [
  {
    id: 1,
    address: '123 Main Street, Beverly Hills, CA 90210',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    price: 1200000,
    type: 'Single Family',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    price: 950000,
    type: 'Single Family',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    address: '789 Sunset Boulevard, West Hollywood, CA 90069',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    price: 850000,
    type: 'Condo',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'
  },
  {
    id: 4,
    address: '321 Wilshire Blvd, Santa Monica, CA 90403',
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3500,
    price: 2350000,
    type: 'Single Family',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop'
  },
  {
    id: 5,
    address: '555 Venice Beach Drive, Venice, CA 90291',
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2000,
    price: 1750000,
    type: 'Townhouse',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop'
  }
];