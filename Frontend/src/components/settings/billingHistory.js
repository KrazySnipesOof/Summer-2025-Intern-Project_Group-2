import React, { useState, useEffect,useMemo } from "react";
import { Button, Image } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { useSelector } from "react-redux";

import { FiDownload } from "react-icons/fi";
import stripe from "../../assets/img/stripe.png";
import * as businessService from "../../services/bookingServices";
import DatePicker from "react-datepicker";
import { HiOutlineChevronDown } from "react-icons/hi";
import {
  InputGroup,
} from "react-bootstrap";
import { BiCalendar } from "react-icons/bi";
import moment from "moment";
import Loader from "../../helper/loader";
import MaterialReactTable from "material-react-table";
export default function BillingHistory() {
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [Color, setColor] = useState("#14513e");
  const [PaymentData, setPaymentData] = useState([]);
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [loader, setLoader] = useState(true);
 
  const PaymentDatapay = {
    payment: stripe,
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
  const columns = useMemo(
    () => [
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
        accessorFn: (row) =>( <>
        {`$ ${row.amount}`}
        </>),
        id: "amount",
        header: "AMOUNT",
      },
      {
        accessorFn: (row) =>( 
          <>
          <div className="table_status d-flex">
          <span className={`dot`}style={{ backgroundColor: Color }} ></span>
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
                        className="download_btn d-flex p-0"
                        onClick={() =>
                          handleDownload(row.invoiceNumber)
                        }
                      >
                        <FiDownload /> Download
                      </Button>
                    </div>
        </>),
        id: "download",
        header: "DownLoad",
      },
    ],
    []
  );
  const filterbilling =async()=>{
    let start_date = moment(startDate)?.format("YYYY-MM-DD");
    let end_date = moment(endDate)?.format("YYYY-MM-DD");
    const obj ={
      paymentStatus: status,
      startDate: start_date == "Invalid date" ? "" : start_date,
      endDate: end_date == "Invalid date" ? "" : end_date,
    }
    const response = await businessService.filterbilling(obj,reduxToken);

    setLoader(true);
    if (response.status == 200) {

      setLoader(false);
      setPaymentData(response?.data?.data);
    } else {
      setLoader(false);
    }
    
  }
  const handleChange = (e) => {
    setStatus(e.target.value)
  }
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

  const getPaymentHistory = async (reduxToken) => {
    if (reduxToken) {
      setLoader(true)
      const response = await businessService.getPaymentHistory(reduxToken);
      if (response?.success == true) {
        setLoader(false)
        response &&
          response?.data &&
          response?.data?.length > 0 &&
          setPaymentData(response?.data);
      }else{
        setLoader(false)
      }
    }
  };

  useEffect(() => {
    getPaymentHistory(reduxToken);
  }, [reduxToken]);
  useEffect(()=>{
    if(startDate || endDate ||status){
      filterbilling()
    }else {
      getPaymentHistory(reduxToken)
    }
  },[startDate,endDate,status])
  return (
    <div className="billing_wrapper">
      <div className="billing_heading">
        <h4>Billing History</h4>
      </div>
      <div className="billing_table_heading d-flex justify-content-end">
        <div className="filter-list">
          <div className="filter-field" >
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
                <div className="filter-field">
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
      <div className="billing_table">
        {
          loader ?(
          <Loader  />
          ):(
              <MaterialReactTable
                    columns={columns}
                    pageSize={20}
                    data={PaymentData}
                    getRowId={(row) => row._id}  
                    enablePagination={true} 
                    enableColumnActions={false}
                    enableSorting={false}
                    enableTopToolbar={false}
                    enableColumnOrdering={false}
                    positionActionsColumn="last" />
          )
        }
        <div className="table_pagination">
        </div>
      </div>
    </div>
  );
}
