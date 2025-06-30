from extensions import db
from datetime import datetime

class ProjectRequest(db.Model):
    __tablename__ = 'project_requests'

    request_id = db.Column(db.Integer, primary_key=True)
    
    project_id = db.Column(
        db.Integer,
        db.ForeignKey('projects.project_id', ondelete="CASCADE"),
        nullable=False
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.user_id', ondelete="CASCADE"),
        nullable=False
    )
    admin_id = db.Column(
        db.Integer,
        db.ForeignKey('users.user_id', ondelete="CASCADE"),
        nullable=False
    )
    
    # ✅ Name the Enum to avoid autogenerate migration errors
    status = db.Column(
        db.Enum('pending', 'approved', 'rejected', name='statusenum'),
        default='pending'
    )
    requested_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        server_default=db.func.now()
    )

    # ✅ Relationships
    project = db.relationship('Project', backref='requests', lazy=True)

    user = db.relationship(
        'User',
        foreign_keys=[user_id],
        backref='project_requests',
        lazy=True
    )

    admin = db.relationship(
        'User',
        foreign_keys=[admin_id],
        backref='received_requests',
        lazy=True
    )
