import React from 'react';
import StaffForm from './StaffForm';
import staffStore from "../../../../stores/staffStore";

function UpdateStaff() {
  staffStore.setUpdateMode();
  return (
    <StaffForm/>
  )
}

export default UpdateStaff;