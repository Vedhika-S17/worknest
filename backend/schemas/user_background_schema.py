from marshmallow import Schema, fields

class UserBackgroundSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    type = fields.Str(required=True)  # 'education', 'certification', or 'experience'
    title = fields.Str()
    description = fields.Str()
    from_date = fields.Date()
    to_date = fields.Date()
