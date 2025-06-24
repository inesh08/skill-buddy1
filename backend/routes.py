from flask import Blueprint, request, jsonify
from firebase_admin import auth
from services import UserService, InterviewService, FeedbackService
from firebase_config import verify_user_token
import logging

# Create blueprints for different route groups
auth_bp = Blueprint('auth', __name__)
interview_bp = Blueprint('interview', __name__)
user_bp = Blueprint('user', __name__)
feedback_bp = Blueprint('feedback', __name__)

def create_routes(db):
    # Initialize services
    user_service = UserService(db)
    interview_service = InterviewService(db)
    feedback_service = FeedbackService(db)
    
    # Authentication Routes
    @auth_bp.route('/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return jsonify({'error': 'Email and password are required'}), 400
            
            # Create user in Firebase Auth
            user = auth.create_user(
                email=email,
                password=password
            )
            
            # Store additional user data in Firestore
            user_service.create_user(user.uid, email)
            
            return jsonify({
                'message': 'User created successfully',
                'user_id': user.uid
            }), 201
            
        except auth.EmailAlreadyExistsError:
            return jsonify({'error': 'Email already exists'}), 400
        except Exception as e:
            logging.error(f"Registration error: {e}")
            return jsonify({'error': 'Registration failed'}), 500

    @auth_bp.route('/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            
            # Support both email/password and token-based login
            email = data.get('email')
            password = data.get('password')
            id_token = data.get('id_token')
            
            if email and password:
                # Development mode: email/password login
                # Check if user exists in Firestore by email
                users_ref = db.collection('users')
                user_query = users_ref.where('email', '==', email).limit(1)
                users = user_query.get()
                
                if users:
                    user_doc = users[0]
                    user_data = user_doc.to_dict()
                    user_id = user_doc.id
                    
                    return jsonify({
                        'message': 'Login successful',
                        'user_id': user_id,
                        'email': user_data.get('email'),
                        'uid': user_id
                    }), 200
                else:
                    return jsonify({'error': 'User not found. Please register first.'}), 404
                    
            elif id_token:
                # Production mode: Firebase token verification
                decoded_token = verify_user_token(id_token)
                if not decoded_token:
                    return jsonify({'error': 'Invalid token'}), 401
                
                user_id = decoded_token['uid']
                
                # Get user data from Firestore
                user_data = user_service.get_user(user_id)
                
                if user_data:
                    return jsonify({
                        'message': 'Login successful',
                        'user_id': user_id,
                        'email': user_data.get('email'),
                        'uid': user_id
                    }), 200
                else:
                    return jsonify({'error': 'User not found'}), 404
            else:
                return jsonify({'error': 'Email and password, or ID token is required'}), 400
                
        except Exception as e:
            logging.error(f"Login error: {e}")
            return jsonify({'error': 'Login failed'}), 401

    @auth_bp.route('/logout', methods=['POST'])
    def logout():
        try:
            data = request.get_json()
            id_token = data.get('id_token')
            
            if id_token:
                # Revoke the user's tokens
                decoded_token = verify_user_token(id_token)
                if decoded_token:
                    auth.revoke_refresh_tokens(decoded_token['uid'])
            
            return jsonify({'message': 'Logged out successfully'}), 200
        except Exception as e:
            logging.error(f"Logout error: {e}")
            return jsonify({'error': 'Logout failed'}), 500

    # Interview Routes
    @interview_bp.route('/questions/<career_path>', methods=['GET'])
    def get_questions(career_path):
        try:
            count = request.args.get('count', type=int)
            
            if count:
                questions = interview_service.get_random_questions(career_path, count)
            else:
                questions = interview_service.get_questions_by_career(career_path)
            
            if not questions:
                return jsonify({'error': 'Invalid career path'}), 400
            
            return jsonify({
                'career_path': career_path,
                'questions': questions,
                'total': len(questions)
            }), 200
            
        except Exception as e:
            logging.error(f"Get questions error: {e}")
            return jsonify({'error': 'Failed to fetch questions'}), 500

    @interview_bp.route('/start', methods=['POST'])
    def start_interview():
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            career_path = data.get('career_path')
            
            if not user_id or not career_path:
                return jsonify({'error': 'User ID and career path are required'}), 400
            
            # Create interview session
            session = interview_service.create_session(user_id, career_path)
            questions = interview_service.get_questions_by_career(career_path)
            
            return jsonify({
                'message': 'Interview session started',
                'session_id': session.session_id,
                'questions': questions,
                'career_path': career_path
            }), 201
            
        except Exception as e:
            logging.error(f"Start interview error: {e}")
            return jsonify({'error': 'Failed to start interview'}), 500

    @interview_bp.route('/response', methods=['POST'])
    def submit_response():
        try:
            data = request.get_json()
            session_id = data.get('session_id')
            question_id = data.get('question_id')
            response = data.get('response')
            
            if not session_id or question_id is None or not response:
                return jsonify({'error': 'Session ID, question ID, and response are required'}), 400
            
            # Add response to session
            updated_session = interview_service.add_response_to_session(
                session_id, question_id, response
            )
            
            if not updated_session:
                return jsonify({'error': 'Session not found'}), 404
            
            return jsonify({
                'message': 'Response submitted successfully',
                'current_question': updated_session.get('current_question', 0),
                'total_responses': len(updated_session.get('responses', []))
            }), 200
            
        except Exception as e:
            logging.error(f"Submit response error: {e}")
            return jsonify({'error': 'Failed to submit response'}), 500

    @interview_bp.route('/end', methods=['POST'])
    def end_interview():
        try:
            data = request.get_json()
            session_id = data.get('session_id')
            
            if not session_id:
                return jsonify({'error': 'Session ID is required'}), 400
            
            # Complete the session
            interview_service.complete_session(session_id)
            
            return jsonify({
                'message': 'Interview session completed successfully'
            }), 200
            
        except Exception as e:
            logging.error(f"End interview error: {e}")
            return jsonify({'error': 'Failed to end interview'}), 500

    @interview_bp.route('/session/<session_id>', methods=['GET'])
    def get_session(session_id):
        try:
            session_data = interview_service.get_session(session_id)
            
            if not session_data:
                return jsonify({'error': 'Session not found'}), 404
            
            return jsonify({
                'session': session_data
            }), 200
            
        except Exception as e:
            logging.error(f"Get session error: {e}")
            return jsonify({'error': 'Failed to fetch session'}), 500

    # User Routes
    @user_bp.route('/profile/<user_id>', methods=['GET'])
    def get_user_profile(user_id):
        try:
            user_data = user_service.get_user(user_id)
            
            if not user_data:
                return jsonify({'error': 'User not found'}), 404
            
            # Get user statistics
            stats = interview_service.get_session_statistics(user_id)
            
            return jsonify({
                'user': user_data,
                'statistics': stats
            }), 200
            
        except Exception as e:
            logging.error(f"Get user profile error: {e}")
            return jsonify({'error': 'Failed to fetch user profile'}), 500

    @user_bp.route('/sessions/<user_id>', methods=['GET'])
    def get_user_sessions(user_id):
        try:
            sessions = interview_service.get_user_sessions(user_id)
            
            return jsonify({
                'user_id': user_id,
                'sessions': sessions,
                'total': len(sessions)
            }), 200
            
        except Exception as e:
            logging.error(f"Get user sessions error: {e}")
            return jsonify({'error': 'Failed to fetch user sessions'}), 500

    @user_bp.route('/update/<user_id>', methods=['PUT'])
    def update_user_profile(user_id):
        try:
            data = request.get_json()
            
            # Remove sensitive fields that shouldn't be updated
            allowed_fields = ['name', 'bio', 'preferences', 'updated_at']
            update_data = {k: v for k, v in data.items() if k in allowed_fields}
            
            if not update_data:
                return jsonify({'error': 'No valid fields to update'}), 400
            
            user_service.update_user(user_id, update_data)
            
            return jsonify({
                'message': 'Profile updated successfully'
            }), 200
            
        except Exception as e:
            logging.error(f"Update user profile error: {e}")
            return jsonify({'error': 'Failed to update profile'}), 500

    # Feedback Routes
    @feedback_bp.route('/submit', methods=['POST'])
    def submit_feedback():
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            session_id = data.get('session_id')
            rating = data.get('rating')
            comments = data.get('comments')
            
            if not user_id or not session_id or not rating:
                return jsonify({'error': 'User ID, session ID, and rating are required'}), 400
            
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
            
            # Submit feedback
            feedback_service.submit_feedback(user_id, session_id, rating, comments)
            
            return jsonify({
                'message': 'Feedback submitted successfully'
            }), 201
            
        except Exception as e:
            logging.error(f"Submit feedback error: {e}")
            return jsonify({'error': 'Failed to submit feedback'}), 500

    @feedback_bp.route('/session/<session_id>', methods=['GET'])
    def get_session_feedback(session_id):
        try:
            feedback_list = feedback_service.get_session_feedback(session_id)
            
            return jsonify({
                'session_id': session_id,
                'feedback': feedback_list,
                'total': len(feedback_list)
            }), 200
            
        except Exception as e:
            logging.error(f"Get session feedback error: {e}")
            return jsonify({'error': 'Failed to fetch session feedback'}), 500

    @feedback_bp.route('/user/<user_id>', methods=['GET'])
    def get_user_feedback(user_id):
        try:
            feedback_list = feedback_service.get_user_feedback(user_id)
            
            return jsonify({
                'user_id': user_id,
                'feedback': feedback_list,
                'total': len(feedback_list)
            }), 200
            
        except Exception as e:
            logging.error(f"Get user feedback error: {e}")
            return jsonify({'error': 'Failed to fetch user feedback'}), 500

    @feedback_bp.route('/average-rating', methods=['GET'])
    def get_average_rating():
        try:
            avg_rating = feedback_service.get_average_rating()
            
            return jsonify({
                'average_rating': round(avg_rating, 2)
            }), 200
            
        except Exception as e:
            logging.error(f"Get average rating error: {e}")
            return jsonify({'error': 'Failed to fetch average rating'}), 500

    return auth_bp, interview_bp, user_bp, feedback_bp