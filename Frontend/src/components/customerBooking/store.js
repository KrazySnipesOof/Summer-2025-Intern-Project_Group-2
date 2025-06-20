import React from "react";
import { Button } from "react-bootstrap";
import { formatMoney } from "../../helper/formatCurrency";
import noIMage from "../../assets/img/userdetail/no-image.png";
const imgUrl = process.env.REACT_APP_IMAGE_URL;

export default function Store({
  storName,
  cartProducts,
  handleClickProduct,
  goToCart,
  allProducts,
}) {
  return (
    <div className="store-wrapper">
      <div className="products-view">
        <div className="store-header">
          <h3>{storName} Store</h3>
          <Button className="button" onClick={goToCart}>
            Go to Cart
          </Button>
        </div>
        <div className="products">
          {allProducts?.map((product, index) => (
            <div key={index} className="product">
              <div className="product-image">
                <img
                  src={
                    product?.productimgs
                      ? `${imgUrl}/${product?.productimgs?.[0]}`
                      : noIMage
                  }
                  alt="Product"
                />
              </div>
              <div className="product-details">
                <p>{product?.name}</p>
                {/* <div className="product-price">
                  {formatMoney(product?.price)}
                </div> */}
              </div>
              <Button
                disabled={product?.productstock < 1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickProduct(product);
                }}
                className={`button ${
                  cartProducts.some((item) => item?.product === product)
                    ? "added"
                    : ""
                }`}
              >
                {product?.productstock < 1
                  ? "Out of Stock"
                  : cartProducts.some((item) => item?.product === product)
                  ? "Added to Cart"
                  : "Add to Cart"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
