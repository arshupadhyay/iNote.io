import React,{useContext,useState} from 'react';
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;

     const [note, setnote] = useState({title:"",description:"",tag:""})
    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setnote({title:"",description:"",tag:""})
        props.showAlert("Added Successfully!!","success")
    }

    const onChange = (e) =>{
        setnote({...note,[e.target.name]: e.target.value})
    }
  return (
    <div className="container my-3">
        <h2>Add a note!</h2>
        <form className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title<span>: min 3 letters</span>
            </label>
            <input type="text" className="form-control" id="title"name="title" aria-describedby="emailHelp" onChange={onChange} value={note.title}
             minLength = {3} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description<span>: min 5 letters</span>
            </label>
            <input type="text" className="form-control" id="description" name='description' onChange={onChange} minLength = {5} required value={note.description}/>
          </div>
          <div className="mb-3 form-check">
          <label htmlFor="tag" className="form-label">
              Tag<span>: min 3 letters</span>
            </label>
            <input type="text" className="form-control" id="tag" name='tag' onChange={onChange} value={note.tag} minLength = {3} required/>
          </div>
          <button disabled={note.title.length<3 || note.description.length<5 || note.tag.length <3} type="submit" className="btn btn-primary" onClick={handleClick}>
            Add note
          </button>
        </form>
      </div>
  );
}

export default AddNote;
