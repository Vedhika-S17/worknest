from extensions import db

class Skill(db.Model):
    __tablename__ = 'skills'

    skill_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
