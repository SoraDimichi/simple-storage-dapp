// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract SimpleStorage {
    uint256 public favoriteNumber;

    function store(uint256 x) public {
        favoriteNumber = x;
    }

    function get() public view returns (uint256) {
        return favoriteNumber;
    }
}
