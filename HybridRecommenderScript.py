# %% [markdown]
# Preprocessing Anime dataset from Kaggle

# %%
from collections import defaultdict
import pandas as pd
import numpy as np
import sklearn as sk
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_absolute_error
from scipy.sparse import csr_matrix
import matplotlib.pyplot as plt
import re
import string
import itertools
import statistics

# %% [markdown]
# 1. Data preprocessing

# %% [markdown]
# 1.1 Data Cleaning

# %% [markdown]
# Anime data

# %%
anime_df = pd.read_csv("datasets/animes.csv")

anime_df.head()

# %% [markdown]
# Missing values + duplicate data for animes.csv

# %%
missing_value = pd.DataFrame({
    'Missing Value': anime_df.isnull().sum()
})
display(missing_value)

# %%
duplicate = anime_df.duplicated(subset=['title']).sum()
print('There are {} duplicated rows in anime_df'.format(duplicate))

# %%
# remove unwanted features (columns) from the dataset
anime_df.rename(columns={'title': 'name'}, inplace=True)
anime_df.drop(['synopsis', 'aired', 'ranked', 'img_url', 'link'], axis=1, inplace=True)

#removing unwanted characters from the anime name strings
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

anime_df['name'] = anime_df['name'].apply(text_cleaning)
anime_df.head(5)

# %%
anime_df.rename(columns={'uid': 'anime_id', 'score': 'rating'}, inplace=True)
anime_df.episodes.replace({'Unknown':np.nan},inplace=True)

anime_df.drop_duplicates(subset=['name'], inplace=True)
anime_df.dropna(inplace=True)
anime_df.reset_index(drop=True, inplace=True)

anime_df.head(5)

# %%
# replace the characters "[]'" with an empty space as the genre column is already of type string
anime_df['genre'] = anime_df['genre'].str.replace("'", "", regex=False)
anime_df['genre'] = anime_df['genre'].str.replace("[", "", regex=False)
anime_df['genre'] = anime_df['genre'].str.replace("]", "", regex=False)

anime_df.head(5)

# %% [markdown]
# Ratings data

# %%
user_ratings_df = pd.read_csv("datasets/reviews.csv")

user_ratings_df.head()

# %% [markdown]
# Missing values + duplicate data for animes.csv

# %%
missing_value = pd.DataFrame({
    'Missing Value': user_ratings_df.isnull().sum()
})
display(missing_value)

# %%
user_ratings_df.drop(['link', 'text'], axis=1, inplace=True)
user_ratings_df.rename(columns={'profile': 'user_id'}, inplace=True)

user_ratings_df.user_id = pd.factorize(user_ratings_df.user_id)[0]

user_ratings_df.head()

# %%
user_ratings_df['scores'] = user_ratings_df['scores'].str.replace("'", "", regex=False)
user_ratings_df['scores'] = user_ratings_df['scores'].str.replace("{", "", regex=False)
user_ratings_df['scores'] = user_ratings_df['scores'].str.replace("}", "", regex=False)

user_ratings_df.head()

# %%
user_ratings_df['scores'] = [re.sub("[^0-9,]", "", anime) for anime in user_ratings_df['scores']]
user_ratings_df.rename(columns={"anime_uid": "anime_id"}, inplace=True)

user_ratings_df.head()

# %%
category_ratings_df = user_ratings_df['scores'].str.split(",", expand=True)
category_ratings_df.columns = ['Overall', 'Story', 'Animation','Sound', 'Character', 'Enjoyment']

category_ratings_df.head(10)

# %% [markdown]
# Finalised user_ratings_df

# %%
user_ratings_df = pd.concat([user_ratings_df, category_ratings_df], axis=1)
user_ratings_df.drop(columns=['score', 'scores', 'uid'], inplace=True)

user_ratings_df.head()

# %%
user_ratings_df[['Overall', 'Story', 'Animation', 'Sound', 'Character', 'Enjoyment']] = user_ratings_df[
    ['Overall', 'Story', 'Animation', 'Sound', 'Character', 'Enjoyment']].apply(pd.to_numeric)
    

# %%
duplicate = user_ratings_df.duplicated(subset=['user_id', 'anime_id']).sum()
print('There are {} duplicated rows in user_ratings_df'.format(duplicate))

# %%
user_ratings_df.drop_duplicates(subset=['user_id', 'anime_id'], inplace=True)

