from marshmallow import Schema, fields

class CompanySchema(Schema):
    company_id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    contact_email = fields.Email(allow_none=True)
    industry = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
