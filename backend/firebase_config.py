import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
import json

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Try to load from service account file first
        if os.path.exists('firebase-service-account.json'):
            cred = credentials.Certificate('firebase-service-account.json')
        else:
            # Load from environment variables (for production)
            firebase_config = {
                "type": "service_account",
                "project_id": os.environ.get('FIREBASE_PROJECT_ID'),
                "private_key_id": os.environ.get('FIREBASE_PRIVATE_KEY_ID'),
                "private_key": os.environ.get('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
                "client_email": os.environ.get('FIREBASE_CLIENT_EMAIL'),
                "client_id": os.environ.get('FIREBASE_CLIENT_ID'),
                "auth_uri": os.environ.get('FIREBASE_AUTH_URI', "https://accounts.google.com/o/oauth2/auth"),
                "token_uri": os.environ.get('FIREBASE_TOKEN_URI', "https://oauth2.googleapis.com/token"),
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.environ.get('FIREBASE_CLIENT_EMAIL')}"
            }
            cred = credentials.Certificate(firebase_config)
        
        firebase_admin.initialize_app(cred)
        return firestore.client()
    
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        return None

def verify_user_token(id_token):
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None

def create_user(email, password):
    """Create a new user in Firebase Auth"""
    try:
        user = auth.create_user(
            email=email,
            password=password
        )
        return user
    except Exception as e:
        print(f"Error creating user: {e}")
        return None