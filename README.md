Appendix B: User Guide

Dataset:
The source code zip does not contain the dataset used for the development of the recommendation system due to file size constraints. Please use the following link to download the two files needed for the application to work, namely “animes.csv” and “reviews.csv”. Do not download “profiles.csv” as this was not used. 

Dataset:
https://www.kaggle.com/datasets/marlesson/myanimelist-dataset-animes-profiles-reviews?resource=download&select=animes.csv

Once these have been downloaded, navigate to the project directory. Here, you will see an empty “datasets” folder. 

Put the downloaded files into this folder. Your directory should look like the following as a result:


Run the application:
You will need two terminals. In the first terminal, navigate into the “flask-server” folder and create a virtual environment. The code to do this is:
Mac/Linux: python3 -m venv venv
Windows: python -m venv venv

Activate the virtual environment using:
Mac/Linux: source venv/bin/activate
Windows: .\venv\Scripts\activate

Upon activating your virtual environment, install the requirements needed using: 
Mac/Linux: pip3 install -r requirements.txt
Windows: pip install -r requirements.txt

To start the backend, run:
Mac/Linux: python3 server.py
Windows: python server.py

Note, it will take some time for the backend to be ready due to the preloading of data. You will know once the server is ready as the local host it is running on will be displayed as such: “Running on “http://127.0.0.1:5000”.

In your second terminal, navigate to the “website” folder. You do not need a virtual environment for this terminal. Then, run “npm install”. This will install the dependencies for the website. Note, you will need to have “npm” installed beforehand. Please refer to the official website to do so: https://nodejs.org/en/download

Next, look in the “package.json” file. You will see the following line: 
“proxy”: “http://127.0.0.1:5000”

This is the URL of my local host for my backend, running on port 5000. If your local host is running on a different port, please change the string value to match the URL of your local host. You can find the local host URL in the first terminal used to run the backend when the server is running. The line “Running on “http://127.0.0.1:5000” will be displayed, where your local host may be different. Use the URL displayed as the proxy value.

Finally, you can start the front end using “npm start”. This will launch the website where you can interact and explore the content to your liking.
