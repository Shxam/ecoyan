import { CartItem, Address, ValidationErrors } from '@/types';

export const SHIPPING_FEE = 50;

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal',
];

export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function calcSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function calcTotal(cart: CartItem[]): number {
  return calcSubtotal(cart) + SHIPPING_FEE;
}

export function generateOrderNumber(): string {
  return 'GC-' + Date.now().toString(36).toUpperCase().slice(-6);
}

export function maskCardNumber(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 16);
  const groups = clean.match(/.{1,4}/g) || [];
  return groups.join(' ');
}

export function maskExpiry(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length === 0) return '';
  let month = clean.slice(0, 2);
  if (month.length === 1 && parseInt(month) > 1) month = '0' + month;
  if (month.length === 2) {
    if (parseInt(month) === 0) month = '01';
    if (parseInt(month) > 12) month = '12';
  }
  if (clean.length > 2) return month + '/' + clean.slice(2);
  return month;
}

export function validateAddress(addr: Partial<Address>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!addr.name?.trim()) errors.name = 'Full name is required';
  if (!/^\d{10}$/.test(addr.phone || '')) errors.phone = 'Enter a valid 10-digit number';
  if (!addr.line1?.trim()) errors.line1 = 'Address line 1 is required';
  if (!addr.city?.trim()) errors.city = 'City is required';
  if (!/^\d{6}$/.test(addr.pincode || '')) errors.pincode = 'Enter a valid 6-digit pincode';
  if (!addr.state) errors.state = 'Please select a state';
  return errors;
}

export function validatePayment(p: { cardNumber: string; cardName: string; expiry: string; cvv: string }): ValidationErrors {
  const errors: ValidationErrors = {};
  if (p.cardNumber.replace(/\s/g, '').length !== 16) errors.cardNumber = 'Enter a valid 16-digit card number';
  if (!p.cardName.trim()) errors.cardName = 'Name on card is required';
  if (!/^\d{2}\/\d{2}$/.test(p.expiry)) errors.expiry = 'Enter valid expiry (MM/YY)';
  if (!/^\d{3}$/.test(p.cvv)) errors.cvv = 'CVV must be 3 digits';
  return errors;
}

export function getDeliveryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}
