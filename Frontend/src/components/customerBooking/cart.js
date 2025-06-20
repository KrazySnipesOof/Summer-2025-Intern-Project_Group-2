import React from "react";
import { Button } from "react-bootstrap";
import { Rings } from "react-loader-spinner";
import { formatMoney } from "../../helper/formatCurrency";
import moment from "moment";
import noIMage from "../../assets/img/userdetail/no-image.png";
const imgUrl = process.env.REACT_APP_IMAGE_URL;

export default function Cart({
  isLoading,
  onPayNow,
  services,
  totalCosts,
  startDateTime,
  cartProducts,
  paymentMethod,
  onAdd,
  onMinus,
  numberOfSeats,
}) {
  return (
    <div className="cart-section">
      <h1>Cart</h1>
      <div className="cart-items">
        {/* Services */}
        {services?.length > 0 ? (
          <div className="cart-item">
            <div className="service-name">
              <h3>
                {services.map((service) => service?.name).join(", ")}
                {`${services.map((service) =>
                  service?.type === "Classes"
                    ? ` Class (${numberOfSeats} Seat${
                        numberOfSeats > 1 ? "s" : ""
                      })`
                    : ""
                )}`}
              </h3>
              <p>
                {moment(startDateTime, "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)").format("dddd, MMMM DD")} |{" "}
                {moment(startDateTime, "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)").format("hh:mma")}
              </p>
            </div>
            <div className="cart-item-price">
              {formatMoney(totalCosts?.serviceCost)}
            </div>
          </div>
        ) : null}
        {/* Products */}
        {cartProducts?.length > 0
          ? cartProducts.map((item, index) => (
              <div
                className={`cart-item products ${
                  services?.length > 0 ? "" : "noService"
                }`}
                key={index}
              >
                <div className="service-product">
                  <div className="product-image">
                    <img
                      src={
                        item?.product?.productimgs
                          ? `${imgUrl}/${item?.product?.productimgs?.[0]}`
                          : noIMage
                      }
                      alt="Product"
                    />
                  </div>
                  <div className="product-details">
                    <p className="name">{item?.product?.name}</p>
                    <div className="bottom">
                      <div className="quantity-btn">
                        <div
                          className="minus"
                          onClick={() => onMinus(item?.product)}
                        >
                          -
                        </div>
                        <div className="value">{item?.quantity}</div>
                        <div
                          className="plus"
                          onClick={() => onAdd(item?.product)}
                        >
                          +
                        </div>
                      </div>
                      <div className="cart-item-price">
                        {formatMoney(item?.product?.price * item?.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cart-item-price cart-product-price">
                  {formatMoney(item?.product?.price * item?.quantity)}
                </div>
              </div>
            ))
          : null}
      </div>
      <div className="cart-total">
        <div className="cart-total-prices">
          <p>Subtotal</p>
          <p>
            <b>{formatMoney(totalCosts?.total)}</b>
          </p>
        </div>
        <div className="cart-total-prices">
          <p>Discounts</p>
          <p>
            <b>- $0.0</b>
          </p>
        </div>
        <div className="cart-total-prices">
          <p>Total</p>
          <p>
            <b>{formatMoney(totalCosts?.total)}</b>
          </p>
        </div>
      </div>
      <div className="cart-button">
        <Button className="button" onClick={onPayNow}>
          {isLoading ? (
            <>
              <div className="submit-loader">
                <Rings
                  height="40"
                  width="40"
                  radius="10"
                  color="#ffffff"
                  wrapperStyle
                  wrapperClass
                />
              </div>
            </>
          ) : paymentMethod === "Paid" ? (
            <>Pay Now</>
          ) : (
            <>Book Now</>
          )}
        </Button>
      </div>
    </div>
  );
}
