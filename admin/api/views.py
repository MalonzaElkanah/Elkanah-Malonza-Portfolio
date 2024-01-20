from django.http import FileResponse
from django.utils import timezone

from rest_framework import viewsets, generics, filters, status
from rest_framework.views import APIView
from rest_framework.decorators import action
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
    VisitorSerializer,
    VisitorStatSerializer,
)
from MyPortfolio.api.permissions import (
    IsAuthenticatedOrPostOnly,
    IsAuthenticatedOrReadOnly,
    IsOwner,
)
from MyPortfolio.api.exceptions import CustomException

import datetime as dt
import calendar as cr


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

    @action(
        detail=True,
        methods=["get"],
        permission_classes=[IsAuthenticatedOrReadOnly],
    )
    def image(self, request, pk=None, **kwargs):
        instance = self.get_object()

        if instance.image is not None:
            # req = requests.get(instance.image)
            # if req.status_code == 200:
            return FileResponse(instance.image, filename=instance.image.name)

        return Response("Image Not Found", status=status.HTTP_404_NOT_FOUND)


class UploadFileModelViewSet(viewsets.ModelViewSet):
    queryset = UploadFile.objects.all()
    serializer_class = UploadFileSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(
        detail=True,
        methods=["get"],
        permission_classes=[IsAuthenticatedOrReadOnly],
    )
    def file(self, request, pk=None, **kwargs):
        instance = self.get_object()

        if instance.file is not None:
            return FileResponse(instance.file, filename=instance.file.name)

        return Response("File Not Found", status=status.HTTP_404_NOT_FOUND)


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


