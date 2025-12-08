from marshmallow import Schema, fields, validate, ValidationError

class RegisterSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class LoginSchema(Schema):
    usernameOrEmail = fields.Str(required=True)
    password = fields.Str(required=True)

class UserResponseSchema(Schema):
    id = fields.Str()
    username = fields.Str()
    email = fields.Email()
    roles = fields.List(fields.Str())
    createdAt = fields.DateTime()
    updatedAt = fields.DateTime()

class AuthResponseSchema(Schema):
    token = fields.Str()
    userId = fields.Str()
    username = fields.Str()
    email = fields.Email()
    roles = fields.List(fields.Str())
