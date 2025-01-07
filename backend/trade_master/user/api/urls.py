from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import create_user, login, get_user, logout, update_user, update_user_image

router = DefaultRouter()

urlpatterns = [
    *router.urls,
    path('user/create-user/', create_user),
    path('user/login/', login),
    path('user/', get_user),
    path('user/logout/', logout),
    path('user/update-user/', update_user),
    path('user/update-image/', update_user_image)
]