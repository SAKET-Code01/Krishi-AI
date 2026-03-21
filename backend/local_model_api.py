from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI()

# Configuration
model_name = "Qwen/Qwen3-Coder-Next"

print(f"Loading Model: {model_name}...")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)
print("Model loaded successfully!")

class ChatRequest(BaseModel):
    msg: str

@app.post("/chat")
def chat(request: ChatRequest):
    messages = [
        {"role": "system", "content": "You are Krishi AI, an expert agriculture assistant."},
        {"role": "user", "content": request.msg}
    ]

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    inputs = tokenizer([text], return_tensors="pt").to(model.device)
    output = model.generate(**inputs, max_new_tokens=500)
    
    response = tokenizer.decode(output[0][len(inputs.input_ids[0]):], skip_special_tokens=True)
    
    return {"reply": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
