from marshmallow import Schema, fields

class ProjectAssignmentSchema(Schema):
    assignment_id = fields.Int(dump_only=True)
    project_id = fields.Int(required=True)
    user_id = fields.Int(required=True)
    assigned_role = fields.Str(allow_none=True)
    progress_status = fields.Str(allow_none=True)
    assigned_at = fields.DateTime(dump_only=True)
