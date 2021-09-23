export const comparePaths: (item: any, path: any) => boolean = (item, path) => {
  console.log(item)
  console.log(path)
  return (
    item.strategy === path.strategy &&
    item.tactic === path.tactic &&
    item.publisher === path.publisher &&
    item.channel === path.channel
  );
};

export const reorder = (
  dimensions: any,
  list: any,
  startIndex: number,
  endIndex: number
) => {
  const keys = Object.keys(list);
  const [removed] = keys.splice(startIndex, 1);
  keys.splice(endIndex, 0, removed);
  const newItems: { [k: string]: any } = {};
  keys.forEach((k: string) => (newItems[k] = dimensions[k]));
  return newItems;
};

export const aggregate = (allocations: any[], field: string = "total") => {
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

export const buildTree = (allocs: any, levels: any[], path: any) => {
  if (levels.length === 0) return;
  const newLevels = JSON.parse(JSON.stringify(levels));
  const thisLevel = newLevels.shift();
  const aggs = aggregate(allocs, thisLevel);
  const dimVals = Object.keys(aggs);
  const results: any = {};
  const result: any = {};
  dimVals.forEach((dv: string) => {
    results[dv] = {};
    const newPath = JSON.parse(JSON.stringify(path));
    newPath[thisLevel] = dv;
    results[dv].path = newPath;
    results[dv].root = aggs[dv];
    results[dv].children = buildTree(
      allocs.filter((alloc: any) => alloc[thisLevel!] === dv),
      newLevels,
      newPath
    );
  });
  result[thisLevel!] = results;
  return result;
};
