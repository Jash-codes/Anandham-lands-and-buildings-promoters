export const BUSINESS = {
  name: 'Anandham Lands and Building Promoters',
  owner: 'Thanaselvan',
  phone: '+919363528609',
  phoneDisplay: '+91 93635 28609',
  whatsapp: '919363528609',
  email: 'info@anandhamlands.com',
  address: 'Anandham Lands and Building Promoters, Chennai, Tamil Nadu',
  reraNumbers: ['TNRERA/CHJ/REG/2021/0145', 'TNRERA/CHJ/REG/2022/0089'],
  yearsExperience: 15,
  completedProjects: 12,
  happyCustomers: 850,
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink(): string {
  return `tel:${BUSINESS.phone}`;
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatPriceShort(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(0)}L`;
  }
  return `₹${(price / 1000).toFixed(0)}K`;
}
