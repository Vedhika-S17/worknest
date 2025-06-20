# ✅ routes/companies.py (basic create/view)
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.company_model import Company

company_bp = Blueprint("company", __name__)

@company_bp.route("", methods=["POST"])
@jwt_required()
def create_company():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    company = Company(
        name=data["name"],
        contact_email=data.get("contact_email"),
        industry=data.get("industry")
    )
    db.session.add(company)
    db.session.commit()
    return jsonify({"message": "Company created"}), 201

@company_bp.route("", methods=["GET"])
@jwt_required()
def get_companies():
    companies = Company.query.all()
    result = [
        {
            "company_id": c.company_id,
            "name": c.name,
            "industry": c.industry
        } for c in companies
    ]
    return jsonify(result), 200