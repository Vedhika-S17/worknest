from models.user_model import User
from extensions import db
from passlib.hash import bcrypt
from sqlalchemy.exc import IntegrityError
from utils.auth import generate_tokens

def register_user(data):
    try:
        hashed_password = bcrypt.hash(data['password'])
        new_user = User(
            phone_number=data['phone_number'],
            email=data['email'],
            password_hash=hashed_password,
            role=data['role']
        )
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User created successfully"}, 201
    except IntegrityError:
        db.session.rollback()
        return {"error": "User with that phone or email already exists"}, 409

def login_user(data):
    user = User.query.filter_by(phone_number=data["phone_number"]).first()
    if not user or not bcrypt.verify(data["password"], user.password_hash):
        return {"error": "Invalid credentials"}, 401
    if user.status == "blacklisted":
        return {"error": "User is blacklisted"}, 403

    access_token, refresh_token = generate_tokens({
        "phone_number": user.phone_number,
        "role": user.role
    })
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }, 200
