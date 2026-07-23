'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button className="btn-cart" onClick={handleClick} disabled={added}>
      {added ? '✓ Додано в кошик!' : '🛒 Додати в кошик'}
    </button>
  );
}
