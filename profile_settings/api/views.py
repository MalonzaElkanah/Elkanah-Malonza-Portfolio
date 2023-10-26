from rest_framework import generics, viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView


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
    EmailApp,
)
from profile_settings.api.serializers import (
    ProfileSerializer,
    SocialLinkSerializer,
    EducationSerializer,
    WorkSerializer,
    WorkHighlightSerializer,
    SkillSerializer,
    SkillKeywordSerializer,
    TechnicalSkillHighlightSerializer,
    ProfessionalSkillHighlightSerializer,
    ServiceSerializer,
    TestimonySerializer,
    PricingSerializer,
    PricingKeywordSerializer,
    EmailAppSerializer,
    MyProfileSerializer,
)
from MyPortfolio.api.permissions import (
    IsOwnerOrReadOnly,
    IsAuthenticatedOrReadOnly,
)
from profile_settings.api.permissions import (
    IsOwnerProfileOrReadOnly,
    IsOwnerWorkOrReadOnly,
    IsOwnerSkillOrReadOnly,
    IsOwnerSkillKeywordOrReadOnly,
    IsOwnerPricingOrReadOnly,
    IsOwnerProfile,
)
from MyPortfolio.api.exceptions import CustomException


class ListCreateProfile(generics.ListCreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        social_links_data = None

        if serializer.validated_data.get("social_links", None) is not None:
            social_links_data = serializer.validated_data.pop("social_links")

        profile = Profile(**serializer.validated_data, user=request.user.id)
        profile.save()

        if social_links_data:
            for item in social_links_data:
                SocialLink.objects.get_or_create(**item, profile=profile)

        return Response(
            self.get_serializer(profile).data, status=status.HTTP_201_CREATED
        )


class RetrieveUpdateDestroyProfile(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [
        IsOwnerOrReadOnly,
    ]


class RetrieveMyProfile(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, format=None):
        """
        Retrieve THE authenticated user profile
        """
        if self.request.user.is_authenticated:
            profile = Profile.objects.filter(user=self.request.user.id)

            if not profile.exists():
                raise CustomException("Error: Profile not Found")

            return Response(
                MyProfileSerializer(profile.first()).data, status=status.HTTP_200_OK
            )

        raise CustomException(
            "Authentication credentials were not provided.", status=401
        )


class SocialLinkModelViewSet(viewsets.ModelViewSet):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerProfileOrReadOnly]

    def get_queryset(self):
        """
        List all SocialLink that belong to
        Project with <profile_pk> id
        """
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return SocialLink.objects.filter(profile=profile[0].id)

    def perform_create(self, serializer):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        serializer.save(profile=profile[0])


class EducationModelViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerProfileOrReadOnly]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return Education.objects.filter(profile=profile[0].id)

    def perform_create(self, serializer):
        profile = Profile.objects.filter(user=self.request.user.id)
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        serializer.save(profile=profile[0])


class ListCreateWork(generics.ListCreateAPIView):
    queryset = Work.objects.all()
    serializer_class = WorkSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return Work.objects.filter(profile=profile[0].id)

    def post(self, request, profile_pk, format=None):
        # Check if profile exists
        profile = Profile.objects.filter(id=profile_pk)
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        # Get the Validated data and pop work highlights
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        highlights_data = None

        if serializer.validated_data.get("highlights", None) is not None:
            highlights_data = serializer.validated_data.pop("highlights")

        # Save work data
        work = Work(**serializer.validated_data, profile=profile[0])
        work.save()

        # Save the poped work highlights data
        if highlights_data:
            for item in highlights_data:
                WorkHighlight.objects.get_or_create(**item, work=work)

        return Response(self.get_serializer(work).data, status=status.HTTP_201_CREATED)


class RetrieveUpdateDestroyWork(generics.RetrieveUpdateDestroyAPIView):
    queryset = Work.objects.all()
    serializer_class = WorkSerializer
    permission_classes = [IsOwnerProfileOrReadOnly]


class WorkHighlightModelViewSet(viewsets.ModelViewSet):
    queryset = WorkHighlight.objects.all()
    serializer_class = WorkHighlightSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerWorkOrReadOnly]

    def get_queryset(self):
        """
        List all highights that belong to
        Work with <work_pk> id
        """
        work = Work.objects.filter(id=self.kwargs["work_pk"])
        if not work.exists():
            raise CustomException("Error: Work not Found")

        return WorkHighlight.objects.filter(work=work[0].id)

    def perform_create(self, serializer):
        work = Work.objects.filter(id=self.kwargs["work_pk"])
        if not work.exists():
            raise CustomException("Error: Work not Found")

        serializer.save(work=work[0])


