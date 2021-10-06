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
  & .MuiInputBase-input {
    margin: 0;
    padding: 0;
    font-size: 10pt !important;
  }
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
  allocations: any[];
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
  allocations,
  style = {},
}: DimensionBlockProps) => {
  const [editMode, setEditMode] = useState<Boolean>(false);
  const newValueRef = useRef<HTMLInputElement>(null);
  console.log(allocations, path);
  const createOffsetAllocation = () => {
    const newValue = parseInt(newValueRef.current!.value);
    const offset = newValue - value;
    if (offset !== 0) {
      const newData: { [dim: string]: string | number } = {};
      Object.keys(dimensions).forEach((dim: string) => {
        const thisDim = path[dim];
        console.log(thisDim)
        if (thisDim) {
          newData[dim] = thisDim;
        } else {
          newData[dim] = "none";
        }
      });
      newData.amount = offset;
      console.log(newData, path);
      const pathKeys = Object.keys(path);
      console.log(path[pathKeys[pathKeys.length - 2]]);
      handleSubmit(newData);
    }
  };
  if (value === 0) {
    deleteAllocation(path);
    return null;
  }
  const isCollapsed = () =>
    !!_.find(collapsed, (i: any) => comparePaths(i, path));
  const findUnallocatedNeighbor = () => {
    const pathKeys = Object.keys(path)
    const spec = pathKeys.reduce((acc: any, p: any, i: number) => {
      if (i < pathKeys.length - 1) {
        return { ...acc, ...path[p] };
      } else {
        return { ...acc, [p]: "none" };
      }
    }, {});
    const allDimensions = ["strategy", "tactic", "publisher", "channel"];
    allDimensions.forEach((d: string) => {
      if (!(d in spec)) {
        spec[d] = "none";
      }
    });
    console.log(
      allocations.filter((a: any) =>
        Object.keys(a).every(
          (dim: string) => dim === "amount" || spec[dim] === a[dim]
        )
      )
    );
  };
  findUnallocatedNeighbor();
  return (
    <DimensionBlockOuter
      style={{
        ...style,
        backgroundColor: item === "none" ? "#eee" : color,
        borderRadius: item === "none" ? 999 : 0,
        boxShadow: item === "none" ? "none" : "",
        border:
          value < 0
            ? "thick red solid"
            : item === "none"
            ? `thin ${color} solid`
            : "none",
      }}
    >
      <DimensionBlockInner
        onClick={() => {
          level !== "Campaign" && setEditMode(true);
        }}
        style={{ backgroundColor: item === "none" ? "" : "inherit" }}
      >
        {hasChildren &&
          (isCollapsed() ? (
            <ArrowUpwardOutlined
              fontSize="small"
              onClick={() => collapse(path, false)}
            />
          ) : (
            <ArrowDownwardOutlined
              fontSize="small"
              onClick={() => collapse(path, true)}
            />
          ))}
        <div>{level}</div>
        <div>{item == "none" ? "unallocated" : item}</div>
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