class ListDailyVisitor(generics.ListAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = VisitorSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        """
        Return a count of vistors(Unique IP Address) per day.
        [{
            "date": datetime.datetime(2023, 11, 1, 23, 59),
            "ip_address": [127.0.0.1, 127.0.0.2, 127.0.0.4, 27.0.0.1]
            "requests_count": 23
        },]
        """
        data_list = []

        today = dt.date.today()
        today = dt.datetime(
            today.year,
            today.month,
            today.day,
            00,
            00,
            tzinfo=timezone.get_current_timezone(),
        )
        data_date = today - dt.timedelta(days=30)

        queryset = ActivityLog.objects.filter(
            datetime__gt=data_date,
        ).order_by("-datetime", "ip_address")

        while data_date <= today:
            buffer_date = data_date + dt.timedelta(days=1)
            queryset_data = queryset.filter(
                datetime__gt=data_date, datetime__lt=buffer_date
            )

            data = {
                "date": data_date.date(),
                "ip_addresses": [],
                "requests_count": queryset_data.count(),
            }

            for activity in queryset_data:
                if activity.ip_address not in data["ip_addresses"]:
                    data["ip_addresses"].append(activity.ip_address)
                # data["requests_count"] += 1

            data_list.append(data)

            data_date = buffer_date

        data_list.reverse()

        return data_list


class ListWeeklyVisitor(generics.ListAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = VisitorSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        """
        Return a count of vistors(Unique IP Address) per month.
        [{
            "date": datetime.date(2023, 11, 1),
            "ip_address": [127.0.0.1, 127.0.0.2, 127.0.0.4, 27.0.0.1]
        },]
        """
        data_list = []

        today = dt.datetime.today()
        data_date = today - dt.timedelta(days=365)
        data_date = dt.datetime(
            data_date.year,
            data_date.month,
            1,
            00,
            00,
            tzinfo=timezone.get_current_timezone(),
        )

        queryset = ActivityLog.objects.filter(
            datetime__gt=data_date,
        ).order_by("-datetime", "ip_address")

        calendar = cr.Calendar()

        data_weeks = []

        for x in range(today.month, 12):
            for week in calendar.monthdatescalendar(year=today.year - 1, month=x + 1):
                if week not in data_weeks:
                    data_weeks.append(week)
                    data = self.visitor_data(queryset, week[0], week[-1])
                    data_list.append(data)

        for x in range(0, today.month):
            for week in calendar.monthdatescalendar(year=today.year, month=x + 1):
                if week not in data_weeks and today.date() > week[0]:
                    data_weeks.append(week)
                    data = self.visitor_data(queryset, week[0], week[-1])
                    data_list.append(data)

        data_list.reverse()

        return data_list

    def visitor_data(self, queryset, first_date, last_date):
        first_datetime = dt.datetime(
            first_date.year,
            first_date.month,
            first_date.day,
            00,
            00,
            tzinfo=timezone.get_current_timezone(),
        )

        last_datetime = dt.datetime(
            last_date.year,
            last_date.month,
            last_date.day,
            23,
            59,
            59,
            tzinfo=timezone.get_current_timezone(),
        )
        queryset_data = queryset.filter(
            datetime__gt=first_datetime, datetime__lt=last_datetime
        )

        data = {
            "date": first_date,
            "ip_addresses": [],
            "requests_count": queryset_data.count(),
        }

        for activity in queryset_data:
            if activity.ip_address not in data["ip_addresses"]:
                data["ip_addresses"].append(activity.ip_address)

        return data


class ListMonthlyVisitor(generics.ListAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = VisitorSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        """
        Return a count of vistors(Unique IP Address) per month.
        [{
            "date": datetime.date(2023, 11, 1),
            "ip_address": [127.0.0.1, 127.0.0.2, 127.0.0.4, 27.0.0.1]
        },]
        """
        data_list = []

        today = dt.date.today()
        this_month = dt.datetime(
            today.year, today.month, 1, 00, 00, tzinfo=timezone.get_current_timezone()
        )

        data_date = this_month - dt.timedelta(days=365)
        data_date = dt.datetime(
            data_date.year,
            data_date.month,
            1,
            00,
            00,
            tzinfo=timezone.get_current_timezone(),
        )

        calendar = cr.Calendar()

        queryset = ActivityLog.objects.filter(
            datetime__gt=data_date,
        ).order_by("-datetime", "ip_address")

        while data_date <= this_month:
            month = calendar.monthdayscalendar(
                year=data_date.year, month=data_date.month
            )

            buffer_date = data_date + dt.timedelta(days=max(month[-1]))
            queryset_data = queryset.filter(
                datetime__gt=data_date, datetime__lt=buffer_date
            )

            data = {
                "date": data_date.date(),
                "ip_addresses": [],
                "requests_count": queryset_data.count(),
            }

            for activity in queryset_data:
                if activity.ip_address not in data["ip_addresses"]:
                    data["ip_addresses"].append(activity.ip_address)

            data_list.append(data)

            data_date = buffer_date

        data_list.reverse()

        return data_list


class ListYearlyVisitor(generics.ListAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = VisitorSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        """
        Return the Unique IP Address every year.
        [{
            "date": datetime.date(2023, 11, 1),
            "ip_address": [127.0.0.1, 127.0.0.2, 127.0.0.4, 27.0.0.1]
        },]
        """
        data_list = []

        today = dt.date.today()

        data_year = today.year - 10
        data_date = dt.datetime(
            data_year, 1, 1, 00, 00, tzinfo=timezone.get_current_timezone()
        )

        queryset = ActivityLog.objects.filter(
            datetime__gt=data_date,
        ).order_by("-datetime", "ip_address")

        while data_year <= today.year:
            data_year += 1

            buffer_date = dt.datetime(
                data_year, 1, 1, 00, 00, tzinfo=timezone.get_current_timezone()
            )

            queryset_data = queryset.filter(
                datetime__gt=data_date, datetime__lt=buffer_date
            )

            data = {
                "date": data_date.date(),
                "ip_addresses": [],
                "requests_count": queryset_data.count(),
            }

            for activity in queryset_data:
                if activity.ip_address not in data["ip_addresses"]:
                    data["ip_addresses"].append(activity.ip_address)

            data_list.append(data)

            data_date = buffer_date

        data_list.reverse()

        return data_list


class RetrieveVisitorStat(APIView):
    permission_classes = [
        # IsAuthenticated,
    ]

    def get(self, request, format=None):
        """
        Return the visitor stat.
        {
            "day": 10,
            "week": 70,
            "month": 2400,
            "year": 30000
        }
        """
        now = timezone.now()

        year_ago = now - dt.timedelta(days=365)

        queryset = ActivityLog.objects.filter(
            datetime__gt=year_ago,
        ).order_by("-datetime", "ip_address")

        # year stat
        year_ip_address = []
        month_ip_address = []
        week_ip_address = []
        day_ip_address = []

        for activity in queryset:
            if activity.ip_address not in year_ip_address:
                year_ip_address.append(activity.ip_address)

            if (
                now - dt.timedelta(days=30) <= activity.datetime
                and activity.ip_address not in month_ip_address
            ):
                month_ip_address.append(activity.ip_address)

                if (
                    now - dt.timedelta(days=7) <= activity.datetime
                    and activity.ip_address not in week_ip_address
                ):
                    week_ip_address.append(activity.ip_address)

                    if (
                        now - dt.timedelta(days=1) <= activity.datetime
                        and activity.ip_address not in day_ip_address
                    ):
                        day_ip_address.append(activity.ip_address)

        data = {
            "day": len(day_ip_address),
            "week": len(week_ip_address),
            "month": len(month_ip_address),
            "year": len(year_ip_address),
        }

        return Response(VisitorStatSerializer(data).data, status=status.HTTP_200_OK)
