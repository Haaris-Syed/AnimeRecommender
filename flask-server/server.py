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

def text_cleaning(text):
    text = re.sub(r'&quot;', '', text)
    text  = "".join([char for char in text if char not in string.punctuation])
    text = re.sub(r'.hack//', '', text)
    text = re.sub(r'&#039;', '', text)
    text = re.sub(r'A&#039;s', '', text)
    text = re.sub(r'I&#039;', 'I\'', text)
    text = re.sub(r'&amp;', 'and', text)
    text = re.sub(r'Â°', '',text)

    return text

# @app.route("/get_anime_df")
# def get_anime_df():
#     anime_df = pd.read_csv("../datasets/animes.csv")

#     # reformat dataframe: removing NaN values and renaming columns, etc.
#     anime_df.rename(columns={'title': 'name'}, inplace=True)
#     anime_df.drop(['aired', 'ranked', 'img_url', 'link'], axis=1, inplace=True)
    
#     anime_df['name'] = anime_df['name'].apply(text_cleaning)

#     anime_df.rename(columns={'uid': 'anime_id', 'score': 'rating'}, inplace=True)
#     anime_df.episodes.replace({'Unknown':np.nan},inplace=True)

#     anime_df.drop_duplicates(subset=['name'], inplace=True)
#     anime_df.dropna(inplace=True)
#     anime_df.reset_index(drop=True, inplace=True)

#     # replace the characters "[]'" with an empty space as the genre column is already of type string
#     anime_df['genre'] = anime_df['genre'].str.replace("'", "", regex=False)
#     anime_df['genre'] = anime_df['genre'].str.replace("[", "", regex=False)
#     anime_df['genre'] = anime_df['genre'].str.replace("]", "", regex=False)

#     return anime_df['name'].values.tolist()[:50]

@app.route("/clean_anime_df")
def clean_anime_df(dataframe):
    # reformat dataframe: removing NaN values and renaming columns, etc.
    dataframe.rename(columns={'title': 'name'}, inplace=True)
    dataframe.drop(['aired', 'ranked', 'img_url', 'link'], axis=1, inplace=True)
    
    dataframe['name'] = dataframe['name'].apply(text_cleaning)

    dataframe.rename(columns={'uid': 'anime_id', 'score': 'rating'}, inplace=True)
    dataframe.episodes.replace({'Unknown':np.nan},inplace=True)

    dataframe.drop_duplicates(subset=['name'], inplace=True)
    dataframe.dropna(inplace=True)
    dataframe.reset_index(drop=True, inplace=True)

    # replace the characters "[]'" with an empty space as the genre column is already of type string
    dataframe['genre'] = dataframe['genre'].str.replace("'", "", regex=False)
    dataframe['genre'] = dataframe['genre'].str.replace("[", "", regex=False)
    dataframe['genre'] = dataframe['genre'].str.replace("]", "", regex=False)

    return dataframe

@app.route("/get_user_ratings_df")
def get_user_ratings_df():
    user_ratings_df = pd.read_csv("../datasets/reviews.csv")

    user_ratings_df.drop(['link', 'text'], axis=1, inplace=True)
    user_ratings_df.rename(columns={'profile': 'user_id'}, inplace=True)

    # turn user profile names (strings) into user ids (integers)
    user_ratings_df.user_id = pd.factorize(user_ratings_df.user_id)[0]

    user_ratings_df['scores'] = user_ratings_df['scores'].str.replace("'", "", regex=False)
    user_ratings_df['scores'] = user_ratings_df['scores'].str.replace("{", "", regex=False)
    user_ratings_df['scores'] = user_ratings_df['scores'].str.replace("}", "", regex=False)
    user_ratings_df['scores'] = [re.sub("[^0-9,]", "", anime) for anime in user_ratings_df['scores']]

    # separate the ratings dictionary into separate columns
    category_ratings_df = user_ratings_df['scores'].str.split(",", expand=True)
    category_ratings_df.columns = ['Overall', 'Story', 'Animation','Sound', 'Character', 'Enjoyment']

    # Finalise the user_ratings_df
    user_ratings_df = pd.concat([user_ratings_df, category_ratings_df], axis=1)
    user_ratings_df.drop(columns=['score', 'scores', 'uid'], inplace=True)
    user_ratings_df.rename(columns={"anime_uid": "anime_id"}, inplace=True)

    user_ratings_df[['Overall', 'Story', 'Animation', 'Sound', 'Character', 'Enjoyment']] = user_ratings_df[
    ['Overall', 'Story', 'Animation', 'Sound', 'Character', 'Enjoyment']].apply(pd.to_numeric)

    return user_ratings_df['Overall'].values.tolist()[:50]

def merge_anime_with_ratings_df(anime_df, user_ratings_df):
    anime_with_ratings_df = pd.merge(anime_df, user_ratings_df, on='anime_id')

    anime_with_ratings_df.drop_duplicates(subset=['user_id', 'name'], inplace=True)
    anime_with_ratings_df.reset_index(drop=True, inplace=True)

    return anime_with_ratings_df

