import styled from "@emotion/styled";
import { Button, TextField } from "@material-ui/core";
import {
  Add,
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  Cancel,
  MaximizeOutlined,
  MinimizeOutlined,
} from "@material-ui/icons";
import { useCallback, useRef, useState } from "react";
import { dimensions } from "../lib/data";
import _ from "lodash";
import { comparePaths } from "../lib/helpers";

const DimensionBlockOuter = styled.div`
  display: inline-block;
  height: 6em;
  width: 6em;
  box-shadow: 3px 4px 6px rgba(33, 33, 33, 0.7);
`;

const DimensionBlockInner = styled.div`
  text-decoration: none;
  font-size: 10pt;
  padding: 1em;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: inherit;
  & .MuiInputBase-input { margin: 0; padding: 0; font-size: 10pt !important; }
`;

export interface DimensionBlockProps {
  color: string;
  level: string;
  item: string;
  value: number;
  path: any;
  style?: any;
  deleteAllocation: any;
  handleSubmit: any;
  collapsed: any[];
  collapse: any;
  hasChildren: boolean;
}

export const DimensionBlock = ({
  color,
  level,
  item,
  value,
  path,
  deleteAllocation,
  handleSubmit,
  collapsed,
  collapse,
  hasChildren,
  style = {},
}: DimensionBlockProps) => {
  const [editMode, setEditMode] = useState<Boolean>(false);
  const newValueRef = useRef<HTMLInputElement>(null);

  const createOffsetAllocation = () => {
    const newValue = parseInt(newValueRef.current!.value);
    const offset = newValue - value;
    if (offset !== 0) {
      const newData: { [dim: string]: string | number } = {};
      Object.keys(dimensions).forEach((dim: any) => {
        if (path[dim]) {
          newData[dim] = path[dim];
        } else {
          newData[dim] = "none";
        }
      });
      newData.amount = offset;
      handleSubmit(newData);
    }
  };
  if (value === 0) {
    deleteAllocation(path);
    return null;
  }
  const isCollapsed = () =>
    !!_.find(collapsed, (i: any) => comparePaths(i, path));
  return (
    <DimensionBlockOuter
      style={{
        ...style,
        backgroundColor: color,
        border: value < 0 || item === "none" ? "thick red solid" : "none",
      }}
    >
      <DimensionBlockInner onClick={() => {level!=="Campaign" && setEditMode(true)}}>
        {hasChildren &&
          (isCollapsed() ? (
            <ArrowUpwardOutlined fontSize="small" onClick={() => collapse(path, false)} />
          ) : (
            <ArrowDownwardOutlined fontSize="small" onClick={() => collapse(path, true)} />
          ))}
        <div>{level}</div>
        <div>{item}</div>
        {editMode ? (
          <>
            <TextField
              inputRef={newValueRef}
              type="number"
              defaultValue={value}
            />
            <Button
              style={{ fontSize: "8pt", padding: 0 }}
              variant="outlined"
              onClick={(e: any) => {
                e.stopPropagation();
                setEditMode(false);
                createOffsetAllocation();
              }}
            >
              Commit
            </Button>
          </>
        ) : (
          <div>${value}</div>
        )}
      </DimensionBlockInner>
    </DimensionBlockOuter>
  );
};

export default DimensionBlock;
