import React from 'react';
import ProductItem from './ProductItem';

class ProductList extends React.Component {
  render() {

    console.log(this.props.productList);
    return (
      <ul className="product-list">
        {
          this.props.productList.map(function(item, idx) {

            if(item) {

              return <ProductItem key={idx} {...item}/>

            }

          })
        }
      </ul>
    );
  }
}

export default ProductList;
