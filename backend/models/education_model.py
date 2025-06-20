from extensions import db

class Education(db.Model):
    __tablename__ = 'educations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    from_date = db.Column(db.Date)
    to_date = db.Column(db.Date)