# used in both content-based and collaborative filtering
# removes anime titles of repeating seasons to diversify the recommendations
# E.g. Tokyo Ghoul S1, S2, S3... only have Tokyo Ghoul S1
def get_unique_recommendations(anime_titles, anime_df):
    titles = anime_titles[:]

    # sort all the anime titles so that it is easier to group similar titles
    titles.sort()
    iterator = itertools.groupby(titles, lambda string: string.split(' ')[0])

    grouped_titles = []
    for element, group in iterator:
        grouped_titles.append(list(group))

    # checking for each grouped anime title which one has the highest average rating so that we can recommend
    # that one to the user
    unique_titles = []
    title = ''
    for anime_group in grouped_titles:
        max_rating = 0
        for anime in anime_group:
            anime_index = anime_df[anime_df['name'] == anime].index
            curr_rating = anime_df['rating'].iloc[anime_index[0]]

            if curr_rating > max_rating:
                max_rating = anime_df['rating'].iloc[anime_index[0]]
                title = anime_df['name'].iloc[anime_index[0]]

        unique_titles.append(title)

    return unique_titles

# ============ Content based filtering ============

def get_genre_df(normalised_anime_df):
    weights = {
        'genre': 0.35,
        'members_norm': 0.1,
        'rating_norm': 0.35,
        'popularity_norm': 0.1,
        'episodes_norm': 0.1
    }

    genres_df = normalised_anime_df['genre'].str.get_dummies(sep=', ').astype(int)
    genres_df = genres_df.apply(lambda x : x * weights['genre'])

    return genres_df

def normalise_values(column, maxVal, weight):
    norm_values = [(value / maxVal * weight) for 
    value in normalised_anime_df[column].values]

    return norm_values

# @app.route("/normalised")
def get_normalised_df():#anime_df
    normalised_anime_df = pd.read_csv("../datasets/animes.csv") 
    normalised_anime_df = clean_anime_df(normalised_anime_df)
    # anime_df.copy()
    # 

    weights = {
        'genre': 0.35,
        'members_norm': 0.1,
        'rating_norm': 0.35,
        'popularity_norm': 0.1,
        'episodes_norm': 0.1
    }

    normalised_anime_df['members_norm'] = normalised_anime_df['members'] / normalised_anime_df['members'].max() * weights['members_norm']
    normalised_anime_df['avg_rating_norm'] = normalised_anime_df['rating'] / normalised_anime_df['rating'].max() * weights['rating_norm']
    normalised_anime_df['popularity_norm'] = normalised_anime_df['popularity'] / normalised_anime_df['popularity'].max() * weights['popularity_norm']
    normalised_anime_df['episodes_norm'] = normalised_anime_df['episodes'] / normalised_anime_df['episodes'].max() * weights['episodes_norm']
    
    normalised_anime_df.drop(['members', 'rating', 'popularity', 'episodes'], axis=1, inplace=True)
    
    # # get hot encoding of genres and merge with our main df
    genres_df = get_genre_df(normalised_anime_df)

    # normalised_anime_df.drop('genre', axis=1, inplace=True)
    normalised_anime_df = pd.concat([normalised_anime_df, genres_df], axis=1)

    return normalised_anime_df

def calculate_cosine_similarity(normalised_anime_df, genres_df):
    features = ['members_norm', 'avg_rating_norm', 'popularity_norm', 'episodes_norm'] + genres_df.columns.tolist()

    cosine_sim = cosine_similarity(normalised_anime_df[features], normalised_anime_df[features])

    return cosine_sim

def content_based_recommendations(title, cosine_sim, anime_df, n_recommendations=100):
    indices = pd.Series(anime_df.index, index=anime_df['name']).drop_duplicates()
    
    # Get the index of the anime that matches the title
    index = indices[title]
    
    # Get the pairwise cosine similarity scores for all anime with that index
    sim_scores = list(enumerate(cosine_sim[index]))

    # Sort the anime based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the top 100 most similar anime -> allows us to have more anime so that we are 
    # still able to recommend n_recommendations animes to the user after getting all the unique titles
    sim_scores = sim_scores[1:101]

    # Get the titles of the top 10 most similar anime
    anime_indices = [i[0] for i in sim_scores]
    
    anime_titles = anime_df['name'].iloc[anime_indices].values.tolist()

    # convert to set for constant lookup time
    unique_titles = set(get_unique_recommendations(anime_titles, anime_df))

    recommendations = [i for i in anime_titles if i in unique_titles]

    return recommendations[:n_recommendations+1]

@app.route("/get_cb_recs")
def get_cb_recs():
    # anime_df = get_anime_df()
    anime_df = pd.read_csv("../datasets/animes.csv")
    anime_df = clean_anime_df(anime_df)
    user_ratings_df = get_user_ratings_df()

    # normalised_anime_df = pd.read_csv("../datasets/animes.csv")
    # normalised_anime_df = clean_anime_df(normalised_anime_df)
    # get_normalised_df(anime_df)
    normalised_anime_df = get_normalised_df()
    genres_df = get_genre_df(normalised_anime_df)

    cosine_similarities = calculate_cosine_similarity(normalised_anime_df, genres_df)

    return content_based_recommendations("Death Note", cosine_similarities, anime_df)


# ============ Collaborative filtering ============






if __name__ == "__main__":
    app.run(debug=True)


