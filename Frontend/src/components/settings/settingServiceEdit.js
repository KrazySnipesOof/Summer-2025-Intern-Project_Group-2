import React, { useState } from "react";

const Settingserviceedit = ({
  item,
  setEditPrice,
  setEditServiceHours,
  setEditServiceMinute,
  editprice,
  setPriceID,
  errors,
  timeerror,
  setInput,
  setInputTime,
  setInputMinute
}) => {
  const [iseditprice, setIseditPrice] = useState(false);
  const [selectedHours, setSelectedHours] = useState("");
  const [selectedMinutes, setSelectedMinutes] = useState("");
  const handleInput = (e, id, inputType) => {
    if (inputType === "price") {
      setIseditPrice(true);
      const { value } = e.target;
      setPriceID(id);
      setInput(true);
      if (/[^0-9.]/.test(value)) {
        e.preventDefault();
        return;
      }
      if (value === "0" && value.length === 1) {
        e.target.value = "";
      }
      const data = e.target.validity.valid ? value : undefined;
      if (data !== undefined) {
        if (data !== "") {
          if (data.startsWith("0")) {
            setEditPrice(data.slice(1));
          } else {
            setEditPrice(data);
          }
        } else {
          setEditPrice("");
        }
      }
    } else if (inputType === "hours") {
      setSelectedHours(e.target.value);
      setEditServiceHours(e.target.value);
      setInputTime(true)
    } else if (inputType === "minutes") {
      setSelectedMinutes(e.target.value);
      setEditServiceMinute(e.target.value);
      setInputMinute(true)
    }
  };

  return (
    <div>
      <form>
        <div className="form-group">
          <label className="form-label">Price:</label>
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              pattern="^\d{1,5}(\.\d{0,2})?$"
              value={iseditprice ? editprice : item.price}
              onChange={(e) => {
                handleInput(e, item._id, "price");
              }}
            />
          </div>
          <span className="error">{errors}</span>
        </div>

        <div className="form-group">
          <label className="form-label mt-3">Service Time:</label>
          <div className="input-group">
            <select class="form-select" aria-label="Default select example" value={selectedHours ? selectedHours : item?.serviceTime?.hours} onChange={(e) => {
              handleInput(e, item._id, "hours");
            }}>
              <option selected value="">Select Hours</option>
              {[...Array(13).keys()].map((hour) => (
                <option key={hour} value={hour}>
                  {hour} hours
                </option>
              ))}
            </select>
            <span style={{ margin: "0 10px" }}></span>{" "}
            <select class="form-select" aria-label="Default select example"
              name="minutes"
              value={
                selectedMinutes ? selectedMinutes : item?.serviceTime?.minutes
              }
              onChange={(e) => {
                handleInput(e, item._id, "minutes");
              }}

            >
              <option selected value="" >Select Minutes</option>
              {[0, 15, 30, 45].map((minute) => (
                <option key={minute} value={minute}>
                  {minute} minutes
                </option>
              ))}
            </select>
          </div>
          <span className="error">{timeerror}</span>
        </div>
      </form>
    </div>
  );
};

export default Settingserviceedit;
