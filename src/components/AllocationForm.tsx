import * as React from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"

export interface AllocationFormProps {
  dimensions: any,
  data: any,
  addData: any,
  handleSubmit: any
}

const AllocationForm = ({dimensions, data, addData, handleSubmit}:any) => (
<form onSubmit={() => console.log("whatever")}>
        <div
          style={{
            width: "80vw",
            margin: "40px auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {Object.keys(dimensions).map((dim: string) => (
            <FormControl fullWidth>
              <InputLabel htmlFor={dim}>{dim}</InputLabel>
              <Select name={dim} id={dim} value={data[dim] || ''} onChange={(e) => addData(e.target.name, e.target.value)}>
              <MenuItem value="none">none</MenuItem>
                {dimensions[dim].options.map((opt:any) => (
                  <MenuItem value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
          <FormControl fullWidth>
            <TextField id="amount" value={data.amount || ''} name="amount" type="number" helperText="Amount" placeholder="Amount" onChange={(e) => {if(e.target.value) {addData(e)}}} />
          </FormControl>
          <Button color="primary" onClick={handleSubmit} variant="outlined">
            Add Allocation
          </Button>
        </div>
      </form>
)

export default AllocationForm