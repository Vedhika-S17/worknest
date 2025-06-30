    # schemas/project_skill_schema.py

from marshmallow import Schema, fields

class ProjectSkillSchema(Schema):
    project_id = fields.Int(required=True)
    skill_id = fields.Int(required=True)
