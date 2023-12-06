from rest_framework import serializers

from jobs.models import JobSite, Job, Qualification, Attribute, Letter, JobApplication


class JobSiteSerializer(serializers.ModelSerializer):
    job_count = serializers.IntegerField()
    applied_job_count = serializers.IntegerField()

    class Meta:
        model = JobSite
        fields = "__all__"


class QualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = "__all__"


class AttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = "__all__"


class JobSerializer(serializers.ModelSerializer):
    qualifications = QualificationSerializer(read_only=True, many=True)
    attributes = AttributeSerializer(read_only=True, many=True)

    class Meta:
        model = Job
        fields = "__all__"


class LetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Letter
        fields = [
            "id",
            "name",
            "text",
            "strip_tag_text",
            "file",
            "description",
            "date_created",
        ]


class RenderedLetterSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    text = serializers.CharField()
    strip_tag_text = serializers.CharField()


class JobApplicationSerializer(serializers.ModelSerializer):
    job = serializers.StringRelatedField()
    letter = serializers.StringRelatedField()

    class Meta:
        model = JobApplication
        fields = "__all__"


class JobViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["name", "id", "status", "link"]


class LetterViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Letter
        fields = ["id", "name", "description", "date_created"]


class JobApplicationViewSerializer(serializers.ModelSerializer):
    job = JobViewSerializer()
    letter = LetterViewSerializer()

    class Meta:
        model = JobApplication
        fields = "__all__"
