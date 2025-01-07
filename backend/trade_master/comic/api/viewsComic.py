from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from comic.models import Comic
from user.models import User
from comic.api.serializers import ComicSerializer, UpdateComicSerializer

"""
    Función para obtener todos los cómics disponibles
"""
@api_view(['GET'])
@permission_classes([AllowAny])
def get_comics(request):
    try:
        # Obtenemos los cómics que no han sido vendidos
        comics = Comic.objects.filter(is_sold=False)
        
        if not comics:
            return Response({"message": "No hay cómics disponibles"}, status=status.HTTP_200_OK)
        
        comics_serializer = ComicSerializer(comics, many=True)
        return Response({"data" : comics_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as _:
        return Response({"message": 'Error al intentar obtener los cómics'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

"""
    Función para obtener los cómics que ha creado un usuario
"""    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_comics(request):
    try:
        user = get_object_or_404(User, id=request.user.id)
        comics = Comic.objects.filter(seller=user)
        
        if not comics:
            return Response({"message": "No has publicado cómics aún"}, status=status.HTTP_200_OK)
        
        comics_serializer = ComicSerializer(comics, many=True)
        return Response({"data" : comics_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as _:
        return Response({"message": 'Error al intentar obtener los cómics creados por el usuario'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
"""
    Función para obtener un cómic por su id
    - int comic_id: ID del cómic
"""   
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comic(request, comic_id):
    try:
        comic = get_object_or_404(Comic, id=comic_id)
        
        comic_serializer = ComicSerializer(comic)
        
        return Response({"data": comic_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as _:
        return Response({"message": 'Error al intentar obtener la información de este cómic'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
"""
    Función para crear un cómic
"""   
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comic(request):
    try:
        comic_data = request.data
        comic_data['seller'] = request.user.id # Se asigna el usuario que crea el cómic como vendedor
        
        comic_serializer = ComicSerializer(data=comic_data, context={'request': request})
        
        if not comic_serializer.is_valid():
            return Response(comic_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        comic = comic_serializer.save()
        response_serializer = ComicSerializer(comic)
        
        return Response(
            { "message": "¡Tu cómic ha sido publicado exitosamente!",
              "data": response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
    except Exception as _:
        return Response({"message": 'Error al intentar publicar el cómic'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
"""
    Función para actualizar un cómic
    - int comic_id: ID del cómic
"""   
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_comic(request, comic_id):
    try:
        comic = get_object_or_404(Comic, id=comic_id)
        
        if comic.seller.id != request.user.id: # Solo el usuario que creó el cómic puede actualizarlo
            return Response({"error": "No tienes autorización para actualizar este cómic"}, status=status.HTTP_401_UNAUTHORIZED)
        
        data = request.data
        update_serializer = UpdateComicSerializer(comic, data=data, partial=True)
        
        if not update_serializer.is_valid():
            return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        updated_comic = update_serializer.save()
        
        # Devolvemos los datos actualizados usando el ComicSerializer
        comic_serializer = ComicSerializer(updated_comic)
        return Response(
            { "message": "¡El cómic ha sido actualizado correctamente!",
              "data": comic_serializer.data
            }, status=status.HTTP_200_OK)
        
    except Exception as _:
        return Response({"message": 'Error al intentar actualizar el cómic'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
"""
    Función para actualizar la imagen del cómic
    - int comic_id: ID del cómic
""" 
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_comic_image(request, comic_id):
    try:
        comic = get_object_or_404(Comic, id=comic_id)
        image = request.FILES.get('image')
        
        if comic.seller.id != request.user.id: # Solo el usuario que creó el cómic puede actualizarlo
            return Response({"error": "No tienes autorización para actualizar este cómic"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not image:
            return Response({'message': 'No se ha proporcionado ninguna imagen'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Actualizamos la imagen del cómic
        comic.image = image
        comic.save()
        
        # Devolvemos los datos actualizados usando el ComicSerializer
        comic_serializer = ComicSerializer(comic)
        return Response(
            { "message": "¡La imagen ha sido actualizada correctamente!",
              "data": comic_serializer.data
            }, status=status.HTTP_200_OK)
    
    except Exception as _:
        return Response({"message": 'Error al intentar actualizar la imagen del cómic'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    

"""
    Función para eliminar un cómic creado por el usuario
    - int comic_id: ID del cómic
"""
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comic(request, comic_id):
    try:
        comic = get_object_or_404(Comic, id=comic_id)
        
        if comic.seller.id != request.user.id: # Solo el usuario que creó el cómic puede eliminarlo
            return Response({"error": "No tienes autorización para eliminar este cómic"}, status=status.HTTP_401_UNAUTHORIZED)
        
        comic.delete()
        return Response({"message": "¡Cómic eliminado exitosamente!"}, status=status.HTTP_200_OK)
        
    except Exception as _:
        return Response({"error": 'Error al intentar borrar el cómic'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)