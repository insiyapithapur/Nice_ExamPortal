from django.urls import path,include
from . import views

urlpatterns = [
    path('fetch-from-admin/<int:regNo>',views.FetchFromAdminAPIView.as_view()),
    
    path('sign-up/',views.SignUpAPIView.as_view()),
    # path('sign-in/',views.SignInAPIView.as_view()),
    path('exam/<int:examstdntID>',views.ExamAPIView.as_view()),
    path('submit/exam/',views.SubmitExamAPIView.as_view()),
]

# one email can be used in more than one sign up