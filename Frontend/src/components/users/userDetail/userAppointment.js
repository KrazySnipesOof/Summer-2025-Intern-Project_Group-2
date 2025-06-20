import React, { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Col, Form, Row, Button, InputGroup } from "react-bootstrap";
import MaterialReactTable from "material-react-table";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import * as bookingervices from "../../../services/bookingServices";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import Loader from "../../../helper/loader";
import { BiEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


const Userappointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loader, setLoader] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [AppointmentList, setAppointmentList] = useState("");
  const [service, setService] = useState();
  const [status, setStatus] = useState();
  const [servicesStats, setServicesstats] = useState();

  const reduxToken = useSelector((state) => state?.auth?.token);
   
  const  handleEditshowstaff = (cell) => {
    console.log(cell.row.id,"KKKKKKKKKKKKKKKKKKKKKKKKKK")
    // let  id  =  cell?._def?.groupId
    navigate(`/editbooking/${cell.row.id}`);
  }
  useEffect(() => {
    getAppointmentList();
    getServices();
  }, [reduxToken]);

  const getAppointmentList = async () => {
    setIsLoading(true);
    if (reduxToken) {
      setLoader(true);

      const response = await bookingervices.getAllAppointments(id, reduxToken);
      if (response?.status == 200) {
        setAppointmentList(response?.data?.data);
        setLoader(false);

      } else {
        setIsLoading(false);
        setLoader(false);

      }
    }
  };

   const columns = useMemo(
    () => [
      {
        accessorFn: (row) => moment(row.startDate).format("MMMM D, YYYY"),
        id: "appointmentdate",
        header: "Appointment Date",
        size: 220,
      },
      {
        accessorFn: (row) => moment(row.startDateTime).format("hh:mm a"),
        id: "appointmentTime",
        header: "Appointment Time",
        size: 220,
      },
      {
        accessorFn: (row) =>
          row?.paymentType === "Paid"
            ? moment(row.startDateTime).format("MMMM D, YYYY")
            : "--",
        id: "checkoutdate",
        header: "Checkout Date",
        size: 200,
      },
      {
        accessorFn: (row) => row.bookingType,
        id: "type",
        header: "Type",
        size: 70,
      },
      {
        accessorFn: (row) => row.bookingStatus,
        id: "status",
        header: "Status",
        size: 130,
      },

      {
        accessorFn: (row) =>
          row?.service?.map((item) => item?.service).toString(),
        id: "service",
        header: "Service",
        size: 140,
      },
      {
        accessorFn: (row) => (row.servicePrice ? `$${row.servicePrice}` : "--"),
        id: "price",
        header: "Price",
        size: 100,
      },
      {
        accessorFn: (row) => row.paymentType,
        id: "paid",
        header: "Paid",
        size: 80,
      },
      {
        accessorFn: (row) => row.action,
        id: "action",
        header: "Action",
        Cell: ({ cell }) => (
          <div className="action-btn">
            <Button
              onClick={() => {
                handleEditshowstaff(cell);
              }}
            >
              <BiEdit />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const getServices = async (reduxToken) => {
    const response = await bookingervices.getAppointmentServices(reduxToken);
    if (response.status == 200) {
      setService(response?.data?.data[0]?.service);
    } else {
      console.log("error");
    }
  };

  const handlechange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setStatus(value);
  };

  const handleServices = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setServicesstats(value);
  };
  const filterSearch = async (e) => {
    e.preventDefault();
    let start_date = moment(startDate).format("YYYY-MM-DD");
    const data = start_date == "Invalid date" ? "" : start_date;
    const response = await bookingervices.searchAppointmentByNameandDate(
      data,
      status,
      id,
      servicesStats,
      reduxToken
    );
    if (response.status == 200) {
      
      setAppointmentList(response?.data?.data);
      setLoader(false);

    } else {
      setLoader(false);
      
    }
   
  };
  const clearFilter = (e) => {
    e.preventDefault();
    setStartDate("");
    setServicesstats("");
    setStatus("");
    getAppointmentList();
  };
  return (
    <>
      <div className="appointment-wrapper">
        <div className="form-wrapper">
          <Form>
            <Row>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>All Dates</Form.Label>
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
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>All Status</Form.Label>
                  <Form.Select onChange={handlechange} name="workPerDay" value={status}>
                    <option value={""}>Select Status</option>
                    <option value="Paid">Paid</option>
                    <option value="UnPaid">UnPaid</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>All Services</Form.Label>
                  <Form.Select onChange={handleServices} name="workPerDay" value={servicesStats}>
                    <option value={""}>Select Services </option>
                    {service?.map((result) => {
                      return (
                        <option value={result?.serviceId?.service}>
                          {result?.serviceId?.service}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <div className="app-searchbtn appt-btn">
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
        </div>
        <div className="appointment-table-wrap">
          <div className="user-table">
            <div className="rvn-table-wrap product-inventory-list">
            {loader ? (
                <Loader />
              ) : (
              <MaterialReactTable
                columns={columns}
                getRowId={(row) => row._id}
                pageSize={20}
                data={AppointmentList}
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
      </div>
    </>
  );
};
export default Userappointment;
