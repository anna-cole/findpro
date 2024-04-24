#!/usr/bin/env python3

from flask import jsonify, request, make_response, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc
from config import app, db, api
from models import User, Review, Pro

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Signup(Resource):
    def post(self):
        username = request.get_json().get('username')
        email = request.get_json().get('email') 
        password = request.get_json().get('password')
        try:
            user = User(username=username, email=email)
            user.password_hash = password
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return user.to_dict(), 201 
        except IntegrityError:   
            return {'error': 'Error 422: Unprocessable Entity (username already exists)'}, 422

class CheckSession(Resource):
    def get(self):
        user_id = session['user_id']
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200
        return {'error': '401 Unauthorized'}, 401 
    
class Login(Resource):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']
        user = User.query.filter(User.username == username).first()
        if user.authenticate(password):           
            session['user_id'] = user.id
            return user.to_dict(), 200       
        return {'error': 'Error 401: Unauthorized (invalid password)'}, 401
    
class Logout(Resource):
    def delete(self):
        if session['user_id']:
            session['user_id'] = None
            return {}, 204
        return {'error': '401 Unauthorized'}, 401

class Pros(Resource):
    def get(self):        
        pros = Pro.query.all()
        resp = [pro.to_dict() for pro in pros]
        return make_response(resp, 200)
    
    def post(self):
        user_id = session['user_id']
        user = User.query.filter(User.id == user_id).first()
        name = request.get_json().get('name')
        image_url = request.get_json().get('image_url') 
        service = request.get_json().get('service')
        area_served = request.get_json().get('area_served')
        if name == user.username: 
            pro = Pro(name=name, image_url=image_url, service=service, area_served=area_served)
            db.session.add(pro)
            db.session.commit()
            return pro.to_dict(), 201 
        return {'error': 'Error 422: Unprocessable Entity (enter your username)'}, 422

class ProById(Resource):

    def get(self, id):
        pro = Pro.query.filter_by(id=id).first()
        if pro:
            return make_response(jsonify(pro.to_dict()), 200)
        return {'error': '422 Unprocessable Entity'}, 422
       
    def patch(self, id):
        pro = Pro.query.filter_by(id=id).first()
        for attr in request.get_json():
            setattr(pro, attr, request.get_json()[attr])
        db.session.add(pro) 
        db.session.commit()
        return make_response(pro.to_dict(), 200)
    
    def delete(self, id):
        pro = Pro.query.filter_by(id=id).first()
        db.session.delete(pro)
        db.session.commit()
        response_body = {"message": ''}
        return make_response(response_body, 204)
    
class ProByName(Resource):
    def get(self, name):
        pros = Pro.query.all()
        return [pro.to_dict() for pro in pros if pro.name.lower() == name.lower()], 200
    
class ProsByService(Resource):
    def get(self, service):
        pros = Pro.query.filter(Pro.service==service).all()
        return [pro.to_dict() for pro in pros], 200
    
class ProsByAverageRating(Resource):
    def get(self, average_rating):
        pros = Pro.query.filter_by(average_rating=average_rating).all()
        return [pro.to_dict() for pro in pros], 200
    
class SortProsByAverageRating(Resource):
    def get(self):
        # pros = Pro.query.order_by(desc('average_rating')).all() # need to import desc
        # return [pro.to_dict() for pro in pros], 200
        pros = Pro.query.order_by(Pro.average_rating.desc()).all() # you can use asc for ascending
        return [pro.to_dict() for pro in pros], 200
    
class BestPro(Resource):
    def get(self):
        pro = Pro.query.order_by(desc('average_rating')).first() 
        return pro.to_dict(), 200
    
class ProsByReviewRating(Resource):
    def get(self, rating):
        reviews = Review.query.filter_by(rating=rating).all()
        return [review.pro.to_dict(only=('id', 'name', 'service', 'reviews.rating',)) for review in reviews], 200
    # def get(self):
    # reviews = Review.query.all()
    # return [review.pro.to_dict(only=('id', 'name')) for review in reviews if review.rating == 10], 200 

class SortProsByNumberOfReviews(Resource):
    def get(self):
        pros = Pro.query.all()
        pros.sort(reverse=True, key=lambda pro: len(pro.reviews))
        return [pro.to_dict() for pro in pros], 200
    
class ProsReviewedByUser(Resource):
    def get(self, username):
        user = User.query.filter_by(username=username).first()
        return [pro.to_dict(only=('id', 'name', 'reviews.content', 'reviews.user.username', 'reviews.rating',)) for pro in user.pros], 200
        
