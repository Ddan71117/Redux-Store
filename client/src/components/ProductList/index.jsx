import { useEffect, useState, useCallback } from 'react';
import ProductItem from '../ProductItem';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PRODUCTS } from '../../utils/slices/productSlice';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.products);
  const currentCategory = useSelector((state) => state.categories.currentCategory);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch(UPDATE_PRODUCTS(data.products));
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch(UPDATE_PRODUCTS(products));
      });
    }
  }, [data, loading, dispatch]);

  const filterProducts = useCallback(() => {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }, [currentCategory, state.products]);

  useEffect(() => {
    const filtered = filterProducts();
    setFilteredProducts(filtered);
  }, [state.products, currentCategory, filterProducts]);

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {filteredProducts.length ? (
        <div className="flex-row">
          {filteredProducts.map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        // eslint-disable-next-line react/no-unescaped-entities
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
