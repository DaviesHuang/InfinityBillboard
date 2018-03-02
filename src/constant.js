export const abi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "slots",
        "outputs": [
            {
                "name": "price",
                "type": "uint256"
            },
            {
                "name": "owner",
                "type": "address"
            },
            {
                "name": "description",
                "type": "string"
            },
            {
                "name": "image_url",
                "type": "string"
            },
            {
                "name": "link",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "slotID",
                "type": "uint256"
            }
        ],
        "name": "getSlot",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "creator",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "slotID",
                "type": "uint256"
            },
            {
                "name": "description",
                "type": "string"
            },
            {
                "name": "image_url",
                "type": "string"
            },
            {
                "name": "link",
                "type": "string"
            }
        ],
        "name": "buySlot",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "getFunds",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
];
