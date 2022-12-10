import json
import os
from time import time

import util

from fastapi import FastAPI

# setup
os.makedirs("reports", exist_ok=True)

app = FastAPI()


@app.post("/report")
async def report(data: dict):
	user_path = f"reports/{util.normalize_path(data['userinfo'])}"
	os.makedirs(user_path, exist_ok=True)
	report_json = json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))
	time_now = int(time() * 1000)
	
	with open(f'{user_path}/{time_now}.json', 'w') as f:
		f.write(report_json)
