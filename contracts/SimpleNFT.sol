// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleNFT {
  address public owner;
  constructor() { owner = msg.sender; }
}