duplicate = user_ratings_df.duplicated(subset=['user_id', 'anime_id']).sum()
print('There are {} duplicated rows in user_ratings_df'.format(duplicate))

# %% [markdown]
# Merging the anime and ratings dataframes

# %%
anime_with_ratings_df = pd.merge(anime_df, user_ratings_df, on='anime_id')

anime_with_ratings_df.drop_duplicates(subset=['user_id', 'name'], inplace=True)
anime_with_ratings_df.reset_index(drop=True, inplace=True)

anime_with_ratings_df.head()

# %% [markdown]
# Content based filtering recommendation

# %%
# use MinMax normalisation to normalise the values of each feature, multiplied by their 
# corresponding weight
normalised_anime_df = anime_df.copy()

weights = {
    'genre': 0.3,
    'members_norm': 0.1,
    'rating_norm': 0.4,
    'popularity_norm': 0.1,
    'episodes_norm': 0.1
}

members_min_val = normalised_anime_df['members'].min()
members_max_val = normalised_anime_df['members'].max()

ratings_min_val = normalised_anime_df['rating'].min()
ratings_max_val = normalised_anime_df['rating'].max()

popularity_min_val = normalised_anime_df['popularity'].min()
popularity_max_val = normalised_anime_df['popularity'].max()

episodes_min_val = normalised_anime_df['episodes'].min()
episodes_max_val = normalised_anime_df['episodes'].max()

normalised_anime_df['members_norm'] = (normalised_anime_df['members'] - members_min_val) / (members_max_val - members_min_val) * weights['members_norm']
normalised_anime_df['avg_rating_norm'] = (normalised_anime_df['rating'] - ratings_min_val) / (ratings_max_val - ratings_min_val) * weights['rating_norm']
normalised_anime_df['popularity_norm'] = (normalised_anime_df['popularity'] - popularity_min_val) / (popularity_max_val - popularity_min_val) * weights['popularity_norm']
normalised_anime_df['episodes_norm'] = (normalised_anime_df['episodes'] - episodes_min_val) / (episodes_max_val - episodes_min_val) * weights['episodes_norm']

normalised_anime_df.head()

# %%
normalised_anime_df.drop(['members', 'rating', 'popularity', 'episodes'], axis=1, inplace=True)

normalised_anime_df.head()

# %%
genres_df = anime_df['genre'].str.get_dummies(sep=', ').astype(int)
genres_df = genres_df.apply(lambda x : x * weights['genre'])

genres_df.head()

# %%
normalised_anime_df.drop('genre', axis=1, inplace=True)
normalised_anime_df = pd.concat([normalised_anime_df, genres_df], axis=1)

normalised_anime_df.head()

# %% [markdown]
# Recommend one season of a show.
# 
# E.g. if the recommendations have "Tokyo ghoul season 1, tokyo ghoul season 2" etc. we want to only recommend one of these.
# 
# Recommend the one with the highest average rating

# %%
def get_unique_recommendations(anime_titles, anime_df=anime_df):
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

# %% [markdown]
# Content-based filtering -> Cosine Similarity

# %%
features = ['members_norm', 'avg_rating_norm', 'popularity_norm', 'episodes_norm'] + genres_df.columns.tolist()

cosine_sim = cosine_similarity(normalised_anime_df[features], normalised_anime_df[features])

print(cosine_sim)

# %%
indices = pd.Series(anime_df.index, index=anime_df['name']).drop_duplicates()

# %%
def content_based_recommendations(title, cosine_sim=cosine_sim, anime_df=anime_df, indices=indices, n_recommendations=50):
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
    unique_titles = set(get_unique_recommendations(anime_titles))

    recommendations = [i for i in anime_titles if i in unique_titles]

    return recommendations[:n_recommendations+1]

# %%
content_based_recommendations('Death Note')

# %% [markdown]
# Content-based filtering -> Clustering

# %%
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score

clustering_features = normalised_anime_df[features].copy()

# ========compute the number of clusters to use========

sse = [] #sum of squared errors

# silhouette scores range from -1 to 1: 
# 1 = points are perfectly assigned in a clsuter and clusters are easily distinguishable
# 0 = clusters are overlapping
# -1 = points are wrongly assigned in a cluster

silhouette_coefficients = []

