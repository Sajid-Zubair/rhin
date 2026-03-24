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