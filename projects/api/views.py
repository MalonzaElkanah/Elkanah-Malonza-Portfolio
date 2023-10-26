from rest_framework import generics, viewsets, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination

from profile_settings.models import (
    Profile,
    Project,
    ProjectKeyword,
    ProjectImage,
)
from projects.api.serializers import (
    ProjectListCreateSerializer,
    ProjectSerializer,
    ProjectImageSerializer,
    ProjectKeywordSerializer,
    KeywordSerializer,
)
from MyPortfolio.api.permissions import (
    IsAuthenticatedOrReadOnly,
)
from profile_settings.api.permissions import (
    IsOwnerProfileOrReadOnly,
)
from projects.api.permissions import IsOwnerProjectOrReadOnly
from MyPortfolio.api.exceptions import CustomException


class ListCreateProject(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectListCreateSerializer  # ProjectSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]
    filter_backends = [filters.SearchFilter]
    # filterset_fields = ['name',]
    search_fields = ["name", "keywords__technology"]

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        images_data, keywords_data = None, None

        if serializer.validated_data.get("images", None) is not None:
            images_data = serializer.validated_data.pop("images")

        if serializer.validated_data.get("keywords", None) is not None:
            keywords_data = serializer.validated_data.pop("keywords")

        project = Project(
            **serializer.validated_data,
            profile=Profile.objects.get(user=request.user.id)
        )
        project.save()

        if keywords_data:
            for item in keywords_data:
                ProjectKeyword.objects.get_or_create(
                    technology=item["technology"], project=project
                )

        if images_data:
            for item in images_data:
                ProjectImage.objects.get_or_create(
                    picture=item["picture"], project=project
                )

        return Response(
            self.get_serializer(project).data, status=status.HTTP_201_CREATED
        )


class RetrieveUpdateDestroyProject(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsOwnerProfileOrReadOnly]


class ProjectImageModelViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerProjectOrReadOnly]

    def get_queryset(self):
        """
        List all ProjectImage that belong to
        Project with <project_pk> id
        """
        project = Project.objects.filter(id=self.kwargs["project_pk"])
        if not project.exists():
            raise CustomException("Error: Project not Found")

        return ProjectImage.objects.filter(project=project[0].id)

    def perform_create(self, serializer):
        project = Project.objects.filter(id=self.kwargs["project_pk"])
        if not project.exists():
            raise CustomException("Error: Project not Found")

        serializer.save(project=project[0])


class ProjectKeywordViewSet(viewsets.ModelViewSet):
    queryset = ProjectKeyword.objects.all()
    serializer_class = ProjectKeywordSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerProjectOrReadOnly]

    def get_queryset(self):
        """
        List all ProjectKeyword that belong to
        Project with <project_pk> id
        """
        project = Project.objects.filter(id=self.kwargs["project_pk"])
        if not project.exists():
            raise CustomException("Error: Project not Found")

        return ProjectKeyword.objects.filter(project=project[0].id)

    def perform_create(self, serializer):
        project = Project.objects.filter(id=self.kwargs["project_pk"])
        if not project.exists():
            raise CustomException("Error: Project not Found")

        serializer.save(project=project[0])


class ListKeywords(generics.ListAPIView):
    queryset = ProjectKeyword.objects.all()
    serializer_class = KeywordSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]
    paginator_class = LimitOffsetPagination

    def get_queryset(self):
        """
        List all Unique Project Keywords Technology
        """

        # POSTGRES QUERY
        # return ProjectKeyword.objects.order_by("technology").distinct("technology")

        keywords = ProjectKeyword.objects.order_by("technology")
        unique_keywords = []
        _list = []

        for keyword in keywords:
            if keyword.technology not in _list:
                unique_keywords.append(keyword)
                _list.append(keyword.technology)

        return unique_keywords


class ListKeywordProjects(APIView):
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]

    def get(self, request, slug, format=None):
        projects = Project.objects.filter(keywords__technology__icontains=str(slug))

        search = self.request.query_params.get("search")
        if search is not None:
            projects_searched = Project.objects.none()

            keyword_search = projects.filter(
                keywords__technology__icontains=str(search)
            )
            name_search = projects.filter(name__icontains=str(search))

            projects_searched = projects_searched.union(
                keyword_search, name_search
            ).order_by("date")

            projects = projects_searched

        serializer = ProjectSerializer(projects, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
