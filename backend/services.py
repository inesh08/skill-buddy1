from firebase_admin import firestore
from models import User, InterviewSession, InterviewResponse, Feedback, INTERVIEW_QUESTIONS_DB
from datetime import datetime
import random

class UserService:
    def __init__(self, db):
        self.db = db
    
    def create_user(self, uid, email):
        """Create a new user in Firestore"""
        user = User(uid, email)
        self.db.collection('users').document(uid).set(user.to_dict())
        return user
    
    def get_user(self, uid):
        """Get user by UID"""
        doc = self.db.collection('users').document(uid).get()
        if doc.exists:
            return doc.to_dict()
        return None
    
    def update_user(self, uid, data):
        """Update user data"""
        self.db.collection('users').document(uid).update(data)

class InterviewService:
    def __init__(self, db):
        self.db = db
    
    def get_questions_by_career(self, career_path):
        """Get interview questions for a specific career path"""
        if career_path in INTERVIEW_QUESTIONS_DB:
            questions = INTERVIEW_QUESTIONS_DB[career_path]
            return [q.to_dict() for q in questions]
        return []
    
    def get_random_questions(self, career_path, count=5):
        """Get random questions for a career path"""
        all_questions = self.get_questions_by_career(career_path)
        if len(all_questions) <= count:
            return all_questions
        return random.sample(all_questions, count)
    
    def create_session(self, user_id, career_path):
        """Create a new interview session"""
        session = InterviewSession(user_id, career_path)
        session_ref = self.db.collection('interview_sessions').add(session.to_dict())
        session.session_id = session_ref[1].id
        
        # Update the document with the session ID
        self.db.collection('interview_sessions').document(session.session_id).update({
            'session_id': session.session_id
        })
        
        return session
    
    def get_session(self, session_id):
        """Get interview session by ID"""
        doc = self.db.collection('interview_sessions').document(session_id).get()
        if doc.exists:
            return doc.to_dict()
        return None
    
    def add_response_to_session(self, session_id, question_id, response_text):
        """Add a response to an interview session"""
        session_ref = self.db.collection('interview_sessions').document(session_id)
        session_doc = session_ref.get()
        
        if not session_doc.exists:
            return None
        
        session_data = session_doc.to_dict()
        
        # Create response object
        response = InterviewResponse(question_id, response_text)
        
        # Add response to session
        session_data['responses'].append(response.to_dict())
        session_data['current_question'] = question_id + 1
        
        # Update session
        session_ref.update(session_data)
        
        return session_data
    
    def complete_session(self, session_id):
        """Mark an interview session as completed"""
        session_ref = self.db.collection('interview_sessions').document(session_id)
        session_ref.update({
            'status': 'completed',
            'completed_at': datetime.now()
        })
    
    def get_user_sessions(self, user_id):
        """Get all interview sessions for a user"""
        sessions = self.db.collection('interview_sessions').where('user_id', '==', user_id).get()
        
        sessions_data = []
        for session in sessions:
            session_data = session.to_dict()
            session_data['id'] = session.id
            sessions_data.append(session_data)
        
        return sessions_data
    
    def get_session_statistics(self, user_id):
        """Get statistics for user's interview sessions"""
        sessions = self.get_user_sessions(user_id)
        
        total_sessions = len(sessions)
        completed_sessions = len([s for s in sessions if s.get('status') == 'completed'])
        
        career_paths = {}
        for session in sessions:
            career = session.get('career_path', 'Unknown')
            career_paths[career] = career_paths.get(career, 0) + 1
        
        return {
            'total_sessions': total_sessions,
            'completed_sessions': completed_sessions,
            'completion_rate': (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0,
            'career_paths': career_paths
        }

class FeedbackService:
    def __init__(self, db):
        self.db = db
    
    def submit_feedback(self, user_id, session_id, rating, comments=None):
        """Submit feedback for an interview session"""
        feedback = Feedback(user_id, session_id, rating, comments)
        self.db.collection('feedback').add(feedback.to_dict())
        return feedback
    
    def get_session_feedback(self, session_id):
        """Get feedback for a specific session"""
        feedback_docs = self.db.collection('feedback').where('session_id', '==', session_id).get()
        
        feedback_list = []
        for doc in feedback_docs:
            feedback_data = doc.to_dict()
            feedback_data['id'] = doc.id
            feedback_list.append(feedback_data)
        
        return feedback_list
    
    def get_user_feedback(self, user_id):
        """Get all feedback submitted by a user"""
        feedback_docs = self.db.collection('feedback').where('user_id', '==', user_id).get()
        
        feedback_list = []
        for doc in feedback_docs:
            feedback_data = doc.to_dict()
            feedback_data['id'] = doc.id
            feedback_list.append(feedback_data)
        
        return feedback_list
    
    def get_average_rating(self):
        """Get average rating across all feedback"""
        feedback_docs = self.db.collection('feedback').get()
        
        if not feedback_docs:
            return 0
        
        total_rating = 0
        count = 0
        
        for doc in feedback_docs:
            feedback_data = doc.to_dict()
            total_rating += feedback_data.get('rating', 0)
            count += 1
        
        return total_rating / count if count > 0 else 0