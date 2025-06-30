from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.project_assignment_model import ProjectAssignment

assignment_bp = Blueprint("assignment", __name__)

@assignment_bp.route("", methods=["POST"])
@jwt_required()
def assign_user():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    assignment = ProjectAssignment(
        project_id=data["project_id"],
        phone_number=data["phone_number"],
        assigned_role=data.get("assigned_role"),
        progress_status=data.get("progress_status")
    )
    db.session.add(assignment)
    db.session.commit()

    return jsonify({"message": "User assigned to project"}), 201


