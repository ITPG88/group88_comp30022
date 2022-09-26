import pymongo
import bcrypt
import getpass
from pymongo.errors import ServerSelectionTimeoutError 
# RUN TO CREATE VIRTUAL ENV
# python3 -m venv /createMod
# source Scripts/activate

# INSTALL DEPENDENCIES
# pip install "pymongo[srv]"
# pip install bcrypt
# python create_mod.py

## used pyinstaller to package into a exe

# pyinstaller -F create_mod.py

def createMod(mod, collection):
    try:
        collection.insert_one(mod)
        return True
    except pymongo.errors.DuplicateKeyError:
        print("-- Account Creation Failed -- ")
        print("Username already exists")
        return False
    except Exception as e:
        print("Exception:" + e)
        return False

def establishConnection(CONNECTION_URL):
    try:
        client = pymongo.MongoClient(CONNECTION_URL, serverSelectionTimeoutMS = 5000)
        client.server_info()
        print("Connection Established")
        return client
    except ServerSelectionTimeoutError:
        print("Connection Failed")
        return False
    
def main():
    CONNECTION_URL = input('Please enter MONGO URI: ')
    client = establishConnection(CONNECTION_URL)
    if (client):
        db = client.subjectReviewDB
        collection = db.users
        print("-- Creating a moderator account -- ")
        fullName = input('Please enter moderator full name: ')
        user = input('Please enter moderator username: ')
        pwd = getpass.getpass('Please enter moderator password: ')
        hashed = bcrypt.hashpw(bytes(pwd, encoding='utf-8'), bcrypt.gensalt(rounds=10))
        
        mod = {"fullName": fullName,
        "username":user,
        "password": hashed.decode(),
        "type": "moderator"}

        if (createMod(mod, collection)):
            print("-- Account Creation Success -- ")
            print("user: " + user)
            print("password: " + pwd)
    input("PRESS <ENTER> TO EXIT")

main()
