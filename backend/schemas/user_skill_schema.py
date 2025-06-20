from marshmallow import Schema, fields

class UserSkillSchema(Schema):
    user_id = fields.Int(required=True)
    skill_id = fields.Int(required=True)
