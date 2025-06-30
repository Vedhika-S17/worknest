from extensions import db

class UserBackground(db.Model):
    __tablename__ = 'user_backgrounds'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    type = db.Column(db.Enum('education', 'certification', 'experience'), nullable=False)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    from_date = db.Column(db.Date)
    to_date = db.Column(db.Date)