for k in range(2, 11):
    kmeans = KMeans(n_clusters = k, n_init = 10) #max_iter = 100
    kmeans.fit(clustering_features)
    sse.append(kmeans.inertia_)

    ss = silhouette_score(clustering_features, kmeans.labels_)
    silhouette_coefficients.append(ss)

print("SSE: ", sse)
print("Silhouette scores: ", silhouette_coefficients)

# %% [markdown]
# SSE

# %%
plt.plot(range(2, 11), sse)
plt.xticks(range(2, 11))
plt.xlabel("Number of Clusters")
plt.ylabel("SSE")
plt.show()

# %% [markdown]
# Silhouette coefficients

# %%
plt.plot(range(2, 11), silhouette_coefficients)
plt.xticks(range(2, 11))
plt.xlabel("Number of Clusters")
plt.ylabel("Silhouette coefficients")
plt.show()

# %%
# we label each anime to its designated cluster which will be used to generate recommendations
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
anime_clusters = kmeans.fit_predict(clustering_features)
anime_clusters_visual = kmeans.fit(clustering_features)

anime_with_clusters = anime_df.copy()
anime_with_clusters['Cluster'] = anime_clusters_visual.labels_

# %% [markdown]
# Identify the 2 features that have the highest correlation with each other to be used in the cluster plot

# %%
corr_matrix = clustering_features.corr(numeric_only=True)

# Set diagonal values to 0 as these indicate the correlation between the same features, i.e. members_norm, members_norm
np.fill_diagonal(corr_matrix.values, 0)

print(corr_matrix)

# %%
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
kmeans.fit(clustering_features)

labels = kmeans.labels_

most_correlated = corr_matrix.abs().unstack().sort_values(ascending=False).drop_duplicates()
high_corr_pairs = most_correlated[most_correlated != 1][:2].reset_index()

feature1 = high_corr_pairs.iloc[0]['level_0']
feature2 = high_corr_pairs.iloc[0]['level_1']

print(f'Top pair of features: {feature1}, {feature2}')
print(f'Correlation coefficient: {corr_matrix.loc[feature1, feature2]}')

# %%
def cluster_plot(data, nclusters):
    corr_matrix = data.corr(numeric_only=True)

    # Set diagonal values to 0 as these indicate the correlation between the same features, i.e. members_norm, members_norm
    np.fill_diagonal(corr_matrix.values, 0)

    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    kmeans.fit(data)

    labels = kmeans.labels_

    most_correlated = corr_matrix.abs().unstack().sort_values(ascending=False).drop_duplicates()
    high_corr_pairs = most_correlated[most_correlated != 1][:2].reset_index()

    feature1 = high_corr_pairs.iloc[0]['level_0']
    feature2 = high_corr_pairs.iloc[0]['level_1']


    X = clustering_features[[feature1, feature2]].values

    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10).fit(X)

    plt.scatter(X[:, 0], X[:, 1], c=kmeans.labels_)
    plt.xlabel(feature1)
    plt.ylabel(feature2)
    plt.title('Cluster plot of highest correlated features')
    plt.show()

# %%
X = clustering_features[[feature1, feature2]].values
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10).fit(X)
plt.scatter(X[:, 0], X[:, 1], c=kmeans.labels_)
plt.xlabel(feature1)
plt.ylabel(feature2)
plt.title('Cluster plot of highest correlated features')
plt.show()

# %% [markdown]
# Get recommendations

# %%
def get_similar_anime(anime_name, data, n_recommendations=100):
    anime_index = anime_df[anime_df['name'] == anime_name].index[0]
    anime_cluster = data[anime_index]
    similar_anime_indexes = [i for i, cluster in enumerate(data) if cluster == anime_cluster and i != anime_index]
    similar_anime = anime_df.iloc[similar_anime_indexes]['name'].tolist()

    unique_titles = set(get_unique_recommendations(similar_anime))
    
    recommendations = [i for i in similar_anime if i in unique_titles]
    
    return recommendations[:n_recommendations+1]

# %%
get_similar_anime('Death Note', anime_clusters)

# %% [markdown]
# Clustering With PCA

# %%
features = ['members_norm', 'avg_rating_norm', 'popularity_norm', 'episodes_norm'] + genres_df.columns.tolist()

selected_features_pca = normalised_anime_df[features].copy()
pca_anime_df = normalised_anime_df[features].copy()

