#!/usr/bin/env python3

from random import randint, choice as rc

from faker import Faker

from app import app
from models import db, User, Review, Pro

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        print("Deleting all records...")
        Review.query.delete()
        User.query.delete()
        Pro.query.delete()

        fake = Faker()
        
        print("Creating users...")

        users = []
        usernames = []

        for i in range(5):
        
            username = fake.first_name()
            while username in usernames:
                username = fake.first_name()
            usernames.append(username)

            user = User(
                username=username,
                email=fake.email(),
            )

            user.password_hash = user.username + 'password'

            users.append(user)

        db.session.add_all(users)

        print("Creating pros...")

        images = [
            "https://i.pinimg.com/564x/35/fc/55/35fc5508a93fea6884bf72fdf288a477.jpg", 
            "https://i.pinimg.com/564x/f6/93/4a/f6934af159b4abee6c81d4369ebcdc74.jpg", 
            "https://i.pinimg.com/564x/2c/5a/0e/2c5a0eab64ce68666597b1e9cd9addd4.jpg", 
            "https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png", 
            "https://lumiere-a.akamaihd.net/v1/images/ct_mickeymouseandfriends_goofy_ddt-16970_5d1d64dc.jpeg", 
            "https://i.pinimg.com/236x/33/5b/42/335b42b0bf7b53dbe9e275c0cd353dd1.jpg",
            "https://i.pinimg.com/564x/ef/7e/18/ef7e1847dc8e37a5b8e318d46e46b44c.jpg", 
            "https://i.pinimg.com/564x/fc/87/3f/fc873f679490aa44cc4c3db63d002894.jpg", 
            "https://i.pinimg.com/564x/67/a7/56/67a75659b20247d04970867b9b6b7370.jpg" 
        ]
        pros = []
        names = []

        for i in range(10):
            name = fake.first_name()
            while name in names:
                name = fake.first_name()
            names.append(name)

            pro = Pro(
                name=name,
                average_rating=randint(1,10),
                image_url=rc(images),
                # image_url=fake.url(),
                service=fake.job(),
                area_served=fake['en-US'].city(),
            )

            pros.append(pro)

        db.session.add_all(pros)

        print("Creating reviews...")
        reviews = []
        for i in range(20):
            content = fake.paragraph(nb_sentences=3)
        
            review = Review(
                rating=randint(1,10),
                content=content,
            )

            review.user = rc(users)
            review.pro = rc(pros)

            reviews.append(review)

        db.session.add_all(reviews)

        db.session.commit()
        print("Complete.")





    
