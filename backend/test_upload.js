const fs = require('fs');

async function testUpload() {
  const formData = new FormData();
  formData.append("image", new Blob([fs.readFileSync("C:/Users/ASUS/Desktop/krishi-ai-main/Krishi-AI/public/favicon.ico")]), "favicon.ico");
  
  const response = await fetch("http://localhost:3001/api/analyze", {
    method: "POST",
    body: formData,
  });
  
  const data = await response.json();
  console.log("Result:", data);
}
testUpload();
