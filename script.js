function calculateHash() {
  const pdfInput = document.getElementById("pdfInput");
  const file = pdfInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const pdfData = e.target.result;
      const pdfHash = CryptoJS.SHA256(pdfData).toString();
      const hashResult = document.getElementById("hashResult");
      hashResult.innerText = "The SHA-256 hash of the PDF file is: " + pdfHash;
    }
    reader.readAsBinaryString(file);
  }
}
