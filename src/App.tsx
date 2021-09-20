import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Tree, TreeNode } from "react-organizational-chart";
import { ObjectFlags } from "typescript";

const dimensions:{[k:string]:any} = {
  strategy: {
    content: "Strategy",
    color: "rgba(255, 0, 0, 0.12)",
    options: ["lower funnel", "mid funnel", "upper funnel"],
  },
  publisher: {
    content: "Publisher",
    color: "rgba(0, 255, 0, 0.12)",
    options: ["trade desk", "google", "taboola"],
  },
  channel: {
    content: "Channel",
    color: "rgba(255, 255, 0, 0.12)",
    options: ["display", "video"],
  },
  tactic: {
    content: "Tactic",
    color: "rgba(0, 0, 255, 0.12)",
    options: ["retargeting", "prospecting"],
  },
};

const sampleAllocations = [
  {
    strategy: "lower funnel",
    publisher: "taboola",
    tactic: "retargeting",
    channel: "display",
    amount: 1000,
  },
  {
    strategy: "mid funnel",
    publisher: "google",
    tactic: "prospecting",
    channel: "video",
    amount: 1000,
  },
  {
    strategy: "upper funnel",
    publisher: "trade desk",
    tactic: "retargeting",
    channel: "display",
    amount: 1000,
  },
  {
    strategy: "lower funnel",
    publisher: "google",
    tactic: "retargeting",
    channel: "video",
    amount: 1000,
  },
  {
    strategy: "mid funnel",
    publisher: "trade desk",
    tactic: "prospecting",
    channel: "video",
    amount: 1000,
  },
  {
    strategy: "upper funnel",
    publisher: "google",
    tactic: "retargeting",
    channel: "display",
    amount: 1000,
  },
  {
    strategy: "upper funnel",
    publisher: "trade desk",
    tactic: "prospecting",
    channel: "display",
    amount: 1000,
  },
  {
    strategy: "lower funnel",
    publisher: "taboola",
    tactic: "retargeting",
    channel: "display",
    amount: 1000,
  },
];

const DimensionBlock = styled.div`
  display: inline-block;
  height: 5em;
  width: 8em;
  box-shadow: 3px 4px 6px rgba(33, 33, 33, 0.7);
`;

const DimensionBlockInner = styled.div`
  text-decoration: none;
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
`;

const aggregate = (allocations: any[], field: string = "total") => {
  const aggs = allocations.reduce((agg: any, alloc: any) => {
    if (field === "total") {
      agg.total = (agg.total ?? 0) + alloc.amount;
    } else {
      agg[alloc[field]] = (agg[alloc[field]] ?? 0) + alloc.amount;
    }
    return agg;
  }, {});
  return aggs;
};

const reorder = (list: any, startIndex: number, endIndex: number) => {
  const keys = Object.keys(list);
  const [removed] = keys.splice(startIndex, 1);
  keys.splice(endIndex, 0, removed);
  const newItems:{[k:string]:any} = {};
  keys.forEach((k:string) => newItems[k]=dimensions[k]);
  return newItems;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  padding: `${grid}px ${grid * 2}px ${grid}px ${grid * 2}px`,
  margin: `0 ${grid}px 0 0`,
  borderRadius: 999,
  color: "white",

  // change background colour if dragging
  background: isDragging ? "darkorchid" : "indigo",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 20,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: grid,
  overflow: "auto",
});

