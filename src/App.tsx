import { css, Global } from "@emotion/react";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Allocation, AllocationType } from "./components/Allocation";
import AllocationForm from "./components/AllocationForm";
import DimensionBlock from "./components/DimensionBlock";
import DragDrop from "./components/DragDrop";
import { sampleAllocations, dimensions } from "./lib/data";
import { aggregate, buildTree, comparePaths } from "./lib/helpers";
import _ from "lodash";
import { MoreHoriz } from "@material-ui/icons";
import language from "./lib/language";
import { Typography } from "@material-ui/core";
import nlp from "compromise";

const App = () => {
  const [items, setItems] = useState<any>(dimensions);
  const [parked, setParked] = useState<any>();
  const [data, setData] = useState<any>({});
  const [allocations, setAllocations] = useState<any>(sampleAllocations);
  const [reset, setReset] = useState<boolean>(false);
  const [disappear, setDisappear] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<any[]>([]);
  const [phrase, setPhrase] = useState<string>("Generating...");

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };
  const generatePhrase = () => {
    const { adjectives, nouns, verbs, adverbs } = language;
    var gerund = nlp(verbs[getRandomInt(verbs.length)]).verbs().toGerund().out()
    while(!gerund) {
      gerund = nlp(verbs[getRandomInt(verbs.length)]).verbs().toGerund().out()
    }
    return `RainONE: ${_.upperFirst(
      adverbs[getRandomInt(adverbs.length)]
    )} ${nlp(verbs[getRandomInt(verbs.length)]).verbs().toGerund().out()} ${
      adjectives[getRandomInt(adjectives.length)]
    } ${nouns[getRandomInt(nouns.length)]} since 2020.`;
  };
  useEffect(() => {
    setPhrase(generatePhrase());
    setItems(dimensions);
    setAllocations(sampleAllocations);
    setReset(false);
  }, [reset]);

  const collapse = (path: any, hide: boolean = false) => {
    setDisappear(true);
    console.log(path, collapsed);
    setTimeout(() => {
      if (!hide) {
        const newCollapsed = _.cloneDeep(collapsed);
        _.remove(newCollapsed, (i: any) => comparePaths(i, path));
        setCollapsed(newCollapsed);
      } else {
        setCollapsed([...collapsed, path]);
      }
      setDisappear(false);
    }, 250);
  };

  const deleteAllocation = (target: AllocationType) => {
    setAllocations(
      allocations.filter((alloc: AllocationType) => {
        const pass = !(
          target.strategy === alloc.strategy &&
          target.publisher === alloc.publisher &&
          target.tactic === alloc.tactic &&
          target.channel === alloc.channel
        );
        return pass;
      })
    );
  };

  const handleSubmit = (newData: any) => {
    var submitData: any = {};
    if (newData) {
      submitData = JSON.parse(JSON.stringify(newData));
    } else {
      submitData = JSON.parse(JSON.stringify(data));
    }
    if (
      submitData.strategy &&
      submitData.tactic &&
      submitData.channel &&
      submitData.publisher &&
      submitData.amount
    ) {
      const newAllocations = [
        ...allocations,
        {
          id: allocations.length + 1,
          strategy: submitData.strategy,
          publisher: submitData.publisher,
          tactic: submitData.tactic,
          channel: submitData.channel,
          amount: submitData.amount,
        },
      ];
      setAllocations(newAllocations);
      setData({});
    }
  };

  const addData = (name: string, inputValue: string) => {
    var value;
    if (name === "amount") {
      value = parseInt(inputValue);
    } else {
      value = inputValue;
    }
    setData({ ...data, [name]: value });
  };

  const updateAllocation = (id: number, newValue: any) => {
    const others = allocations.filter((f: any) => f.id !== id);
    const target = allocations.find((f: any) => f.id === id);
    const newTarget = { ...target, ...newValue };
    const newAllocations = [...others, newTarget];
    console.log(target);
    console.log(others);
    console.log(newAllocations);
    setAllocations(newAllocations);
  };

  console.log(collapsed);

  const TreeLevel = ({ level, items }: any) => {
    console.log(items);
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
                <DimensionBlock
                  updateAllocation={updateAllocation}
                  ids={items[item].allocations}
                  allocations={allocations}
                  level={level}
                  item={item}
                  value={items[item].root}
                  path={items[item].path}
                  color={dimensions[level].color}
                  handleSubmit={handleSubmit}
                  deleteAllocation={deleteAllocation}
                  collapse={collapse}
                  collapsed={collapsed}
                  hasChildren={!!childLevel}
                  options={dimensions[level].options}
                />
              }
            >
              {childLevel &&
                (!!_.find(collapsed, (i: any) =>
                  comparePaths(i, items[item].path)
                ) ? (
                  <div style={{ placeSelf: "center", width: "100%" }}>
                    <MoreHoriz />
                  </div>
                ) : (
                  <TreeLevel
                    level={childLevel}
                    items={items[item].children[childLevel]}
                  />
                ))}
            </TreeNode>
          );
        })}
      </>
    );
  };

  if (!items) return null;
  const tree = buildTree(allocations, Object.keys(items), []);
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
        <Typography variant="h4">{phrase}</Typography>
        <DragDrop
          items={items}
          parked={parked}
          setParked={setParked}
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
                  ids={[]}
                  options={[]}
                  allocations={allocations}
                  color="lightgray"
                  level="Campaign"
                  item="Name"
                  value={aggregate(allocations).total}
                  path={{}}
                  deleteAllocation={deleteAllocation}
                  handleSubmit={handleSubmit}
                  collapse={collapse}
                  collapsed={collapsed}
                  hasChildren={false}
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

        {/* <AllocationForm
          dimensions={dimensions}
          data={data}
          addData={addData}
          handleSubmit={handleSubmit}
        /> */}
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
