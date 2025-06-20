from marshmallow import Schema, fields

class TaskSchema(Schema):
    task_id = fields.Int(dump_only=True)
    assignment_id = fields.Int(required=True)
    title = fields.Str(required=True)
    description = fields.Str(allow_none=True)
    due_date = fields.Date(allow_none=True)
    status = fields.Str(allow_none=True)
