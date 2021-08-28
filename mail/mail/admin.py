from django.contrib import admin
from .models import User, Email

# Register your models here.
admin.site.register(Email,)
admin.site.register(User,)