pca = PCA().fit(pca_anime_df)
explained_variance = pca.explained_variance_ratio_
cumulative_variance = explained_variance.cumsum()

plt.plot(range(1, len(cumulative_variance) + 1), cumulative_variance)
plt.xlabel('Number of Components')
plt.ylabel('Cumulative Explained Variance')
plt.show()

# %%
pca = PCA(n_components=30)
pca_result = pca.fit_transform(pca_anime_df)

# compute the number of clusters to use
sse = [] #sum of squared errors

# silhouette scores range from -1 to 1: 
# 1 = points are perfectly assigned in a clsuter and clusters are easily distinguishable
# 0 = clusters are overlapping
# -1 = points are wrongly assigned in a cluster

silhouette_coefficients = []

for k in range(2, 11):
    kmeans = KMeans(n_clusters = k, n_init = 10) #max_iter = 100
    kmeans.fit(pca_result)
    sse.append(kmeans.inertia_)

    ss = silhouette_score(pca_result, kmeans.labels_)
    silhouette_coefficients.append(ss)

print("SSE: ", sse)
print("Silhouette scores: ", silhouette_coefficients)

# %% [markdown]
# SSE With PCA

# %%
plt.plot(range(2, 11), sse)
plt.xticks(range(2, 11))
plt.xlabel("Number of Clusters")
plt.ylabel("SSE")
plt.show()

# %% [markdown]
# Silhouette Coefficients With PCA

# %%
plt.plot(range(2, 11), silhouette_coefficients)
plt.xticks(range(2, 11))
plt.xlabel("Number of Clusters")
plt.ylabel("Silhouette coefficients")
plt.show()

# %%
def pca_cluster_plot(data, nclusters):
    import matplotlib.pyplot as plt
    from sklearn.cluster import KMeans

    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(data)

    kmeans = KMeans(n_clusters=nclusters, random_state=42, n_init=10)
    kmeans.fit(X_pca)
    labels = kmeans.labels_

    plt.scatter(X_pca[:, 0], X_pca[:, 1], c=labels)
    plt.xlabel('Principal Component 1')
    plt.ylabel('Principal Component 2')
    plt.title('K-means Clustering with PCA using the top 2 Principal Components')
    plt.show()

# %% [markdown]
# With PCA

# %%
pca_pd = pd.DataFrame(pca_result)
pca_cluster_plot(pca_pd, 4)

# %% [markdown]
# Without PCA

# %%
clusters = clustering_features
cluster_plot(clusters, 4)

# %% [markdown]
# Get recommendations using PCA

# %%
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
kmeans.fit(pca_result)
anime_clusters_after_pca = kmeans.predict(pca_result)

# %%
get_similar_anime('Death Note', anime_clusters_after_pca)

# %% [markdown]
# Item-item Collaborative filtering

# %%
anime_with_ratings_df.head()

# %%
def create_pivot_table(data, value):
    pivot_table = data.pivot_table(index='user_id', columns='name',values=value)
    pivot_table.fillna(0, inplace=True)

    return pivot_table

# %% [markdown]
# Create user-item matrices (pivot tables) for each rating category (story, animation, etc.) containing the rating value given by users

# %%
# 55.3seconds to execute with all categories
overall_pivot = create_pivot_table(anime_with_ratings_df, 'Overall')
story_pivot = create_pivot_table(anime_with_ratings_df, 'Story')
animation_pivot = create_pivot_table(anime_with_ratings_df, 'Animation')
character_pivot = create_pivot_table(anime_with_ratings_df, 'Character')

overall_pivot.head()

# %%
def calculate_similarities(pivot_table):
    sparse_pivot = csr_matrix(pivot_table)
    similarities = cosine_similarity(sparse_pivot.T)
    similarities_df = pd.DataFrame(similarities, index=pivot_table.columns, columns=pivot_table.columns)

    return similarities_df

# %% [markdown]
# Use Cosine Similarity to calculate the similarity between each anime using the different categories rated by the user.

# %%
overall_similarities_df = calculate_similarities(overall_pivot)
story_similarities_df = calculate_similarities(story_pivot)
animation_similarities_df = calculate_similarities(animation_pivot)
character_similarities_df = calculate_similarities(character_pivot)


# %% [markdown]
# Combine the values in the dataframes obtained above using the assigned weights

