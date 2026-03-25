from django.urls import path
from .views import SendOTPView, VerifyOTPView, CreateHealthReportView, StartAICallView, VoiceAgentWebhook, ReceiveOrderView

urlpatterns = [
    path("send-otp/", SendOTPView.as_view()),
    path("verify-otp/", VerifyOTPView.as_view()),
    path("report/", CreateHealthReportView.as_view()),
    path("start-call/", StartAICallView.as_view()),
    path("voice-webhook/", VoiceAgentWebhook.as_view()),
    path("orders/", ReceiveOrderView.as_view()),
]