import json
import random
import string
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db import transaction
from django.contrib.auth.hashers import check_password
from faculty import models
from datetime import datetime
import time
from django.utils.timezone import now

# Create your views here.
class FetchFromAdminAPIView(APIView):
    def get(self,request,regNo):
        return Response({
            "Name": "Dummy Name",
            "Mobile Number": "1203456789",
            "Email":"demmy@gmail.com"}, 
        status=status.HTTP_200_OK)

class SignUpAPIView(APIView):
    def post(self, request):
        name = request.data.get("name", "")
        phone = request.data.get("phone", "")
        email = request.data.get("email", "")
        regNo = request.data.get("regNo", "")
        course_name = request.data.get("course", "")
        exam_date = request.data.get("exam_date", "")
        exam_time = request.data.get("examtime", "")

        # {
        #     "name": "banu",
        #     "phone": "8141171855",
        #     "email": "banu0804@gmail.com",
        #     "regNo": "NI00256",
        #     "course": "CP",
        #     "exam_date": "05-12-2024",
        #     "examtime": "8:30 AM"
        # }
        
        if not exam_date or not exam_time:
            return Response({"message": "Both exam date and exam time are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate that email is not already in use
        if models.User.objects.filter(email=email).exists():
            return Response({"message": "Email already taken."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Generate password using regNo, exam_date, and exam_time
            password = self.generate_password(regNo, exam_date, exam_time)
            print("password",password)
            with transaction.atomic():
                # Create the user with the generated password
                print("sdxscsc")
                user = models.User.objects.create_user(
                    name=name,
                    email=email,
                    password=password, 
                    is_faculty=False,
                    created_at=timezone.now(),
                    updated_at=timezone.now()
                )
                user.save()
                print("user ",user.email)
                # Create StudentInfo entry
                student_info = models.StudentInfo.objects.create(
                    user=user,
                    registration_No=regNo,
                    mobile=phone
                )
                print("student_info ",student_info)
                # Parse the exam date (in format: "18-02-2024")
                try:
                    exam_date_parsed = datetime.strptime(exam_date, "%d-%m-%Y").date()
                except ValueError:
                    return Response({"message": "Invalid exam date format. Expected format: dd-mm-yyyy."}, status=status.HTTP_400_BAD_REQUEST)

                # Parse the exam time (in format: "9:00 AM" or "8:30 PM")
                try:
                    exam_time_parsed = datetime.strptime(exam_time, "%I:%M %p").time()
                except ValueError:
                    return Response({"message": "Invalid exam time format. Expected format: hh:mm AM/PM."}, status=status.HTTP_400_BAD_REQUEST)

                # Create StudentExamInfo entry
                student_exam_info = models.StudentExamInfo.objects.create(
                    user=user,
                    course_name=course_name,
                    exam_date=exam_date_parsed,
                    exam_time=exam_time_parsed
                )
                print("student_exam_info ",student_exam_info)
                return Response({
                    "message": "Successfully Registered",
                    "is_faculty": False,
                    "user": user.id,
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("str(e) ",str(e))
            return Response({"message": "Something went wrong", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def generate_password(self, regNo, exam_date, exam_time):
        """
        Generate a password based on the regNo, exam_date, and exam_time.
        The password must be 8 characters long, containing digits, letters, and a special symbol.
        """
        # Take first 3 characters from regNo, and first 2 digits from exam_date
        regNo_part = regNo[:3]
        date_part = exam_date.split("-")[0]  # First 2 digits of the exam date (day part)

        # Take first 2 characters from exam_time (AM/PM part)
        time_part = exam_time.split(":")[0][:2]  # Only first 2 digits (hour part)

        # Combine these parts to form the base of the password
        base_password = regNo_part + date_part + time_part

        # Add a special symbol and random digits
        special_symbol = random.choice(["@", "#", "$", "%", "&", "*", "!"])
        random_digits = ''.join(random.choices(string.digits, k=2))  # 2 random digits

        # Final password: Ensure it's 8 characters long and contains special characters, digits, and letters
        password = base_password + special_symbol + random_digits

        return password
        
# class SignInAPIView(APIView):
#     def post(self, request):
#         email = request.data.get("email", "")
#         password = request.data.get("password", "")

#         user = models.User.objects.get(email=email)
#         if user is None:
#             return Response({"message": "Email doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
        
#         if user.is_faculty is True:
#             return Response({"message": "You are faculty"}, status=status.HTTP_400_BAD_REQUEST)
        
#         if check_password(password, user.password):
#             if user.is_faculty == False :
#                 studentExamInfo = models.StudentExamInfo.objects.get(user=user)
#                 print("exam_id ",studentExamInfo.id)
#                 return Response({
#                     "message": "Student is successfully loged in",
#                     "user":user.id,
#                     "exam_id" : studentExamInfo.id,
#                     "is_faculty":user.is_faculty,
#                     "exam_date":studentExamInfo.exam_date,
#                     "exam_time":studentExamInfo.exam_time,
#                     "exam_checked":studentExamInfo.checked}, 
#                 status=status.HTTP_200_OK)
#             else : 
#                 return Response({"message": "is_faculty is true"}, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             return Response({"message": "Invalid credentials, please try again"}, status=status.HTTP_401_UNAUTHORIZED)

class ExamAPIView(APIView):
    def get(self, request, examstdntID):
        if not examstdntID:
            return Response(
                {"message": "StudentExamInfo ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Fetch the StudentExamInfo instance
            student_exam_info = models.StudentExamInfo.objects.get(pk=examstdntID)
        except models.StudentExamInfo.DoesNotExist:
            return Response(
                {"message": "StudentExamInfo not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        if student_exam_info.checked:
            return Response(
                {"message": "Paper has been checked"},
                status=status.HTTP_200_OK,
            )

        exam_datetime = timezone.make_aware(
            timezone.datetime.combine(student_exam_info.exam_date, student_exam_info.exam_time)
        )
        current_time = timezone.now()

        # Calculate the time difference
        time_diff = (current_time - exam_datetime).total_seconds()

        # Check if the exam time has passed by more than an hour
        if time_diff > 3600:
            questions = models.Questions.objects.filter(form=student_exam_info.form).values(
                "id", "question", "question_type", "required", "score", "feedback"
            )

            # Fetch form details
            form = models.Form.objects.filter(pk=student_exam_info.form_id).values(
                "id", "code", "course", "title", "description", "creator__name", "score"
            ).first()

            # Add choices to questions where type is MCQ or Checkbox
            questions_with_choices = []
            for question in questions:
                if question["question_type"] in ["mcq", "checkbox"]:
                    print("dncbjb")
                    choices = models.Choices.objects.filter(question_id=question["id"]).values(
                        "id", "choice", "is_answer"
                    )
                    question["choices"] = list(choices)
                else:
                    question["choices"] = []
                questions_with_choices.append(question)

            return Response(
                {
                    "message": "Exam ongoing",
                    "form": form,
                    "questions": questions_with_choices,
                },
                status=status.HTTP_200_OK,
            )
            # return Response({
            #     "message": "Time out",
            #     "exam_id":student_exam_info.id,
            #     "exam_time":student_exam_info.exam_time,
            #     "exam_date":student_exam_info.exam_date,
            #     "course" : student_exam_info.course_name
            #     }, status=status.HTTP_400_BAD_REQUEST)

        # Check if the exam has not started
        if time_diff < 0:
            # print("nclshk")
            questions = models.Questions.objects.filter(form=student_exam_info.form).values(
                "id", "question", "question_type", "required", "score", "feedback"
            )
            print("questions",questions)
            # Fetch form details
            form = models.Form.objects.filter(pk=student_exam_info.form_id).values(
                "id", "code", "course", "title", "description", "creator__name", "score"
            ).first()

            # Add choices to questions where type is MCQ or Checkbox
            questions_with_choices = []
            for question in questions:
                if question["question_type"] in ["multipleChoice", "checkbox"]:
                    print("dncbjb")
                    choices = models.Choices.objects.filter(question_id=question["id"]).values(
                        "id", "choice", "is_answer"
                    )
                    question["choices"] = list(choices)
                else:
                    question["choices"] = []
                questions_with_choices.append(question)

            print("questions_with_choices ",questions_with_choices)
            return Response(
                {
                    "message": "Exam ongoing",
                    "form": form,
                    "questions": questions_with_choices,
                },
                status=status.HTTP_200_OK,
            )
            # print("nkjsndksjb")
            # return Response(
            #     {"message": "Time left to start", "time_left_seconds": abs(time_diff)},
            #     status=status.HTTP_200_OK,
            # )

        # Exam is ongoing; fetch questions without answer_key
        questions = models.Questions.objects.filter(form=student_exam_info.form).values(
            "id", "question", "question_type", "required", "score", "feedback"
        )
        print("question",questions)
        # Fetch form details
        form = models.Form.objects.filter(pk=student_exam_info.form_id).values(
            "id", "code", "course", "title", "description", "creator__name", "score"
        ).first()

        # Add choices to questions where type is MCQ or Checkbox
        questions_with_choices = []
        for question in questions:
            print("question type",question["question_type"])
            if question["question_type"] in ["multipleChoice", "Checkbox"]:
                choices = models.Choices.objects.filter(question_id=question["id"]).values(
                    "id", "choice", "is_answer"
                )
                question["choices"] = list(choices)
            else:
                question["choices"] = []
            questions_with_choices.append(question)
            print("questions_with_choices",question)
            rresponse = {
                "message": "Exam ongoing",
                "form": form,
                "questions": questions_with_choices,
            }
            print("response",rresponse)
        return Response(
            {
                "message": "Exam ongoing",
                "form": form,
                "questions": questions_with_choices,
            },
            status=status.HTTP_200_OK,
        )
    
class SubmitExamAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            print("kjbcskbck")
            # Extract data from the request
            user = request.data.get("user")
            print("user",user)
            form_id = request.data.get("form_id")
            print("form_id",form_id)
            question_answers = request.data.get("question", {})
            print("question_answers ",question_answers)

            # Validate the form
            form = get_object_or_404(models.Form, id=form_id)
            print("form",form)
            # Validate the StudentExamInfo object
            print("user",user)

            student_exam_info = models.StudentExamInfo.objects.get(id=user)
            print("student",student_exam_info)
            # Prepare the response object
            print("jhbjccccccv")
            with transaction.atomic():
                response = models.Responses.objects.create(
                    response_to=form,
                    responder=student_exam_info
                )

                # Loop through the questions and store answers
                for question_id, answer_data in question_answers.items():
                    print("id",question_id)
                    question = models.Questions.objects.get(id=question_id)
                    print("1234",question)
                    # Save the answer
                    answer = models.Answer.objects.create(
                        answer=json.dumps(answer_data),  
                        answer_to=question
                    )
                    # Add the answer to the response
                    response.response.add(answer)
                student_exam_info.attempted = True
                student_exam_info.save()
                return Response(
                    {"message": "Exam submitted successfully!"},
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )