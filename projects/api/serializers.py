from rest_framework import serializers

from profile_settings.models import Project, ProjectKeyword, ProjectImage


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "picture"]


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectKeyword
        fields = ["id", "technology"]


class ProjectSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True)
    keywords = KeywordSerializer(many=True)
    description_text = serializers.CharField(read_only=True)

    class Meta:
        model = Project
        fields = "__all__"
        extra_kwargs = {
            "profile": {"read_only": True, "required": False},
            "image": {"required": False},
        }

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "images":
                for item in value:
                    ProjectImage.objects.get_or_create(**item, project=instance)
            elif attr == "keywords":
                for item in value:
                    ProjectKeyword.objects.get_or_create(**item, project=instance)
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance


class ProjectListCreateSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, write_only=True, required=False)
    keywords = KeywordSerializer(many=True)
    description_text = serializers.CharField(read_only=True)

    class Meta:
        model = Project
        fields = "__all__"
        extra_kwargs = {
            "profile": {"read_only": True, "required": False},
            "images": {"required": False, "write_only": True},
        }

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "images":
                for item in value:
                    ProjectImage.objects.get_or_create(**item, project=instance)
            elif attr == "keywords":
                for item in value:
                    ProjectKeyword.objects.get_or_create(**item, project=instance)
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance


class ProjectImageSerializer(serializers.ModelSerializer):
    # project = ProjectSerializer()

    class Meta:
        model = ProjectImage
        fields = "__all__"

        extra_kwargs = {"project": {"read_only": True}}


class ProjectKeywordSerializer(serializers.ModelSerializer):
    # project = ProjectSerializer()

    class Meta:
        model = ProjectKeyword
        fields = "__all__"

        extra_kwargs = {"project": {"read_only": True}}
