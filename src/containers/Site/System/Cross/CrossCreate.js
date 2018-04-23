import React from 'react';
import CrossForm from './CrossForm';
import {formModeConfig} from "../../../../config";
import crossStore from "../../../../stores/crossStore";

function CrossCreate() {
  crossStore.setUpdateMode(false);
  return (
    <CrossForm mode={formModeConfig.create}/>

  )
}

export default CrossCreate;