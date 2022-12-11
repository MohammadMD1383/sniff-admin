from base64 import urlsafe_b64encode


def encode_path(path: str):
	return urlsafe_b64encode(bytes(path, 'utf8')).decode('utf8')