# %%
overall_weight = 0.5 
story_weight=0.3
animation_weight=0.1
character_weight=0.1

combined_category_ratings_pivot = (overall_similarities_df * overall_weight) + (story_similarities_df * story_weight) + (animation_similarities_df * animation_weight) 
+ (character_similarities_df * character_weight) 

combined_category_ratings_pivot.head()

# %% [markdown]
# Get collaborative filtering recommendations

# %%
def collaborative_filtering_recommendations(anime, n=50):
    similarity_scores = combined_category_ratings_pivot[anime]
    similarity_scores = similarity_scores.sort_values(ascending=False)

    similar_anime = similarity_scores.iloc[1:n+1].index.tolist()

    unique_titles = set(get_unique_recommendations(similar_anime))

    recommendations = [i for i in similar_anime if i in unique_titles]

    return recommendations


# %%
collaborative_filtering_recommendations('Death Note')

# %% [markdown]
# Hybrid Implementation: Combine content based and collaborative filtering methods to provide recommendations to the user

# %% [markdown]
# 1) Content-based filtering component using Cosine Similarity

# %%
def combined_recommendations(anime_name, content_weight=0.5, collaborative_weight=0.5, num_recommendations=20):
    if anime_name not in combined_category_ratings_pivot.index:
        return []

    content_based = content_based_recommendations(anime_name)
    collaborative_filtering = collaborative_filtering_recommendations(anime_name)

    # removing anime titles that may no longer exist within our dataframe as some were removed after the initial
    # anime_df and ratings_df dataframes were merged together
    content_based_animes = []

    for i in content_based:
        if i in combined_category_ratings_pivot.index:
            content_based_animes.append(i)

    collaborative_based_animes = []

    for i in collaborative_filtering:
        if i in combined_category_ratings_pivot.index:
            collaborative_based_animes.append(i)

    content_based_scores = combined_category_ratings_pivot.loc[content_based_animes]
    collaborative_filtering_scores = combined_category_ratings_pivot.loc[collaborative_based_animes]

    # create weighted scores for all the animes using both the values generated from content based and collaborative filtering methods
    scores = content_based_scores.mul(content_weight).add(collaborative_filtering_scores.mul(collaborative_weight), fill_value=0)
    
    weighted_scores = scores[anime_name].sort_values(ascending=False)
    return weighted_scores, weighted_scores.head(num_recommendations).index.tolist()

# %%
combined_recommendations('Death Note')[1]

# %% [markdown]
# 2) Content-based filtering component using K-means Clustering

# %%
def combined_recommendations_with_clustering(anime_name, content_weight=0.5, collaborative_weight=0.5, num_recommendations=20):
    if anime_name not in combined_category_ratings_pivot.index:
        return []

    content_based = get_similar_anime(anime_name, anime_clusters)
    collaborative_filtering = collaborative_filtering_recommendations(anime_name)

    # removing anime titles that may no longer exist within our dataframe as some were removed after the initial
    # anime_df and ratings_df dataframes were merged together
    content_based_animes = []

    for i in content_based:
        if i in combined_category_ratings_pivot.index:
            content_based_animes.append(i)

    collaborative_based_animes = []

    for i in collaborative_filtering:
        if i in combined_category_ratings_pivot.index:
            collaborative_based_animes.append(i)

    content_based_scores = combined_category_ratings_pivot.loc[content_based_animes]
    collaborative_filtering_scores = combined_category_ratings_pivot.loc[collaborative_based_animes]

    # create weighted scores for all the animes using both the values generated from content based and collaborative filtering methods
    scores = content_based_scores.mul(content_weight).add(collaborative_filtering_scores.mul(collaborative_weight), fill_value=0)
    
    weighted_scores = scores[anime_name].sort_values(ascending=False)
    return weighted_scores, weighted_scores.head(num_recommendations).index.tolist()

# %%
combined_recommendations_with_clustering('Death Note')[1]

# %% [markdown]
# 3) Content-based filtering component using K-Means Clustering with PCA

