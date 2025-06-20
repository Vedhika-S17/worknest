# models/profile_model.py

from extensions import db

class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    profile_id = db.Column(db.Integer, primary_key=True)
    phone_number = db.Column(db.String(15), db.ForeignKey('users.phone_number'), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100))
    bio = db.Column(db.Text)
    experience_level = db.Column(db.String(50))
    goal = db.Column(db.String(100))
    work_type = db.Column(db.String(100))  # stored as comma-separated string
    hourly_rate = db.Column(db.Numeric(6, 2))
    location = db.Column(db.String(100))
    availability = db.Column(db.String(50))
    profile_image = db.Column(db.String(255))
    languages = db.Column(db.JSON)  # List of strings
    profile_completion_pct = db.Column(db.Integer, default=0)
