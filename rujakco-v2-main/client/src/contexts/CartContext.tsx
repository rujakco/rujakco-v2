import React, { createContext, useContext, useReducer, useCallback } from "react";

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  type: "rujak" | "asinan" | "salad";
  category: string;
  tag: string;
  price: number;
  description: string;
  image: string;
  variants?: ProductVariant[];
  spiceLevel?: { min: number; max: number; default: number };
  ingredients?: string[];
  sauce?: string;
  notes?: string[];
  customOptions?: {
    fruits: string[];
    sauces: string[];
    pricingNote?: string;
  };
  preorderDays?: number;
}

export interface CartItem {
  cartKey: string;
  product: Product;
  variant?: ProductVariant;
  qty: number;
  spiceLevel: number;
}

export interface CartState {
  items: CartItem[];
  cartOpen: boolean;
  checkoutOpen: boolean;
  filter: string;
  userName: string;
  isGuest: boolean;
}

const DELIVERY_COST = 8000;

type CartAction =
  | { type: "ADD_TO_CART"; payload: { product: Product; variant?: ProductVariant; qty: number; spiceLevel: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QTY"; payload: { cartKey: string; qty: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART"; payload?: boolean }
  | { type: "SET_CHECKOUT"; payload: boolean }
  | { type: "SET_FILTER"; payload: string }
  | { type: "SET_USER_NAME"; payload: string }
  | { type: "SET_GUEST" };

const initialState: CartState = {
  items: [],
  cartOpen: false,
  checkoutOpen: false,
  filter: "all",
  userName: "",
  isGuest: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, variant, qty, spiceLevel } = action.payload;
      const cartKey = `${product.id}:${variant?.id ?? "default"}:spice-${spiceLevel}`;
      const existing = state.items.find((item) => item.cartKey === cartKey);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.cartKey === cartKey ? { ...item, qty: item.qty + qty } : item
          ),
        };
      }
      const selectedProduct = variant ? { ...product, price: variant.price } : product;
      return {
        ...state,
        items: [...state.items, { cartKey, product: selectedProduct, variant, qty, spiceLevel }],
      };
    }
    case "REMOVE_FROM_CART":
      return { ...state, items: state.items.filter((item) => item.cartKey !== action.payload) };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.cartKey === action.payload.cartKey ? { ...item, qty: Math.max(1, action.payload.qty) } : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [], checkoutOpen: false };
    case "TOGGLE_CART":
      return { ...state, cartOpen: action.payload !== undefined ? action.payload : !state.cartOpen };
    case "SET_CHECKOUT":
      return { ...state, checkoutOpen: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_USER_NAME":
      return { ...state, userName: action.payload, isGuest: false };
    case "SET_GUEST":
      return { ...state, userName: "Tamu", isGuest: true };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, qty?: number, spiceLevel?: number, variant?: ProductVariant) => void;
  removeFromCart: (cartKey: string) => void;
  updateQty: (cartKey: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  setCheckout: (open: boolean) => void;
  setFilter: (filter: string) => void;
  setUserName: (name: string) => void;
  setGuest: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = useCallback((product: Product, qty = 1, spiceLevel = 3, variant?: ProductVariant) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, qty, spiceLevel, variant } });
  }, []);
  const removeFromCart = useCallback((cartKey: string) => dispatch({ type: "REMOVE_FROM_CART", payload: cartKey }), []);
  const updateQty = useCallback((cartKey: string, qty: number) => dispatch({ type: "UPDATE_QTY", payload: { cartKey, qty } }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const toggleCart = useCallback((open?: boolean) => dispatch({ type: "TOGGLE_CART", payload: open }), []);
  const setCheckout = useCallback((open: boolean) => dispatch({ type: "SET_CHECKOUT", payload: open }), []);
  const setFilter = useCallback((filter: string) => dispatch({ type: "SET_FILTER", payload: filter }), []);
  const setUserName = useCallback((name: string) => dispatch({ type: "SET_USER_NAME", payload: name }), []);
  const setGuest = useCallback(() => dispatch({ type: "SET_GUEST" }), []);

  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const total = subtotal + (state.items.length > 0 ? DELIVERY_COST : 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.qty, 0);

  return <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQty, clearCart, toggleCart, setCheckout, setFilter, setUserName, setGuest, subtotal, total, itemCount }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
