from extensions import db

class UserSkill(db.Model):
    __tablename__ = 'user_skills'

    skill_id = db.Column(db.Integer, db.ForeignKey('skills.skill_id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
