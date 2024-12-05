from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from comic.models import Comic, WishList
from user.models import User
from comic.api.serializers import WishListSerializer, MyWishListSerializer


"""
    Función para añadir un cómic a la lista de deseos de un usuario.
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request, comic_id):
    try:
        comic = get_object_or_404(Comic, id=comic_id)
        user = get_object_or_404(User, id=request.user.id)
        
        whish_list_data = {
            'user': user.id,
            'comic': comic.id
        }
        
        whish_list_serializer = WishListSerializer(data=whish_list_data)
        
        if not whish_list_serializer.is_valid():
            return Response({"error": whish_list_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        whish_list_serializer.save()    
        
        return Response({"message": "Comic added to wishlist"}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

"""
    Función para obtener la lista de deseos de un usuario.
"""    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    try:
        user = get_object_or_404(User, id=request.user.id)
        wishlist = WishList.objects.filter(user=user)
        
        if not wishlist.exists():
            return Response({"message": "Wishlist is empty"}, status=status.HTTP_200_OK)
        
        wishlist_serializer = MyWishListSerializer(wishlist, many=True)
        
        return Response({"data": wishlist_serializer.data }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
 
"""
    Función para eliminar un cómic de la lista de deseos de un usuario.
"""   
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_item(request, comic_id):
    try:
        user = get_object_or_404(User, id=request.user.id)
        comic = get_object_or_404(Comic, id=comic_id)
        
        wishlist_item = WishList.objects.filter(user=user, comic=comic)
        
        if not wishlist_item.exists():
            return Response({"message": "Item not found in wishlist"}, status=status.HTTP_404_NOT_FOUND)
        
        wishlist_item.delete()
        
        return Response({"message": "Item deleted from wishlist"}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)