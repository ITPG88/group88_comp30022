import pymongo
import json
# python3 subjectImport.py 
CONNECTION_URL =  "mongodb+srv://admin:adminpassword@cluster0.7ilezxe.mongodb.net"
client = pymongo.MongoClient(CONNECTION_URL)
db = client.subjectReviewDB
collection = db.subjects

with open("./subjects_2022.json") as file:
    file_data = json.load(file)
    collection.insert_many(file_data)

client.close()