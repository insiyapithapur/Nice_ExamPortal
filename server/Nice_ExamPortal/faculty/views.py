from collections import defaultdict
from datetime import datetime
import json
import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.utils import timezone
from django.db import transaction
from django.contrib.auth.hashers import check_password
from . import models

# Create your views here.
class SignUpAPIView(APIView):
    def post(self, request):
        print("sjabnxajkb")
        name = request.data.get("name", "")
        password = request.data.get("password", "")
        email = request.data.get("email", "")

        # Check if email is already in use
        if models.User.objects.filter(email=email).exists():
            return Response({"message": "Email already taken."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create the user
            user = models.User.objects.create_user(
                name=name, 
                password=password, 
                email=email,
                is_faculty=True,
                created_at = timezone.now(),
                updated_at = timezone.now()
            )
            user.save()
            return Response({"message": "Successfully Registered","is_faculty":True}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": "Something is wrong", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class SignInAPIView(APIView):
    def post(self, request):
        email = request.data.get("email", "")
        password = request.data.get("password", "")

        print("Email",email)
        print("password",password)
        user = models.User.objects.get(email=email)
        if user is None:
            return Response({"message": "Email doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        if check_password(password, user.password):
            if user.is_faculty == True :
                return Response({"message": "Faculty is successfully loged in","user":user.id,"is_faculty":user.is_faculty}, status=status.HTTP_200_OK)
            else : 
                studentExamInfo = models.StudentExamInfo.objects.get(user=user)
                print("exam_id ",studentExamInfo.id)
                return Response({
                    "message": "Student is successfully loged in",
                    "exam_id" : studentExamInfo.id,
                    "user":user.id,
                    "is_faculty":user.is_faculty,
                    "exam_date":studentExamInfo.exam_date,
                    "exam_time":studentExamInfo.exam_time,
                    "exam_checked":studentExamInfo.checked}, 
                status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid credentials, please try again"}, status=status.HTTP_401_UNAUTHORIZED)
        
class GetFormById(APIView):
    def get(self, request, form, *args, **kwargs):
        try:
            form = models.Form.objects.get(id=form)
            
            response_data = {
                "form_id": form.id,
                "paper_code": form.code,
                "paper_title": form.title,
                "course": form.course,
                "description": form.description,
                "total_score": form.score,
                "questions": []
            }
            questions = models.Questions.objects.filter(form=form).prefetch_related('choices')
            
            for question in questions:
                question_data = {
                    "question_id": question.id,
                    "question_text": question.question,
                    "question_type": question.question_type,
                    "score": question.score,
                    "answer_key": question.answer_key,
                    "required": question.required,
                    "feedback": question.feedback,
                    "choices": []
                }
                
                if question.question_type in ["mcq", "checkbox"]:
                    choices = question.choices.all()
                    for choice in choices:
                        question_data["choices"].append({
                            "choice_id": choice.id,
                            "choice_text": choice.choice,
                            "is_answer": choice.is_answer
                        })

                response_data["questions"].append(question_data)
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        except models.Form.DoesNotExist:
            return Response({"error": "Form not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CheckPaperCodeAPIView(APIView):
    def get(self, request,course=None,papercode=None, *args, **kwargs):
        try : 
            pattern = r"^(?P<month>[A-Za-z]{3})-(?P<year>\d{4})-(?P<code>\d{3})$"
            match = re.match(pattern, papercode)
            if not match:
                return Response(
                    {"error": "Invalid paper code format. Expected format is 'MMM-YYYY-###'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            papercode_data = match.groupdict()
            paper_month = papercode_data["month"]
            paper_year = int(papercode_data["year"])
            paper_code = int(papercode_data["code"])

            # Validate current month and year
            current_month = datetime.now().strftime("%b")  # 'Dec', 'Jan', etc.
            current_year = datetime.now().year

            if paper_year < current_year or (paper_year == current_year and paper_month != current_month):
                return Response(
                    {"error": "Paper code does not match the current month and year."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            last_papercode = models.Form.objects.filter(course=course).order_by('-code').first()
            if last_papercode:
                print("last_papercode ",last_papercode)
                last_code = int(last_papercode.code.split('-')[-1])
                print("last_code ",last_code) 
                print("paper_code ",paper_code)
                if paper_code != last_code + 1:
                    return Response(
                        {"error": f"Invalid paper code sequence. Expected code is {last_code + 1}."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            return Response({"message": "Paper code is valid."}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class CreateFormAPIView(APIView):        
    def post(self, request, *args, **kwargs):
        data = request.data
        
        try:
            required_fields = ['user', 'paper_code', 'paper_title', 'course', 'total_score', 'questions']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return Response(
                    {"error": f"Missing fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_id = data.get("user")
            paper_code = data.get("paper_code")
            paper_title = data.get("paper_title")
            course = data.get("course")
            total_score = data.get("total_score")
            description = data.get("description", "")
            questions = data.get("questions")
            
            try:
                print("skojslow")
                user = models.User.objects.get(id=user_id)
            except models.User.DoesNotExist:
                return Response(
                    {"error": "User does not exist."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            
            with transaction.atomic():
                print("vcjsgvd")
                form_exist = models.Form.objects.filter(code=paper_code).exists
                print("cbjbj")
                if form_exist == False:
                    return Response(
                    {"error": "Paper code already exist"},
                    status=status.HTTP_404_NOT_FOUND,
                )
                print("1234")
                form = models.Form.objects.create(
                    code=paper_code,
                    course=course,
                    title=paper_title,
                    description=description,
                    creator=user,
                    score=total_score,
                )

                for question_data in questions:
                    question_text = question_data.get("question_text")
                    question_type = question_data.get("question_type", "text")  # Default to text
                    score = question_data.get("score", 0)
                    answer_key = question_data.get("answer_key", "")  
                    choices_data = question_data.get("choices", [])
                    
                    if not question_text:
                        return Response(
                            {"error": "Question text is required for all questions."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    if question_type in ["text", "true_false"]:
                        if not answer_key:
                            return Response(
                                {"error": f"Answer key is required for {question_type} questions."},
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                        question = models.Questions.objects.create(
                            form=form,
                            question=question_text,
                            question_type=question_type,
                            score=score,
                            answer_key=answer_key,
                            required=True,  
                        )

                    # Handle "mcq" or "checkbox" question types
                    elif question_type in ["multipleChoice", "checkbox"]:
                        if not choices_data:
                            return Response(
                                {"error": f"Choices are required for {question_type} questions."},
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                        question = models.Questions.objects.create(
                            form=form,
                            question=question_text,
                            question_type=question_type,
                            score=score,
                            required=True,
                        )

                        for choice_data in choices_data:
                            choice_text = choice_data.get("choice_text")
                            is_answer = choice_data.get("is_answer", False)

                            if not choice_text:
                                return Response(
                                    {"error": "Choice text is required for all choices."},
                                    status=status.HTTP_400_BAD_REQUEST,
                                )

                            models.Choices.objects.create(
                                choice=choice_text,
                                is_answer=is_answer,
                                question=question,
                            )

                    else:
                        return Response(
                            {"error": f"Unsupported question type: {question_type}."},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                return Response(
                    {"message": "Exam created successfully!"},
                    status=status.HTTP_201_CREATED,
                )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class RetrievePaperlistAPIView(APIView):
    def get(self, request):
        try:
            # Fetch all forms
            forms = models.Form.objects.all()
            
            if not forms.exists():
                return Response({"error": "No forms found."}, status=status.HTTP_404_NOT_FOUND)

            # Initialize a defaultdict to group forms by course
            grouped_by_course = defaultdict(list)

            # Loop through all forms and group them by course
            for form in forms:
                paper_info = {
                    "form_id": form.id,
                    "paper_code": form.code,
                    "paper_title": form.title,
                }
                # Append the paper info to the list for the respective course
                grouped_by_course[form.course].append(paper_info)

            # Convert defaultdict to a regular dict for the response
            response_data = dict(grouped_by_course)

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class AssignExamPaperAPIView(APIView):
    def get(self, request, form, examregNo):
        form_instance = models.Form.objects.get(id=form)
        student_info = models.StudentExamInfo.objects.get(id=examregNo)

        student_info.form = form_instance
        student_info.save()

        return Response(
            {"message": f"Form {form_instance.id} has been assigned to {student_info.id}."},
            status=status.HTTP_200_OK
        )

class RetrieveUncheckedPaperAPIView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Filter unchecked papers with attempted=True
            unchecked_papers = models.StudentExamInfo.objects.filter(
                checked=False, attempted=True
            ).select_related("user", "form")

            # Group papers by course name
            grouped_data = {}
            for exam_info in unchecked_papers:
                course_name = exam_info.course_name
                paper_data = {
                    "student_examID": exam_info.id if exam_info.id else None,
                    "paper_code": exam_info.form.code if exam_info.form else None,
                    "student_name": exam_info.user.name if exam_info.user else None,
                }
                if course_name in grouped_data:
                    grouped_data[course_name].append(paper_data)
                else:
                    grouped_data[course_name] = [paper_data]

            return Response(grouped_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RetrieveUncheckedStudentPaperAPIView(APIView):
    def get(self, request, code=None, exmID=None, *args, **kwargs):
        try:
            # Validate input
            if not code or not exmID:
                return Response(
                    {"error": "Code and exmID are required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Retrieve the StudentExamInfo by exmID
            student_exam_info = models.StudentExamInfo.objects.filter(id=exmID).first()
            if not student_exam_info:
                return Response(
                    {"error": "Student exam info not found for the given course and exmID."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Retrieve the associated form
            form = student_exam_info.form
            if not form:
                return Response(
                    {"error": "Form not associated with the student exam info."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Retrieve responses and questions for the form
            print("form ",form)
            print("student exam id",student_exam_info)
            responses = models.Responses.objects.filter(response_to=form, responder=student_exam_info)
            print("responses ",responses)
            questions = models.Questions.objects.filter(form=form).prefetch_related("choices")

            # Prepare response data
            response_data = []
            for question in questions:
                response_item = {
                    "question_id": question.id,
                    "question_score" : question.score,
                    "question_text": question.question,
                    "question_type": question.question_type,
                    "required": question.required,
                    "correct_answer": question.answer_key,
                    "score": question.score,
                    "choices": [
                        {"choice_id": choice.id, "choice_text": choice.choice, "is_answer": choice.is_answer}
                        for choice in question.choices.all()
                    ],
                    "student_response": None,
                }

                # Check if the student has responded to the question
                for response in responses:
                    print("response ",response)
                    for answer in response.response.all():
                        if answer.answer_to_id == question.id:
                            response_item["response_id"] = answer.id
                            response_item["student_response"] = answer.answer

                response_data.append(response_item)

            # Return structured data
            return Response({
                "form_title": form.title,
                "form_course" : form.course,
                "form_code" : form.code,
                "form_creater" : form.creator.name,
                "form_score" : form.score, 
                "student_name" : student_exam_info.user.name,
                "student_email" : student_exam_info.user.email,
                "questions": response_data,
                }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class SubmitScoreAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Get the 'scores_data' from the request
            scores_data = request.data
            print("scores_data ",scores_data)
            if not scores_data:
                return Response({"error": "No scores data provided."}, status=status.HTTP_400_BAD_REQUEST)

            # Parse the JSON string into a list of dictionaries
            scores_data = json.loads(scores_data) if isinstance(scores_data, str) else scores_data
            
            total_score = 0

            with transaction.atomic():
                for entry in scores_data:
                    print("entry ",entry)

                    response_id = entry.get('response_id')
                    print("response_id ",response_id)
                    score = entry.get('score')
                    print("score ",score)

                    if response_id is None or score is None:
                        return Response({"error": "Missing response_id or score in the request."}, status=status.HTTP_400_BAD_REQUEST)

                    # Fetch the response object from the database
                    answer = models.Answer.objects.get(id=response_id)
                    answer.score = score
                    answer.save()

                    total_score += score

                # After saving all scores, update the student exam info
                response = models.Responses.objects.filter(response=response_id).first()
                print(" response",response)
                student_exam_info = response.responder
                student_exam_info.total_score = total_score
                student_exam_info.checked = True
                student_exam_info.save()

                return Response({"message": "Scores submitted successfully."}, status=status.HTTP_200_OK)

        except models.Responses.DoesNotExist:
            return Response({"error": "Response ID not found."}, status=status.HTTP_404_NOT_FOUND)
        
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class RetrieveFormsbyCourseAPIView(APIView):
    def get(self, request, course=None, *args, **kwargs):
        try:
            forms = models.Form.objects.filter(course=course)
            if not forms.exists():
                return Response({"error": "No forms found for the given course and form ID."}, status=status.HTTP_404_NOT_FOUND)

            response_data = []

            for form in forms:
                form_data = {
                    "form_id": form.id,
                    "paper_code": form.code,
                    "paper_title": form.title,
                    "course": form.course,
                    "description": form.description,
                    "total_score": form.score,
                    "questions": []
                }

                questions = models.Questions.objects.filter(form=form).prefetch_related('choices')

                for question in questions:
                    question_data = {
                        "question_id": question.id,
                        "question_text": question.question,
                        "question_type": question.question_type,
                        "score": question.score,
                        "answer_key": question.answer_key,
                        "required": question.required,
                        "feedback": question.feedback,
                        "choices": []
                    }

                    if question.question_type in ["mcq", "checkbox"]:
                        choices = question.choices.all()
                        for choice in choices:
                            question_data["choices"].append({
                                "choice_id": choice.id,
                                "choice_text": choice.choice,
                                "is_answer": choice.is_answer
                            })

                    form_data["questions"].append(question_data)

                response_data.append(form_data)

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)