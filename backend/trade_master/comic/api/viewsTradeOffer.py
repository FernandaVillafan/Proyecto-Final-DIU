from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.utils import timezone

from comic.models import Comic, TradeOffer
from user.models import User
from comic.api.serializers import TradeOfferSerializer, TradeOfferDetailSerializer

"""
    Función para crear una oferta de intercambio de un cómic.
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_trade_offer(request, comic_id):
    try:
        trade_offer_data = request.data
        
        comic = get_object_or_404(Comic, id=comic_id)
        seller = get_object_or_404(User, id=comic.seller.id)
        trader = get_object_or_404(User, id=request.user.id)
        
        trade_offer_data['comic'] = comic.id
        trade_offer_data['seller'] = seller.id
        trade_offer_data['trader'] = trader.id
        # Poner fecha de hoy
        trade_offer_data['date'] = timezone.now().date() 
        
    
        trade_offer_serializer = TradeOfferSerializer(data=trade_offer_data)
        
        if not trade_offer_serializer.is_valid():
            return Response({"error": trade_offer_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        trade_offer_serializer.save()
        
        response_serializer = TradeOfferSerializer(trade_offer_serializer.instance)
        
        
        return Response({"data": response_serializer.data}, status=status.HTTP_200_OK)
  
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
 
"""
    Función para obtener las ofertas de intercambio de un usuario.
    Las ofertas que ha realizado como vendedor y las que ha recibido como comprador.
"""   
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_trade_offers(request):
    try:
        
        # obtenemos por separado las ofertas de intercambio como vendedor y como comprador
        trade_offers_as_seller  = TradeOffer.objects.filter(seller=request.user)
        trade_offers_as_trader = TradeOffer.objects.filter(trader=request.user)
               
        trade_offers_as_seller_serializer = TradeOfferDetailSerializer(trade_offers_as_seller, many=True)
        trade_offers_as_trader_serializer = TradeOfferDetailSerializer(trade_offers_as_trader, many=True)
        return Response({"data" : {
            "trade_offers_as_seller": trade_offers_as_seller_serializer.data,
            "trade_offers_as_trader": trade_offers_as_trader_serializer.data
            }}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
"""
    Función para obtener una oferta de intercambio a tráves de su ID.
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_trade_offer(request, trade_offer_id):
    try:
        trade_offer = TradeOffer.objects.get(id=trade_offer_id, seller=request.user)
        trade_offer_serializer = TradeOfferDetailSerializer(trade_offer)
        
        return Response({"data": trade_offer_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
"""
    Función para editar el estatus de un oferta de intercambio.
    0: Pendiente , 1: Aceptada, 2: Rechazada
"""
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def trade_offer_update(request, trade_offer_id):
    try:
        trade_offer_data = request.data
        status_data = trade_offer_data.get('status')
        
        trade_offer = TradeOffer.objects.get(id=trade_offer_id, seller=request.user)
        
        if not trade_offer:
            return Response({"message": "Trade offer not found"}, status=status.HTTP_404_NOT_FOUND)
                      
        if status_data == 1: # Ver si la oferta fue aceptada
            comic = Comic.objects.get(id=trade_offer.comic_id)
            comics_offers = TradeOffer.objects.filter(comic=comic)
            for offer in comics_offers: # rechazar las otras ofertas
                if offer.id != trade_offer_id:
                    offer.status = 2
                    offer.save()
                    
            comic.is_sold = True # marcar el comic como vendido
            comic.save()
        
        
        trade_offer_serializer = TradeOfferSerializer(trade_offer, data=trade_offer_data, partial=True)
        
        if not trade_offer_serializer.is_valid():
            return Response({"error": trade_offer_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        trade_offer = trade_offer_serializer.save()
        response_serializer = TradeOfferSerializer(trade_offer)
        
        return Response({"message": "Trade Edited",
                         "data" : response_serializer.data }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)