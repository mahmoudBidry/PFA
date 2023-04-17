const ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"addAdministrator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"addProfessor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"addStudent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"checkPerson","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"enum TranscriptContract.Role","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"createTranscript","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"}],"name":"deletePerson","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"deleteTranscript","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"getTranscript","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"adr","type":"address"},{"internalType":"enum TranscriptContract.Role","name":"role","type":"uint8"}],"name":"updateRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"verifyTranscript","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
const contractAddress = "0xE2d0e16312d5A504508ca2Cd2843ee426a889030";
const GoerliChainId = "0x5"
var connected = false
var currentHash = ""
var account = ""
var contract;

function calculateHash() {
  const pdfInput = document.getElementById("pdfInput");
  const file = pdfInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const pdfData = e.target.result;
      const pdfHash = CryptoJS.SHA256(pdfData).toString();
      const hashResult = document.getElementById("hashResult");
      hashResult.innerText = "The SHA-256 hash of the PDF file is: 0x" + pdfHash;
      currentHash = "0x"+pdfHash
    }
    reader.readAsBinaryString(file);
  }
}

async function connectWallet(){
  if(window.ethereum){
    const currentChainId = await ethereum.request({ method: 'eth_chainId' });
    if(currentChainId != GoerliChainId){
      await switchToGoerli()
    }
    await window.ethereum.send("eth_requestAccounts");
    window.web3 = new Web3(window.ethereum);
  }else {
    window.open("https://metamask.io/download/", "_blank");
    return 
  }
  var accounts = await web3.eth.getAccounts();
  account = accounts[0]     
  document.getElementById("connectButton").innerHTML = truncateAddress(account) 
  contract = await new web3.eth.Contract(ABI, contractAddress)
  connected = true
}

async function switchToGoerli() {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x5' }], // Goerli chain ID
    });
    console.log('Switched to Georli network!');
  } catch (error) {
    console.error('Error switching network:', error);
  }
}

function truncateAddress(address) {
  const start = address.substring(0, 6);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
}

async function addPDFToBlockchain(){
  if(connected && currentHash != ""){
    // const owner = await contract.methods.owner().call()
    // const checkPerson = await contract.methods.checkPerson("0x6B0e66fa75b45870c39C3827d253514133cC0fc0").call()
    // console.log("checkPerson : ", checkPerson)
    try{
      await contract.methods.createTranscript(currentHash).send({from : account})
    }catch(error){
      console.error("error : ", error)
    }
  }else{
    console.log("connect your metamask or upload a PDF and hash it")
  }
}


async function verifyPDF(){
  if(connected && currentHash != ""){
    try{
      const result = await contract.methods.verifyTranscript(currentHash).call()
      console.log('result : ', result)
    }catch(error){
      console.error("error : ", error)
    }
  }else{
    console.log("connect your metamask or upload a PDF and hash it")
  }
}


async function deletePDF(){
  if(connected && currentHash != ""){
    try{
      await contract.methods.deleteTranscript(currentHash).send({from : account})
    }catch(error){
      console.error("error : ", error)
    }
  }else{
    console.log("connect your metamask or upload a PDF and hash it")
  }
}

async function addAdministrator(){

  if(connected){
    var administratorAddress =  document.getElementById("addAdministrator").value

    try{
      await contract.methods.addAdministrator(administratorAddress).send({from : account})
    }catch(error){
      console.error("error : ", error)
    }
  }else{
    console.log("connect your metamask or upload a PDF and hash it")
  }
}