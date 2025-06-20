# schemas/profile_schema.py

from marshmallow import Schema, fields

class UserProfileSchema(Schema):
    phone_number = fields.Str(required=True)
    full_name = fields.Str(required=True)
    title = fields.Str(allow_none=True)
    bio = fields.Str(allow_none=True)
    experience_level = fields.Str(required=True)
    goal = fields.Str(required=True)
    work_type = fields.Str(allow_none=True)  # CSV string: "marketplace,contract_to_hire"
    hourly_rate = fields.Decimal(as_string=True, allow_none=True)
    location = fields.Str(allow_none=True)
    availability = fields.Str(allow_none=True)
    profile_image = fields.Str(allow_none=True)
    languages = fields.List(fields.Str(), allow_none=True)
    profile_completion_pct = fields.Int(dump_only=True)
