import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router";
import { MdHome } from "react-icons/md";
const UserBreadcurm = (props) => {
   const navigate = useNavigate();
  const handleClick = (()=>{
navigate(`/clients`);
  })
  return (
    <div className="breadcurm-bar">
      <div className="bdbar-box">
        <h2>
         {props?.params != null ? <b>Client </b> : <b>Clients</b>} 
        </h2>
        <Breadcrumb>
          <Breadcrumb.Item>
            <MdHome  onClick={() => handleClick()}/>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{props.params != null ? `Client / ${props?.name?.name}` : "Clients"}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    </div>
  );
};
export default UserBreadcurm;
