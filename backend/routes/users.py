# ✅ routes/users.py (admin-only route to view users)   
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_model import User

user_bp = Blueprint("user", __name__)

@user_bp.route("", methods=["GET"])
@jwt_required()
def get_all_users():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    users = User.query.all()
    result = [
        {
            "phone_number": u.phone_number,
            "email": u.email,
            "role": u.role,
            "status": u.status
        } for u in users
    ]
    return jsonify(result), 200