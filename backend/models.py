from datetime import datetime
from typing import List, Dict, Optional

class User:
    def __init__(self, uid: str, email: str, created_at: datetime = None):
        self.uid = uid
        self.email = email
        self.created_at = created_at or datetime.now()
        self.interview_sessions = []
    
    def to_dict(self):
        return {
            'uid': self.uid,
            'email': self.email,
            'created_at': self.created_at,
            'interview_sessions': self.interview_sessions
        }

class InterviewQuestion:
    def __init__(self, id: int, question: str, category: str, difficulty: str):
        self.id = id
        self.question = question
        self.category = category
        self.difficulty = difficulty
    
    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'category': self.category,
            'difficulty': self.difficulty
        }

class InterviewResponse:
    def __init__(self, question_id: int, response: str, timestamp: datetime = None):
        self.question_id = question_id
        self.response = response
        self.timestamp = timestamp or datetime.now()
    
    def to_dict(self):
        return {
            'question_id': self.question_id,
            'response': self.response,
            'timestamp': self.timestamp
        }

class InterviewSession:
    def __init__(self, user_id: str, career_path: str, session_id: str = None):
        self.session_id = session_id
        self.user_id = user_id
        self.career_path = career_path
        self.started_at = datetime.now()
        self.completed_at = None
        self.status = 'in_progress'  # in_progress, completed, abandoned
        self.current_question = 0
        self.responses = []
    
    def add_response(self, response: InterviewResponse):
        self.responses.append(response)
        self.current_question += 1
    
    def complete_session(self):
        self.status = 'completed'
        self.completed_at = datetime.now()
    
    def to_dict(self):
        return {
            'session_id': self.session_id,
            'user_id': self.user_id,
            'career_path': self.career_path,
            'started_at': self.started_at,
            'completed_at': self.completed_at,
            'status': self.status,
            'current_question': self.current_question,
            'responses': [r.to_dict() if isinstance(r, InterviewResponse) else r for r in self.responses]
        }

class Feedback:
    def __init__(self, user_id: str, session_id: str, rating: int, comments: str = None):
        self.user_id = user_id
        self.session_id = session_id
        self.rating = rating
        self.comments = comments
        self.submitted_at = datetime.now()
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'session_id': self.session_id,
            'rating': self.rating,
            'comments': self.comments,
            'submitted_at': self.submitted_at
        }

# Interview Questions Database
INTERVIEW_QUESTIONS_DB = {
    'SoftwareDev': [
        InterviewQuestion(1, 'Can you explain the difference between REST and GraphQL?', 'API Design', 'intermediate'),
        InterviewQuestion(2, 'What is the difference between synchronous and asynchronous programming?', 'Programming Concepts', 'intermediate'),
        InterviewQuestion(3, 'Explain the concept of Big O notation and its importance.', 'Algorithms', 'intermediate'),
        InterviewQuestion(4, 'What are the main principles of object-oriented programming?', 'Programming Concepts', 'beginner'),
        InterviewQuestion(5, 'How do you handle errors in your code?', 'Error Handling', 'intermediate'),
        InterviewQuestion(6, 'What is the difference between SQL and NoSQL databases?', 'Databases', 'intermediate'),
        InterviewQuestion(7, 'Explain the concept of version control and Git.', 'Tools', 'beginner'),
        InterviewQuestion(8, 'What is test-driven development (TDD)?', 'Testing', 'intermediate'),
        InterviewQuestion(9, 'How do you optimize code performance?', 'Performance', 'advanced'),
        InterviewQuestion(10, 'Explain the concept of microservices architecture.', 'Architecture', 'advanced')
    ],
    'DataAnalyst': [
        InterviewQuestion(1, 'What tools do you use for data visualization?', 'Tools', 'beginner'),
        InterviewQuestion(2, 'How would you handle missing data in a dataset?', 'Data Cleaning', 'intermediate'),
        InterviewQuestion(3, 'Explain the difference between correlation and causation.', 'Statistics', 'intermediate'),
        InterviewQuestion(4, 'What is the difference between mean, median, and mode?', 'Statistics', 'beginner'),
        InterviewQuestion(5, 'How do you validate the accuracy of your analysis?', 'Data Quality', 'intermediate'),
        InterviewQuestion(6, 'Explain A/B testing and its importance.', 'Testing', 'intermediate'),
        InterviewQuestion(7, 'What is the difference between supervised and unsupervised learning?', 'Machine Learning', 'intermediate'),
        InterviewQuestion(8, 'How do you handle outliers in your data?', 'Data Cleaning', 'intermediate'),
        InterviewQuestion(9, 'Explain the concept of data normalization.', 'Data Processing', 'intermediate'),
        InterviewQuestion(10, 'What are KPIs and how do you choose them?', 'Business Intelligence', 'intermediate')
    ],
    'UIDesigner': [
        InterviewQuestion(1, 'How do you approach user research for a new design project?', 'User Research', 'intermediate'),
        InterviewQuestion(2, 'What is the difference between UX and UI design?', 'Design Fundamentals', 'beginner'),
        InterviewQuestion(3, 'How do you ensure accessibility in your designs?', 'Accessibility', 'intermediate'),
        InterviewQuestion(4, 'Explain the design thinking process.', 'Design Process', 'intermediate'),
        InterviewQuestion(5, 'What are design systems and why are they important?', 'Design Systems', 'intermediate'),
        InterviewQuestion(6, 'How do you handle user feedback on your designs?', 'User Feedback', 'intermediate'),
        InterviewQuestion(7, 'What is responsive design and how do you implement it?', 'Responsive Design', 'intermediate'),
        InterviewQuestion(8, 'Explain the concept of information architecture.', 'Information Architecture', 'intermediate'),
        InterviewQuestion(9, 'How do you measure the success of a design?', 'Design Metrics', 'intermediate'),
        InterviewQuestion(10, 'What are the latest design trends you follow?', 'Design Trends', 'beginner')
    ],
    'DigitalMarketer': [
        InterviewQuestion(1, 'Explain how you would run a successful paid ad campaign.', 'Paid Advertising', 'intermediate'),
        InterviewQuestion(2, 'What metrics do you track for email marketing campaigns?', 'Email Marketing', 'intermediate'),
        InterviewQuestion(3, 'How do you measure the ROI of social media marketing?', 'Social Media', 'intermediate'),
        InterviewQuestion(4, 'Explain the concept of marketing funnel.', 'Marketing Strategy', 'beginner'),
        InterviewQuestion(5, 'What is SEO and how do you optimize for it?', 'SEO', 'intermediate'),
        InterviewQuestion(6, 'How do you segment your audience for campaigns?', 'Audience Targeting', 'intermediate'),
        InterviewQuestion(7, 'What is content marketing and its benefits?', 'Content Marketing', 'beginner'),
        InterviewQuestion(8, 'How do you handle negative feedback on social media?', 'Social Media Management', 'intermediate'),
        InterviewQuestion(9, 'Explain the concept of marketing automation.', 'Marketing Automation', 'intermediate'),
        InterviewQuestion(10, 'What are the key components of a digital marketing strategy?', 'Marketing Strategy', 'intermediate')
    ]
}