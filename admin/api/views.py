from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from profile_settings.models import Message, AppSettings
from admin.api.serializers import MessageSerializer, AppSettingsSerializer
from MyPortfolio.api.permissions import (
    IsAuthenticatedOrPostOnly,
    IsOwner,
)


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
        serializer.save(user=self.request.user.id)
