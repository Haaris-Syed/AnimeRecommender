from flask import Flask, request, session, jsonify

from collections import defaultdict
import pandas as pd
import numpy as np
import sklearn as sk
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from scipy.sparse import csr_matrix
import re
import string
import itertools

app = Flask(__name__)

# ============ Declaring global values/dataframes ============

overall_pivot = None
story_pivot = None
animation_pivot = None
character_pivot = None

overall_similarities_df = None
story_similarities_df = None
animation_similarities_df = None
character_similarities_df = None

combined_category_ratings_pivot = None

content_weight = 0.4
collaborative_weight = 0.6

# ============ Generic Helper Functions ============
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

def process_anime_df():
    anime_df = pd.read_csv("../datasets/animes.csv")

    # reformat dataframe: removing NaN values and renaming columns, etc.
    anime_df.rename(columns={'title': 'name'}, inplace=True)
    anime_df.drop(['aired', 'ranked', 'img_url', 'link'], axis=1, inplace=True)
    
    anime_df['name'] = anime_df['name'].apply(text_cleaning)

    anime_df.rename(columns={'uid': 'anime_id', 'score': 'rating'}, inplace=True)
    anime_df.episodes.replace({'Unknown':np.nan},inplace=True)

    anime_df.drop_duplicates(subset=['name'], inplace=True)
    anime_df.dropna(inplace=True)
    anime_df.reset_index(drop=True, inplace=True)

    # replace the characters "[]'" with an empty space as the genre column is already of type string
    anime_df['genre'] = anime_df['genre'].str.replace("'", "", regex=False)
    anime_df['genre'] = anime_df['genre'].str.replace("[", "", regex=False)
    anime_df['genre'] = anime_df['genre'].str.replace("]", "", regex=False)

    return anime_df

def process_ratings_df():
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

    return user_ratings_df

def get_merged_df(anime_df, user_ratings_df): 
    anime_with_ratings_df = pd.merge(anime_df, user_ratings_df, on='anime_id')

    anime_with_ratings_df.drop_duplicates(subset=['user_id', 'name'], inplace=True)
    anime_with_ratings_df.reset_index(drop=True, inplace=True)

    return anime_with_ratings_df

# hot-encoding of categorical data
def get_genre_df(normalised_anime_df, genre_weight=0.4):
    genres_df = normalised_anime_df['genre'].str.get_dummies(sep=', ').astype(int)
    genres_df = genres_df.apply(lambda x : x * genre_weight)

    return genres_df

def get_normalised_df():
    global anime_df, feature_weights

    normalised_anime_df = anime_df.copy()

    members_min_val = normalised_anime_df['members'].min()
    members_max_val = normalised_anime_df['members'].max()

    ratings_min_val = normalised_anime_df['rating'].min()
    ratings_max_val = normalised_anime_df['rating'].max()

    popularity_min_val = normalised_anime_df['popularity'].min()
    popularity_max_val = normalised_anime_df['popularity'].max()

    episodes_min_val = normalised_anime_df['episodes'].min()
    episodes_max_val = normalised_anime_df['episodes'].max()

    normalised_anime_df['members_norm'] = (normalised_anime_df['members'] - members_min_val) / (members_max_val - members_min_val) * feature_weights['members_norm']
    normalised_anime_df['avg_rating_norm'] = (normalised_anime_df['rating'] - ratings_min_val) / (ratings_max_val - ratings_min_val) * feature_weights['rating_norm']
    normalised_anime_df['popularity_norm'] = (normalised_anime_df['popularity'] - popularity_min_val) / (popularity_max_val - popularity_min_val) * feature_weights['popularity_norm']
    normalised_anime_df['episodes_norm'] = (normalised_anime_df['episodes'] - episodes_min_val) / (episodes_max_val - episodes_min_val) * feature_weights['episodes_norm']
    
    normalised_anime_df.drop(['members', 'rating', 'popularity', 'episodes'], axis=1, inplace=True)
    
    # # get hot encoding of genres and merge with our main df
    genres_df = get_genre_df(normalised_anime_df, feature_weights['genre'])

    normalised_anime_df = pd.concat([normalised_anime_df, genres_df], axis=1)

    return normalised_anime_df

def set_feature_weights(genre_weight=0.3, members_weight=0.1, rating_weight=0.4, popularity_weight=0.1, episodes_weight=0.1):
    global feature_weights

    total_weight = genre_weight + members_weight + rating_weight + popularity_weight + episodes_weight

    feature_weights = {
        'genre': float(genre_weight / total_weight),
        'members_norm': float(members_weight / total_weight),
        'rating_norm': float(rating_weight / total_weight),
        'popularity_norm': float(popularity_weight / total_weight),
        'episodes_norm': float(episodes_weight / total_weight),
    }

    return feature_weights

