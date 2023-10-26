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
    Project,
)
from blog.models import Article

from MyPortfolio.api.serializers import UserProfileSerializer


class MyProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "image", "first_name", "second_name", "user"]


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
    highlights = serializers.StringRelatedField(read_only=True, many=True)

    class Meta:
        model = Work
        exclude = [
            "profile",
        ]


class ProfileSkillKeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillKeyword
        exclude = [
            "skill",
        ]


class ProfileSkillSerializer(serializers.ModelSerializer):
    keywords = ProfileSkillKeywordSerializer(many=True)

    class Meta:
        model = Skill
        exclude = [
            "profile",
        ]


class ProfileServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        exclude = [
            "profile",
        ]


class ProfileTechnicalSkillSerializer(serializers.ModelSerializer):
    skill_keyword = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TechnicalSkillHighlight
        fields = "__all__"


class ProfileProfessionalSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalSkillHighlight
        exclude = [
            "profile",
        ]


class ProfileProjectSerializer(serializers.ModelSerializer):
    keywords = serializers.StringRelatedField(read_only=True, many=True)

    class Meta:
        model = Project
        exclude = [
            "profile",
        ]


class ProfilePricingSerializer(serializers.ModelSerializer):
    keywords = serializers.StringRelatedField(read_only=True, many=True)

    class Meta:
        model = Pricing
        exclude = [
            "profile",
        ]


class ArticleSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True, source="user.first_name")

    class Meta:
        model = Article
        fields = ["image", "title", "date_created", "user", "content_text", "id"]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    social_links = ProfileSocialLinkSerializer(many=True)
    education = ProfileEducationSerializer(many=True, read_only=True)
    work = ProfileWorkSerializer(many=True, read_only=True)
    skills = ProfileSkillSerializer(many=True, read_only=True)
    services = ProfileServiceSerializer(many=True, read_only=True)
    technical_skills = ProfileTechnicalSkillSerializer(many=True, read_only=True)
    professional_skills = ProfileProfessionalSkillSerializer(many=True, read_only=True)
    project_highlights = ProfileProjectSerializer(many=True, read_only=True)
    pricing = ProfilePricingSerializer(many=True, read_only=True)
    article_highlights = ArticleSerializer(many=True, read_only=True)

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
    skill_keyword = SkillKeywordSerializer()

    class Meta:
        model = TechnicalSkillHighlight
        fields = "__all__"

    def create(self, validated_data):
        print(validated_data)

        percentage = validated_data.get("percentage")
        print(percentage)
        keyword = validated_data.get("skill_keyword").get("name")
        print(keyword)

        keywords = SkillKeyword.objects.filter(name__contains=keyword)
        print(keywords)

        return TechnicalSkillHighlight.objects.create(
            percentage=percentage, skill_keyword=keywords[0]
        )

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "skill_keyword":
                keywords = SkillKeyword.objects.filter(name__contains=value["name"])
                if keywords.exists():
                    setattr(instance, attr, keywords[0])
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance


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
