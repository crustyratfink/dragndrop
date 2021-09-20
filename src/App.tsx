import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Tree, TreeNode } from "react-organizational-chart";

const dimensions = [
  { id: "strategy", content: "Strategy", color: "rgba(255, 0, 0, 0.12)" },
  { id: "publisher", content: "Publisher", color: "rgba(0, 255, 0, 0.12)" },
  { id: "channel", content: "Channel", color: "rgba(255, 255, 0, 0.12)" },
  { id: "tactic", content: "Tactic", color: "rgba(0, 0, 255, 0.12)" },
];

// const strategies = ["lower funnel", "mid funnel", "upper funnel"];
// const tactics = ["retargeting", "prospecting"];
// const publishers = ["trade desk", "google", "taboola"];
// const channels = ["display", "video"];

const allocations = [
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

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
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
  aggregate(allocations, "publisher");
  const [items, setItems] = useState<any>([]);
  const [reset, setReset] = useState<boolean>(false);
  const [disappear, setDisappear] = useState<boolean>(false);
  useEffect(() => {
    setItems(dimensions);
    setReset(false);
  }, [reset]);

  const shutUp = (itemId: string) => {
    const newItems = items.filter((item: any) => item.id != itemId);
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

  const buildTree = (allocs: any, levels: any) => {
    if (levels.length === 0) return;
    const newLevels = JSON.parse(JSON.stringify(levels));
    const thisLevel = newLevels.shift();
    const aggs = aggregate(allocs, thisLevel.id);
    const dimVals = Object.keys(aggs);
    const results: any = {};
    const result: any = {};
    dimVals.forEach((dv: string) => {
      results[dv] = {};
      results[dv].root = aggs[dv];
      results[dv].children = buildTree(
        allocs.filter((alloc: any) => alloc[thisLevel.id] === dv),
        newLevels
      );
    });
    result[thisLevel.id] = results;
    return result;
  };

  const TreeItem = ({ level, item, value }: any) => (
    <DimensionBlock
      style={{
        backgroundColor: dimensions.filter((dim: any) => dim.id === level)[0]
          .color,
      }}
    >
      <DimensionBlockInner>
        <div>{level}</div>
        <div>{item}</div>
        <div>${value}</div>
      </DimensionBlockInner>
    </DimensionBlock>
  );

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
  const tree = buildTree(allocations, items);
  const rootLevel = tree ? Object.keys(tree)[0] : "";
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
                {items.map((item: any, index: number) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
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
                        {item.content}
                        <CancelOutlined onClick={() => shutUp(item.id)} />
                      </div>
                    )}
                  </Draggable>
                ))}
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
    </>
  );
};

export default App;
