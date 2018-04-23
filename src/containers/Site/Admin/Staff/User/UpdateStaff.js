import React from 'react';
import StaffForm from './StaffForm';
import staffByUserStore from "../../../../../stores/staffByUserStore";

function UpdateStaff() {
  staffByUserStore.setUpdateMode();
  return (
    <StaffForm/>
  )
}

export default UpdateStaff;