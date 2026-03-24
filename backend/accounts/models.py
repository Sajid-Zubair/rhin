from django.db import models

class User(models.Model):
    USER_TYPES = (
        ("villager", "Villager"),
        ("asha_worker", "ASHA Worker"),
        ("admin_phc", "Admin / PHC"),
        ("delivery_partner", "Delivery Partner"),
    )

    phone = models.CharField(max_length=15, unique=True)
    user_type = models.CharField(max_length=30, choices=USER_TYPES)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.phone} - {self.user_type}"