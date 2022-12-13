import json
from base64 import urlsafe_b64encode, urlsafe_b64decode


def encode_path(path: str):
	return urlsafe_b64encode(bytes(path, 'utf8')).decode('utf8')


def decode_path(path: str):
	return urlsafe_b64decode(path).decode('utf8')


def read_json(path: str):
	with open(path) as file:
		return json.load(file)
