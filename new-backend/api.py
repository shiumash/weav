from flask import Flask, request, jsonify
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db, auth
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

class Profile(Resource):
    def get(self, user_id):
        try:
            # Convert email to Firebase-compatible key
            user_id_key = user_id.replace('.', ',')
            user_ref = db.reference(f'users/{user_id_key}')
            user_data = user_ref.get()
            if not user_data:
                return {"message": "User not found"}, 404

            return user_data, 200
        except Exception as e:
            return {"message": "Error retrieving profile", "error": str(e)}, 500

    def put(self, user_id):
        try:
            # Convert email to Firebase-compatible key
            user_id_key = user_id.replace('.', ',')
            user_ref = db.reference(f'users/{user_id_key}')
            user_data = user_ref.get()
            if not user_data:
                return {"message": "User not found"}, 404

            update_data = request.json
            user_ref.update(update_data)
            return {"message": "Profile updated successfully"}, 200
        except Exception as e:
            return {"message": "Error updating profile", "error": str(e)}, 500

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

class FriendRequest(Resource):
    def post(self):
        data = request.json
        sender_email = data.get('sender_email')
        receiver_email = data.get('receiver_email')

        if not sender_email or not receiver_email:
            return {"message": "Both sender and receiver emails are required"}, 400

        sender_key = sender_email.replace('.', ',')
        receiver_key = receiver_email.replace('.', ',')

        sender_ref = db.reference(f'users/{sender_key}')
        receiver_ref = db.reference(f'users/{receiver_key}')

        sender_data = sender_ref.get()
        receiver_data = receiver_ref.get()

        if not sender_data:
            return {"message": "Sender not found"}, 404
        if not receiver_data:
            return {"message": "Receiver not found"}, 404

        # Add friend request to receiver's pending requests
        pending_requests_ref = db.reference(f'users/{receiver_key}/pending_requests')
        pending_requests = pending_requests_ref.get() or []
        if sender_key not in pending_requests:
            pending_requests.append(sender_key)
            pending_requests_ref.set(pending_requests)

        return {"message": "Friend request sent"}, 200

class FriendRequestResponse(Resource):
    def get(self, user_id):
        try:
            # Convert email to Firebase-compatible key
            user_id_key = user_id.replace('.', ',')
            user_ref = db.reference(f'users/{user_id_key}')
            user_data = user_ref.get()
            if not user_data:
                return {"message": "User not found"}, 404

            pending_requests = user_data.get('pending_requests', [])
            requests_data = []
            for sender_key in pending_requests:
                sender_ref = db.reference(f'users/{sender_key}')
                sender_data = sender_ref.get()
                if sender_data:
                    requests_data.append({
                        "email": sender_data.get('email').replace(',', '.'),
                        "name": sender_data.get('name'),
                        "profile_picture": sender_data.get('profile_picture')
                    })

            return {"pending_requests": requests_data}, 200
        except Exception as e:
            return {"message": "Error retrieving friend requests", "error": str(e)}, 500

    def post(self):
        data = request.json
        receiver_email = data.get('receiver_email')
        sender_email = data.get('sender_email')
        action = data.get('action')

        if not receiver_email or not sender_email or not action:
            return {"message": "Receiver email, sender email, and action are required"}, 400

        receiver_key = receiver_email.replace('.', ',')
        sender_key = sender_email.replace('.', ',')

        receiver_ref = db.reference(f'users/{receiver_key}')
        sender_ref = db.reference(f'users/{sender_key}')

        receiver_data = receiver_ref.get()
        sender_data = sender_ref.get()

        if not receiver_data:
            return {"message": "Receiver not found"}, 404
        if not sender_data:
            return {"message": "Sender not found"}, 404

        # Remove friend request from receiver's pending requests
        pending_requests_ref = db.reference(f'users/{receiver_key}/pending_requests')
        pending_requests = pending_requests_ref.get() or []
        if sender_key in pending_requests:
            pending_requests.remove(sender_key)
            pending_requests_ref.set(pending_requests)

        if action == 'accept':
            # Add each other to friends list
            receiver_friends_ref = db.reference(f'users/{receiver_key}/friends')
            sender_friends_ref = db.reference(f'users/{sender_key}/friends')

            receiver_friends = receiver_friends_ref.get() or []
            sender_friends = sender_friends_ref.get() or []

            if sender_key not in receiver_friends:
                receiver_friends.append(sender_key)
                receiver_friends_ref.set(receiver_friends)

            if receiver_key not in sender_friends:
                sender_friends.append(receiver_key)
                sender_friends_ref.set(sender_friends)

            return {"message": "Friend request accepted"}, 200
        elif action == 'decline':
            return {"message": "Friend request declined"}, 200
        else:
            return {"message": "Invalid action"}, 400

api.add_resource(Profile, '/api/profile/<string:user_id>')
api.add_resource(Friends, '/api/users/<string:user_id>/friends')
api.add_resource(FriendRequest, '/api/friend-request')
api.add_resource(FriendRequestResponse, '/api/friend-request-response', '/api/friend-request-response/<string:user_id>')

@app.route('/')
def home():
    return '<h1>Flask REST API</h1>'

if __name__ == '__main__':
    app.run(debug=True)