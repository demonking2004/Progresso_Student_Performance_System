from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pymongo
import operator
import spacy
import os

app = Flask(__name__)
CORS(app)

connection_string = "mongodb://localhost:27017"
client = MongoClient(connection_string)
db = client['local']
mydb = db['sps']

def extract_information_from_user(text):
    key = []
    value = []
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "output", "model-best")
    nlp = spacy.load(model_path)
    doc = nlp(text)
    for ent in doc.ents:
        key.append(ent.label_)
        value.append(ent.text)
    Dict = {key[i]: value[i] for i in range(len(key))}
    if "SKILLS" not in Dict:
        return jsonify({"error": "No skills detected. Please mention your skills clearly."}), 400
    SKILLS = Dict["SKILLS"].split(",")
    Dict.update(SKILLS=SKILLS)
    text = Dict["SKILLS"]
    return retirve_info_from_db(text)

def retirve_info_from_db(user_list):
    len_user_list = len(user_list)
    n = mydb.find({'skills': {'$in': user_list}}, {'_id': 0})
    jobs = []
    for i in n:
        job_skills = i['skills']
        match = len([k for k, val in enumerate(job_skills) if val in user_list])
        total_len = len(job_skills) + len_user_list
        i['rank'] = match / total_len
        jobs.append(i)
    return show_info(jobs, user_list, len(jobs))

def show_info(jobs, job_skills, job_len):
    jobs.sort(key=operator.itemgetter('rank'), reverse=True)
    return jsonify({
        "jobs": jobs,
        "job_skills": job_skills,
        "job_len": job_len
    })

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def my_form_post():
    text = request.form['text']
    return extract_information_from_user(text)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)