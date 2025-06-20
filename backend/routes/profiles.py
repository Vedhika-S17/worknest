from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.profile_model import UserProfile
from schemas.profile_schema import UserProfileSchema
from extensions import db

profiles_bp = Blueprint("profiles", __name__)

@profiles_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():


    #identity = get_jwt_identity()
    #phone_number = identity["phone_number"]

    #profile = UserProfile.query.filter_by(phone_number=phone_number).first()
    phone_number = get_jwt_identity()
    profile = UserProfile.query.filter_by(phone_number=phone_number).first()
    if not profile:
        return jsonify({"message": "Profile not found"}), 404

    schema = UserProfileSchema()
    return jsonify(schema.dump(profile)), 200
'''
@profiles_bp.route("/profile", methods=["POST"])
@jwt_required()
def create_or_update_profile():
    identity = get_jwt_identity()
    phone_number = identity["phone_number"]
    data = request.get_json()

    profile = UserProfile.query.filter_by(phone_number=phone_number).first()

    if not profile:
        profile = UserProfile(phone_number=phone_number)

    # Update fields
    profile.full_name = data.get("full_name")
    profile.title = data.get("title")
    profile.bio = data.get("bio")
    profile.hourly_rate = data.get("hourly_rate")
    profile.location = data.get("location")
    profile.availability = data.get("availability")
    profile.profile_image = data.get("profile_image")
    profile.languages = data.get("languages")
    profile.experience_level = data.get("experience_level")
    profile.goal = data.get("goal")
    profile.work_type = data.get("work_type")
    profile.profile_completion_pct = data.get("profile_completion_pct")

    try:
        db.session.add(profile)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error saving profile", "error": str(e)}), 500

    return jsonify({"message": "Profile saved successfully"}), 200

@profiles_bp.route("/", methods=["OPTIONS"])
def profiles_root_options():
    return jsonify({"message": "OK"}), 200
'''