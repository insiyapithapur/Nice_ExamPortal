from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.User)
admin.site.register(models.Form)
admin.site.register(models.StudentInfo)
admin.site.register(models.StudentExamInfo)
admin.site.register(models.Questions)
admin.site.register(models.Choices)
admin.site.register(models.Answer)
admin.site.register(models.Responses)