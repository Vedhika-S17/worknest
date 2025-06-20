from marshmallow import Schema, fields

class SkillSchema(Schema):
    skill_id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