class Reviews(Resource):
    def get(self):       
        reviews = Review.query.all()
        return [review.to_dict() for review in reviews], 200
    
    def post(self):
        rating = request.get_json().get('rating')
        content = request.get_json().get('content')
        pro_id = request.get_json().get('pro_id') 
        user_id = session.get('user_id')
        try:
            review = Review(rating=rating, content=content, pro_id=pro_id, user_id=user_id)
            db.session.add(review)
            db.session.commit()
            return review.to_dict(), 201 
        except IntegrityError:   
            return {'error': '422 Unprocessable Entity'}, 422
        
class ReviewById(Resource):
    def get(self, id):
        review = Review.query.filter_by(id=id).first()
        if review:
            return make_response(jsonify(review.to_dict()), 200)
        return {'error': '422 Unprocessable Entity'}, 422
    
class SortReviewsByRating(Resource):
    def get(self):
        reviews = Review.query.order_by(Review.rating.desc()).all() # no need to import desc
        return [review.to_dict(only=('id', 'content', 'rating', 'pro.name', 'pro.id', 'user.username',)) for review in reviews], 200
    
class ReviewsByProId(Resource):
    def get(self, pro_id):
        pro = Pro.query.filter_by(id=pro_id).first()
        return [review.to_dict(only=('id', 'content', 'rating', 'pro.name', 'pro.id', 'user.username',)) for review in pro.reviews], 200
    
class ReviewsByUser(Resource):
    def get(self, username):
        user = User.query.filter_by(username=username).first()
        return [review.to_dict() for review in user.reviews]
    
class ReviewsByContent(Resource):
    def get(self, content):
        # all_reviews = Review.query.all()
        # matching_reviews = [review.to_dict() for review in all_reviews if any(word in review.content.lower() for word in content.lower().split())]
        # return matching_reviews, 200
        reviews = Review.query.all()
        return [review.to_dict() for review in reviews if content.lower() in review.content.lower()], 200

class Users(Resource):
    def get(self):        
        users = User.query.all()
        return [user.to_dict() for user in users], 200
    
class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            return make_response(jsonify(user.to_dict()), 200)
        return {'error': '422 Unprocessable Entity'}, 422
    
class UsersByReviewRating(Resource):
    def get(self, rating):
        reviews = Review.query.filter(Review.rating==rating).all()
        return [user.to_dict() for user in reviews.user], 200
    
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Pros, '/pros', endpoint='pros')
api.add_resource(ProById, '/pros/<int:id>', endpoint='pros/id')
api.add_resource(ProByName, '/pros/<string:name>', endpoint='pros/name')
api.add_resource(ProsByService, '/pros/<string:service>', endpoint='pros/service')
api.add_resource(ProsByAverageRating, '/pros/average_rating/<int:average_rating>', endpoint='pros/average_rating/average_rating')
api.add_resource(SortProsByAverageRating, '/pros/by_average_rating', endpoint='pros/by_average_rating')
api.add_resource(BestPro, '/pros/best_pro', endpoint='pros/best_pro')
api.add_resource(ProsByReviewRating, '/pros/pros_by_review_rating/<int:rating>', endpoint='pros/pros_by_review_rating/rating')
api.add_resource(SortProsByNumberOfReviews, '/pros/pros_by_number_of_reviews', endpoint='pros/pros_by_number_of_reviews')
api.add_resource(ProsReviewedByUser, '/pros/pros_by_user/<string:username>', endpoint='pros/pros_by_user/username')
api.add_resource(Reviews, '/reviews', endpoint='reviews')
api.add_resource(ReviewById, '/reviews/<int:id>', endpoint='reviews/id')
api.add_resource(SortReviewsByRating, '/reviews/by_rating', endpoint='reviews/by_rating')
api.add_resource(ReviewsByProId, '/reviews/reviews_by_pro/<int:pro_id>', endpoint='reviews/reviews_by_pro/pro_id')
api.add_resource(ReviewsByUser, '/reviews/reviews_by_user/<string:username>', endpoint='reviews/reviews_by_user/username')
api.add_resource(ReviewsByContent, '/reviews/search_by_content/<string:content>', endpoint='reviews/search_by_content/content')
api.add_resource(Users, '/users', endpoint='users') 
api.add_resource(UserById, '/users/<int:id>', endpoint='users/id')
api.add_resource(UsersByReviewRating, '/users/users_by_review_rating/<int:rating>', endpoint='users/users_by_review_rating/rating') 

if __name__ == '__main__':
    app.run(port=5555, debug=True)

