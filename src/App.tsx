import { css, Global } from "@emotion/react";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Allocation, AllocationType } from "./components/Allocation";
import AllocationForm from "./components/AllocationForm";
import DimensionBlock from "./components/DimensionBlock";
import DragDrop from "./components/DragDrop";
import { sampleAllocations, dimensions } from "./lib/data";
import { aggregate, buildTree } from "./lib/helpers";

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

  const deleteAllocation = (target: AllocationType) => {
    console.log(target);
    setAllocations(
      allocations.filter((alloc: AllocationType) => {
        const pass =
          !(target.strategy === alloc.strategy &&
          target.publisher === alloc.publisher &&
          target.tactic === alloc.tactic &&
          target.channel === alloc.channel &&
          target.amount === alloc.amount);
          console.log(pass)
        return pass;
      })
    );
  };

  const TreeItem = ({ level, item, value }: any) => {
    return (
      <DimensionBlock
        color={dimensions[level].color}
        level={level}
        item={item}
        value={value}
      />
    );
  };

  const handleSubmit = () => {
    console.log(data);
    if (
      data.strategy &&
      data.tactic &&
      data.channel &&
      data.publisher &&
      data.amount
    ) {
      console.log("Setting allocations...", data);
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
      setData({});
    }
  };

  const addData = (e: any) => {
    var value;
    if (e.target.name === "amount") {
      value = parseInt(e.target.value);
    } else {
      value = e.target.value;
    }
    setData({ ...data, [e.target.name]: value });
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
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 15%" }}>
      <div>
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
        <DragDrop
          items={items}
          setItems={setItems}
          dimensions={dimensions}
          setDisappear={setDisappear}
          setReset={setReset}
        />
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
                  color="lightgray"
                  level="Campaign"
                  item="Name"
                  value={aggregate(allocations).total}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "0 auto",
                  }}
                />
              }
            >
              <TreeLevel level={rootLevel} items={tree[rootLevel]} />
            </Tree>
          )}
        </div>

        <AllocationForm
          dimensions={dimensions}
          data={data}
          addData={addData}
          handleSubmit={handleSubmit}
        />
      </div>
      <div>
        {allocations.map((alloc: any) => {
          return (
            <div>
              <Allocation
                allocation={alloc}
                deleteAllocation={deleteAllocation}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
