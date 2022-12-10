import os

from fastapi import FastAPI

# setup
os.makedirs("reports")

app = FastAPI()


@app.get("/report")
async def report(data: dict):
	print(data)