# %%
def combined_recommendations_with_clustering_and_pca(anime_name, content_weight=0.5, collaborative_weight=0.5, num_recommendations=20):
    if anime_name not in combined_category_ratings_pivot.index:
        return []

    content_based = get_similar_anime(anime_name, anime_clusters_after_pca)
    collaborative_filtering = collaborative_filtering_recommendations(anime_name)

    # removing anime titles that may no longer exist within our dataframe as some were removed after the initial
    # anime_df and ratings_df dataframes were merged together
    content_based_animes = []

    for i in content_based:
        if i in combined_category_ratings_pivot.index:
            content_based_animes.append(i)

    collaborative_based_animes = []

    for i in collaborative_filtering:
        if i in combined_category_ratings_pivot.index:
            collaborative_based_animes.append(i)

    content_based_scores = combined_category_ratings_pivot.loc[content_based_animes]
    collaborative_filtering_scores = combined_category_ratings_pivot.loc[collaborative_based_animes]

    # create weighted scores for all the animes using both the values generated from content based and collaborative filtering methods
    scores = content_based_scores.mul(content_weight).add(collaborative_filtering_scores.mul(collaborative_weight), fill_value=0)
    
    weighted_scores = scores[anime_name].sort_values(ascending=False)
    return weighted_scores, weighted_scores.head(num_recommendations).index.tolist()

# %%
combined_recommendations_with_clustering_and_pca('Death Note')[1]

# %% [markdown]
# Performance

# %% [markdown]
# MAE (Mean Absolute Error)

# %% [markdown]
# Create dataframe to store the mean and standard deviation of all users

# %%
def get_mean_and_std(user_id):
    user = user_ratings_df[user_ratings_df['user_id'] == user_id]

    user_mean = user['Overall'].mean()
    user_std = user['Overall'].std()

    return user_mean, user_std

# %%
# for each user id in user_ratings_df['user_id'].unique(), get the mean 
# and standard deviation for that user

# create a dataframe from the results: user_id as index, mean and std as columns

user_mean_std = [get_mean_and_std(user_id) for user_id in user_ratings_df['user_id'].unique()]

user_mean_std_df = pd.DataFrame(user_mean_std, columns=['mean', 'std'])

user_mean_std_df.head()

# %%
def calculate_mae(recommendations):
    # Create pivot table with users as rows and recommended anime as columns
    recommendations_pivot = recommendations.pivot_table(index='user_id', columns='anime_id', values='hybrid_score')
    
    # Merge pivot table with actual ratings data to get ratings for recommended anime
    ratings = pd.merge(mae_df, recommendations_pivot.stack().reset_index().rename(columns={0: 'hybrid_score'}), on=['user_id', 'anime_id'])
    ratings.drop(columns={'hybrid_score_x'}, inplace=True)
    ratings.rename(columns={'hybrid_score_y' : 'hybrid_score'}, inplace=True)
    ratings.drop_duplicates(subset=['user_id', 'anime_id'], inplace=True) 

    if not ratings['normalized_rating'].shape[0] > 1 or not ratings['hybrid_score'].shape[0] > 1:
        return None
        
    # # Calculate MAE
    mae = mean_absolute_error(ratings['normalized_rating'], ratings['hybrid_score'])
    return mae

# %%
def mae_value_without_clustering(title):
    
    # get the similarity scores of the hybrid recommendation titles
    hybrid_recommendations_scores = combined_recommendations(title)[0]
    hybrid_recs_df = hybrid_recommendations_scores.to_frame(name='hybrid_score')

    get_hybrid_recs_df(title)

    # Add anime ids to each of the recommendations so we can merge with anime_with_ratings_df 
    anime_indexes = [anime_df[anime_df['name'] == anime_name].index[0] for anime_name in hybrid_recs_df.index]
    anime_ids = [anime_df.loc[index, 'anime_id'] for index in anime_indexes]
    hybrid_recs_df['anime_id'] = anime_ids

    # Create our mae_df to be used specifically for MAE calculations
    mae_df = anime_with_ratings_df.copy()
    mae_df= pd.merge(anime_with_ratings_df, hybrid_recs_df, on='anime_id')
    mae_df[['Overall', 'Story', 'Animation', 'Character']] = mae_df[
    ['Overall', 'Story', 'Animation', 'Character']].apply(pd.to_numeric)

    # Add 'normalized_rating' column, which uses the Overall score a user has given an anime 
    # alongside the mean and standard deviation of all the animes a user has rated to normalise.
    mae_df['normalized_rating'] = mae_df.apply((lambda row: 
    (row['Overall'] - user_mean_std_df.loc[row['user_id'], 'mean']) / user_mean_std_df.loc[row['user_id'], 'std'] 
    if user_mean_std_df.loc[row['user_id'], 'std'] != 0 else 0), axis=1)
    
    # # # NaN values are present as the user has only rated this single anime, so they 
    # # # are not that useful when providing recommendations, so we can simply just fill it with 0.
    mae_df['normalized_rating'] = mae_df['normalized_rating'].fillna(0)

    mae = calculate_mae(mae_df)

    return mae

