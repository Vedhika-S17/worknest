from extensions import db

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, unique=True, autoincrement=True)
    phone_number = db.Column(db.String(15), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.Enum('freelancer', 'admin'), default='freelancer')
    status = db.Column(db.Enum('active', 'blacklisted'), default='active')
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
