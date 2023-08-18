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
import requests

openai.api_key = config('OPENAI_KEY')
mongodb_key = config('MONGODB_KEY')
wit_access_token = config('WIT_ACCESS_TOKEN')
wit_api_endpoint = config('WIT_API_ENDPOINT')

app = FastAPI()
client = MongoClient(mongodb_key)
db = client["cetec-chatbot"]

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

@app.post("/gpt")
async def generate_gpt_text(prompt: str):
    completions = openai.ChatCompletion.create(
      model= model_engine,
      temperature=.2,
      top_p=0.3,
      messages=[
        {"role": "user", "content": prompt}
      ]
    )
    db["Prompt"].insert_one(jsonable_encoder({"text": prompt, "date": datetime.utcnow()}))
    message = completions.choices[0]['message']['content']
    return (message)

@app.post("/lstm")
async def generate_lstm_text(prompt: str):


    response = requests.get(wit_api_endpoint, headers = { 'Authorization': f'Bearer {wit_access_token}' }, params = { 'q': prompt.lower() })
    response_json = response.json()
    value = list(response_json['entities'].keys())[0]

    entity = response_json['entities'][value][0]['name']
    role = response_json['entities'][value][0]['role']
    intent = response_json['intents'][0]['name']
    trait = response_json['traits'][list(response_json['traits'].keys())[0]][0]['value']

    entity_text = db["NLU"].find_one({ 'name': entity })['text']
    role_text = db["NLU"].find_one({ 'name': role })['text']
    intent_text = db["NLU"].find_one({ 'name': intent })['text']
    trait_text = db["NLU"].find_one({ 'name': trait })['text']

    ans = entity_text + role_text + intent_text + trait_text

    db["Prompt"].insert_one(jsonable_encoder({"text": prompt, "date": datetime.utcnow()}))

    return (ans)

@app.get("/prompts", response_class=StreamingResponse)
async def export_data():
    prompts = [p['text'] for p in db["Prompt"].find()]
    df = pd.DataFrame({'=============== Chatbot Prompts ===============': prompts})
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    response = StreamingResponse(
        iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=prompts.csv"
    return response
