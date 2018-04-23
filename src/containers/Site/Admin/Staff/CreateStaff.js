import React from 'react';
import StaffForm from './StaffForm';
import staffStore from "../../../../stores/staffStore";

function CreateStaff() {
  staffStore.setUpdateMode(false);
  return (
    <StaffForm/>
  )
}

export default CreateStaff;