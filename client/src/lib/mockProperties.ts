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
  },
  {
    id: 6,
    address: '8832 Mulholland Drive, Los Angeles, CA 90046',
    bedrooms: 6,
    bathrooms: 5.5,
    squareFeet: 4800,
    price: 3950000,
    type: 'Single Family',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop'
  },
  {
    id: 7,
    address: '422 Palm Ave, Manhattan Beach, CA 90266',
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 2850,
    price: 2875000,
    type: 'Single Family',
    image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=600&h=400&fit=crop'
  },
  {
    id: 8,
    address: '15 Marina Blvd, Marina del Rey, CA 90292',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1450,
    price: 1250000,
    type: 'Condo',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop'
  },
  {
    id: 9,
    address: '6700 Melrose Avenue, Hollywood, CA 90038',
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2100,
    price: 1650000,
    type: 'Townhouse',
    image: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&h=400&fit=crop'
  },
  {
    id: 10,
    address: '9921 Sunset Drive, Pacific Palisades, CA 90272',
    bedrooms: 5,
    bathrooms: 4.5,
    squareFeet: 4200,
    price: 4500000,
    type: 'Single Family',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'
  }
];