# used in both content-based and collaborative filtering
# removes anime titles of repeating seasons to diversify the recommendations
# E.g. Tokyo Ghoul S1, S2, S3... only have Tokyo Ghoul S1
def get_unique_recommendations(anime_titles):
    global anime_df

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
def get_anime_clusters():
    global normalised_anime_df, genres_df

    features = ['members_norm', 'avg_rating_norm', 'popularity_norm', 'episodes_norm'] + genres_df.columns.tolist()

    pca_anime_df = normalised_anime_df[features].copy()

    # perform PCA to extract principal components
    pca = PCA(n_components=30)
    pca_result = pca.fit_transform(pca_anime_df)

    # perform K-means clustering to group similar items
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    kmeans.fit(pca_result)
    anime_clusters_after_pca = kmeans.predict(pca_result)

    return anime_clusters_after_pca

def content_based_recommendations(title, data, n_recommendations=100):
    # retrieve the index of the anime title from our main dataframe
    # and find the cluster this anime title is in
    anime_index = anime_df[anime_df['name'] == title].index[0]
    anime_cluster = data[anime_index]

    # gather similar anime titles within the same cluster
    similar_anime_indexes = [i for i, cluster in enumerate(data) if cluster == anime_cluster and i != anime_index]
    similar_anime = anime_df.iloc[similar_anime_indexes]['name'].tolist()

    unique_titles = set(get_unique_recommendations(similar_anime))
    
    recommendations = [i for i in similar_anime if i in unique_titles]
    
    return recommendations[:n_recommendations+1]

def get_content_based_recommendations(anime_title):
    global anime_cluster_with_pca

    return content_based_recommendations(anime_title, anime_cluster_with_pca)


# ============ Collaborative filtering ============
def set_rating_weights(overall_weight=0.5, story_weight=0.3, animation_weight=0.1, character_weight=0.1):
    global rating_weights

    # normalise the weights so that they add up to 1
    # this way we are able to maintain the relative importance of each
    # feature whilst the user scales the weights to their liking.
    total_weight = overall_weight + story_weight + animation_weight + character_weight

    rating_weights = {
        'overall_weight' : float(overall_weight / total_weight), 
        'story_weight' : float(story_weight / total_weight), 
        'animation_weight' : float(animation_weight / total_weight),
        'character_weight': float(character_weight / total_weight),
    }

    return rating_weights
    
# creates our user-item matrices needed to compute similarity
def create_pivot_table(data, value):
    pivot_table = data.pivot_table(index='user_id', columns='name', values=value)
    pivot_table.fillna(0, inplace=True)

    return pivot_table

def calculate_similarities(pivot_table):
    sparse_pivot = csr_matrix(pivot_table)
    similarities = cosine_similarity(sparse_pivot.T)
    similarities_df = pd.DataFrame(similarities, index=pivot_table.columns, columns=pivot_table.columns)

    return similarities_df

def create_pivots_for_rating_categories():
    global anime_with_ratings_df

    overall_pivot = create_pivot_table(anime_with_ratings_df, 'Overall')
    story_pivot = create_pivot_table(anime_with_ratings_df, 'Story')
    animation_pivot = create_pivot_table(anime_with_ratings_df, 'Animation')
    character_pivot = create_pivot_table(anime_with_ratings_df, 'Character')

    return overall_pivot, story_pivot, animation_pivot, character_pivot

def get_similarities_for_category_ratings(overall_pivot, story_pivot, animation_pivot, character_pivot):

    overall_similarities_df = calculate_similarities(overall_pivot)
    story_similarities_df = calculate_similarities(story_pivot)
    animation_similarities_df = calculate_similarities(animation_pivot)
    character_similarities_df = calculate_similarities(character_pivot)

    return overall_similarities_df, story_similarities_df, animation_similarities_df, character_similarities_df

def create_category_ratings_pivot(overall_similarities_df, story_similarities_df, 
animation_similarities_df, character_similarities_df):
    global rating_weights

    combined_category_ratings_pivot = ((overall_similarities_df * rating_weights['overall_weight']) + (story_similarities_df * rating_weights['story_weight']) + (animation_similarities_df * rating_weights['animation_weight']) + (character_similarities_df * rating_weights['character_weight']))

    return combined_category_ratings_pivot

def collaborative_filtering_recommendations(anime, combined_category_ratings_pivot, n=100):
    # retrieving the similarity scores of the specified anime title
    similarity_scores = combined_category_ratings_pivot[anime]
    similarity_scores = similarity_scores.sort_values(ascending=False)

    similar_anime = similarity_scores.iloc[1:n+1].index.tolist()

    unique_titles = set(get_unique_recommendations(similar_anime))

    recommendations = [i for i in similar_anime if i in unique_titles]

    return recommendations

def get_collaborative_filtering_recommendations(anime_title):
    global combined_category_ratings_pivot

    return collaborative_filtering_recommendations(anime_title, combined_category_ratings_pivot)

