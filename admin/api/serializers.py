from rest_framework import serializers

from profile_settings.models import Message, AppSettings
from admin.models import UploadImage, UploadFile, ActivityLog


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


class AppSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppSettings
        fields = "__all__"

        extra_kwargs = {"user": {"read_only": True, "required": False}}


class UploadImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadImage
        fields = ["image", "path"]

        extra_kwargs = {"image": {"required": False}}


class UploadFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadFile
        fields = ["file", "path"]

        extra_kwargs = {"file": {"required": False}}


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        """
        Check that confirm_password is equal to new_password.
        """
        if data["new_password"] == data["confirm_password"]:
            raise serializers.ValidationError(
                "Confirm Password should be the same as New Password"
            )

        return data


class ActivityLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ActivityLog
        fields = "__all__"
