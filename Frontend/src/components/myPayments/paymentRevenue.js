import React, { useState, useMemo, useEffect } from "react";
import moment from "moment";
import { CSVLink } from 'react-csv';
import "./paymentRevenue.scss";
import {
  Form,
  Modal,
  Button,
  Image,
  InputGroup,
} from "react-bootstrap";
import { createNotification } from "../../helper/notification";
import DatePicker from "react-datepicker";
import { BiCalendar } from "react-icons/bi";
import { HiOutlineChevronDown } from "react-icons/hi";
import MaterialReactTable from "material-react-table";
import * as bookingService from "../../services/bookingServices";



import Loader from "../../helper/loader";
import { useSelector } from "react-redux";

import SearchIcon from '@mui/icons-material/Search';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import * as businessService from "../../services/bookingServices";
import stripe from "../../assets/img/stripe.png";


const PaymentRevenue = () => {


  const PaymentDatapay = {
    payment: stripe,
  };
  const reduxToken = useSelector((state) => state?.auth?.token);

  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userService, setUserService] = useState([]);
  const [addressGeo, setAddressGeo] = useState("");
  const [serviceSetting, setServiceSetting] = useState([]);
  const [loader, setLoader] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteAllShow, setDeleteAllShow] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteData, setDeleteData] = useState("");
  const [val, setVal] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [Color, setColor] = useState("#14513e");
  const handleClose = () => {
    setShow(false);
    setDeleteAllShow(false);
  };
  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => (row?.name),
        id: "name",
        header: "Name",
      },
      {
        accessorFn: (row) => (row?.email),
        id: "email",
        header: "Email",
      },
      {
        accessorFn: (row) => (
          
          <>
         
            {moment(row?.createdAt).format("D MMM, h:mm A")}
          </>
        ),
        id: "timedate",
        header: "Time & Date",
      },
      {
        accessorFn: (row) => (row?.invoiceNumber),
        id: "invoiceNumber",
        header: "INvoice Number",
      },
      {
        accessorFn: (row) => (
          <>
            <div className="payemnt_icon">
              <Image src={PaymentDatapay.payment} alt="payment" />
            </div>
          </>
        ),
        id: "PAYMENT METHOD",
        header: "PAYMENT METHOD",
      },
      {
        accessorFn: (row) => (<>
          {`$ ${row.amount}`}
        </>),
        id: "amount",
        header: "AMOUNT",
      },
      {
        accessorFn: (row) => (
          <>
            <div className="table_status d-flex">
              <span className={`dot`} style={{ backgroundColor: Color }} ></span>
              <span style={{ color: Color }}>{row.paymentStatus}</span>
            </div>
          </>),
        id: "status",
        header: "Status",
        size: 100,
      },
      {
        accessorFn: (row) => (<>
          <div className="table_btn">
            <Button
              className=" d-flex bg-transparent border-0" style={{ color: "#005941", fontWeight: "600" }}
              onClick={() =>
                handleDownload(row.invoiceNumber)
              }
            >

              <FileDownloadOutlinedIcon /> Download
            </Button>
          </div>
        </>),

        id: "download",
        header: "DownLoad",
      },
    ],
    []
  );


  const [rowSelection, setRowSelection] = useState({});

  const getBooking = async (reduxToken) => {
    if (reduxToken) {
      setLoader(true)
      const response = await businessService.getPaymentHistory(reduxToken);
      if (response?.success == true) {
        setLoader(false)
        response &&
          response?.data &&
          response?.data?.length > 0 &&
          setFilterData(response?.data);
      } else {
        setLoader(false)
      }
    }
  };
  useEffect(() => {
    if (!addressGeo) {
      getBooking(reduxToken);
    }
  }, [addressGeo, reduxToken]);


  const customizedData = filterData?.map(item => {
    const formattedTime = moment(item.createdAt).format('D MMM, h:mm A');

    return {
      Name: item.name,
      Email: item.email,
      Time: formattedTime,
      InvoiceNumber: item.invoiceNumber,
      PaymentMethod: "Strip",
      Amount: item.amount,
      Status: item.paymentStatus,
    };
  });



  const selectedCustomized = selectedPayment && selectedPayment.length > 0 && selectedPayment?.map(item => {
    const formattedTime = moment(item.createdAt).format('D MMM, h:mm A');
    return {
      Name: item.name,
      Email: item.email,
      Time: formattedTime,
      InvoiceNumber: item.invoiceNumber,
      PaymentMethod: "Strip",
      Amount: item.amount,
      Status: item.paymentStatus,
    };
  })

  const handleDownload = async (invoiceId) => {
    const userId = localStorage.getItem("front_user_id")
    const response = await businessService.getInvoice(userId, invoiceId);
    const downloadLink = response.data.invoice_pdf;
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = downloadLink;
    a.download = `invoice_${invoiceId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getService = async (reduxToken) => {
    const response = await bookingService.getServices(reduxToken);
    if (response.status == 200) {
      setUserService(response?.data?.data);
    } else {
      console.log("error");
    }
  };

  const getServicesSetting = async (reduxToken) => {
    const response = await bookingService.getServicesSetting(reduxToken);
    if (response.status == 200) {
      const data1 = response?.data?.data[0]?.service
      const serviceIds1 = data1.map((item) => item.serviceId)
      setServiceSetting(serviceIds1);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getServicesSetting(reduxToken);
  }, [reduxToken]);

  useEffect(() => {
    getService(reduxToken);
  }, [reduxToken]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);





  const handleChange = (e) => {
    setStatus(e.target.value)
  };

  const handleStartDateChange = (date) => {
    if (endDate && date?.getTime() > endDate?.getTime()) {
      setEndDate(null);
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    if (startDate && date?.getTime() < startDate?.getTime()) {
      setStartDate(null);
    }
    setEndDate(date);
  };

  useEffect(() => {

    if (startDate || endDate || status ||val) {
      applyFilters()
    } else {
      getBooking(reduxToken)
    }
  }, [startDate, endDate, status,val])

  const inputChange = async (e) => {
    const { value } = e.target;
    setVal(value);
  }
  const applyFilters = async () => {
    let start_date = moment(startDate).format("YYYY-MM-DD");
    let end_date = moment(endDate).format("YYYY-MM-DD");

    const obj = {
      paymentStatus: status,
      startDate: start_date == "Invalid date" ? "" : start_date,
      endDate: end_date == "Invalid date" ? "" : end_date,
    }
    const response = await businessService.filterbilling(obj,reduxToken,page,10,val);
    setLoader(true);
    if (response.status == 200) {
      setLoader(false);
      setFilterData(response?.data?.data);
    } else {
      setLoader(false);
    }

  }
  const handleDelete = async () => {
    let id = deleteId;
    let data = deleteData.startDateTime
    if (id) {
      const response = await bookingService.removeBooking(id, data);
      if (response.status == 200) {
        createNotification("success", response?.data?.message);
        handleClose();
        applyFilters();
      }
    } else {
      removeAllBooking();
    }
  };



  let getPaymentById = async () => {
    const val = Object.keys(rowSelection);
    const obj = {
      Ids: val
    }
    const response = await bookingService.getPaymentById(obj);
    if (response?.data) {
      setSelectedPayment(response?.data)
    }
  };
  useEffect(() => {
    getPaymentById();
  }, [rowSelection]);


  useEffect(() => {
    if (filterData.length === 0) {
      setRowSelection([]);
    }
  }, [filterData]);

  const removeAllBooking = async () => {
    const val = Object.keys(rowSelection);
    setLoader(true);
    const response = await bookingService.removeMultiBooking(val, reduxToken);
    setRowSelection({});
    if (response.status == 200) {
      createNotification("success", response?.data?.message);
      getBooking(reduxToken);
      setLoader(false);
      setDeleteAllShow(false);
    }
  };

 
 
  




  return (
    <>
   
      <div className="booking-layout-wrapper">
        <div className="main-heading">
          <h1>Payments By Customer</h1>
          <p>List of customer Payments</p>
        </div>

       
        <div className="revenue-list-section" >

          <div className="rvn-table-list">
            <div className="rvn-filter">
              <div className="filter-data">
                <h2>Filter:</h2>
                <div className="filter-list">

                  <div className="filter-field">
                    <InputGroup>
                      <div className="input__group">
                        <DatePicker
                          selected={startDate}
                          onChange={handleStartDateChange}
                          selectsStart
                          maxDate={endDate}
                          startDate={startDate}
                          endDate={endDate}
                          dateFormat="MMMM d, yyyy"
                          placeholderText="Start Date"
                        />
                      </div>
                      <InputGroup.Text id="basic-addon1">
                        <BiCalendar />
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                  <div className="filter-field" >
                    <InputGroup>
                      <div className="input__group">
                        <DatePicker
                          selected={endDate}
                          onChange={handleEndDateChange}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          dateFormat="MMMM d, yyyy"
                          placeholderText="End Date"
                        />
                      </div>
                      <InputGroup.Text id="basic-addon2">
                        <BiCalendar />
                      </InputGroup.Text>
                    </InputGroup>
                  </div>

                  <div className="filter-field" >
                    <div className="selectoption">
                      <Form.Select
                        name="status"
                        onChange={handleChange}
                        aria-label="Default select example"
                      >
                        <option value="">Select Status</option>
                        <option value="succeeded">Success</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                      </Form.Select>
                      <span className="slarrow">
                        <HiOutlineChevronDown />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="search_input1">
                <InputGroup className="">
                  <Form.Control
                    className="border-end-0 shadow-none rounded-0 py-2"
                    placeholder="Search payment"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    onChange={inputChange}
                    value={val}
                  />
                  <InputGroup.Text id="basic-addon2" className="border-start-0 rounded-0 py-2" style={{ backgroundColor: "#fff" }}><SearchIcon /></InputGroup.Text>
                </InputGroup>
              </div>
            </div>

            <div className="rvn-table-wrap">

              <div className="revenu-btns mt-3 d-flex align-items-center justify-content-start gap-3">

                <Button className="addbtn2" disabled={customizedData.length < 1 && selectedPayment.length < 1 ? true : false}>
                  <FileDownloadOutlinedIcon />

                  <CSVLink className="text-decoration-none text-light text-capitalize" style={{ fontSize: "16px" }} data={selectedPayment.length > 0 ? selectedCustomized : customizedData} filename={"Payment_report.csv"}>
                    Report
                  </CSVLink>
                </Button>
                <div style={{ fontStyle: "italic", fontWeight: "bold" }}>{
                  selectedPayment.length > 0 ? `${selectedPayment.length} Selected` : ""
                }
                </div>
              </div>
              {loader ? (
                <Loader />
              ) : (
                <MaterialReactTable
                  columns={columns}
                  pageSize={pageSize}
                  data={filterData}
                  getRowId={(row) => row._id}
                  enablePagination={true}
                  enableRowSelection
                  onRowSelectionChange={setRowSelection}
                  state={{ rowSelection }}
                  enableColumnActions={false}
                  enableSorting={false}
                  enableTopToolbar={false}
                  enableColumnOrdering={false}
                  enableRowActions={false}
                  positionActionsColumn="last"
                   />
                  
              )}
              <Modal show={show ? show : deleteAllShow ? deleteAllShow : ""}>
                <Modal.Header>
                  <Modal.Title>Delete Booking</Modal.Title>
                </Modal.Header>
                {deleteAllShow ? (
                  <Modal.Body>Do you want to Delete All Booking ?</Modal.Body>
                ) : show ? (
                  <Modal.Body>Do you want to Delete this Booking ?</Modal.Body>
                ) : (
                  ""
                )}

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PaymentRevenue;
