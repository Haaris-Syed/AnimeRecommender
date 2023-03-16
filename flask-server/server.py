from flask import Flask

from collections import defaultdict
import pandas as pd
import numpy as np
import sklearn as sk
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_absolute_error
import matplotlib.pyplot as plt
import re
import string
import itertools

app = Flask(__name__)

@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

@app.route("/test_data")
def test_data():
    anime_df = pd.read_csv("../datasets/animes.csv")
    anime_df.rename(columns={'title': 'name'}, inplace=True)
    anime_df.drop(['aired', 'ranked', 'img_url', 'link'], axis=1, inplace=True)

    return anime_df['name'].values.tolist()[:50]

if __name__ == "__main__":
    app.run(debug=True)


