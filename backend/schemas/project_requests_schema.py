from marshmallow import Schema, fields

class ProjectRequestSchema(Schema):
    request_id = fields.Int(dump_only=True)
    project_id = fields.Int(required=True)
    user_id = fields.Int(required=True)
    admin_id = fields.Int(required=True)
    status = fields.Str()
    requested_at = fields.DateTime()
