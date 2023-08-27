from rest_framework import serializers

from profile_settings.models import Message, AppSettings


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


class AppSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppSettings
        fields = "__all__"

        extra_kwargs = {"user": {"read_only": True, "required": False}}
