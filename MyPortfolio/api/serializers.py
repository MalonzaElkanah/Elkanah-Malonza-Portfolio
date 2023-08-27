from rest_framework import serializers, exceptions
from django.contrib.auth import authenticate

from django.contrib.auth.models import User


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, data):

        username = data.get("username", None)
        password = data.get("password", None)

        if username and password:
            user = authenticate(username=username, password=password)

            if user:
                if user.is_active:
                    data["user"] = user
                else:
                    msg = "user is deactivated"
                    raise exceptions.ValidationError(msg)
            else:
                msg = "Unable to login with the given username and password"
                data["error"] = msg
                raise exceptions.ValidationError(msg)
        else:
            msg = "You must provide both Username and Password"
            data["error"] = msg
            raise exceptions.ValidationError(msg)

        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
