from rest_framework import serializers

class SendOTPSerializer(serializers.Serializer):
    phone = serializers.CharField()
    user_type = serializers.ChoiceField(choices=[
        "villager",
        "asha_worker",
        "admin_phc",
        "delivery_partner"
    ])

class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField()
    otp = serializers.CharField()




# serializers.py


from .models import HealthReport

class HealthReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthReport
        fields = ["latitude", "longitude", "symptoms"]