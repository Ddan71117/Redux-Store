import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import Cart from '../components/Cart';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY, ADD_TO_CART } from '../utils/slices/cartSlice';
import { UPDATE_PRODUCTS } from '../utils/slices/productSlice';
import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';

function Detail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [currentProduct, setCurrentProduct] = useState({});
  const { products } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (products.length) {
      const product = products.find((product) => String(product._id) === id);
      setCurrentProduct(product);
    } else if (data && data.products) {
      dispatch(UPDATE_PRODUCTS(data.products));
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(UPDATE_PRODUCTS(indexedProducts));
        const product = indexedProducts.find((product) => String(product._id) === id);
        setCurrentProduct(product);
      });
    }
  }, [products, data, loading, dispatch, id]);

  if (!currentProduct) {
    return loading ? <img src={spinner} alt="loading" /> : <div>Product is not found.</div>;
  }

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch(UPDATE_CART_QUANTITY({
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      }));
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch(ADD_TO_CART({ ...currentProduct, purchaseQuantity: 1 }));
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCart = () => {
    dispatch(REMOVE_FROM_CART(currentProduct));
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
