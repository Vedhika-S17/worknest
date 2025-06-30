
from flask import Blueprint, request, jsonify
from extensions import db
from models.user_model import User
from models.profile_model import UserProfile
from schemas.user_schema import UserSignupSchema, UserLoginSchema
from passlib.hash import bcrypt_sha256
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_refresh_cookies,
    unset_jwt_cookies
)
from datetime import timedelta

auth_bp = Blueprint("auth", __name__)

signup_schema = UserSignupSchema()
login_schema = UserLoginSchema()

# ------------------- SIGNUP -------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    required = ["phone_number", "email", "password", "role"]
    if not all(k in data for k in required):
        return jsonify({"message": "Missing required fields"}), 400

    if User.query.filter_by(phone_number=data["phone_number"]).first():
        return jsonify({"message": "Phone number already exists"}), 409

    hashed_pw = bcrypt_sha256.hash(data["password"])
    user = User(
        phone_number=data["phone_number"],
        email=data["email"],
        password_hash=hashed_pw,
        role=data["role"]
    )
    db.session.add(user)
    db.session.commit()

    # Basic empty profile — onboarding will populate rest
    profile = UserProfile(
        phone_number=user.phone_number,
        profile_completion_pct=0,
        full_name="",
        bio="",
        hourly_rate=None,
        availability=None,
        experience_level=None,
        goal=None,
        work_type=""
    )
    db.session.add(profile)
    db.session.commit()

#identity = {
    #       "phone_number": user.phone_number,
    #      "role": user.role
    # }

    access_token = create_access_token(identity=str(user.phone_number), expires_delta=timedelta(minutes=30))
    refresh_token = create_refresh_token(identity=str(user.phone_number))  #HERE IT IS ALREADY STRING. 

    resp = jsonify({
        "access_token": access_token,
        "role": user.role,
        "refresh_token": refresh_token,
        "message": "Signup successful"
    })
    set_refresh_cookies(resp, refresh_token)
    return resp, 201

# ------------------- LOGIN -------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print("Login data received:", data)

    errors = login_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    user = User.query.filter_by(phone_number=data["phone_number"]).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        match = bcrypt_sha256.verify(data["password"], user.password_hash)
    except Exception:
        return jsonify({"error": "Password verification failed"}), 500

    if not match:
        return jsonify({"error": "Invalid credentials"}), 401

    if user.status == "blacklisted":
        return jsonify({"error": "User is blacklisted"}), 403

    identity = {
        "phone_number": user.phone_number,
        "role": user.role
    }

    access_token = create_access_token(identity=user.phone_number)  #CHANGE TO STRING.
    refresh_token = create_refresh_token(identity=identity)

    resp = jsonify({
        "access_token": access_token,
        "refresh_token":refresh_token,
        "role": user.role, 
        "message": "Login successful"
    })

    set_refresh_cookies(resp, refresh_token)
    return resp, 200

# ------------------- REFRESH TOKEN -------------------
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity, expires_delta=timedelta(minutes=30)) #CHANGE TO STRING
    return jsonify({"access_token": new_access_token}), 200

# ------------------- LOGOUT -------------------
@auth_bp.route("/logout", methods=["POST"])
def logout():
    resp = jsonify({"message": "Logged out successfully"})
    unset_jwt_cookies(resp)
    return resp, 200

# ------------------- GET CURRENT USER -------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    identity = get_jwt_identity()

    # If your identity is just the phone number:
    user = User.query.filter_by(phone_number=identity).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "phone_number": user.phone_number,
        "role": user.role
    }), 200