# %%
def mae_value_with_clustering(title):

    hybrid_recommendations_scores = combined_recommendations_with_clustering(title)[0]
    hybrid_recs_df = hybrid_recommendations_scores.to_frame(name='hybrid_score')

    anime_indexes = [anime_df[anime_df['name'] == anime_name].index[0] for anime_name in hybrid_recs_df.index]
    anime_ids = [anime_df.loc[index, 'anime_id'] for index in anime_indexes]

    hybrid_recs_df['anime_id'] = anime_ids

    mae_df = anime_with_ratings_df.copy()
    mae_df = pd.merge(anime_with_ratings_df, hybrid_recs_df, on='anime_id')

    mae_df[['Overall', 'Story', 'Animation', 'Character']] = mae_df[
        ['Overall', 'Story', 'Animation', 'Character']].apply(pd.to_numeric)

    mae_df['normalized_rating'] = mae_df.apply((lambda row: 
    (row['Overall'] - user_mean_std_df.loc[row['user_id'], 'mean']) / user_mean_std_df.loc[row['user_id'], 'std'] 
    if user_mean_std_df.loc[row['user_id'], 'std'] != 0 else 0), axis=1)
    
    mae_df['normalized_rating'] = mae_df['normalized_rating'].fillna(0)

    mae = calculate_mae(mae_df)

    return mae

# %%
def mae_value_with_clustering_and_pca(title):

    hybrid_recomhybrid_recommendations_scoresmendations = combined_recommendations_with_clustering_and_pca(title)[0]
    hybrid_recs_df = hybrid_recommendations_scores.to_frame(name='hybrid_score')

    anime_indexes = [anime_df[anime_df['name'] == anime_name].index[0] for anime_name in hybrid_recs_df.index]
    anime_ids = [anime_df.loc[index, 'anime_id'] for index in anime_indexes]

    hybrid_recs_df['anime_id'] = anime_ids

    mae_df = anime_with_ratings_df.copy()
    mae_df = pd.merge(anime_with_ratings_df, hybrid_recs_df, on='anime_id')

    mae_df[['Overall', 'Story', 'Animation', 'Character']] = mae_df[
    ['Overall', 'Story', 'Animation', 'Character']].apply(pd.to_numeric)

    mae_df['normalized_rating'] = mae_df.apply((lambda row: 
    (row['Overall'] - user_mean_std_df.loc[row['user_id'], 'mean']) / user_mean_std_df.loc[row['user_id'], 'std'] 
    if user_mean_std_df.loc[row['user_id'], 'std'] != 0 else 0), axis=1)
    
    mae_df['normalized_rating'] = mae_df['normalized_rating'].fillna(0)


    mae = calculate_mae(mae_df)

    return mae

# %% [markdown]
# Calculating the MAE for every anime title would take a very long time, so we limit the number of titles to save us time.

# %% [markdown]
# MAE for Cosine Similarity Content-based filtering approach

# %%
mae_values_without_clustering = [calculate_mae(mae_value_without_clustering(title)) for title in anime_with_ratings_df['name'].unique()[:100]]
mae_values_without_clustering = [i for i in mae_values_without_clustering if i is not None]

mae_mean_without_clustering = statistics.mean(mae_values_without_clustering)

mae_mean_without_clustering

# %% [markdown]
# MAE for Clustering without PCA Content-based filtering approach

# %%
mae_values_with_clustering = [mae_value_with_clustering(title) for title in anime_with_ratings_df['name'].unique()[:100]]
mae_values_with_clustering = [i for i in mae_values_with_clustering if i is not None]

mae_mean_with_clustering = statistics.mean(mae_values_with_clustering)

mae_mean_with_clustering

# %% [markdown]
# MAE for Clustering with PCA Content-based filtering approach

# %%
mae_values_with_pca = [mae_value_with_clustering_and_pca(title) for title in anime_with_ratings_df['name'].unique()[:100]]
mae_values_with_pca = [i for i in mae_values_with_pca if i is not None]

