from flask import Flask, request, jsonify
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
import firebase_admin
from firebase_admin import credentials, db, auth

# Initialize Firebase Admin SDK
cred = credentials.Certificate('weavdb-62503-firebase-adminsdk-fbsvc-114d0ac0e3.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://weavdb-62503-default-rtdb.firebaseio.com/'  # Correct database URL
})



# Reference to the database
users_ref = db.reference('users')  # Points to the 'users' node in the database

app = Flask(__name__)
api = Api(app)

@app.route('/api/verify-token', methods=['POST'])
def verify_token():
    token = request.json.get('token')
    if not token:
        return jsonify({"message": "Token missing"}), 400

    try:
        # Verify the Firebase ID token
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token['uid']
        user_email = decoded_token.get('email', 'No email provided')

        # Example: Respond with user details
        return jsonify({
            "message": "Token is valid",
            "user_id": user_id,
            "email": user_email
        }), 200
    except Exception as e:
        return jsonify({"message": "Invalid token", "error": str(e)}), 401

user_args = reqparse.RequestParser()
user_args.add_argument('name', type=str, required=True, help="Name cannot be blank")

class Users(Resource):
    def get(self):
        users = users_ref.get()
        if not users:
            return {"message": "No users found"}, 404
        return users, 200

    def post(self):
        args = user_args.parse_args()  # Parse request arguments
        new_user = {"name": args['name']}
        user_ref = users_ref.push(new_user)  # Add a new user to the database
        return {"id": user_ref.key, "user": new_user}, 201

# Add the Users resource to the API
api.add_resource(Users, '/api/users/')

@app.route('/')
def home():
    return '<h1>Flask REST API</h1>'

if __name__ == '__main__':
    app.run(debug=True)