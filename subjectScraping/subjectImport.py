import pymongo
import json
# python subjectImport.py 
CONNECTION_URL =  "mongodb+srv://admin:adminpassword@cluster0.7ilezxe.mongodb.net"
client = pymongo.MongoClient(CONNECTION_URL)
db = client.subjectReviewDB
collection = db.subjects

# Reset the collection to not have duplicates
collection.drop()
with open("./subjects_2022.json") as file:
    file_data = json.load(file)
    collection.insert_many(file_data)
    print("Subjects Loaded: " + str(len(file_data)))
client.close()