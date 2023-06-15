from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse
import openai
from decouple import config
from pymongo import MongoClient
from bson import ObjectId
from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
import pandas as pd
import io

openai.api_key = config('OPENAI_KEY')
mongodb_key = config('MONGODB_KEY')

app = FastAPI()
client = MongoClient(mongodb_key)
db = client.chatbot

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class PromptModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    text: str = Field(...)
    date: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UpdatePromptModel(BaseModel):
    text: Optional[str]
    date: Optional[str]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_engine = "gpt-3.5-turbo"

@app.post("/generate")
async def generate_text(prompt: str):
    completions = openai.ChatCompletion.create(
      model= model_engine,
      temperature=.2,
      top_p=0.3,
      messages=[
        {"role": "user", "content": prompt}
      ]
    )
    _id = db["prompts"].insert_one(jsonable_encoder({"text": prompt, "date": datetime.utcnow()}))
    # Print the generated text
    message = completions.choices[0]['message']['content']
    return (message)

@app.get("/prompts", response_class=StreamingResponse)
async def export_data():
    prompts = [p['text'] for p in db["prompts"].find()]

    df = pd.DataFrame({'=============== Chatbot Prompts ===============': prompts})
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    response = StreamingResponse(
        iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=prompts.csv"
    return response
