from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_config import initialize_firebase
from routes import create_routes
import logging
import os
from config import config

def create_app(config_name='default'):
    # Initialize Flask app
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Enable CORS
    CORS(app, origins=['*'])  # Configure origins based on your frontend URL
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s %(message)s'
    )
    
    # Initialize Firebase
    db = initialize_firebase()
    if not db:
        app.logger.error("Failed to initialize Firebase")
        return None
    
    # Create and register blueprints
    auth_bp, interview_bp, user_bp, feedback_bp = create_routes(db)
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(interview_bp, url_prefix='/api/interview')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    
    # Health check endpoint
    @app.route('/')
    def health_check():
        return jsonify({
            'message': 'Interview Prep API is running!',
            'status': 'healthy',
            'version': '1.0.0'
        })
    
    @app.route('/api/health')
    def api_health():
        return jsonify({
            'status': 'healthy',
            'database': 'connected' if db else 'disconnected',
            'timestamp': '2025-06-24T12:00:00Z'
        })
    
    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized'}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden'}), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'error': 'Method not allowed'}), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal error: {error}")
        return jsonify({'error': 'Internal server error'}), 500
    
    # Request logging middleware
    @app.before_request
    def log_request_info():
        app.logger.info(f"{request.method} {request.url} - {request.remote_addr}")
    
    @app.after_request
    def log_response_info(response):
        app.logger.info(f"Response: {response.status_code}")
        return response
    
    return app

if __name__ == '__main__':
    # Get configuration from environment
    config_name = os.environ.get('FLASK_ENV', 'development')
    
    # Create app
    app = create_app(config_name)
    
    if app:
        # Run the application
        port = int(os.environ.get('PORT', 5000))
        debug = config_name == 'development'
        
        app.run(
            debug=debug,
            host='0.0.0.0',
            port=port
        )
    else:
        print("Failed to create application")