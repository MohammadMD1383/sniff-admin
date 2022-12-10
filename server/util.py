def normalize_path(path: str):
	return "".join([c if c.isalnum() else '-' for c in path])
