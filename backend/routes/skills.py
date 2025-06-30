# routes/skills.py
from flask import Blueprint, jsonify
from models.skill_model import Skill

skills_bp = Blueprint("skills", __name__)

@skills_bp.route("/all", methods=["GET"])
def get_all_skills():
    skills = Skill.query.all()
    return jsonify([{"skill_id": s.skill_id, "name": s.name} for s in skills])
