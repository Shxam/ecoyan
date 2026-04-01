export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

export interface Address {
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export interface CartData {
  cartItems: CartItem[];
  shipping_fee: number;
}

export interface CheckoutState {
  cart: CartItem[];
  addresses: Address[];
  selectedAddressIndex: number | null;
  payment: PaymentData;
  orderNumber: string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}
