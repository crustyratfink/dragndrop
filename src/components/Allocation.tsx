import styled from "@emotion/styled";
import { Button } from "@material-ui/core";
import * as React from "react";

export interface AllocationType {
  strategy: string;
  publisher: string;
  tactic: string;
  channel: string;
  amount: number;
}

export interface AllocationProps {
  allocation: AllocationType;
  deleteAllocation: any;
}

const AllocBlock = styled.div`
  font-size: 10pt;
  margin-top: 5px;
  border: thin gray solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
`;
const Item = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
`;
const Header = styled.div`
  font-weight: bolder;
  justify-self: flex-end;
`;

export const Allocation = ({
  allocation,
  deleteAllocation,
}: AllocationProps) => {
  const { strategy, publisher, tactic, channel, amount } = allocation;
  return (
    <AllocBlock>
      <Item>
        <Header>Strategy: </Header>
        <div>{strategy}</div>
      </Item>
      <Item>
        <Header>Publisher: </Header>
        <div>{publisher}</div>
      </Item>
      <Item>
        <Header>Tactic: </Header>
        <div>{tactic}</div>
      </Item>
      <Item>
        <Header>Channel: </Header>
        <div>{channel}</div>
      </Item>
      <Item>
        <Header>Amount: </Header>
        <div>${amount}</div>
      </Item>
      <Button
        onClick={() => deleteAllocation(allocation)}
        style={{ padding: 0, fontSize: 10, margin: 4 }}
        variant="outlined"
      >
        Delete
      </Button>
    </AllocBlock>
  );
};
