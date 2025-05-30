/**
 * Contracts Controller
 * 
 * This controller handles API routes for managing smart contracts,
 * including creating, analyzing, and deploying contracts.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { runAgent } = require('../../../agent/index');

/**
 * @route GET /api/contracts
 * @desc Get a list of all contracts
 * @access Public
 */
router.get('/', (req, res) => {
  try {
    const contractsDir = path.join(process.cwd(), 'contracts');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
      return res.json({ contracts: [] });
    }
    
    // Read the directory
    const files = fs.readdirSync(contractsDir);
    
    // Filter for Solidity files
    const contracts = files
      .filter(file => file.endsWith('.sol'))
      .map(file => {
        const stats = fs.statSync(path.join(contractsDir, file));
        return {
          name: file.replace('.sol', ''),
          path: `/contracts/${file}`,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      });
    
    res.json({ contracts });
  } catch (error) {
    console.error('Error listing contracts:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route GET /api/contracts/:name
 * @desc Get a specific contract by name
 * @access Public
 */
router.get('/:name', (req, res) => {
  try {
    const { name } = req.params;
    const contractsDir = path.join(process.cwd(), 'contracts');
    const filePath = path.join(contractsDir, `${name}.sol`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Contract ${name} not found`
      });
    }
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    
    res.json({
      name,
      content,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });
  } catch (error) {
    console.error(`Error retrieving contract ${req.params.name}:`, error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/contracts
 * @desc Create a new contract
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, type = 'custom', options = {} } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Contract name is required'
      });
    }
    
    const contractsDir = path.join(process.cwd(), 'contracts');
    const filePath = path.join(contractsDir, `${name}.sol`);
    
    // Check if contract already exists
    if (fs.existsSync(filePath)) {
      return res.status(409).json({
        error: 'Conflict',
        message: `Contract ${name} already exists`
      });
    }
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
    }
    
    // Determine contract template based on type
    let templateContent = '';
    
    switch (type.toLowerCase()) {
      case 'erc20':
        templateContent = getERC20Template(name, options);
        break;
      case 'erc721':
        templateContent = getERC721Template(name, options);
        break;
      case 'erc1155':
        templateContent = getERC1155Template(name, options);
        break;
      case 'custom':
      default:
        templateContent = getCustomTemplate(name, options);
        break;
    }
    
    // Write contract to file
    fs.writeFileSync(filePath, templateContent);
    const stats = fs.statSync(filePath);
    
    res.status(201).json({
      success: true,
      contract: {
        name,
        path: `/contracts/${name}.sol`,
        content: templateContent,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        type
      },
      message: `Contract ${name} created successfully`
    });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route PUT /api/contracts/:name
 * @desc Update an existing contract
 * @access Public
 */
router.put('/:name', (req, res) => {
  try {
    const { name } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Contract content is required'
      });
    }
    
    const contractsDir = path.join(process.cwd(), 'contracts');
    const filePath = path.join(contractsDir, `${name}.sol`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Contract ${name} not found`
      });
    }
    
    // Write the updated content
    fs.writeFileSync(filePath, content);
    const stats = fs.statSync(filePath);
    
    res.json({
      success: true,
      contract: {
        name,
        path: `/contracts/${name}.sol`,
        content,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      },
      message: `Contract ${name} updated successfully`
    });
  } catch (error) {
    console.error(`Error updating contract ${req.params.name}:`, error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route DELETE /api/contracts/:name
 * @desc Delete a contract
 * @access Public
 */
router.delete('/:name', (req, res) => {
  try {
    const { name } = req.params;
    const contractsDir = path.join(process.cwd(), 'contracts');
    const filePath = path.join(contractsDir, `${name}.sol`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Contract ${name} not found`
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: `Contract ${name} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting contract ${req.params.name}:`, error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route POST /api/contracts/:name/analyze
 * @desc Analyze a contract for security issues
 * @access Public
 */
router.post('/:name/analyze', async (req, res) => {
  try {
    const { name } = req.params;
    const contractsDir = path.join(process.cwd(), 'contracts');
    const filePath = path.join(contractsDir, `${name}.sol`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Contract ${name} not found`
      });
    }
    
    // Use the AI agent to analyze the contract
    const result = await runAgent(`Use the ContractAnalyzer tool to analyze the contract at ${filePath}`);
    
    res.json({
      success: true,
      contract: name,
      analysis: result
    });
  } catch (error) {
    console.error(`Error analyzing contract ${req.params.name}:`, error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Contract templates
function getERC20Template(contractName, options = {}) {
  const {
    name = contractName,
    symbol = contractName.substring(0, 4).toUpperCase(),
    decimals = 18,
    initialSupply = '1000000'
  } = options;
  
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${contractName} is ERC20, Ownable {
    constructor() ERC20("${name}", "${symbol}") {
        _mint(msg.sender, ${initialSupply} * 10 ** ${decimals});
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`;
}

function getERC721Template(contractName, options = {}) {
  const {
    name = contractName,
    symbol = contractName.substring(0, 4).toUpperCase(),
    baseURI = ''
  } = options;
  
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ${contractName} is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    string private _baseTokenURI;

    constructor() ERC721("${name}", "${symbol}") {
        _baseTokenURI = "${baseURI}";
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}`;
}

function getERC1155Template(contractName, options = {}) {
  const {
    uri = 'https://token-cdn-domain/{id}.json'
  } = options;
  
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract ${contractName} is ERC1155, Ownable, ERC1155Supply {
    constructor() ERC1155("${uri}") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}`;
}

function getCustomTemplate(contractName, options = {}) {
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title ${contractName}
 * @dev A custom smart contract
 */
contract ${contractName} {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    // Add your custom contract logic here
}`;
}

module.exports = router;