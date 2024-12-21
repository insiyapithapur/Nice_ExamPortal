from django.urls import path
from . import views

urlpatterns = [
    path('sign-up/',views.SignUpAPIView.as_view()),
    path('sign-in/',views.SignInAPIView.as_view()), #login of Faculty + Student
    
    # Set Exam API's
    # checking paper code
    path('checking-papercode/<str:course>/<str:papercode>',views.CheckPaperCodeAPIView.as_view()),
    #faculty seted exam paper
    path('form/create', views.CreateFormAPIView.as_view()), 

    # Check Paper API's
    # course and it's dropdown menus
    path('show-unchecked-paper/dropdown',views.RetrieveUncheckedPaperAPIView.as_view()),
    # retrieve selected paper details to check
    path('retrive-unchecked-paper/<str:code>/<int:exmID>',views.RetrieveUncheckedStudentPaperAPIView.as_view()),
    # submit checked score to each response of selected paper 
    path('submit-score/',views.SubmitScoreAPIView.as_view()),

    #View Paper API's
    path('paper-list/',views.RetrievePaperlistAPIView.as_view()),


    path('form/view/<int:form>',views.GetFormById.as_view()),
    # path('edit-student-exam-datetime',views.UpdateStudentExamDatetimeAPIView.as_view()),
    path('assign/exam-paper/<int:form>/<int:examregNo>',views.AssignExamPaperAPIView.as_view()),

    path('form/view/<str:course>/',views.RetrieveFormsbyCourseAPIView.as_view())
]