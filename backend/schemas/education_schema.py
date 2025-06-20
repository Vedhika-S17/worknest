from marshmallow import Schema, fields

class EducationSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    title = fields.Str()
    description = fields.Str()
    from_date = fields.Date()
    to_date = fields.Date()
