import React from 'react';
import StaffForm from './StaffForm';
import staffByUserStore from "../../../../../stores/staffByUserStore";

function CreateStaffByUser() {
  staffByUserStore.setUpdateMode(false);
  return (
    <StaffForm/>
  )
}

export default CreateStaffByUser;