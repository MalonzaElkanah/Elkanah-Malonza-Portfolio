from rest_framework import viewsets, generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from profile_settings.models import Message, AppSettings
from admin.models import UploadImage, UploadFile, ActivityLog
from admin.api.serializers import (
    MessageSerializer,
    AppSettingsSerializer,
    UploadImageSerializer,
    UploadFileSerializer,
    ChangePasswordSerializer,
    ActivityLogSerializer,
)
from MyPortfolio.api.permissions import (
    IsAuthenticatedOrPostOnly,
    IsOwner,
)
from MyPortfolio.api.exceptions import CustomException


class MessageModelViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [
        IsAuthenticatedOrPostOnly,
    ]


class AppSettingsModelViewSet(viewsets.ModelViewSet):
    queryset = AppSettings.objects.all()
    serializer_class = AppSettingsSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return AppSettings.objects.filter(user=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UploadImageModelViewSet(viewsets.ModelViewSet):
    queryset = UploadImage.objects.all()
    serializer_class = UploadImageSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UploadFileModelViewSet(viewsets.ModelViewSet):
    queryset = UploadFile.objects.all()
    serializer_class = UploadFileSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChangePasswordAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def put(self, request, format=None):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.confirm_old_password(serializer)
        self.request.user.set_password(serializer.validated_data.get("new_password"))
        # self.request.user.changed_password = True
        self.request.user.save()

        return Response({"detail": "Password successfully changed."})

    def confirm_old_password(self, serializer):
        old_password = serializer.validated_data.get("old_password")

        valid = self.request.user.check_password(old_password)
        if not valid:
            raise CustomException("Wrong old password provided.")

        return True


class ListActivityLogs(generics.ListAPIView):
    queryset = ActivityLog.objects.all().select_related("user")
    serializer_class = ActivityLogSerializer
    filter_backends = [filters.SearchFilter]
    # filterset_fields = ['user',]
    search_fields = [
        "user__username",
        "request_url",
        "request_method",
        "response_code",
        "ip_address",
        "datetime",
    ]
    permission_classes = [
        IsAuthenticated,
    ]
