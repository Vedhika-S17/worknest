from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.profile_model import UserProfile
from schemas.profile_schema import UserProfileSchema
from extensions import db
from models.user_background_model import UserBackground
from models.user_skill_model import UserSkill
from models.user_model import User
from models.skill_model import Skill

profiles_bp = Blueprint("profiles", __name__)

@profiles_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    phone_number = get_jwt_identity()
    user = User.query.filter_by(phone_number=phone_number).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    profile = UserProfile.query.filter_by(phone_number=phone_number).first()
    if not profile:
        return jsonify({"message": "Profile not found"}), 404

    schema = UserProfileSchema()
    profile_data = schema.dump(profile)

    # Optional: Include user backgrounds
    try:
        backgrounds = UserBackground.query.filter_by(user_id=user.user_id).all()
        profile_data["backgrounds"] = [
            {
                "type": b.type,
                "title": b.title,
                "description": b.description,
                "from_date": b.from_date.isoformat() if b.from_date else None,
                "to_date": b.to_date.isoformat() if b.to_date else None,
            }
            for b in backgrounds
        ]
    except:
        profile_data["backgrounds"] = []

    # Optional: Include user skills
    try:
        user_skill_ids = [s.skill_id for s in UserSkill.query.filter_by(user_id=user.user_id).all()]
        skill_names = [s.name for s in Skill.query.filter(Skill.skill_id.in_(user_skill_ids)).all()]
        profile_data["skills"] = skill_names
    except:
        profile_data["skills"] = []

    return jsonify(profile_data), 200

@profiles_bp.route("/edit-details", methods=["POST"])
@jwt_required()
def update_user_backgrounds_and_skills():
    identity = get_jwt_identity()
    user = User.query.filter_by(phone_number=identity).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    backgrounds = data.get("backgrounds", [])
    skills = data.get("skills", [])

    UserBackground.query.filter_by(user_id=user.user_id).delete()
    UserSkill.query.filter_by(user_id=user.user_id).delete()

    for item in backgrounds:
        new_bg = UserBackground(
            user_id=user.user_id,
            type=item["type"],
            title=item.get("title"),
            description=item.get("description"),
            from_date=item.get("from_date"),
            to_date=item.get("to_date"),
        )
        db.session.add(new_bg)

    for skill_id in skills:
        db.session.add(UserSkill(user_id=user.user_id, skill_id=skill_id))

    db.session.commit()
    return jsonify({"message": "Profile details updated successfully."}), 200

@profiles_bp.route("/adminprofiles", methods=["GET"])
@jwt_required()
def get_admin_profile():
    identity = get_jwt_identity()
    user = User.query.filter_by(phone_number=identity).first()

    if not user or user.role != "admin":
        return jsonify({"error": "Unauthorized or not an admin"}), 403

    profile = UserProfile.query.filter_by(phone_number=identity).first()
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "phone_number": user.phone_number,
        "email": user.email,
        "role": user.role,
        "status": user.status,
        "full_name": profile.full_name,
        "goal": profile.goal,
        "profile_image_url": profile.profile_image
    }), 200
