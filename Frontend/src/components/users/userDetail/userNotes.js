import React, { useState, useMemo, useEffect } from "react";
// import DatePicker from "react-datepicker";
import { Form, Button } from "react-bootstrap";
// import { BiCalendar } from "react-icons/bi";
import MaterialReactTable from "material-react-table";
import CreateNotes from "./modal/createNotes";
import * as notesServices from "../../../services/notesServices";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

import Loader from "../../../helper/loader";

const Usernotes = () => {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const NotesClose = () => setShow(false);
  const NotesShow = () => setShow(true);
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [NotesList, setNotesList] = useState([]);
  const [loader, setLoader] = useState(true);

  const reduxToken = useSelector((state) => state?.auth?.token);

useEffect(()=>{
  getNotes()
},[reduxToken])

const getNotes = async  () =>{
  setIsLoading(true);
  if (reduxToken) {
    setLoader(true);

    const response = await notesServices.NotesList(id ,reduxToken);
    if (response?.status == 200) {
      setNotesList(response?.data?.data);
      setLoader(false);

    } else {
      setIsLoading(false);
      setLoader(false);

    }
  }
}


  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => moment(row.createdAt).format("MMMM D, YYYY"),
        id: "createdAt",
        header: "Created Date",
        size: 200,
      },
      {
        accessorFn: (row) => row.title,
        id: "title",
        header: "Title",
        size: 200,
      },
      {
        accessorFn: (row) => row.description,
        id: "description",
        header: "Description",
        size: 200,
      },
    
    ],
    []
  );

  return (
    <>
      <div className="appointment-wrapper">
        <div className="form-wrapper">
          <Form>
            <div className="Notes-created">
              <Button className="newnote-btn" onClick={NotesShow}>
                Create New
              </Button>
            </div>
          </Form>
        </div>
        <div className="appointment-table-wrap user-note-table">
          <div className="user-table">
            <div className="rvn-table-wrap product-inventory-list">
            {loader ? (
                <Loader />
              ) : (
              <MaterialReactTable
                columns={columns}
                pageSize={20}
                data={NotesList}
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
        <CreateNotes NotesList={NotesList} show={show} getNotes={getNotes} NotesClose={NotesClose} />
      </div>
    </>
  );
};
export default Usernotes;
