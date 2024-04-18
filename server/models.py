from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-pros.users', '-reviews.user', '-_password_hash',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    # Relationship mapping the user to related reviews.
    reviews = db.relationship('Review', back_populates="user")

    # Association proxy to get pros for this user through reviews. Establishes the many-to-many relationship between users and pros.
    pros = association_proxy('reviews', 'pro', creator=lambda pro_obj: Review(pro=pro_obj))

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'<User ID: {self.id}, username: {self.username}>'


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    __table_args__ = (db.CheckConstraint('LENGTH(content) >= 5'),)
    serialize_rules = ('-user.reviews', '-pro.reviews',)
    
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    pro_id = db.Column(db.Integer, db.ForeignKey('pros.id'))

    user = db.relationship('User', back_populates="reviews")
    pro = db.relationship('Pro', back_populates="reviews")

    def __repr__(self):
        return f'<Review {self.id}: {self.content}>'


class Pro(db.Model, SerializerMixin):
    __tablename__ = 'pros'
    serialize_rules = ('-users.pros', '-reviews.pro',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    average_rating = db.Column(db.Integer)
    image_url = db.Column(db.String)
    service = db.Column(db.String, nullable=False)
    area_served = db.Column(db.String, nullable=False)

    # Relationship mapping the pro to related reviews.
    reviews = db.relationship('Review', back_populates="pro")

    # Association proxy to get users for this pro through reviews. Establishes the many-to-many relationship between users and pros.
    users = association_proxy('reviews', 'user', creator=lambda user_obj: Review(user=user_obj))

    def __repr__(self):
        return f'<Pro ID: {self.id}, name: {self.name}>'
    




               

