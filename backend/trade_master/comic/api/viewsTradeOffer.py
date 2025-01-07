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
    Función para crear una oferta de intercambio de un cómic
    - int comic_id: ID del cómic
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_trade_offer(request, comic_id):
    try:
        trade_offer_data = request.data.copy()
        
        comic = get_object_or_404(Comic, id=comic_id)
        seller = get_object_or_404(User, id=comic.seller.id)
        trader = get_object_or_404(User, id=request.user.id)
        
        trade_offer_data['comic'] = comic.id
        trade_offer_data['seller'] = seller.id
        trade_offer_data['trader'] = trader.id
        # Ponemos la fecha de hoy
        trade_offer_data['date'] = timezone.now().date() 
        
        trade_offer_serializer = TradeOfferSerializer(data=trade_offer_data)
        
        if not trade_offer_serializer.is_valid():
            return Response(trade_offer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        trade_offer_serializer.save()
        
        response_serializer = TradeOfferSerializer(trade_offer_serializer.instance)
        
        return Response(
            { "message": "¡Tu oferta ha sido enviada exitosamente!",
              "data": response_serializer.data
            }, status=status.HTTP_200_OK)
  
    except Exception as _:
        return Response({"message": 'Error al intentar crear una oferta del cómic'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
"""
    Función para obtener las ofertas de intercambio de un usuario.
    Las ofertas que ha realizado como vendedor y las que ha recibido como comprador
"""   
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_trade_offers(request):
    try:
        # Obtenemos por separado las ofertas de intercambio como vendedor y como comprador
        trade_offers_as_seller  = TradeOffer.objects.filter(seller=request.user)
        trade_offers_as_trader = TradeOffer.objects.filter(trader=request.user)
               
        trade_offers_as_seller_serializer = TradeOfferDetailSerializer(trade_offers_as_seller, many=True)
        trade_offers_as_trader_serializer = TradeOfferDetailSerializer(trade_offers_as_trader, many=True)
        
        return Response(
            { "data" : {
                "trade_offers_as_seller": trade_offers_as_seller_serializer.data,
                "trade_offers_as_trader": trade_offers_as_trader_serializer.data }
            }, status=status.HTTP_200_OK)
        
    except Exception as _:
        return Response({"message": 'Error al intentar obtener las ofertas del usuario'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
"""
    Función para obtener una oferta de intercambio a tráves de su ID
    - int trade_offer_id: ID de la oferta
"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_trade_offer(request, trade_offer_id):
    try:
        trade_offer = TradeOffer.objects.get(id=trade_offer_id, seller=request.user)
        trade_offer_serializer = TradeOfferDetailSerializer(trade_offer)
        
        return Response({"data": trade_offer_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as _:
        return Response({"message": 'Error al intentar obtener esta oferta'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
"""
    Función para editar el estatus de un oferta de intercambio (0: Pendiente , 1: Aceptada, 2: Rechazada)
    - int trade_offer_id: ID de la oferta
"""
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def trade_offer_update(request, trade_offer_id):
    try:
        trade_offer_data = request.data
        status_data = trade_offer_data.get('status')
        
        trade_offer = TradeOffer.objects.get(id=trade_offer_id, seller=request.user)
        
        if not trade_offer:
            return Response({"error": "No se encontró una oferta para intercambio"}, status=status.HTTP_404_NOT_FOUND)
                      
        if status_data == 1: # Para ver si la oferta fue aceptada
            comic = Comic.objects.get(id=trade_offer.comic_id)
            comics_offers = TradeOffer.objects.filter(comic=comic)
            
            for offer in comics_offers: # Rechazamos las otras ofertas
                if offer.id != trade_offer_id:
                    offer.status = 2
                    offer.save()
                    
            comic.is_sold = True # Marcamos el cómic como vendido
            comic.save()
        
        trade_offer_serializer = TradeOfferSerializer(trade_offer, data=trade_offer_data, partial=True)
        
        if not trade_offer_serializer.is_valid():
            return Response(trade_offer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        trade_offer = trade_offer_serializer.save()
        
        response_serializer = TradeOfferSerializer(trade_offer)
        
        return Response(
            { "message": "¡Se ha actualizado el estatus de la oferta correctamente!",
              "data" : response_serializer.data 
            }, status=status.HTTP_200_OK)
        
    except Exception as _:
        return Response({"message": 'Error al intentar editar el estatus de la oferta'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)