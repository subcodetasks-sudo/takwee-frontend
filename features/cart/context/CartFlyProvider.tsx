"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { CartFlyer } from "../components/CartFlyer";
import {
  isCartTargetVisible,
  prefersReducedMotion,
  resolveOriginRect,
  resolveTargetRect,
  type FlyRect,
  type FlyToCartPayload,
} from "../utils/fly-to-cart";

type Flight = {
  id: string;
  imageUrl: string;
  alt?: string;
  from: FlyRect;
  to: FlyRect;
};

export type CartFlyContextValue = {
  registerCartTarget: (el: HTMLElement | null) => void;
  flyToCart: (payload: FlyToCartPayload) => void;
  /** Increments when a flyer lands — Header uses this to pulse the bag. */
  pulseToken: number;
};

const CartFlyContext = createContext<CartFlyContextValue | null>(null);

function subscribeToNothing() {
  return () => {};
}

export function CartFlyProvider({ children }: { children: ReactNode }) {
  const targetRef = useRef<HTMLElement | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [pulseToken, setPulseToken] = useState(0);

  const portalReady = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const registerCartTarget = useCallback((el: HTMLElement | null) => {
    targetRef.current = el;
  }, []);

  const flyToCart = useCallback((payload: FlyToCartPayload) => {
    if (prefersReducedMotion()) return;
    if (!payload.imageUrl) return;

    const target = targetRef.current;
    if (!target) return;

    const rawTarget = target.getBoundingClientRect();
    if (!isCartTargetVisible(rawTarget)) return;

    const from = resolveOriginRect(payload.origin);
    const to = resolveTargetRect(target);
    const id = `fly-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setFlights((prev) => [
      ...prev.slice(-1),
      {
        id,
        imageUrl: payload.imageUrl,
        alt: payload.alt,
        from,
        to,
      },
    ]);
  }, []);

  const handleComplete = useCallback((id: string) => {
    setFlights((prev) => prev.filter((flight) => flight.id !== id));
    setPulseToken((token) => token + 1);
  }, []);

  const value = useMemo<CartFlyContextValue>(
    () => ({
      registerCartTarget,
      flyToCart,
      pulseToken,
    }),
    [registerCartTarget, flyToCart, pulseToken],
  );

  return (
    <CartFlyContext.Provider value={value}>
      {children}
      {portalReady
        ? createPortal(
            <AnimatePresence>
              {flights.map((flight) => (
                <CartFlyer
                  key={flight.id}
                  id={flight.id}
                  imageUrl={flight.imageUrl}
                  alt={flight.alt}
                  from={flight.from}
                  to={flight.to}
                  onComplete={handleComplete}
                />
              ))}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </CartFlyContext.Provider>
  );
}

export function useCartFly() {
  const context = useContext(CartFlyContext);
  if (!context) {
    throw new Error("useCartFly must be used within a CartFlyProvider");
  }
  return context;
}
