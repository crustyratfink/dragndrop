import styled from "@emotion/styled";

const DimensionBlockOuter = styled.div`
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

export interface DimensionBlockProps {
  color: string;
  level: string;
  item: string;
  value: number;
  style?: any;
}

export const DimensionBlock = ({
  color,
  level,
  item,
  value,
  style={}
}: DimensionBlockProps) => (
  <DimensionBlockOuter
    style={{
      ...style,
      //@ts-ignore
      backgroundColor: color,
    }}
  >
    <DimensionBlockInner>
      <div>{level}</div>
      <div>{item}</div>
      <div>${value}</div>
    </DimensionBlockInner>
  </DimensionBlockOuter>
);

export default DimensionBlock;
