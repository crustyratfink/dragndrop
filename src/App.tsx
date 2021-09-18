import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@material-ui/core";
import { ArrowDownward, FormatAlignRightSharp } from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const dimensions = [
  { id: "strategy", content: "Strategy", color: "rgba(255, 0, 0, 0.12)" },
  { id: "publisher", content: "Publisher", color: "rgba(0, 255, 0, 0.12)" },
  { id: "channel", content: "Channel", color: "rgba(255, 255, 0, 0.12)" },
  { id: "tactic", content: "Tactic", color: "rgba(0, 0, 255, 0.12)" },
];

const strategies = ["lower funnel", "mid funnel", "upper funnel"];
const tactics = ["retargeting", "prospecting"];
const publishers = ["trade desk", "google", "taboola"];
const channels = ["display", "video"];

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

const aggregate = (allocations: any[], field: string) => {
  const aggs = allocations.reduce((agg: any, alloc: any) => {
    agg[alloc[field]] = (agg[alloc[field]] ?? 0) + alloc.amount;
    return agg;
  }, {});
  return aggs;
};

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: `${grid}px ${grid * 2}px ${grid}px ${grid * 2}px`,
  margin: `0 ${grid}px 0 0`,
  borderRadius: 999,
  color: "white",
  // change background colour if dragging
  background: isDragging ? "darkorchid" : "indigo",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: grid,
  overflow: "auto",
});

const App = (props: any) => {
  aggregate(allocations, "publisher");
  const [items, setItems] = useState<any>([]);
  const [reset, setReset] = useState<boolean>(false);
  const [disappear, setDisappear] = useState<boolean>(false);
  useEffect(() => {
    setItems(dimensions);
    setReset(false);
  }, [reset]);

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

    console.log(newItems);
    setDisappear(false);
    setItems(newItems);
  };

  const DimensionBlock = styled.div`
    text-decoration: none;
    color: #000;
    margin: 20px;
    background: #ffc;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 5em;
    width: 8em;
    padding: 1em;
    box-shadow: 3px 4px 6px rgba(33, 33, 33, 0.7);
  `;

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  if (!items) return null;
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
                margin: "0 auto",
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
        {items.map((item: any, key: number) => {
          const aggs = aggregate(allocations, item.id);
          return (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {Object.keys(aggs).map((agg: any) => (
                <DimensionBlock
                  style={{
                    backgroundColor: item.color,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>{item.content}</div>
                  <div>{agg}</div>
                  <div>${aggs[agg]}</div>
                </DimensionBlock>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;

//{//key < items.length - 1 && <ArrowDownward fontSize="large" />}
