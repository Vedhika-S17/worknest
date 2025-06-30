from extensions import db

class ProjectSkill(db.Model):
    __tablename__ = 'project_skills'

    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.skill_id'), primary_key=True)
