import json
import os
from base64 import urlsafe_b64decode
from time import time

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request

import util

# setup
os.makedirs("reports", exist_ok=True)

app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_credentials=True,
	allow_origins=["*"],
	allow_methods=["*"],
	allow_headers=["*"]
)


@app.post("/report")
async def report(enc_data: Request):
	data = json.loads(urlsafe_b64decode(await enc_data.body()).decode('utf8'))
	user_path = f"reports/{util.encode_path(data['userinfo'])}"
	os.makedirs(user_path, exist_ok=True)
	report_json = json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))
	time_now = int(time() * 1000)
	
	with open(f'{user_path}/{time_now}.json', 'w') as f:
		f.write(report_json)
	
	return {"status": "success"}


@app.get("/reports")
async def reports(request: Request):
	if request.client.host != '127.0.0.1':
		return
	
	result = {}
	_, directories, _ = next(os.walk("reports"))
	
	for d in directories:
		_, _, files = next(os.walk(f"reports/{d}"))
		
		result[util.decode_path(d)] = []
		for f in files:
			j = util.read_json(f"reports/{d}/{f}")
			j["servertime"] = int(f.split('.')[0])
			result[util.decode_path(d)].append(j)
	
	return result
