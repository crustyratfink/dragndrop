import { Button } from "@material-ui/core";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { reorder } from "../lib/helpers";
import { CancelOutlined } from "@material-ui/icons";


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

export const DragDrop = ({items, setItems, dimensions, setDisappear, setReset}:any) => {

  const shutUp = (itemId: string) => {
    const newItems = JSON.parse(JSON.stringify(items));
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
      dimensions,
      items,
      result.source.index,
      result.destination.index
    );
    setDisappear(false);
    setItems(newItems);
  };
  return(
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
                  console.log(items, item);
                  return (
                    <Draggable key={item} draggableId={item} index={index}>
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
                  );
                })}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
  )
}
export default DragDrop