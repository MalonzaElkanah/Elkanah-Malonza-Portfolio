from rest_framework import serializers

from profile_settings.models import (
    Profile,
    SocialLink,
    Education,
    Work,
    WorkHighlight,
    Skill,
    SkillKeyword,
    TechnicalSkillHighlight,
    ProfessionalSkillHighlight,
    Service,
    Testimony,
    Pricing,
    PricingKeyword,
    AppSettings,
    EmailApp,
)
from MyPortfolio.api.serializers import UserProfileSerializer


class ProfileSocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["name", "logo", "url", "id"]


class ProfileEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        exclude = [
            "profile",
        ]


class ProfileWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        exclude = [
            "profile",
        ]


class ProfileSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        exclude = [
            "profile",
        ]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    social_links = ProfileSocialLinkSerializer(many=True)
    education = ProfileEducationSerializer(many=True, read_only=True)
    work = ProfileWorkSerializer(many=True, read_only=True)
    skills = ProfileSkillSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "social_links":
                for item in value:
                    SocialLink.objects.get_or_create(**item, profile=instance)
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}


class WorkHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkHighlight
        fields = "__all__"

        extra_kwargs = {"work": {"read_only": True, "required": False}}


class WorkSerializer(serializers.ModelSerializer):
    highlights = WorkHighlightSerializer(many=True)

    class Meta:
        model = Work
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "highlights":
                for item in value:
                    WorkHighlight.objects.get_or_create(**item, work=instance)
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance


class SkillKeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillKeyword
        fields = "__all__"

        extra_kwargs = {"skill": {"read_only": True, "required": False}}


class SkillSerializer(serializers.ModelSerializer):
    keywords = SkillKeywordSerializer(many=True)

    class Meta:
        model = Skill
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "keywords":
                for item in value:
                    SkillKeyword.objects.get_or_create(**item, skill=instance)
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance


class TechnicalSkillHighlightSerializer(serializers.ModelSerializer):
    skill_keyword = SkillKeywordSerializer(read_only=True)

    class Meta:
        model = TechnicalSkillHighlight
        fields = "__all__"


class ProfessionalSkillHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalSkillHighlight
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}


class TestimonySerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimony
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}


class PricingKeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingKeyword
        fields = "__all__"

        extra_kwargs = {"pricing": {"read_only": True, "required": False}}


class PricingSerializer(serializers.ModelSerializer):
    keywords = PricingKeywordSerializer(many=True)

    class Meta:
        model = Pricing
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "keywords":
                for item in value:
                    PricingKeyword.objects.get_or_create(**item, pricing=instance)
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance


class EmailAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailApp
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}


class AppSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppSettings
        fields = "__all__"

        extra_kwargs = {"profile": {"read_only": True, "required": False}}
