# schemas/user_schema.py

from marshmallow import Schema, fields, validate

class UserSignupSchema(Schema):
    phone_number = fields.Str(required=True, validate=validate.Length(min=10, max=15))
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)
    role = fields.Str(required=True, validate=validate.OneOf(['freelancer', 'admin']))

class UserLoginSchema(Schema):
    phone_number = fields.String(required=True)
    password = fields.String(required=True)