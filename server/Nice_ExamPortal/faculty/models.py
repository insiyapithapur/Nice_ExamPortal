from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, name ,password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        if not name:
            raise ValueError("The Name field must be set")
        
        email = self.normalize_email(email)
        user = self.model(email=email, name=name ,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name ,password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        user = self.create_user(email,name, password, **extra_fields)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.TextField(blank=False,null=False)
    password = models.TextField()
    is_superuser = models.BooleanField(default=False)
    is_faculty = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return f"{self.email} ({self.name})"

# duration
class Form(models.Model):
    code = models.CharField(max_length=30)
    course = models.TextField()
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    creator = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "creator")
    score = models.IntegerField(default=0)
    hrs = models.FloatField(default=1)
    createdAt = models.DateTimeField(auto_now_add = True)
    updatedAt = models.DateTimeField(auto_now = True)

class StudentInfo(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    registration_No = models.CharField(max_length=10,unique=True)
    mobile = models.CharField(max_length=10)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

class StudentExamInfo(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    course_name = models.CharField(max_length=100)
    form = models.ForeignKey(Form,on_delete=models.CASCADE,blank=True,null=True)
    attempted = models.BooleanField(default=False)
    total_score = models.IntegerField(blank=True,default=0)
    checked = models.BooleanField(default=False)
    exam_date = models.DateField()
    exam_time = models.TimeField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

class Questions(models.Model):
    form = models.ForeignKey(Form,on_delete=models.CASCADE)
    question = models.TextField()
    question_type = models.CharField(max_length=20)
    required = models.BooleanField(default= False)
    answer_key = models.TextField(blank=True)
    score = models.IntegerField(blank = True, default=0)
    feedback = models.TextField(null=True)

class Choices(models.Model):
    question = models.ForeignKey("Questions", on_delete=models.CASCADE, related_name="choices")
    choice = models.TextField()
    is_answer = models.BooleanField(default=False)

class Answer(models.Model):
    answer = models.TextField()
    score = models.IntegerField(blank=True,default=0)
    answer_to = models.ForeignKey(Questions, on_delete = models.CASCADE ,related_name = "answer_to")

class Responses(models.Model):
    response_to = models.ForeignKey(Form, on_delete = models.CASCADE, related_name = "response_to")
    responder = models.ForeignKey(StudentExamInfo, on_delete = models.CASCADE, related_name = "responder", blank = True, null = True)
    response = models.ManyToManyField(Answer, related_name = "response")