class ListCreateSkill(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return Skill.objects.filter(profile=profile[0].id)

    def post(self, request, profile_pk, format=None):
        # Check if profile exists
        profile = Profile.objects.filter(id=profile_pk)
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        # Get the Validated data and pop skill keywords
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        keywords_data = None

        if serializer.validated_data.get("keywords", None) is not None:
            keywords_data = serializer.validated_data.pop("keywords")

        # Save skill data
        skill = Skill(**serializer.validated_data, profile=profile[0])
        skill.save()

        # Save the poped skill keyword data
        if keywords_data:
            for item in keywords_data:
                SkillKeyword.objects.get_or_create(**item, skill=skill)

        return Response(self.get_serializer(skill).data, status=status.HTTP_201_CREATED)


class RetrieveUpdateDestroySkill(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsOwnerProfileOrReadOnly]


class SkillKeywordModelViewSet(viewsets.ModelViewSet):
    queryset = SkillKeyword.objects.all()
    serializer_class = SkillKeywordSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerSkillOrReadOnly]

    def get_queryset(self):
        skill = Skill.objects.filter(id=self.kwargs["skill_pk"])
        if not skill.exists():
            raise CustomException("Error: Skill not Found")

        return SkillKeyword.objects.filter(skill=skill[0].id)

    def perform_create(self, serializer):
        skill = Skill.objects.filter(id=self.kwargs["skill_pk"])
        if not skill.exists():
            raise CustomException("Error: Skill not Found")

        serializer.save(skill=skill[0])

    @action(
        detail=True,
        methods=["post", "get"],
        permission_classes=[IsAuthenticatedOrReadOnly],
    )
    def highlights(self, request, pk=None, **kwargs):
        instance = self.get_object()

        if request.method == "POST":
            serializer = TechnicalSkillHighlightSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            if instance.highlights.exists():
                instance.highlights.update(
                    percentage=serializer.validated_data["percentage"]
                )
            else:
                highlight = TechnicalSkillHighlight(
                    skill_keyword=instance, **serializer.validated_data
                )
                highlight.save()

            return Response(
                TechnicalSkillHighlightSerializer(instance.highlights.first()).data,
                status=status.HTTP_201_CREATED,
            )
        else:
            if instance.highlights.exists():
                return Response(
                    TechnicalSkillHighlightSerializer(instance.highlights.first()).data,
                    status=status.HTTP_200_OK,
                )

            return Response({"detail": "No highlights"}, status=status.HTTP_200_OK)


class ListTechnicalSkillHighlight(generics.ListAPIView):
    queryset = TechnicalSkillHighlight.objects.all()
    serializer_class = TechnicalSkillHighlightSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return TechnicalSkillHighlight.objects.filter(
            skill_keyword__skill__profile=profile[0].id
        )


class TechnicalSkillHighlightModelViewSet(viewsets.ModelViewSet):
    queryset = TechnicalSkillHighlight.objects.all()
    serializer_class = TechnicalSkillHighlightSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsOwnerSkillKeywordOrReadOnly,
    ]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return TechnicalSkillHighlight.objects.filter(
            skill_keyword__skill__profile=profile[0].id
        )


class ProfessionalSkillHighlightModelViewSet(viewsets.ModelViewSet):
    queryset = ProfessionalSkillHighlight.objects.all()
    serializer_class = ProfessionalSkillHighlightSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerProfileOrReadOnly]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return ProfessionalSkillHighlight.objects.filter(profile=profile[0].id)

    def perform_create(self, serializer):
        profile = Profile.objects.filter(user=self.request.user.id)
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        serializer.save(profile=profile[0])


class ServiceModelViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerProfileOrReadOnly]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return Service.objects.filter(profile=profile[0].id)

    def perform_create(self, serializer):
        profile = Profile.objects.filter(user=self.request.user.id)
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        serializer.save(profile=profile[0])


class TestimonyModelViewSet(viewsets.ModelViewSet):
    queryset = Testimony.objects.all()
    serializer_class = TestimonySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerProfileOrReadOnly]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return Testimony.objects.filter(profile=profile[0].id)

    def perform_create(self, serializer):
        profile = Profile.objects.filter(user=self.request.user.id)
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        serializer.save(profile=profile[0])


class ListCreatePricing(generics.ListCreateAPIView):
    queryset = Pricing.objects.all()
    serializer_class = PricingSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return Pricing.objects.filter(profile=profile[0].id)

    def post(self, request, profile_pk, format=None):
        # Check if profile exists
        profile = Profile.objects.filter(id=profile_pk)
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        # Get the Validated data and pop pricing keywords
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        keywords_data = None

        if serializer.validated_data.get("keywords", None) is not None:
            keywords_data = serializer.validated_data.pop("keywords")

        # Save pricing data
        pricing = Pricing(**serializer.validated_data, profile=profile[0])
        pricing.save()

        # Save the poped data
        if keywords_data:
            for item in keywords_data:
                PricingKeyword.objects.get_or_create(**item, pricing=pricing)

        return Response(
            self.get_serializer(pricing).data, status=status.HTTP_201_CREATED
        )


class RetrieveUpdateDestroyPricing(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pricing.objects.all()
    serializer_class = PricingSerializer
    permission_classes = [IsOwnerProfileOrReadOnly]


class PricingKeywordModelViewSet(viewsets.ModelViewSet):
    queryset = PricingKeyword.objects.all()
    serializer_class = PricingKeywordSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerPricingOrReadOnly]

    def get_queryset(self):
        pricing = Pricing.objects.filter(id=self.kwargs["pricing_pk"])
        if not pricing.exists():
            raise CustomException("Error: Pricing not Found")

        return PricingKeyword.objects.filter(pricing=pricing[0].id)

    def perform_create(self, serializer):
        pricing = Pricing.objects.filter(id=self.kwargs["pricing_pk"])
        if not pricing.exists():
            raise CustomException("Error: Pricing not Found")

        serializer.save(pricing=pricing[0])


class EmailAppModelViewSet(viewsets.ModelViewSet):
    queryset = EmailApp.objects.all()
    serializer_class = EmailAppSerializer
    permission_classes = [IsAuthenticated, IsOwnerProfile]

    def get_queryset(self):
        profile = Profile.objects.filter(id=self.kwargs["profile_pk"])
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        return EmailApp.objects.filter(profile=profile[0].id)

    def perform_create(self, serializer):
        profile = Profile.objects.filter(user=self.request.user.id)
        if not profile.exists():
            raise CustomException("Error: Profile not Found")

        serializer.save(profile=profile[0])
