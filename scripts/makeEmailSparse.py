import pymongo

CONNECTION_URL = "mongodb+srv://admin:adminpassword@cluster0.7ilezxe.mongodb.net/subjectReviewDB?retryWrites=true&w=majority"
client = pymongo.MongoClient(
    CONNECTION_URL,
    serverSelectionTimeoutMS=5000,
)
client.server_info()
db = client.subjectReviewDB
collection = db.users
for index in collection.list_indexes():
    if index == "email_1":
        collection.drop_index("email_1")
collection.create_index(
    "email",
    sparse=True,
    unique=True,
)
