from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.project_model import Project
from schemas.project_schema import ProjectSchema

project_bp = Blueprint("project", __name__)
project_schema = ProjectSchema()

@project_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    errors = project_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    project = Project(
        title=data["title"],
        description=data.get("description"),
        status=data.get("status"),
        company_id=data.get("company_id")
    )
    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Project created", "project_id": project.project_id}), 201

@project_bp.route("", methods=["GET"])
@jwt_required()
def get_all_projects():
    projects = Project.query.all()
    result = [
        {
            "project_id": p.project_id,
            "title": p.title,
            "description": p.description,
            "status": p.status
        } for p in projects
    ]
    return jsonify(result), 200
@profile_bp.route("/onboarding", methods=["POST"])
@jwt_required()
def save_onboarding():
    phone_number = get_jwt_identity()

    data = request.get_json()
    experience = data.get("experience")
    goal = data.get("goal")
    work_type = data.get("work_type", [])

    if not experience or not goal:
        return jsonify({"message": "Missing onboarding fields"}), 400

    profile = UserProfile.query.filter_by(phone_number=phone_number).first()
    if not profile:
        return jsonify({"message": "Profile not found"}), 404

    profile.experience_level = experience
    profile.goal = goal
    profile.work_type = work_type
    profile.profile_completion_pct = 10

    db.session.commit()
    return jsonify({"message": "Onboarding saved"}), 200
