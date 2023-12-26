import React from 'react';

const Alert = (props) => {
  const capitalize = (word)=>{

    return 
  }
  return (
    <div style={{height:'50px'}}>
      {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible
      fade show`} role='alert'>
          {/* <strong>{capitalize(props.alert.type)}</strong> : */}{props.alert.msg} 
        </div>}
    </div>
  );
}

export default Alert;
