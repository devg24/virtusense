
import sys
import json
from noddingpigeon.inference import predict_video


result = predict_video("./recorded_video.mp4")

with open('./result.json', 'w') as f:
    json.dump(result, f)