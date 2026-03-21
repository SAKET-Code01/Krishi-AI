const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ADITYA\\.gemini\\antigravity\\brain\\026adfe0-0577-48cb-add1-ca2c4f36d582';

// 1. Find the newest image file in the brain directory
const files = fs.readdirSync(brainDir)
  .filter(f => f.match(/\.(png|jpg|jpeg|webp)$/i))
  .map(f => ({
    name: f,
    time: fs.statSync(path.join(brainDir, f)).mtime.getTime()
  }))
  .sort((a, b) => b.time - a.time); // newest first

if (files.length === 0) {
  console.error("No images found!");
  process.exit(1);
}

const newestImage = path.join(brainDir, files[0].name);
console.log(`Analyzing newest image: ${files[0].name}...`);

// 2. Read image as Base64
const imageBuffer = fs.readFileSync(newestImage);
const base64Image = imageBuffer.toString('base64');
const ext = path.extname(newestImage).substring(1);
const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

const prompt = "Analyze this image and provide a JSON response exactly matching this format: { \"disease\": \"disease name\", \"confidence\": 95, \"symptoms\": [\"symptom 1\"], \"treatment\": [\"treatment 1\"], \"fertilizers\": [\"fertilizer 1\"] }. Respond ONLY with valid JSON.";

// 3. Send to local Krishi-AI backend
fetch("http://localhost:3001/api/vision", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: prompt,
    imageBase64: base64Image,
    mimeType: mimeType
  })
})
.then(res => {
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  return res.json();
})
.then(data => {
  console.log("\n✅ BACKEND RESPONSE SUCCESSFUL!");
  console.log("===============================");
  console.log(data.text);
  
  // Write to artifact for user display
  const cleanJson = data.text.replace(/```json|```/g, "").trim();
  let obj = JSON.parse(cleanJson);
  
  const content = `
# Crop Doctor Analysis Result

Here is the exact API result returned by the new Hugging Face + Groq pipeline for the leaf image you provided!

**Disease Detected**: ${obj.disease}
**Confidence Level**: ${obj.confidence}%

### Symptoms Identified
${obj.symptoms.map(s => `- ${s}`).join('\n')}

### Recommended Treatment
${obj.treatment.map(t => `- ${t}`).join('\n')}

### Suggested Fertilizers
${obj.fertilizers.map(f => `- ${f}`).join('\n')}

![Analyzed Leaf Image](file:///${newestImage.replace(/\\/g, '/')})
  `;
  
  fs.writeFileSync(path.join(brainDir, 'analysis_result.md'), content);
  console.log("Wrote artifact to analysis_result.md successfully!");
})
.catch(err => {
  console.error("\n❌ BACKEND REQUEST FAILED:");
  console.error(err);
});
