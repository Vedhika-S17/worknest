from extensions import db

class ProjectAssignment(db.Model):
    __tablename__ = 'project_assignments'

    assignment_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    assigned_role = db.Column(db.String(100))
    progress_status = db.Column(db.String(30))
    assigned_at = db.Column(db.DateTime, server_default=db.func.now())
