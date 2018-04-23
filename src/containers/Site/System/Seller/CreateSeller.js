import React from 'react';
import SellerForm from './SellerForm';
import {formModeConfig} from "../../../../config";

function CreateSeller() {
  return (
    <SellerForm mode={formModeConfig.create}/>
  )
}

export default CreateSeller;