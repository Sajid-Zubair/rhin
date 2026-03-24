from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from twilio.rest import Client
from .models import User
from .serializers import SendOTPSerializer, VerifyOTPSerializer

client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


class SendOTPView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        user_type = serializer.validated_data["user_type"]

        user, created = User.objects.get_or_create(phone=phone)

        if user.is_verified and user.user_type != user_type:
            return Response(
                {"error": "User role already assigned"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.user_type = user_type
        user.save()

        try:
            verification = client.verify.v2.services(
                settings.TWILIO_VERIFY_SERVICE_SID
            ).verifications.create(to=phone, channel="sms")

            return Response({
                "message": "OTP sent",
                "status": verification.status
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print("TWILIO ERROR:", e)  # 👈 VERY IMPORTANT
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyOTPView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        otp = serializer.validated_data["otp"]

        check = client.verify.v2.services(
            settings.TWILIO_VERIFY_SERVICE_SID
        ).verification_checks.create(to=phone, code=otp)

        if check.status == "approved":
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            user.is_verified = True
            user.save()

            return Response({
                "message": "Verified",
                "user_type": user.user_type
            }, status=status.HTTP_200_OK)

        return Response(
            {"error": "Invalid OTP"},
            status=status.HTTP_400_BAD_REQUEST
        )
    




# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import HealthReportSerializer
from .models import HealthReport


class CreateHealthReportView(APIView):
    authentication_classes = []
    permission_classes = []


    def get(self, request):
        reports = HealthReport.objects.all()
        serializer = HealthReportSerializer(reports, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("🔥 Incoming data:", request.data)  # ✅ debug

        serializer = HealthReportSerializer(data=request.data)

        if serializer.is_valid():
            report = serializer.save()

            return Response(
                {
                    "message": "Report saved successfully",
                    "data": {
                        "id": report.id,
                        "latitude": report.latitude,
                        "longitude": report.longitude,
                        "symptoms": report.symptoms,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        print("❌ Errors:", serializer.errors)  # ✅ debug

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)