import React from 'react';
import CrossForm from './CrossForm';
import {formModeConfig} from "../../../../config";
import crossStore from "../../../../stores/crossStore";

function UpdateCross() {
  crossStore.setUpdateMode(true);
  return (
    <CrossForm mode={formModeConfig.update}/>
  )
}

export default UpdateCross;