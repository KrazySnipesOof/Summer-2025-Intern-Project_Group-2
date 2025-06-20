import React, { useMemo, useState, useEffect } from "react";
import { Col, Form, Row, Button, InputGroup, Table } from "react-bootstrap";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { useSelector } from "react-redux";
import * as bookingervices from "../../../services/bookingServices";
import { useParams } from "react-router-dom";
import moment from "moment";
import MaterialReactTable from "material-react-table";
import Loader from "../../../helper/loader";

const UserInvoice = () => {
  const { id } = useParams();
  const [invoicesList, setInvoicesList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [val, setVal] = useState("");
  const [servicesStats, setServicesstats] = useState();
  const [rowSelection, setRowSelection] = useState({});
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [loader, setLoader] = useState(true);
  const [err, setErr] = useState({});

  useEffect(() => {
    getInvoiceList();
  }, [reduxToken]);

  const getInvoiceList = async () => {
    setIsLoading(true);
    if (reduxToken) {
      setLoader(true);
      const response = await bookingervices.getAllInvoices(id, reduxToken);
      if (response?.status == 200) {
        setInvoicesList(response?.data?.data);
        setLoader(false);

      } else {
        setIsLoading(false);
        setLoader(false);

      }
    }
  };

  
  const inputChange = async (e) => {
    e.preventDefault();
    const { value } = e.target;
    setVal(value);
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
    const response = await bookingervices.searchinvoiceByNameandstatus(
      id,
      servicesStats,
      val,
      reduxToken
    );
    if (response.status == 200) {
    setInvoicesList(response?.data?.data);
    setLoader(false);

  } else {
    setLoader(false);
  }
}
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => moment(row?.startDate).format("MMMM D, YYYY"),
        id: "Date",
        header: "Date",
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
        accessorFn: (row) => row?.bookingFor?.name,
        id: "Client Name",
        header: "Client Name",
        size: 70,
      },
      {
        accessorFn: (row) => row?.bookingFor?.email,
        id: "Email",
        header: "Email",
        size: 180,
      },

      {
        accessorFn: (row) =>
          row?.bookingFor?.phoneNumber,
        id: "Phone No",
        header: "Phone No",
        size: 120,
      },
      {
        accessorFn: (row) => row?.servicePrice ? `$${row.servicePrice}` : "--" ,
        id: "Price",
        header: "Price",
        size: 100,
      },
      {
        accessorFn: (row) => row?.paymentType ,
        id: "Status",
        header: "Status",
        size: 100,
      },
    ],
    []
  );
  const clearFilter = (e) => {
    e.preventDefault();
    setServicesstats('');
    setVal("");
    getInvoiceList();
    setErr()
  };
  return (
    <>
      <div className="appointment-wrapper">
        <div className="form-wrapper">
          <Form>
            <Row>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <div className="searchbar">
                    <InputGroup className="mb-3">
                      <Form.Control
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        onChange={inputChange}
                        value={val}
                        placeholder="Search by name..."
                      />
                    </InputGroup>
                  </div>
                </Form.Group>
              </Col>

              <Col xs={4}>
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
              data={invoicesList ? invoicesList : ""}
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
export default UserInvoice;
