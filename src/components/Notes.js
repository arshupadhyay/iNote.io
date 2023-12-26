import React,{ useContext, useEffect,useRef,useState } from 'react';
import noteContext from "../context/notes/noteContext";
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(noteContext);
    const {notes,getNotes,editNote} = context;
    let navigate = useNavigate()
    useEffect(() => {
      if(localStorage.getItem('token')){
        getNotes();
      }
      else{
        navigate("/login")
      }
      // eslint-disable-next-line
    }, [])

    const ref = useRef(null)
    const refClose = useRef(null);
    const [note, setnote] = useState({id:"", etitle:"",edescription:"",etag:""})
    
const updateNote = (currentnote)=>{
  ref.current.click();
  setnote({id:currentnote._id,etitle: currentnote.title,edescription: currentnote.description , etag:currentnote.tag});

}

const handleClick = (e)=>{
  console.log('Updating node',note)
  editNote(note.id,note.etitle,note.edescription,note.etag)
  refClose.current.click();
  props.showAlert("Updated Successfully!!","success")
}

const onChange = (e) =>{
  setnote({...note,[e.target.name]: e.target.value})
}
  return (
    <div>
      <AddNote showAlert={props.showAlert}/>

      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>


      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <form className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input type="text" className="form-control" id="etitle"name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange}
             minLength = {3} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} minLength = {5} required/>
          </div>
          <div className="mb-3 form-check">
          <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onChange} minLength = {3} required/>
          </div>
          {/* <button type="submit" className="btn btn-primary" onClick={handleClick}>
            Add note
          </button> */}
        </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button onClick={handleClick} disabled={note.etitle.length<3 || note.edescription.length<5 || note.etag.length <3} type="button" className="btn btn-primary">Update</button>
            </div>
          </div>
        </div>
      </div>
      <div className=" container row my-3">
        <h2>Your notes</h2>
        <div className = "container mx-2">
          {notes.length === 0 && 'No notes to display'}
        </div>
        {notes.map((note)=>{
          return <NoteItem key={note._id} updateNote = {updateNote} showAlert={props.showAlert} note = {note}/>;
        })}
      </div>
    </div>
  );
}

export default Notes;
