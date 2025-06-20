from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.profile_model import UserProfile
from schemas.profile_schema import UserProfileSchema
from marshmallow import ValidationError
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

import os
print("🧠 Running file:", os.path.abspath(__file__))

onboarding_bp = Blueprint("onboarding", __name__, url_prefix="/api/onboarding")

# Initialize schema
profile_schema = UserProfileSchema()

print("🧠 Running file:", os.path.abspath(__file__))

onboarding_bp = Blueprint("onboarding", __name__, url_prefix="/api/onboarding")
profile_schema = UserProfileSchema()

print("going somewhere")
@onboarding_bp.route("/debug-onboarding", methods=["POST"])
@jwt_required()
def onboarding():
    print("✅ ONBOARDING ROUTE HIT")

    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()

    except Exception as e:
        print("❌ Token error:", str(e))
        return jsonify({"message": "Missing or invalid token", "error": str(e)}), 401
        
    if not identity:
        return jsonify({"message": "Token required"}), 401

    phone_number = identity.get("phone_number") if isinstance(identity, dict) else identity
    print("📞 Authenticated phone:", phone_number)

    print("[DEBUG] Content-Type:", request.content_type)
    print("[DEBUG] Raw body bytes:", request.data)

    try:
        raw_data = request.get_json(force=True)
        print("[DEBUG] Parsed JSON:", raw_data)
    except Exception as e:
        print("❌ JSON parsing failed:", str(e))
        return jsonify({"message": "Invalid JSON", "error": str(e)}), 400

    # Normalize hourly_rate if it's a string
    if "hourly_rate" in raw_data:
        try:
            if isinstance(raw_data["hourly_rate"], str):
                raw_data["hourly_rate"] = float(raw_data["hourly_rate"])
        except ValueError:
            return jsonify({"message": "hourly_rate must be a number"}), 422

    # Normalize work_type string to list
    #  if isinstance(raw_data.get("work_type"), str):
    #  raw_data["work_type"] = [w.strip() for w in raw_data["work_type"].split(",") if w.strip()]

    # Normalize languages string to list
    if isinstance(raw_data.get("languages"), str):
        raw_data["languages"] = [lang.strip() for lang in raw_data["languages"].split(",") if lang.strip()]

    # Marshmallow validation
    try:
        errors = profile_schema.validate(raw_data)
        if errors:
            print("❌ Marshmallow validation errors:", errors)
            return jsonify({"message": "Validation error", "errors": errors}), 422
    except ValidationError as ve:
        print("❌ Marshmallow raised ValidationError")
        return jsonify({"message": "Validation error", "errors": ve.messages}), 422

    # Load into schema
    try:
        data = profile_schema.load(raw_data)
    except ValidationError as ve:
        print("❌ Failed to load schema:", ve.messages)
        return jsonify({"message": "Schema load failed", "errors": ve.messages}), 422

    # Prepare work_type CSV string for DB
    work_type = ",".join(data["work_type"]) if isinstance(data["work_type"], list) else data["work_type"]

    # Get or create the user profile
    profile = UserProfile.query.filter_by(phone_number=phone_number).first()
    if not profile:
        profile = UserProfile(phone_number=phone_number)

    # Assign values to profile
    profile.full_name = data["full_name"]
    profile.title = data.get("title", "")
    profile.bio = data.get("bio", "")
    profile.experience_level = data["experience_level"]
    profile.goal = data["goal"]
    profile.work_type = work_type
    profile.hourly_rate = data.get("hourly_rate")
    profile.location = data.get("location", "")
    profile.availability = data.get("availability", "")
    profile.profile_image = data.get("profile_image", "")
    profile.languages = data.get("languages", [])
    profile.profile_completion_pct = 10

    try:
        db.session.add(profile)  
        db.session.commit()
        print("✅ Profile saved successfully")
        return jsonify({"message": "Onboarding saved successfully"}), 200
    except Exception as e:
        print("🔥 DB commit failed:", str(e))
        db.session.rollback()
        return jsonify({"message": "Database error", "error": str(e)}), 500