# ============ Hybrid Recommendations ============

def combined_recommendations(anime_name, num_recommendations=50):
    global combined_category_ratings_pivot, content_weight, collaborative_weight
    
    content_based = get_content_based_recommendations(anime_name)
    collaborative_filtering = get_collaborative_filtering_recommendations(anime_name)

    # removing anime titles that may no longer exist within our dataframe as some were removed after the initial
    # anime_df and user_ratings_df dataframes were merged together
    content_based_animes = []

    for i in content_based:
        if i in combined_category_ratings_pivot.index:
            content_based_animes.append(i)

    collaborative_based_animes = []

    for i in collaborative_filtering:
        if i in combined_category_ratings_pivot.index:
            collaborative_based_animes.append(i)

    # retrieve the similarity scores for the anime titles in each recommendation list 
    content_based_scores = combined_category_ratings_pivot.loc[content_based_animes]
    collaborative_filtering_scores = combined_category_ratings_pivot.loc[collaborative_based_animes]

    # create weighted scores for all the animes using both the values generated from content based and collaborative filtering methods
    scores = content_based_scores.mul(content_weight).add(collaborative_filtering_scores.mul(collaborative_weight), fill_value=0)
    
    weighted_scores = scores[anime_name].sort_values(ascending=False)
    return weighted_scores.head(num_recommendations).index.tolist()

@app.route("/get_hybrid_recs")
def get_hybrid_recs():
    anime_title = request.args.get('query')
    
    return combined_recommendations(anime_title)

def load_data():
    global anime_df, user_ratings_df, anime_with_ratings_df, normalised_anime_df, genres_df, anime_cluster_with_pca, website_anime_df
    global combined_category_ratings_pivot
    
    # content-based dataframes
    anime_df = process_anime_df()
    user_ratings_df = process_ratings_df()
    anime_with_ratings_df = get_merged_df(anime_df, user_ratings_df)
    feature_weights = set_feature_weights()
    normalised_anime_df = get_normalised_df()
    genres_df = get_genre_df(normalised_anime_df)
    anime_cluster_with_pca = get_anime_clusters()

    # collaborative based dataframes
    rating_weights = set_rating_weights()
    overall_pivot = create_pivot_table(anime_with_ratings_df, 'Overall')
    story_pivot = create_pivot_table(anime_with_ratings_df, 'Story')
    animation_pivot = create_pivot_table(anime_with_ratings_df, 'Animation')
    character_pivot = create_pivot_table(anime_with_ratings_df, 'Character')
    overall_similarities_df, story_similarities_df, animation_similarities_df, character_similarities_df = get_similarities_for_category_ratings(overall_pivot, story_pivot, 
    animation_pivot, character_pivot)
    combined_category_ratings_pivot = create_category_ratings_pivot(overall_similarities_df, story_similarities_df, 
    animation_similarities_df, character_similarities_df)

    # generic dataframes
    website_anime_df = get_website_anime_df()

# ============ Update weight dataframes and values used for similarity calculations ============

# ======= Update Content-based filtering dataframes and values =======
@app.route('/update_content_weights')
def update_content_weights():
    global feature_weights

    content_weights = request.args.get('query')
    content_weights = content_weights.split(',')

    genre_weight = float(content_weights[0])
    members_weight = float(content_weights[1])
    ratings_weight = float(content_weights[2])
    popularity_weight = float(content_weights[3])
    episodes_weight = float(content_weights[4])

    feature_weights = set_feature_weights(genre_weight, members_weight, ratings_weight, popularity_weight, episodes_weight)

    return '', 204 # Return an empty response with status code 204

def update_content_dataframes():
    global normalised_anime_df, feature_weights

    normalised_anime_df = get_normalised_df()
    genres_df = get_genre_df(normalised_anime_df, feature_weights['genre'])
    

# ======= Update Collaborative filtering dataframes and values =======
@app.route('/update_collaborative_weights')
def update_collaborative_weights():
    global rating_weights

    collaborative_weights = request.args.get('query')
    collaborative_weights = collaborative_weights.split(',')

    overall_weight = float(collaborative_weights[0])
    story_weight = float(collaborative_weights[1])
    animation_weight = float(collaborative_weights[2])
    character_weight = float(collaborative_weights[3])

    rating_weights = set_rating_weights(overall_weight, story_weight, animation_weight, character_weight)

    update_collaborative_dataframes()

    return '', 204 # Return an empty response with status code 204

