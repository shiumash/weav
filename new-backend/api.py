from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
import firebase_admin
from firebase_admin import credentials, db
from functools import wraps

# Initialize Firebase Admin SDK
cred = credentials.Certificate('weavdb-62503-firebase-adminsdk-fbsvc-b4dcbc6a5e.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://weavdb-62503-default-rtdb.firebaseio.com/'
})

# Reference to the database
users_ref = db.reference('users')

app = Flask(__name__)
api = Api(app)
CORS(app)

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_data = request.json
        if not auth_data or 'userId' not in auth_data:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/user', methods=['POST'])
@require_auth
def handle_user():
    user_data = request.json
    
    # Format email to be used as key (replace '.' with ',' for Firebase compatibility)
    email_key = user_data.get('email').replace('.', ',')
    
    # Create user data object
    new_user = {
        'userId': user_data.get('userId'),
        'email': user_data.get('email'),
        'username': user_data.get('username'),
        'imageUrl': user_data.get('imageUrl'),
        'firstName': user_data.get('firstName'),
        'lastName': user_data.get('lastName'),
        'googleId': user_data.get('googleId'),
        'friends': [],
        'tags': [],
        'createdAt': {'.sv': 'timestamp'}  # Server timestamp
    }
    
    try:
        # Check if user already exists
        existing_user = users_ref.child(email_key).get()
        
        if existing_user:
            # Update existing user data
            users_ref.child(email_key).update(new_user)
            return jsonify({
                'status': 'success',
                'message': 'User data updated',
                'user': new_user
            })
        else:
            # Create new user
            users_ref.child(email_key).set(new_user)
            return jsonify({
                'status': 'success',
                'message': 'New user created',
                'user': new_user
            })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

class Users(Resource):
    def get(self):
        try:
            users = users_ref.get()
            if not users:
                return {"message": "No users found"}, 404
            return users, 200
        except Exception as e:
            return {"message": "Error retrieving users", "error": str(e)}, 500

class Friends(Resource):
    def get(self, user_id):
        try:
            # Convert email to Firebase-compatible key
            user_id_key = user_id.replace('.', ',')
            user_ref = db.reference(f'users/{user_id_key}')
            user_data = user_ref.get()
            if not user_data:
                return {"message": "User not found"}, 404

            friends = user_data.get('friends', [])
            friends_data = []
            for friend_id in friends:
                friend_ref = db.reference(f'users/{friend_id}')
                friend_data = friend_ref.get()
                if friend_data:
                    friends_data.append({
                        "name": friend_data.get('name'),
                        "profile_picture": friend_data.get('profile_picture'),
                        "tags": friend_data.get('tags'),
                        "email": friend_id.replace(',', '.')  # Convert back to regular email format
                    })

            return {"friends": friends_data}, 200
        except Exception as e:
            return {"message": "Error retrieving friends", "error": str(e)}, 500

api.add_resource(Users, '/api/users/')
api.add_resource(Friends, '/api/users/<string:user_id>/friends')

@app.route('/')
def home():
    return '<h1>Flask REST API</h1>'

if __name__ == '__main__':
    app.run(debug=True)