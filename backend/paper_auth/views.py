from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from paper_auth.serializers import GroupSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
import requests


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class SignUpViewSet(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")

        # stringify
        username = str(username)
        password = str(password)
        email = str(email)

        if username is None or password is None:
            return Response(
                {"error": "Please provide both username and password"}, status="400"
            )
        else:
            user = User.objects.create_user(username, email, password)
            user.save()
            # return the access and refresh tokens
            return Response({"info": "User created successfully"})