def update_collaborative_dataframes():
    global anime_with_ratings_df, combined_category_ratings_pivot

    overall_pivot = create_pivot_table(anime_with_ratings_df, 'Overall')
    story_pivot = create_pivot_table(anime_with_ratings_df, 'Story')
    animation_pivot = create_pivot_table(anime_with_ratings_df, 'Animation')
    character_pivot = create_pivot_table(anime_with_ratings_df, 'Character')

    overall_similarities_df, story_similarities_df, animation_similarities_df, character_similarities_df = get_similarities_for_category_ratings(overall_pivot, story_pivot, 
    animation_pivot, character_pivot)

    combined_category_ratings_pivot = create_category_ratings_pivot(overall_similarities_df, story_similarities_df, 
    animation_similarities_df, character_similarities_df)


# ============ Update weights for the hybrid recommendations ============
@app.route('/update_hybrid_weights')
def update_hybrid_weights():
    global content_weight, collaborative_weight

    hybrid_weights = request.args.get('query')
    hybrid_weights = hybrid_weights.split(',')

    content_weight = float(hybrid_weights[0])
    collaborative_weight = float(hybrid_weights[1])

    return '', 204 # Return an empty response with status code 204

# ============ Information for website functionality / displaying recommendations ============

# this function will return an anime_df that will be a cleaned version but will consist of 
# columns that were originally removed as part of developing the recommender system
def get_website_anime_df():
    website_anime_df = pd.read_csv("../datasets/animes.csv")

    # reformat dataframe: removing NaN values and renaming columns, etc.
    website_anime_df.rename(columns={'title': 'name'}, inplace=True)
    
    website_anime_df['name'] = website_anime_df['name'].apply(text_cleaning)

    website_anime_df.rename(columns={'uid': 'anime_id', 'score': 'rating'}, inplace=True)
    website_anime_df.episodes.replace({'Unknown':np.nan},inplace=True)

    # fill NaN values for images with a default MAL picture:
    website_anime_df.fillna('https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ', inplace=True)

    website_anime_df.drop_duplicates(subset=['name'], inplace=True)
    website_anime_df.dropna(inplace=True)
    website_anime_df.reset_index(drop=True, inplace=True)

    # replace the characters "[]'" with an empty space as the genre column is already of type string
    website_anime_df['genre'] = website_anime_df['genre'].str.replace("'", "", regex=False)
    website_anime_df['genre'] = website_anime_df['genre'].str.replace("[", "", regex=False)
    website_anime_df['genre'] = website_anime_df['genre'].str.replace("]", "", regex=False)

    return website_anime_df

@app.route('/get_anime_titles')
def get_anime_titles_for_searchbar():
    return website_anime_df['name'].tolist()

@app.route('/get_ids_for_recommendations')
def get_ids_for_recommendations():
    global website_anime_df

    recommendations = request.args.get('query')
    recommendations = recommendations.replace('%20', ' ')
    recommendations = recommendations.split(',')

    website_recommendations_df = website_anime_df[website_anime_df['name'].isin(recommendations)] 

    anime_ids = []

    for rec in recommendations:
        anime_rec = website_recommendations_df.loc[website_recommendations_df['name'] == rec]
        anime_ids.append(int(anime_rec['anime_id'].values[0]))

    return anime_ids

@app.route('/get_images_for_recommendations')
def get_images_for_recommendations():
    global website_anime_df

    recommendations = request.args.get('query')
    recommendations = recommendations.replace('%20', ' ')
    recommendations = recommendations.split(',')

    website_recommendations_df = website_anime_df[website_anime_df['name'].isin(recommendations)] 

    img_urls = []

    for rec in recommendations:
        anime_rec = website_recommendations_df.loc[website_recommendations_df['name'] == rec]
        img_urls.append(str(anime_rec['img_url'].values[0]))

    return img_urls

@app.route('/get_links_for_recommendations')
def get_links_for_recommendations():
    global website_anime_df

    recommendations = request.args.get('query')
    recommendations = recommendations.replace('%20', ' ')
    recommendations = recommendations.split(',')

    website_recommendations_df = website_anime_df[website_anime_df['name'].isin(recommendations)] 

    mal_link = []

    for rec in recommendations:
        anime_rec = website_recommendations_df.loc[website_recommendations_df['name'] == rec]
        mal_link.append(str(anime_rec['link'].values[0]))

    return mal_link

# ========== USER LOGIN/AUTHENTICATION FUNCTIONS ==========

#Based on this Youtube video, https://www.youtube.com/watch?v=sBw0O5YTT4Q, on authentication using Flask and React, 
#the following user authentication code was produced. Modifications were made to accommodate the needs of my website.
#config.py and models.py were also created on the basis of this video.

from models import db, User
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS

app.config.from_object(ApplicationConfig)

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/get_current_user")
def get_current_user():
    user_id = session.get("user_id")
    
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    
    return jsonify({
        "id": user.id,
        "email": user.email,
        "username": user.username
    }) 

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists, Please login with the same email."}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, username=username)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "username": new_user.username
    })

@app.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized Password"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"



# start the backend
if __name__ == "__main__":
    load_data()
    app.run()


