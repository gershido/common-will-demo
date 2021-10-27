import React, {useState} from "react";
import { ExistingSafe } from "./ExistingSafe";
import { CreateSafe } from "./CreateSafe";
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton'


export function InitSafe(){
    const [value, setValue] = useState(1);

    const handleChange = (val : any) => setValue(val);

    return (
      <div>
          <ToggleButtonGroup type="radio" name="optins" value={value} onChange={handleChange}>
            <ToggleButton id="tbg-btn-1" value={1}>
              New
            </ToggleButton>
            <ToggleButton id="tbg-btn-2" value={2}>
              Existing
            </ToggleButton>
          </ToggleButtonGroup>
          {value == 1 ? <CreateSafe/> : <ExistingSafe/>}
      </div>
      
      
    );
}