const App = () => {
  const [items, setItems] = useState<any>(dimensions);
  const [data, setData] = useState<any>({});
  const [allocations, setAllocations] = useState<any>(sampleAllocations);
  const [reset, setReset] = useState<boolean>(false);
  const [disappear, setDisappear] = useState<boolean>(false);
  useEffect(() => {
    setItems(dimensions);
    setAllocations(sampleAllocations);
    setReset(false);
  }, [reset]);

  const shutUp = (itemId: string) => {
    const newItems = JSON.parse(JSON.stringify(items))
    delete newItems[itemId];
    setDisappear(false);
    setItems(newItems);
  };

  const onDragStart = () => {
    setDisappear(true);
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setDisappear(false);
    setItems(newItems);
  };

  const buildTree = (allocs: any, levels: any[]) => {
    if (levels.length === 0) return;
    const newLevels = JSON.parse(JSON.stringify(levels));
    const thisLevel = newLevels.shift();
    const aggs = aggregate(allocs, thisLevel);
    console.log(aggs);
    const dimVals = Object.keys(aggs);
    const results: any = {};
    const result: any = {};
    dimVals.forEach((dv: string) => {
      results[dv] = {};
      results[dv].root = aggs[dv];
      results[dv].children = buildTree(
        allocs.filter((alloc: any) => alloc[thisLevel!] === dv),
        newLevels
      );
    });
    result[thisLevel!] = results;
    console.log(result);
    return result;
  };

  const TreeItem = ({ level, item, value }: any) => {
    console.log(level, item, value);
    return (
      <DimensionBlock
        style={{
          //@ts-ignore
          backgroundColor: dimensions[level].color,
        }}
      >
        <DimensionBlockInner>
          <div>{level}</div>
          <div>{item}</div>
          <div>${value}</div>
        </DimensionBlockInner>
      </DimensionBlock>
    );
  };

  const handleSubmit = () => {
    console.log(data)
    if (
      data.strategy &&
      data.tactic &&
      data.channel &&
      data.publisher &&
      data.amount
    ) {
      console.log("Setting allocations...", data)
      setAllocations([
        ...allocations,
        {
          strategy: data.strategy,
          publisher: data.publisher,
          tactic: data.tactic,
          channel: data.channel,
          amount: data.amount,
        },
      ]);
      setData({})
    }
  };

  const addData = (e: any) => {
    var value;
    if(e.target.name==="amount") {value=parseInt(e.target.value)} else {value=e.target.value};
    setData({ ...data, [e.target.name]:  value});
  };
  console.log(data);

  const TreeLevel = ({ level, items }: any) => {
    return (
      <>
        {Object.keys(items).map((item: any) => {
          const childLevel =
            items[item].children && Object.keys(items[item].children).length > 0
              ? Object.keys(items[item].children)[0]
              : null;
          return (
            <TreeNode
              label={
                <TreeItem level={level} item={item} value={items[item].root} />
              }
            >
              {childLevel && (
                <TreeLevel
                  level={childLevel}
                  items={items[item].children[childLevel]}
                />
              )}
            </TreeNode>
          );
        })}
      </>
    );
  };

  if (!items) return null;
  const tree = buildTree(allocations, Object.keys(items));
  const rootLevel = tree ? Object.keys(tree)[0] : "";
  console.log(items)
  return (
    <>
      <Global
        styles={css`
          .invisible {
            opacity: 0.1 !important;
          }
          .visible {
            opacity: 1;
          }
        `}
      />
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided: any, snapshot: any) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "60px auto 60px 0",
                justifyContent: "space-around",
              }}
            >
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                <Button
                  style={{ marginRight: 10 }}
                  variant="outlined"
                  color="primary"
                  onClick={() => setReset(true)}
                >
                  Reset
                </Button>
                {Object.keys(items).map((item: string, index: number) => {
                  console.log(items, item)
                  return(<Draggable key={item} draggableId={item} index={index}>
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {items[item].content}
                        <CancelOutlined onClick={() => shutUp(item)} />
                      </div>
                    )}
                  </Draggable>
                )})}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div
        className={clsx([disappear && "invisible"])}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "opacity .25s",
          margin: "0 auto",
        }}
      >
        {tree && (
          <Tree
            lineWidth={"2px"}
            lineColor={"green"}
            lineBorderRadius={"10px"}
            label={
              <DimensionBlock
                style={{
                  backgroundColor: "lightgray",
                  display: "flex",
                  flexDirection: "column",
                  margin: "0 auto",
                }}
              >
                <DimensionBlockInner>
                  <div>Campaign</div>
                  <div>Name</div>
                  <div>${aggregate(allocations).total}</div>
                </DimensionBlockInner>
              </DimensionBlock>
            }
          >
            <TreeLevel level={rootLevel} items={tree[rootLevel]} />
          </Tree>
        )}
      </div>

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
              <Select name={dim} id={dim} value={data[dim] || ''} onChange={(e) => addData(e)}>
                {/* @ts-ignore */}
                {dimensions[dim].options.map((opt) => (
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
    </>
  );
};

export default App;