mae_mean_with_pca = statistics.mean(mae_values_with_pca)

mae_mean_with_pca

# %% [markdown]
# Coverage Testing

# %% [markdown]
# Coverage Testing -> Cosine Similarity Content-based filtering approach

# %%
all_anime_titles = list(anime_with_ratings_df['name'].unique())

# set to store all recommended anime titles
recommended_anime = set()

for anime_title in all_anime_titles:
    recommendations = combined_recommendations(anime_title)[1]
    for recommendation in recommendations:
        recommended_anime.add(recommendation)

coverage = (len(recommended_anime) / len(anime_df['name'])) * 100

print(f"Coverage: {coverage:.2f}%")
# Coverage: 47.07% testing all anime titles -> 16mins 

# %% [markdown]
# Coverage Testing -> K-means clustering Content-based filtering approach

# %%
all_anime_titles = list(anime_with_ratings_df['name'].unique())

# set to store all recommended anime titles
recommended_anime = set()

for anime_title in all_anime_titles:
    recommendations = combined_recommendations_with_clustering(anime_title)[1]
    for recommendation in recommendations:
        recommended_anime.add(recommendation)

clustering_coverage = (len(recommended_anime) / len(anime_df['name'])) * 100

print(f"Clustering Coverage: {clustering_coverage:.2f}%")

# Clustering Coverage: 45.63% -> 373 minutes to execute

# %% [markdown]
# Coverage Testing -> K-means clustering with PCA Content-based filtering approach

# %%
all_anime_titles = list(anime_with_ratings_df['name'].unique())

# set to store all recommended anime titles
recommended_anime = set()

for anime_title in all_anime_titles:
    recommendations = combined_recommendations_with_clustering_and_pca(anime_title)[1]
    for recommendation in recommendations:
        recommended_anime.add(recommendation)

pca_coverage = (len(recommended_anime) / len(anime_df['name'])) * 100

print(f"Clustering with PCA Coverage: {pca_coverage:.2f}%")

# Clustering with PCA Coverage: 52.04% -> over 10 hours to compute

# %% [markdown]
# Website related functions

# %%
recommendations = combined_recommendations('Death Note')[1]

recommendations

# %% [markdown]
# Gather information/data needed for the frontend

# %% [markdown]
# Retrieve Anime IDs (MAL ID) for all the recommendations to help fetch and display them using Jikan API on the website

# %%
def get_ids_for_recommendations(recommendations):

    anime_ids = []
    for rec in recommendations:
        id = anime_df.loc[anime_df['name'] == rec]['anime_id'].values[0]
        anime_ids.append(id)

    return anime_ids

# %%
ids = get_ids_for_recommendations(recommendations)

ids

# %%
recommendation_ids_df = pd.DataFrame(ids, columns=['mal_id'])

recommendation_ids_df.head()

# %% [markdown]
# Restoring original anime_df to use columns dropped for recommendation purposes as information to be passed to the frontend

# %%
def get_website_anime_df():
    website_anime_df = pd.read_csv("datasets/animes.csv")

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

# %%
website_anime_df = get_website_anime_df()

website_anime_df.head()

# %% [markdown]
# Gathering only the rows which are produced from the recommendations

# %%
website_recommendations_df = website_anime_df[website_anime_df['name'].isin(recommendations)] 
website_recommendations_df.reset_index(drop=True, inplace=True)

website_recommendations_df.head(10)

# %% [markdown]
# Function to gather and return the required data to the frontend

# %%
def get_data_for_recommendations(recommendations):
    global website_anime_df

    # recommendations = request.args.get('query')
    recommendations = recommendations.replace('%20', ' ')
    recommendations = recommendations.split(',')

    website_recommendations_df = website_anime_df[website_anime_df['name'].isin(recommendations)] 

    anime_ids = []
    img_urls = []
    mal_link = []
    status = 200

    for rec in recommendations:
        anime_rec = website_recommendations_df.loc[website_recommendations_df['name'] == rec]
        anime_ids.append(int(anime_rec['anime_id'].values[0]))
        img_urls.append(str(anime_rec['img_url'].values[0]))
        mal_link.append(str(anime_rec['link'].values[0]))

    return anime_ids, img_urls, mal_link, status


