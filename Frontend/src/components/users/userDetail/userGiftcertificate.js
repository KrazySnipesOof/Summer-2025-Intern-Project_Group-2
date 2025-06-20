import React, { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Col, Form, Row, Button, InputGroup, Table } from "react-bootstrap";
import MaterialReactTable from "material-react-table";
import Loader from "../../../helper/loader";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as giftCertificateservices from "../../../services/giftCertificateService";
import moment from "moment";
const UserGiftcertificate = () => {
  const { id } = useParams();
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [startDate, setStartDate] = useState("");
  const [giftList, setGiftList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [val, setVal] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [loader, setLoader] = useState(true);
  const [err, setErr] = useState({});
  useEffect(() => {
    getGiftList();
  }, [reduxToken]);
  const getGiftList = async () => {
    setIsLoading(true);
    if (reduxToken) {
      setLoader(true);
      const response = await giftCertificateservices.getAllgiftCertificate(
        id,
        reduxToken
      );
      if (response?.status == 200) {
        setGiftList(response?.data?.data);
        setLoader(false);
      } else {
        setIsLoading(false);
        setLoader(false);
      }
    }
  };
  const filterSearch = async (e) => {
    e.preventDefault();
    const validate = () => {
      let isValid = true;
      const formError = {};
      const pattern = /^[a-zA-Z0-9\s]*$/;
      if (!val?.match(pattern)) {
        isValid = false;
        formError["name"] = "Special character not Allowed";
      }
      setErr(formError);
      return isValid;
    };
if(validate()){
    let start_date = moment(startDate).format("YYYY-MM-DD");
    const date = start_date == "Invalid date" ? "" : start_date;
    const response = await giftCertificateservices.searchGiftByNameandDate(
      date,
      val,
      id,
      reduxToken
    );
    if (response.status == 200) {
      setLoader(false);

      setGiftList(response?.data?.data);
    } else {
      setLoader(false);
    }
  }
  };

  const inputChange = async (e) => {
    e.preventDefault();
    const { value } = e.target;
    setVal(value);
  };

  const clearFilter = (e) => {
    e.preventDefault();
    setStartDate("");
    setVal("");
    getGiftList();
    setErr()

  };
  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => moment(row?.startDate).format("MMMM D, YYYY"),
        id: "appointmentdate",
        header: "Appointment Date",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row?.paymentType === "Paid"
            ? moment(row?.startDateTime).format("MMMM D, YYYY")
            : "--",
        id: "checkoutdate",
        header: "Checkout Date",
        size: 200,
      },
      {
        accessorFn: (row) =>
          row?.bookingFor?.name
            ? row?.bookingFor?.name
            : row?.bookingFor?.map((item) => item.name),
        id: "Client Name",
        header: "Client Name",
        size: 70,
      },
      {
        accessorFn: (row) =>
          row?.bookingFor?.email
            ? row?.bookingFor?.email
            : row?.bookingFor?.map((item) => item.email),
        id: "Email",
        header: "Email",
        size: 180,
      },

      {
        accessorFn: (row) =>
          row?.service?.map((item) => item?.service).toString(),
        id: "Service",
        header: "Service",
        size: 120,
      },
      {
        accessorFn: (row) => row?.paymentType,
        id: "Status",
        header: "Status",
        size: 100,
      },
    ],
    []
  );

  return (
    <>
      <div className="appointment-wrapper">
        <div className="form-wrapper">
          <Form>
            <Row>
              <Col xs={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    onChange={inputChange}
                    value={val}
                    type="text"
                    name="search"
                    placeholder="Search by name..."
                  />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Dates</Form.Label>
                  <div className="selectdate-field">
                    <InputGroup>
                      <div className="input__group">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MMMM d, yyyy"
                          placeholderText="Search by Date"
                        />
                      </div>
                    </InputGroup>
                  </div>
                </Form.Group>
              </Col>
              <Col xs={2}>
                <div className="app-searchbtn">
                  <Button onClick={filterSearch} className="searchbtn">
                    <MdOutlineSearch />
                  </Button>
                  <Button onClick={clearFilter} className="clearbtn">
                    <AiOutlineClear />
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
          <span className="error" style={{ color: "red" }}>
                      {err && err.name}
                    </span>
        </div>
        <div className="appointment-table-wrap">
          <div className="rvn-table-wrap userproduct-list">
          {loader ? (
                <Loader />
              ) : (
            <MaterialReactTable
              columns={columns}
              pageSize={20}
              data={giftList ? giftList : ""}
              manualPagination
              onRowSelectionChange={setRowSelection}
              state={{ rowSelection }}
              enableColumnActions={false}
              enableSorting={false}
              enableTopToolbar={false}
              enableColumnOrdering={false}
            />
              )}
          </div>
        </div>
      </div>
    </>
  );
};
export default UserGiftcertificate;
