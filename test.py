import requests

url = "http://127.0.0.1:5000/predict"
data = {"text": "This is a biased article."}
response = requests.post(url, json=data)

print(response.json())  # Should print the bias detection result
