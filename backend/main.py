from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse
import openai
from decouple import config
from pymongo import MongoClient
from datetime import datetime
import pandas as pd
import io
import requests

mongodb_key = config('MONGODB_KEY')
wit_access_token = config('WIT_ACCESS_TOKEN')
wit_api_endpoint = config('WIT_API_ENDPOINT')
openai.api_key = config('OPENAI_KEY')

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins = ['*'], allow_credentials = True, allow_methods = ['*'], allow_headers = ['*'])
client = MongoClient(mongodb_key)
db = client['cetec-chatbot']

def build_answer(entity, role, intent, trait):
    structures = [entity, role, intent, trait]
    answer = ''
    for text in structures:
        if text[-1] == ' ':
            text = text[0:-1]
        if text[-1] == ' ':
            text = text[0:-1]
        if text[-1] != '.':
            text = text + '.'
        text = text + ' '
        text = text[0].upper() + text[1:]
        for i in range(0, len(text)-1):
            if text[i] == '.' and text[i+1] == ' ' and i+2 != len(text):
                text = text[:i+2] + text[i+2].upper() + text[i+3:]
            if i != 0 and text[i] == ' ' and text [i-1] == ' ':
                text = text[:i] + text[i+1:]
                i = i-1
        answer += text
    return answer

@app.post('/gpt')
async def generate_gpt_text(prompt: str):
    model_engine = 'gpt-3.5-turbo'
    completions = openai.ChatCompletion.create(model = model_engine, temperature = .2, top_p = 0.3, messages = [{'role': 'user', 'content': prompt}])
    db['Prompt'].insert_one(jsonable_encoder({'text': prompt, 'date': datetime.utcnow()}))
    message = completions.choices[0]['message']['content']
    return (message)

@app.post('/lstm')
async def generate_lstm_text(prompt: str):
    response = requests.get(wit_api_endpoint, headers = { 'Authorization': f'Bearer {wit_access_token}' }, params = { 'q': prompt.lower() }).json()
    entity = response['entities'][list(response['entities'].keys())[0]][0]['name']
    role = response['entities'][list(response['entities'].keys())[0]][0]['role']
    intent = response['intents'][0]['name']
    trait = response['traits'][list(response['traits'].keys())[0]][0]['value']
    entity_text = db['NLU'].find_one({ 'name': entity })['text']
    role_text = db['NLU'].find_one({ 'name': role })['text']
    intent_text = db['NLU'].find_one({ 'name': intent })['text']
    trait_text = db['NLU'].find_one({ 'name': trait })['text']
    ans = build_answer(entity_text, role_text, intent_text, trait_text)
    db['Prompt'].insert_one(jsonable_encoder({'text': prompt, 'date': datetime.utcnow()}))
    return (ans)

@app.get('/prompts', response_class=StreamingResponse)
async def export_data():
    prompts = [p['text'] for p in db['Prompt'].find()]
    df = pd.DataFrame({'=============== Chatbot Prompts ===============': prompts})
    stream = io.StringIO()
    df.to_csv(stream, index = False)
    response = StreamingResponse(iter([stream.getvalue()]), media_type='text/csv')
    response.headers['Content-Disposition'] = 'attachment; filename=prompts.csv'
    return response
