import React from 'react';
import SellerForm from './SellerForm';
import {formModeConfig} from "../../../../config";

function UpdateSeller() {
  return (
    <SellerForm mode={formModeConfig.update}/>
  )
}

export default UpdateSeller;