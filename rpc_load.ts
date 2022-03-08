// import * as http from 'http';
// import * as https from 'https';
import fetch from "node-fetch";

import { readFileSync } from "fs";

// Contains the eth_call data payloads (variable)
const dataPayloads = readFileSync("./output.log").toString().split("\n");
// Contains the eth_call overrides bytecode (constant)
const overrideBytecode = JSON.parse(
  readFileSync("./override_bytecode").toString()
);

const toAddress = "0x5555555555555555555555555555555555555555";

const buildRequestPayload = (data: string, bytecode: string) => {
  return {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_call",
    params: [
      {
        to: toAddress,
        data,
        gas: "0x1dcd6500",
      },
      "latest",
      { [toAddress]: { code: bytecode } },
    ],
  };
};

const randomRequestAsync = async () => {
  const index = Math.floor(Math.random() * dataPayloads.length);
  const body = JSON.stringify(
    buildRequestPayload(JSON.parse(dataPayloads[index]).data, overrideBytecode)
  );
  const timeBefore = performance.now();
  const response = await fetch(process.env.ETHEREUM_RPC_URL!, {
    method: "POST",
    headers: {},
    body,
    compress: true,
  });
  const timeAfter = performance.now();
  const text = await response.text();
  if (response.ok) {
    console.log(`timing: ${timeAfter - timeBefore}`);
  } else {
    console.log(text);
  }
};

(async () => {
  await randomRequestAsync();
})();
