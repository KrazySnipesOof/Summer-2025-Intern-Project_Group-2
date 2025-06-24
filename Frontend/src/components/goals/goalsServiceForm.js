import React from "react";
import { Form } from "react-bootstrap";

const GoalsServiceform = ({
  index,
  service,
  handleService,
  serviceName,
  error1,
  
}) => {

  return (
    <>
 
    <div
        className={service.checked ? "showdetail service-goal" : "showdetail service-goal"}
    >
      <div className="goalcheckbox">
        <div className="gservice-check">
          <label
            for={
              serviceName
            }
          >
            <span className="name">
              {serviceName}
            </span>
          </label>
        </div>
         {service.checked && ( 
          <div className="service-list-detail">
            <Form.Group className="mb-3">
              <Form.Label>How much do you charge for this service?</Form.Label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                  }}
                >
                  $
                </span>
                <Form.Control
                  type="text"
                  pattern="[0-9]*"
                  name="serviceCharge"
                  value={service?.serviceCharge}
                  onChange={(e) => {
                    handleService(e, index);
                  }}
                  style={{ paddingLeft: "20px" }}
                />
              </div>
              <span className="error">
                {error1[index] && error1[index].serviceCharge
                  ? error1[index].serviceCharge
                  : null}
              </span>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                How long does this service take to complete? (Service + Clean
                up)
              </Form.Label>
              <div className="service-time">
                <div>
                  <Form.Select
                    name="serviceHours"
                    onChange={(e) => {
                      handleService(e, index);
                    }}
                    value={service?.serviceHours}
                  >
                    <option value="">Select Hours</option>
                    <option value="0">0 hours</option>

                    {[...Array.from(Array(13).keys())]
                      .slice(1)
                      .map((num, i) => (
                        <option key={i}>{num + " " + (num === 1 ? "hour" : "hours")}</option>
                      ))}
                  </Form.Select>

                  <span className="error">
                    {error1[index] && error1[index].serviceHours
                      ? error1[index].serviceHours
                      : null}
                  </span>
                </div>
                <div>
                  <Form.Select
                    name="serviceMinute"
                    onChange={(e) => {
                      handleService(e, index);
                    }}
                    value={service.serviceMinute}
                  >
                    <option value="">Select Minutes</option>
                    {[...Array.from(Array(4).keys())].slice(1).map((num, i) => (
                      <option key={i}>{num ? num * 15 + " minutes" : ""}</option>
                    ))}

                    <span className="error">
                      {error1[index] && error1[index].serviceMinute
                        ? error1[index].serviceMinute
                        : null}
                    </span>
                  </Form.Select>
                </div>
              </div>
            </Form.Group>
          </div>
         )}  
      </div>

    </div>
   
    </>
  )
}
export default GoalsServiceform;
