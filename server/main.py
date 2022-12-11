import json
import os
from base64 import urlsafe_b64decode
from time import time

from fastapi import FastAPI
from starlette.requests import Request

import util

# setup
os.makedirs("reports", exist_ok=True)

app = FastAPI()


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
