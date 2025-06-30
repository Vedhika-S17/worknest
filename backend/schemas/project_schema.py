from marshmallow import Schema, fields

class ProjectSchema(Schema):
    project_id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    description = fields.Str()
    status = fields.Str()
    created_at = fields.DateTime()
    admin_id = fields.Int()
