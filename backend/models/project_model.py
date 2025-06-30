from extensions import db
from datetime import datetime

class Project(db.Model):
    __tablename__ = 'projects'

    project_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, server_default=db.func.now())

    admin_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)

    # Relationships
    admin = db.relationship('User', backref='projects_created', lazy=True)
