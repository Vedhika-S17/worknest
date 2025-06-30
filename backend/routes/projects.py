# routes/projects.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.project_model import Project
from models.user_model import User
from models.project_assignment_model import ProjectAssignment
from schemas.project_schema import ProjectSchema
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from models.project_skill_model import ProjectSkill
from models.skill_model import Skill
from models.user_skill_model import UserSkill
from models.project_request_model import ProjectRequest 
from models.profile_model import UserProfile  # ✅ if not already


project_bp = Blueprint("projects", __name__, url_prefix="/api/projects")

project_schema = ProjectSchema()
project_list_schema = ProjectSchema(many=True)

# ---------------------------
# CREATE NEW PROJECT (ADMIN)
# ---------------------------
@project_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    identity = get_jwt_identity()
    admin = User.query.filter_by(phone_number=identity).first()

    if not admin or admin.role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    try:
        data = request.get_json()
        #errors = project_schema.validate(data)
        #if errors:
        #   return jsonify({"errors": errors}), 400

        new_project = Project(
            title=data["title"],
            description=data.get("description"),
            status=data.get("status", "pending"),
            admin_id=admin.user_id,
            created_at=datetime.utcnow()
        )

        db.session.add(new_project)
        db.session.flush()  # Get project_id before commit

        admin_assignment = ProjectAssignment(
            project_id=new_project.project_id,
            user_id=admin.user_id,
            assigned_role="Project Admin",
            progress_status="active"
        )

        db.session.add(admin_assignment)

        # ✅ Add project skills
        skill_ids = data.get("skill_ids", [])  # expects [1, 2, 3]
        for skill_id in skill_ids:
            db.session.add(ProjectSkill(project_id=new_project.project_id, skill_id=skill_id))

        db.session.commit()

        return jsonify({
            "message": "Project created successfully",
            "project_id": new_project.project_id
        }), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500


# ---------------------------
# GET ALL PROJECTS FOR ADMIN
# ---------------------------
@project_bp.route("/admin", methods=["GET"])
@jwt_required()
def get_admin_projects():
    identity = get_jwt_identity()
    admin = User.query.filter_by(phone_number=identity).first()

    if not admin or admin.role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    projects = Project.query.filter_by(admin_id=admin.user_id).order_by(Project.created_at.desc()).all()
    result = []

    for p in projects:
        skill_ids = [ps.skill_id for ps in ProjectSkill.query.filter_by(project_id=p.project_id).all()]
        skill_names = [s.name for s in Skill.query.filter(Skill.skill_id.in_(skill_ids)).all()]

        # 🧩 ADD: Include requests
        join_requests = ProjectRequest.query.filter_by(project_id=p.project_id).all()
        formatted_requests = []
        for r in join_requests:
            user = User.query.filter_by(user_id=r.user_id).first()
            profile = UserProfile.query.filter_by(phone_number=user.phone_number).first()
            user_name = profile.full_name if profile else "Unnamed"
            formatted_requests.append({
                "request_id": r.request_id,
                "user_id": r.user_id,
                "user_name": user_name,
                "status": r.status,
                "requested_at": r.requested_at.isoformat()
            })

        result.append({
            "project_id": p.project_id,
            "title": p.title,
            "description": p.description,
            "status": p.status,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "skills": skill_names,
            "requests": formatted_requests  # ✅ Include join requests
        })

    return jsonify(result), 200
# ---------------------------


@project_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()

    project_data = []
    for p in projects:
        skill_ids = [ps.skill_id for ps in ProjectSkill.query.filter_by(project_id=p.project_id).all()]
        skill_names = [s.name for s in Skill.query.filter(Skill.skill_id.in_(skill_ids)).all()]

        project_data.append({
            "project_id": p.project_id,
            "title": p.title,
            "description": p.description,
            "status": p.status,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "skills": skill_names  # ✅ add skill names here
        })

    return jsonify(project_data)

@project_bp.route("/matched", methods=["GET"])
@jwt_required()
def get_projects_matching_user_skills():
    identity = get_jwt_identity()
    user = User.query.filter_by(phone_number=identity).first()

    if not user:
        return jsonify({"error": "User  not found"}), 404

    # Get user's skill IDs
    user_skill_ids = db.session.query(UserSkill.skill_id).filter_by(user_id=user.user_id).subquery()

    # Get project IDs that have matching skills
    matching_project_ids = db.session.query(ProjectSkill.project_id).filter(ProjectSkill.skill_id.in_(user_skill_ids)).subquery()

    # Fetch distinct projects
    matching_projects = (
        db.session.query(Project)
        .filter(Project.project_id.in_(matching_project_ids))
        .order_by(Project.created_at.desc())
        .all()
    )

    result = []
    for project in matching_projects:
        skill_names = [
            s.name for s in db.session.query(Skill.name)
            .join(ProjectSkill, Skill.skill_id == ProjectSkill.skill_id)
            .filter(ProjectSkill.project_id == project.project_id)
            .all()
        ]
        result.append({
            "project_id": project.project_id,
            "title": project.title,
            "description": project.description,
            "status": project.status,
            "created_at": project.created_at.isoformat() if project.created_at else None,
            "skills": skill_names
        })

    return jsonify(result), 200


