// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
contract HelloWorld{
    string private usermessage;
    constructor(string memory message) {
        usermessage = message;
    }
    function setUserMessage(string memory message) public {
        usermessage = message;
    }
    function getUserMessage() public view returns(string memory){
        return usermessage;
    }
}