@project_bp.route("/<int:project_id>/request", methods=["POST"])
@jwt_required()
def request_to_join_project(project_id):
    identity = get_jwt_identity()
    user = User.query.filter_by(phone_number=identity).first()
    if not user:
        return jsonify({"error": "User  not found"}), 404

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Prevent duplicate request
    existing = ProjectRequest.query.filter_by(project_id=project_id, user_id=user.user_id).first()
    if existing:
        return jsonify({"message": "Request already submitted."}), 400

    request_entry = ProjectRequest(
        project_id=project.project_id,
        user_id=user.user_id,
        admin_id=project.admin_id,
        status="pending",
        requested_at=datetime.utcnow()
    )

    db.session.add(request_entry)
    db.session.commit()

    return jsonify({"message": "Request submitted successfully."}), 201


@project_bp.route("/requests", methods=["GET"])
@jwt_required()
def get_incoming_requests():
    identity = get_jwt_identity()
    admin = User.query.filter_by(phone_number=identity).first()

    if not admin or admin.role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    requests = ProjectRequest.query.filter_by(admin_id=admin.user_id).order_by(ProjectRequest.requested_at.desc()).all()

    result = []
    for r in requests:
        user = User.query.filter_by(user_id=r.user_id).first()
        profile = UserProfile.query.filter_by(phone_number=user.phone_number).first()
        user_name = profile.full_name if profile else "Unnamed"
        result.append({
            "request_id": r.request_id,
            "project_id": r.project_id,
            "project_title": r.project.title,
            "user_id": r.user_id,
            "user_name": user_name,
            "status": r.status,
            "requested_at": r.requested_at.isoformat()
        })

    return jsonify(result), 200




@project_bp.route("/assigned", methods=["GET"])
@jwt_required()
def get_assigned_projects():
    identity = get_jwt_identity()
    user = User.query.filter_by(phone_number=identity).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    assignments = ProjectAssignment.query.filter_by(user_id=user.user_id).all()
    project_ids = [a.project_id for a in assignments]
    projects = Project.query.filter(Project.project_id.in_(project_ids)).order_by(Project.created_at.desc()).all()

    result = []
    for p in projects:
        skill_ids = [ps.skill_id for ps in ProjectSkill.query.filter_by(project_id=p.project_id).all()]
        skill_names = [s.name for s in Skill.query.filter(Skill.skill_id.in_(skill_ids)).all()]
        progress = next((a.progress_status for a in assignments if a.project_id == p.project_id), "unknown")

        result.append({
            "project_id": p.project_id,
            "title": p.title,
            "description": p.description,
            "status": p.status,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "skills": skill_names,
            "progress_status": progress
        })

    return jsonify(result), 200

@project_bp.route("/<int:project_id>/complete", methods=["POST"])
@jwt_required()
def complete_project_assignment(project_id):
    identity = get_jwt_identity()
    user = User.query.filter_by(phone_number=identity).first()

    assignment = ProjectAssignment.query.filter_by(project_id=project_id, user_id=user.user_id).first()
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    # ✅ Update assignment progress
    assignment.progress_status = "completed"

    # ✅ Update project.status in the projects table
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    project.status = "completed"

    db.session.commit()
    return jsonify({"message": "Project marked as completed"}), 200

@project_bp.route("/requests/<int:request_id>/accept", methods=["POST", "OPTIONS"])
def accept_project_request(request_id):
    # Allow CORS preflight request through without requiring JWT
    if request.method == "OPTIONS":
        return '', 204

    # ✅ Require JWT for actual POST
    from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
    verify_jwt_in_request()
    identity = get_jwt_identity()

    admin = User.query.filter_by(phone_number=identity).first()
    if not admin or admin.role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    project_request = ProjectRequest.query.get(request_id)
    if not project_request:
        return jsonify({"error": "Request not found"}), 404

    if project_request.status != "pending":
        return jsonify({"message": "Request already processed"}), 400

    # ✅ Mark as approved + create assignment
    project_request.status = "approved"
    assignment = ProjectAssignment(
        project_id=project_request.project_id,
        user_id=project_request.user_id,
        assigned_role="Member",
        progress_status="active"
    )
    db.session.add(assignment)
    db.session.commit()

    return jsonify({"message": "Request accepted and user assigned to project"}), 200
